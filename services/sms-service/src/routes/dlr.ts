import { Router } from "express";
import crypto from "crypto";
import { config } from "../config";
import { query } from "../db/mysql";

export const dlr = Router();

function verify(reqBody: string, signature: string): boolean {
    if (!signature) return true;
    const mac = crypto.createHmac("sha256", config.dlr.secret).update(reqBody).digest("hex");
    return crypto.timingSafeEqual(Buffer.from(mac), Buffer.from(signature));
}

function mapProviderStatus(provider: string, providerStatus: string): string {
    const statusMap: Record<string, Record<string, string>> = {
        twilio: {
            'delivered': 'delivered',
            'failed': 'failed',
            'undelivered': 'failed',
            'sent': 'sent'
        },
        vonage: {
            'delivered': 'delivered',
            'failed': 'failed',
            'accepted': 'sent'
        }
    };

    return statusMap[provider]?.[providerStatus] || providerStatus;
}

dlr.post("/sms/dlr", async (req, res) => {
    const rawBody = JSON.stringify(req.body);
    const sig = (req.headers["x-signature"] as string) ?? "";

    if (!verify(rawBody, sig)) {
        console.warn("Invalid DLR signature");
        return res.status(401).json({ error: "bad signature" });
    }

    try {
        const provider = config.provider;
        let providerMessageId: string;
        let status: string;

        if (provider === "twilio") {
            providerMessageId = req.body.MessageSid;
            status = mapProviderStatus("twilio", req.body.MessageStatus);
        } else if (provider === "vonage") {
            providerMessageId = req.body["message-id"];
            status = mapProviderStatus("vonage", req.body.status);
        } else {
            providerMessageId = req.body.providerMessageId;
            status = req.body.status;
        }

        if (!providerMessageId || !status) {
            return res.status(400).json({ error: "missing required fields" });
        }

        // Update status in MySQL
        await query(
            `UPDATE sms_messages 
       SET status = ?, updated_at = NOW() 
       WHERE provider_message_id = ?`,
            [status, providerMessageId]
        );

        // If failed, update error message if available
        if (status === 'failed' && req.body.errorCode) {
            await query(
                `UPDATE sms_messages 
         SET error_message = ? 
         WHERE provider_message_id = ?`,
                [req.body.errorCode, providerMessageId]
            );
        }

        res.json({ ok: true });
    } catch (error) {
        console.error("DLR processing error:", error);
        res.status(500).json({ error: "internal server error" });
    }
});
