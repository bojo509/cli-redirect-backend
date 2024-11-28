import sql from "../connection/query.js";

const dropUsersTable = await sql("DROP TABLE IF EXISTS users CASCADE;");
const dropUrlsTable = await sql("DROP TABLE IF EXISTS urls CASCADE;");
const dropEventsTable = await sql("DROP TABLE IF EXISTS events CASCADE;");