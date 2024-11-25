import sql from "../connection/dbConnect.js";

const users = await sql("\
    CREATE TABLE IF NOT EXISTS users (\
    id SERIAL PRIMARY KEY, \
    username TEXT UNIQUE NOT NULL, \
    email TEXT UNIQUE NOT NULL, \
    password TEXT NOT NULL);");
const linkTable = await sql("\
    CREATE TABLE IF NOT EXISTS urls (\
    id SERIAL PRIMARY KEY, \
    url TEXT UNIQUE NOT NULL, \
    shortid TEXT UNIQUE NOT NULL, \
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, \
    user_id INT NOT NULL, \
    CONSTRAINT fk_user \
    FOREIGN KEY (user_id) \
    REFERENCES users (id) \
    ON DELETE CASCADE);");