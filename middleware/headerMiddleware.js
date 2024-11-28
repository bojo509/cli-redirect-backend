export const headerVerify = (req, res, next) => {
    const userAgent = req?.headers?.['user-agent'];
    if (!userAgent || userAgent !== 'urlcli') {
        return res.status(401).json({ message: "Unauthorized access" });
    }
    next();
}