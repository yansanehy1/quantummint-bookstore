"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dlr = void 0;
const express_1 = require("express");
const crypto_1 = __importDefault(require("crypto"));
const config_1 = require("../config");
const mysql_1 = require("../db/mysql");
exports.dlr = (0, express_1.Router)();
function verify(reqBody, signature) {
    if (!signature)
        return true;
    const mac = crypto_1.default.createHmac("sha256", config_1.config.dlr.secret).update(reqBody).digest("hex");
    return crypto_1.default.timingSafeEqual(Buffer.from(mac), Buffer.from(signature));
}
function mapProviderStatus(provider, providerStatus) {
    const statusMap = {
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
exports.dlr.post("/sms/dlr", async (req, res) => {
    const rawBody = JSON.stringify(req.body);
    const sig = req.headers["x-signature"] ?? "";
    if (!verify(rawBody, sig)) {
        console.warn("Invalid DLR signature");
        return res.status(401).json({ error: "bad signature" });
    }
    try {
        const provider = config_1.config.provider;
        let providerMessageId;
        let status;
        if (provider === "twilio") {
            providerMessageId = req.body.MessageSid;
            status = mapProviderStatus("twilio", req.body.MessageStatus);
        }
        else if (provider === "vonage") {
            providerMessageId = req.body["message-id"];
            status = mapProviderStatus("vonage", req.body.status);
        }
        else {
            providerMessageId = req.body.providerMessageId;
            status = req.body.status;
        }
        if (!providerMessageId || !status) {
            return res.status(400).json({ error: "missing required fields" });
        }
        // Update status in MySQL
        await (0, mysql_1.query)(`UPDATE sms_messages 
       SET status = ?, updated_at = NOW() 
       WHERE provider_message_id = ?`, [status, providerMessageId]);
        // If failed, update error message if available
        if (status === 'failed' && req.body.errorCode) {
            await (0, mysql_1.query)(`UPDATE sms_messages 
         SET error_message = ? 
         WHERE provider_message_id = ?`, [req.body.errorCode, providerMessageId]);
        }
        res.json({ ok: true });
    }
    catch (error) {
        console.error("DLR processing error:", error);
        res.status(500).json({ error: "internal server error" });
    }
});
