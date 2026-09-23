/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, react/no-unescaped-entities */
import mongoose from "mongoose";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env" });
dotenv.config({ path: ".env.local" });

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI as string);
        console.log("Connected to MongoDB.");

        const db = mongoose.connection.db;
        if (!db) throw new Error("DB not found");

        const collection = db.collection("donors");
        
        try {
            await collection.dropIndex("normalizedEmail_1");
            console.log("Dropped normalizedEmail_1 index");
        } catch (e: any) {
            console.log("normalizedEmail_1 index not found or already dropped:", e.message);
        }

        try {
            await collection.dropIndex("normalizedWhatsappNumber_1");
            console.log("Dropped normalizedWhatsappNumber_1 index");
        } catch (e: any) {
            console.log("normalizedWhatsappNumber_1 index not found or already dropped:", e.message);
        }

        console.log("Finished dropping unique indexes on Donor.");
        process.exit(0);
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
};

run();
