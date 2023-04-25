import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const mongoClient = new MongoClient(process.env.DATABASE_URL);
try {
    await mongoClient.connect();
    console.log("MongoDB conectado!");
} catch (err) {
    console.log("Failed to connect to database:", err);
}

export const db = mongoClient.db();