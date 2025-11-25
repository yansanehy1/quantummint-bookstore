"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.startWorker = startWorker;
const queue_1 = require("./queue");
const mysql_1 = require("./db/mysql");
const providers_1 = require("./providers");
const renderer_1 = require("./templates/renderer");
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
function exponentialBackoff(attempt) {
    return Math.min(60000, Math.pow(2, attempt) * 1000);
}
async function startWorker() {
    console.log("Worker started, polling for jobs...");
    while (true) {
        const job = await (0, queue_1.dequeue)();
        if (!job) {
            await sleep(500);
            continue;
        }
        try {
            const { recipient, book, gift, locale = "en" } = job.payload;
            // Render template
            const text = await (0, renderer_1.renderTemplate)("gift", locale, {
                name: recipient.name ?? "there",
                title: book.title,
                message: gift?.message || "Enjoy your gift!"
            });
            // Send SMS
            const { providerMessageId } = await (0, providers_1.sendSms)(recipient.phone, text);
            // Store message record in MySQL
            const metadata = JSON.stringify({
                bookId: book.id,
                giftFromUserId: gift?.fromUserId,
                locale,
                provider: process.env.SMS_PROVIDER
            });
            await (0, mysql_1.query)(`INSERT INTO sms_messages 
        (recipient_phone, content_text, status, provider, provider_message_id, metadata) 
        VALUES (?, ?, ?, ?, ?, ?)`, [
                recipient.phone,
                text,
                'sent',
                process.env.SMS_PROVIDER || 'unknown',
                providerMessageId,
                metadata
            ]);
            console.log(`SMS sent to ${recipient.phone}`, providerMessageId);
        }
        catch (err) {
            console.error("Job failed:", err.message);
            // Track attempts
            job.attempts = (job.attempts ?? 0) + 1;
            if (job.attempts >= 5) {
                console.error(`Moving job to DLQ after ${job.attempts} attempts`);
                await (0, queue_1.toDLQ)(job);
                // Store failed message record
                const metadata = JSON.stringify({
                    ...job.payload,
                    attempts: job.attempts
                });
                await (0, mysql_1.query)(`INSERT INTO sms_messages 
          (recipient_phone, content_text, status, provider, error_message, metadata) 
          VALUES (?, ?, ?, ?, ?, ?)`, [
                    job.payload.recipient.phone,
                    "FAILED_TO_RENDER",
                    'failed',
                    process.env.SMS_PROVIDER || 'unknown',
                    err.message,
                    metadata
                ]);
            }
            else {
                const backoffMs = exponentialBackoff(job.attempts);
                console.log(`Retrying job in ${backoffMs}ms (attempt ${job.attempts})`);
                await sleep(backoffMs);
                // Re-enqueue with updated attempts
                const { enqueue } = await Promise.resolve().then(() => __importStar(require("./queue")));
                await enqueue(job);
            }
        }
    }
}
