import { Router } from "express";
import { enqueue } from "../queue";
import crypto from "crypto";

export const sendGift = Router();

sendGift.post("/send-gift", async (req, res) => {
    const { recipient, book, gift, locale } = req.body;

    if (!recipient?.phone || !book?.title) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    const idempotencyKey = crypto.randomUUID();

    await enqueue({
        idempotencyKey,
        payload: { recipient, book, gift, locale }
    });

    res.json({ ok: true, idempotencyKey });
});
