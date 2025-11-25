"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = void 0;
exports.query = query;
const promise_1 = __importDefault(require("mysql2/promise"));
const config_1 = require("../config");
exports.pool = promise_1.default.createPool(config_1.config.mysql);
async function query(sql, params = []) {
    const [results] = await exports.pool.execute(sql, params);
    return results;
}
