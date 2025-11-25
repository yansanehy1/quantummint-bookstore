"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendGift = void 0;
const express_1 = require("express");
const queue_1 = require("../queue");
const crypto_1 = __importDefault(require("crypto"));
exports.sendGift = (0, express_1.Router)();
exports.sendGift.post("/send-gift", async (req, res) => {
    const { recipient, book, gift, locale } = req.body;
    if (!recipient?.phone || !book?.title) {
        return res.status(400).json({ error: "Missing required fields" });
    }
    const idempotencyKey = crypto_1.default.randomUUID();
    await (0, queue_1.enqueue)({
        idempotencyKey,
        payload: { recipient, book, gift, locale }
    });
    res.json({ ok: true, idempotencyKey });
});
