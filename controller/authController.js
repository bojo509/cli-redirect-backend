import sql from "../connection/query.js";

export const register = async (username, email, password) => {
    await sql("INSERT INTO users (username, email, password) VALUES ($1, $2, $3);", [username, email, password]);
    return await sql("SELECT id, username, email FROM users WHERE username = $1;", [username]);
};
export const login = async (username) => await sql("SELECT id, username, email, password FROM users WHERE username = $1;", [username]);

export const emailExists = async (email) => await sql("SELECT email FROM users WHERE email = $1;", [email]);
export const userNameExists = async (username) => await sql("SELECT username FROM users WHERE username = $1;", [username]);

export const getUsers = async () => await sql("SELECT * FROM users;");