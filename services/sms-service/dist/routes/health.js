"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.health = void 0;
const express_1 = require("express");
const redis_1 = require("../db/redis");
const mysql_1 = require("../db/mysql");
exports.health = (0, express_1.Router)();
exports.health.get("/health", async (req, res) => {
    try {
        // Check Redis
        await redis_1.redis.ping();
        // Check MySQL
        await mysql_1.pool.query("SELECT 1");
        res.json({
            status: "healthy",
            timestamp: new Date().toISOString(),
            uptime: process.uptime()
        });
    }
    catch (error) {
        res.status(503).json({
            status: "unhealthy",
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});
