import { Router } from "express";
import { query } from "../db/mysql";

export const messages = Router();

messages.get("/messages", async (req, res) => {
    try {
        const messages = await query(
            "SELECT * FROM sms_messages ORDER BY created_at DESC LIMIT 50"
        );
        res.json(messages);
    } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
