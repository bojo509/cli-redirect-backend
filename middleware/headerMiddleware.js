const cliHeaderVerify = (req, res, next) => {
    const userAgent = req?.headers?.['user-agent'];
    if (!userAgent || userAgent !== 'urlcli') {
        return res.status(401).json({ message: "Unauthorized access" });
    }
    next();
}

const redirectHeaderVerify = (req, res, next) => {
    const userAgent = req?.headers?.['redirect-server'];
    if (!userAgent || userAgent.toLowerCase() !== 'true') {
        return res.status(401).json({ message: "Unauthorized access" });
    }
    next();
}

export { cliHeaderVerify, redirectHeaderVerify };