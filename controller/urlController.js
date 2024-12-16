import sql from "../connection/query.js";
import { customAlphabet } from 'nanoid';
import { config } from 'dotenv';
import { Redis } from "ioredis";

config();
const shortid = customAlphabet(process.env.CUSTOM_ALPHABET, 8)
const redis = new Redis(process.env.REDIS_URL);

const getUrls = async (userid) => {
    return await sql("SELECT url, shortid FROM urls WHERE user_id = $1;", [userid]);
}

const getUrl = async (shortid) => {
    return await sql("SELECT url FROM urls WHERE shortid = $1;", [shortid]);
}

const addToCache = async (shortid, url, expireTime) => {
    await redis.set(shortid, JSON.stringify(url));
    await redis.expire(shortid, expireTime);
}

const getFromCache = async (shortid) => {
    const url = await redis.get(shortid);
    return JSON.parse(url);
}

const removeFromCache = async (shortid) => {
    await redis.del(shortid);
}

const shortenUrl = async (url, userId) => {
    let shortId = shortid();
    const shortIdExists = await sql("SELECT shortid FROM urls WHERE shortid = $1;", [shortId]);

    while (shortIdExists.length > 0) {
        shortId = shortid();
        shortIdExists = await sql("SELECT shortid FROM urls WHERE shortid = $1;", [shortId]);
    }

    await sql("INSERT INTO urls (url, shortid, user_id) VALUES ($1, $2, $3);", [url, shortId, userId]);
    return await sql("SELECT url, shortid FROM urls WHERE shortid = $1;", [shortId]);
}

const updateUrl = async (newUrl, id, shortid) => {
    const ownerId = await sql("SELECT user_id FROM urls WHERE shortid = $1;", [shortid])

    if (ownerId.length === 0) {
        return { message: "Not the owner of this shortened url" };
    }

    const uid = ownerId[0].user_id;
    const urlExists = await sql("SELECT shortid FROM urls WHERE shortid = $1;", [shortid]);

    if (urlExists.length === 0) {
        return { message: "Url does not exist" };
    }

    if (uid === id) {
        await sql("UPDATE urls SET url = $1 WHERE shortid = $2;", [newUrl, shortid]);
        return await sql("SELECT url, shortid FROM urls WHERE shortid = $1;", [shortid]);
    }
}

const deleteURL = async (id, shortid) => {
    const ownerId = await sql("SELECT user_id FROM urls WHERE shortid = $1;", [shortid])
    const url = await sql("SELECT url FROM urls WHERE shortid = $1;", [shortid]);

    if (ownerId.length === 0) {
        return { message: "Not the owner of this shortened url" };
    }

    const uid = ownerId[0].user_id;
    const urlExists = await sql("SELECT shortid FROM urls WHERE shortid = $1;", [shortid]);

    if (urlExists.length === 0) {
        return { message: "Url does not exist" };
    }

    if (uid === id) {
        await sql("DELETE FROM urls WHERE shortid = $1;", [shortid]);
        return { message: "Url deleted successfully", url: url[0].url, shortid };
    }
}

export { getUrls, getUrl, getFromCache, addToCache, removeFromCache, shortenUrl, updateUrl, deleteURL };