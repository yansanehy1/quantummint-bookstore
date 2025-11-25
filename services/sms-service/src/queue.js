"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.enqueue = enqueue;
exports.dequeue = dequeue;
exports.toDLQ = toDLQ;
const redis_1 = require("./db/redis");
const QUEUE_KEY = "sms:queue";
const DLQ_KEY = "sms:dlq";
async function enqueue(job) {
    await redis_1.redis.lPush(QUEUE_KEY, JSON.stringify(job));
}
async function dequeue() {
    const result = await redis_1.redis.rPop(QUEUE_KEY);
    return result ? JSON.parse(result) : null;
}
async function toDLQ(job) {
    await redis_1.redis.lPush(DLQ_KEY, JSON.stringify(job));
}
