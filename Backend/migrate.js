require("dotenv").config();
const { execSync } = require("child_process");

const dbUser = process.env.DB_USER || "postgres";
const dbPassword = process.env.DB_PASSWORD || "0000";
const dbHost = process.env.DB_HOST || "localhost";
const dbPort = process.env.DB_PORT || 5432;
const dbName = process.env.DB_NAME || "University_data";

let databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  databaseUrl = `postgres://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}`;
}

const args = process.argv.slice(2).join(" ");
const command = `npx node-pg-migrate ${args}`;

console.log(`Running migration: ${command}`);

try {
  execSync(command, {
    env: { ...process.env, DATABASE_URL: databaseUrl },
    stdio: "inherit",
  });
} catch (error) {
  process.exit(1);
}
