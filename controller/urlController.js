import sql from "../connection/query.js";
import { customAlphabet } from 'nanoid';

const shortid = customAlphabet(process.env.CUSTOM_ALPHABET, 8)

export const shortenUrl = async (url, userId) => {
    let shortId = shortid();
    const shortIdExists = await sql("SELECT shortid FROM urls WHERE shortid = $1;", [shortId]);

    while (shortIdExists.length > 0) {
        shortId = shortid();
        shortIdExists = await sql("SELECT shortid FROM urls WHERE shortid = $1;", [shortId]);
    }

    await sql("INSERT INTO urls (url, shortid, user_id) VALUES ($1, $2, $3);", [url, shortId, userId]);
    return await sql("SELECT url, shortid FROM urls WHERE shortid = $1;", [shortId]);
}

export const getUrls = async (userid) => {
    return await sql("SELECT url, shortid FROM urls WHERE user_id = $1;", [userid]);
}

// return url when deleted so it can be added to the event table
export const deleteURL = async (id, shortid) => {
    const ownerId = await sql("SELECT user_id FROM urls WHERE shortid = $1;", [shortid])
    const url = await sql("SELECT url FROM urls WHERE shortid = $1;", [shortid]);

    if (ownerId.length === 0) {
        return { message: "Url does not exist" };
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