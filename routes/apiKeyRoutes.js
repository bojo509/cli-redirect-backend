import express from "express";
import { getUrls, shortenUrl, deleteURL } from "../controller/urlController.js";
import { getInfoWithKey } from "../controller/keysController.js";
import { createEvent } from "../controller/eventController.js";

const router = express.Router();

router.get("/urls", async (req, res) => {
    try {
        const { apiKey } = req.body;
        if (!apiKey) {
            return res.status(400).json({ message: "Please provide an API key" });
        }

        const id = await getInfoWithKey(apiKey);
        if (id.length === 0) {
            return res.status(401).json({ message: "Invalid API key" });
        }

        const userId = id[0].user_id;
        const email = id[0].email;
        await createEvent("URLs fetched", email, "");
        const urls = await getUrls(userId);
        return res.status(200).json({ message: "Fetched URLs successfully", urls });
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
})

router.post("/create", async (req, res) => {
    try {
        const { url, apiKey } = req.body;
        if (!url || !apiKey) {
            return res.status(400).json({ message: "Please provide a URL and an API key" });
        }

        const id = await getIdWithKey(apiKey);
        if (id.length === 0) {
            return res.status(401).json({ message: "Invalid API key" });
        }

        const userId = id[0].user_id;
        const email = (await getEmailById(userId))[0].email;
        const shortUrl = await shortenUrl(url, userId);
        await createEvent("URL shortened", email, `${url} -> ${shortUrl[0].shortid}`);

        return res.status(200).json({ message: "URL shortened successfully", shortUrl });
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
});

router.put("/update", async (req, res) => {
    try {
        const { url, apiKey, shortid } = req.body;
        if (!url || !apiKey || !shortid) {
            return res.status(400).json({ message: "Please provide a URL, an API key, and a shortid" });
        }

        const id = await getIdWithKey(apiKey);
        if (id.length === 0) {
            return res.status(401).json({ message: "Invalid API key" });
        }
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
});

router.delete("/delete", async (req, res) => {
    try {
        const { apiKey, shortid } = req.body;
        if (!apiKey || !shortid) {
            return res.status(400).json({ message: "Please provide an API key and a shortid" });
        }

        const id = await getIdWithKey(apiKey);
        if (id.length === 0) {
            return res.status(401).json({ message: "Invalid API key" });
        }

        const userId = id[0].user_id;
        const email = (await getEmailById(userId))[0].email;
        const deleteResponse = await deleteURL(userId, shortid);
        if (deleteResponse.message === 'Url deleted successfully') {
            createEvent("Url deleted", email, `${deleteResponse.shortid} -> ${deleteResponse.url}`);
            return res.status(200).json({ message: deleteResponse.message });
        }

        return res.status(200).json({ message: "URL deleted successfully" });
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
})

export default router;