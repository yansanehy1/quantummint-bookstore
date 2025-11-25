"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redis = void 0;
const redis_1 = require("redis");
const config_1 = require("../config");
exports.redis = (0, redis_1.createClient)({ url: config_1.config.redisUrl });
exports.redis.on("error", (err) => console.error("Redis Client Error", err));
exports.redis.connect().catch(console.error);
