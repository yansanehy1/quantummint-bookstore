import { config } from "../config";
import { sendTwilio } from "./twilio";

export async function sendSms(to: string, body: string) {
    const provider = config.provider;

    if (provider === "twilio") {
        return sendTwilio(to, body);
    }

    // Placeholder for other providers
    if (provider === "vonage") {
        throw new Error("Vonage provider not implemented yet");
    }

    throw new Error(`Unknown SMS provider: ${provider}`);
}
