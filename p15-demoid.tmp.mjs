import { neon } from "@neondatabase/serverless";
import { readFileSync } from "fs";
const url = readFileSync(process.env.HOME + "/.neon-centher-db-url", "utf8").trim();
const sql = neon(url);
const r = await sql.query(`SELECT id FROM "user" WHERE email='demo@centher.io'`);
console.log(r[0].id);
