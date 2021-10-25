import {config} from "dotenv";
import {migrateSubreddits} from "./src/migrate.js";

// load environment config
config();

await migrateSubreddits();
console.log('Migration done.');