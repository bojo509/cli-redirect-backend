import express from 'express';
import { register, login, emailExists, userNameExists } from '../controller/authController.js';
import { insertKey } from '../controller/keysController.js';
import { createEvent } from '../controller/eventController.js';
import { compare, hash } from 'bcrypt';
import pkg from 'validator';
const { isEmail } = pkg;
import { encryptPayload } from '../controller/JWEController.js';
import { randomBytes } from 'crypto';

const router = express.Router();
const getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min)) + min;
}
const generateKey = () => {
    return randomBytes(32).toString('base64url');
}

router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: "Please provide necessary credentials" });
        }

        if (!isEmail(email)) {
            return res.status(400).json({ message: "Please provide a valid email address" });
        }

        if ((await userNameExists(username)).length > 0) {
            return res.status(400).json({ message: "User with that username already exists" });
        }

        if (isEmail(email) && (await emailExists(email)).length > 0) {
            return res.status(400).json({ message: "User with that email already exists" });
        }

        const hashedPassword = await hash(password, getRandomInt(5, 10));
        const user = await register(username, email, hashedPassword);
        await createEvent("User registered", user[0].email, "")
        const token = await encryptPayload({ user: { id: user[0].id, email: user[0].email } });
        const key = generateKey();
        await insertKey(user[0].id, key, user[0].email);
        user[0].id = undefined;

        return res.status(200).json({ message: "User registered successfully", user, token });
    } catch (error) {
        console.error("Registration error:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
})

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: "Please provide username and password" });
        }

        const user = await login(username);

        if (user.length === 0) {
            return res.status(401).json({ message: "Invalid username or password" });
        }

        const isMatch = await compare(password, user[0].password);

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid username or password" })
        }

        user[0].password = undefined;

        await createEvent("User logged in", user[0].email, "")
        const payload = { user: { id: user[0].id, email: user[0].email } }
        const token = await encryptPayload(payload);
        user[0].id = undefined;

        return res.status(200).json({ message: "User logged in successfully", user, token });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
})

export default router;