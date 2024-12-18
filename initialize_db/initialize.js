import sql from "../connection/query.js";

const usersTable = await sql("\
    CREATE TABLE IF NOT EXISTS users (\
    id SERIAL PRIMARY KEY, \
    username TEXT UNIQUE NOT NULL, \
    email TEXT UNIQUE NOT NULL, \
    password TEXT NOT NULL, \
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, \
    edited_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);");

const linkTable = await sql("\
    CREATE TABLE IF NOT EXISTS urls (\
    id SERIAL PRIMARY KEY, \
    url TEXT NOT NULL, \
    shortid TEXT UNIQUE NOT NULL, \
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, \
    user_id INT NOT NULL, \
    CONSTRAINT fk_user \
    FOREIGN KEY (user_id) \
    REFERENCES users (id) \
    ON DELETE CASCADE);");

const eventTable = await sql("\
    CREATE TABLE IF NOT EXISTS events (\
    id SERIAL PRIMARY KEY, \
    event_type TEXT NOT NULL, \
    event_attribute TEXT NOT NULL, \
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, \
    user_email TEXT NOT NULL, \
    CONSTRAINT fk_user_event \
    FOREIGN KEY (user_email) \
    REFERENCES users (email) \
    ON DELETE CASCADE);");

const keys = await sql("\
    CREATE TABLE IF NOT EXISTS keys (\
    id SERIAL PRIMARY KEY, \
    user_key TEXT NOT NULL, \
    user_id INT NOT NULL , \
    CONSTRAINT fk_user_id \
    FOREIGN KEY (user_id) \
    REFERENCES users (id) \
    ON DELETE CASCADE);");