import sql from "../connection/query.js";

const insertKey = async (userId, key) => await sql("INSERT INTO keys (user_id, user_key) VALUES ($1, $2);", [userId, key]);
const getIdWithKey = async (key) => await sql("SELECT user_id FROM keys WHERE user_key = $1;", [key]);
const getEmailById = async (id) => await sql("SELECT email FROM users WHERE id = $1;", [id]);

export { insertKey, getIdWithKey, getEmailById };