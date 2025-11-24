"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messages = void 0;
const express_1 = require("express");
const mysql_1 = require("../db/mysql");
exports.messages = (0, express_1.Router)();
exports.messages.get("/messages", async (req, res) => {
    try {
        const messages = await (0, mysql_1.query)("SELECT * FROM sms_messages ORDER BY created_at DESC LIMIT 50");
        res.json(messages);
    }
    catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
