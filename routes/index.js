import authRoute from './authRoutes.js';
import urlRoute from './urlRoutes.js';
import express from 'express';
import { cliHeaderVerify, redirectHeaderVerify } from '../middleware/headerMiddleware.js';
import { getUrl } from '../controller/urlController.js';

const router = express.Router();

router.get('/', redirectHeaderVerify, async (req, res) => {
    try {
        const { shortid } = req.body;
        const url = await getUrl(shortid);
        if (url.length === 0) {
            return res.status(404).json({ message: "URL not found" });
        }

        res.status(200).json({ message: "URL found", url: url[0].url });
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Internal server error" });
    }
})

router.use('/cli/auth', cliHeaderVerify, authRoute);
router.use('/cli/url', cliHeaderVerify, urlRoute);

export default router;