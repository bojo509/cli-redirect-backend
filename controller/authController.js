import sql from "../connection/query.js";

const register = async (username, email, password) => {
    await sql("INSERT INTO users (username, email, password) VALUES ($1, $2, $3);", [username, email, password]);
    return await sql("SELECT id, username, email FROM users WHERE username = $1;", [username]);
};
const login = async (username) => await sql("SELECT id, username, email, password FROM users WHERE username = $1;", [username]);

const emailExists = async (email) => await sql("SELECT email FROM users WHERE email = $1;", [email]);
const userNameExists = async (username) => await sql("SELECT username FROM users WHERE username = $1;", [username]);

const getUsers = async () => await sql("SELECT * FROM users;");

export { register, login, emailExists, userNameExists, getUsers };