const cliHeaderVerify = (req, res, next) => {
    const userAgent = req?.headers?.['user-agent'];
    if (!userAgent || userAgent !== 'urlcli') {
        return res.status(401).json({ message: "Unauthorized access" });
    }
    next();
}

const redirectHeaderVerify = (req, res, next) => {
    const redirectServer = req?.headers?.['redirect-server'];
    if (!redirectServer || redirectServer.toLowerCase() !== 'true') {
        return res.status(401).json({ message: "Unauthorized access" });
    }
    next();
}

const removeApiKey = (req, res, next) => {
    const isFromScraper = req.headers['from-scraper'];

    const originalJson = res.json.bind(res);
    res.json = (data) => {
        if (!isFromScraper || isFromScraper.toLowerCase() !== 'true') {
            if (data && data.key) {
                delete data.key;
            }
        }
        return originalJson(data);
    };
    
    next();
};

export { cliHeaderVerify, redirectHeaderVerify, removeApiKey };