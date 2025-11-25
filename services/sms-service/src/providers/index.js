"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendSms = sendSms;
const config_1 = require("../config");
const twilio_1 = require("./twilio");
async function sendSms(to, body) {
    const provider = config_1.config.provider;
    if (provider === "twilio") {
        return (0, twilio_1.sendTwilio)(to, body);
    }
    // Placeholder for other providers
    if (provider === "vonage") {
        throw new Error("Vonage provider not implemented yet");
    }
    throw new Error(`Unknown SMS provider: ${provider}`);
}
