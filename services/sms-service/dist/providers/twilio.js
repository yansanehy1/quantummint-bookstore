"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendTwilio = sendTwilio;
const node_fetch_1 = __importDefault(require("node-fetch"));
const config_1 = require("../config");
const buffer_1 = require("buffer");
async function sendTwilio(to, body) {
    const { accountSid, authToken, from } = config_1.config.providers.twilio;
    const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
    const auth = buffer_1.Buffer.from(`${accountSid}:${authToken}`).toString("base64");
    try {
        const resp = await (0, node_fetch_1.default)(url, {
            method: "POST",
            headers: {
                Authorization: `Basic ${auth}`,
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams({
                To: to,
                From: from,
                Body: body
            })
        });
        if (!resp.ok) {
            const errorText = await resp.text();
            throw new Error(`Twilio API error: ${resp.status} - ${errorText}`);
        }
        const data = await resp.json();
        return { providerMessageId: data.sid };
    }
    catch (error) {
        throw new Error(`Twilio send failed: ${error.message}`);
    }
}
