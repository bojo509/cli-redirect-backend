import authRoute from './authRoutes.js';
import urlRoute from './urlRoutes.js';
import apiKeyRoute from './apiKeyRoutes.js';
import express from 'express';
import { cliHeaderVerify, redirectHeaderVerify } from '../middleware/headerMiddleware.js';
import { getUrl, getFromCache, addToCache } from '../controller/urlController.js';

const router = express.Router();

router.get('/', redirectHeaderVerify, async (req, res) => {
    try {
        const { shortid } = req.body;
        const urlFromCache = await getFromCache(shortid);
        if (urlFromCache) {
            return res.status(200).json({ message: "URL found", url: urlFromCache });
        }
        else {
            const urlFromDb = await getUrl(shortid);
            if (urlFromDb.length === 0) {
                return res.status(404).json({ message: "URL not found" });
            }
            
            addToCache(shortid, urlFromDb[0].url);
            res.status(200).json({ message: "URL found", url: urlFromDb[0].url });
        }
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Internal server error" });
    }
})

router.use('/cli/auth', cliHeaderVerify, authRoute);
router.use('/cli/url', cliHeaderVerify, urlRoute);
router.use('/api', apiKeyRoute);

export default router;