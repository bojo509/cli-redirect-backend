import sql from "../connection/query.js";

const insertKey = async (userId, key, email) => await sql("INSERT INTO keys (user_id, user_key, email) VALUES ($1, $2, $3);", [userId, key, email]);
const getInfoWithKey = async (key) => await sql("SELECT user_id, email FROM keys WHERE user_key = $1;", [key]);

export { insertKey, getInfoWithKey };