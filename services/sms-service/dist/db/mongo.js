"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbPromise = exports.mongoClient = void 0;
const mongodb_1 = require("mongodb");
const config_1 = require("../config");
exports.mongoClient = new mongodb_1.MongoClient(config_1.config.mongoUri);
exports.dbPromise = exports.mongoClient.connect().then(client => client.db());
