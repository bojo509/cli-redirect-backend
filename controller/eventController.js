import sql from "../connection/query.js";

export const createEvent = async (event_type, email, event_attribute) => await sql("INSERT INTO events (event_type, user_email, event_attribute) VALUES ($1, $2, $3);", [event_type, email, event_attribute]);