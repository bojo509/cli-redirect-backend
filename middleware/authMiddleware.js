import { decryptPayload } from '../controller/JWEController.js';

const userAuth = async (req, res, next) => {
    const authHandler = req?.headers?.authorization;

    if (!authHandler || !authHandler.startsWith("Bearer")) {
        return res.status(401).json({ message: "Unauthorized access" })
    }

    const token = authHandler?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Auth failed: no token provided" })
    }

    try {
        const decryptedPayload = await decryptPayload(token);

        if (decryptedPayload.exp < Date.now().valueOf() / 1000) {
            return res.status(401).json({ message: "JWT expired, please login again" });
        }

        req.user = {
            userId: decryptedPayload.user.id,
            userEmail: decryptedPayload.user.email
        };

        next();
    } catch (error) {
        if (error.message === 'Token has expired') {
            return res.status(401).json({ message: "JWT expired, please login again" });
        } else {
            console.log(error);
            return res.status(401).json({ message: `Auth failed: ${error}` });
        }
    }
}

export default userAuth;