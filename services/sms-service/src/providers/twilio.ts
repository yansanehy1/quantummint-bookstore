import fetch from "node-fetch";
import { config } from "../config";
import { Buffer } from "buffer";

export async function sendTwilio(to: string, body: string) {
    const { accountSid, authToken, from } = config.providers.twilio;
    const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
    const auth = Buffer.from(`${accountSid}:${authToken}`).toString("base64");

    try {
        const resp = await fetch(url, {
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

        const data = await resp.json() as any;
        return { providerMessageId: data.sid };
    } catch (error: any) {
        throw new Error(`Twilio send failed: ${error.message}`);
    }
}
