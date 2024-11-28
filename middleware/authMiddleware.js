import pkg from 'jsonwebtoken';
const { verify } = pkg;

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
        const decodedToken = verify(token, process.env.JWT_SECRET);
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: "JWT expired" });
        } else {
            return res.status(401).json({ message: "Auth failed" });
        }
    }

    try {
        const userToken = verify(token, process.env.JWT_SECRET);
        req.user = {
            userId: userToken.user.id,
            userEmail: userToken.user.email
        }

        next();
    } catch (error) {
        console.log(error)
        return res.status(401).json({ message: "Auth failed" })
    }
}

export default userAuth;