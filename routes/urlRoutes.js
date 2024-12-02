import express from 'express';
import userAuth from '../middleware/authMiddleware.js';
import { createEvent } from '../controller/eventController.js';
import { shortenUrl, getUrls, deleteURL, updateUrl, getFromCache, addToCache, removeFromCache } from '../controller/urlController.js';

const router = express.Router();

router.get('/urls', userAuth, async (req, res) => {
    try {
        const id = req.user.userId;
        const email = req.user.userEmail;
        const urls = await getUrls(id);
        createEvent("Urls fetched", email, "");
        return res.status(200).json({ message: "Fetched urls successfully", urls });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
})

router.post('/create', userAuth, async (req, res) => {
    try {
        const { url } = req.body;
        const id = req.user.userId;
        const email = req.user.userEmail;
        const shortenedUrl = await shortenUrl(url, id);
        addToCache(shortenedUrl[0].shortid, shortenedUrl[0].url);
        createEvent("Url shortened", email, `${url} -> ${shortenedUrl[0].shortid}`);
        return res.status(200).json({ message: "Url shortened successfully", shortenedUrl });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
})

router.put('/update', userAuth, async (req, res) => {
    try {
        const { shortid, newUrl } = req.body;
        const id = req.user.userId;
        const email = req.user.userEmail;
        const updatedUrl = await updateUrl(newUrl, id, shortid);
        removeFromCache(shortid);
        addToCache(updatedUrl[0].shortid, updatedUrl[0].url);
        createEvent("Url updated", email, `${updatedUrl[0].url} -> ${updatedUrl[0].shortid}`);
        return res.status(200).json({ message: "Url updated successfully", updatedUrl });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
})

router.delete('/delete', userAuth, async (req, res) => {
    try {
        const { shortid } = req.body;
        const id = req.user.userId;
        const email = req.user.userEmail;
        const deleteResponse = await deleteURL(id, shortid);
        if (deleteResponse.message === 'Url deleted successfully') {
            createEvent("Url deleted", email, `${deleteResponse.url} -> ${deleteResponse.shortid}`);
            removeFromCache(shortid)
            return res.status(200).json({ message: deleteResponse.message });
        }
        return res.status(400).json({ message: deleteResponse.message });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
})

export default router;