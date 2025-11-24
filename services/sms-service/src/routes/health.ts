import { Router } from "express";
import { redis } from "../db/redis";
import { pool } from "../db/mysql";

export const health = Router();

health.get("/health", async (req, res) => {
    try {
        // Check Redis
        await redis.ping();

        // Check MySQL
        await pool.query("SELECT 1");

        res.json({
            status: "healthy",
            timestamp: new Date().toISOString(),
            uptime: process.uptime()
        });
    } catch (error: any) {
        res.status(503).json({
            status: "unhealthy",
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});
