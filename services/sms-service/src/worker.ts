import { dequeue, toDLQ } from "./queue";
import { query } from "./db/mysql";
import { sendSms } from "./providers";
import { renderTemplate } from "./templates/renderer";

function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)); }

function exponentialBackoff(attempt: number): number {
    return Math.min(60000, Math.pow(2, attempt) * 1000);
}

export async function startWorker() {
    console.log("Worker started, polling for jobs...");

    while (true) {
        const job = await dequeue();
        if (!job) { await sleep(500); continue; }

        try {
            const { recipient, book, gift, locale = "en" } = job.payload;

            // Render template
            const text = await renderTemplate("gift", locale, {
                name: recipient.name ?? "there",
                title: book.title,
                message: gift?.message || "Enjoy your gift!"
            });

            // Send SMS
            const { providerMessageId } = await sendSms(recipient.phone, text);

            // Store message record in MySQL
            const metadata = JSON.stringify({
                bookId: book.id,
                giftFromUserId: gift?.fromUserId,
                locale,
                provider: process.env.SMS_PROVIDER
            });

            await query(
                `INSERT INTO sms_messages 
        (recipient_phone, content_text, status, provider, provider_message_id, metadata) 
        VALUES (?, ?, ?, ?, ?, ?)`,
                [
                    recipient.phone,
                    text,
                    'sent',
                    process.env.SMS_PROVIDER || 'unknown',
                    providerMessageId,
                    metadata
                ]
            );

            console.log(`SMS sent to ${recipient.phone}`, providerMessageId);

        } catch (err: any) {
            console.error("Job failed:", err.message);

            // Track attempts
            job.attempts = (job.attempts ?? 0) + 1;

            if (job.attempts >= 5) {
                console.error(`Moving job to DLQ after ${job.attempts} attempts`);
                await toDLQ(job);

                // Store failed message record
                const metadata = JSON.stringify({
                    ...job.payload,
                    attempts: job.attempts
                });

                await query(
                    `INSERT INTO sms_messages 
          (recipient_phone, content_text, status, provider, error_message, metadata) 
          VALUES (?, ?, ?, ?, ?, ?)`,
                    [
                        job.payload.recipient.phone,
                        "FAILED_TO_RENDER",
                        'failed',
                        process.env.SMS_PROVIDER || 'unknown',
                        err.message,
                        metadata
                    ]
                );

            } else {
                const backoffMs = exponentialBackoff(job.attempts);
                console.log(`Retrying job in ${backoffMs}ms (attempt ${job.attempts})`);
                await sleep(backoffMs);

                // Re-enqueue with updated attempts
                const { enqueue } = await import("./queue");
                await enqueue(job);
            }
        }
    }
}
