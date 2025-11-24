import { redis } from "./db/redis";

const QUEUE_KEY = "sms:queue";
const DLQ_KEY = "sms:dlq";

export interface Job {
    idempotencyKey: string;
    payload: any;
    attempts?: number;
}

export async function enqueue(job: Job) {
    await redis.lPush(QUEUE_KEY, JSON.stringify(job));
}

export async function dequeue(): Promise<Job | null> {
    const result = await redis.rPop(QUEUE_KEY);
    return result ? JSON.parse(result) : null;
}

export async function toDLQ(job: Job) {
    await redis.lPush(DLQ_KEY, JSON.stringify(job));
}
