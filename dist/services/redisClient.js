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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setAsync = exports.getAsync = exports.client = void 0;
const redis = __importStar(require("redis"));
const util_1 = require("util");
const client = redis.createClient({
    // username: process.env.REDIS_USERNAME as string,
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
    },
});
exports.client = client;
// const client: any = redis.createClient(process.env.REDIS_HOST as any);
// Log when the client is created
console.log('Redis client created.');
// Log any errors that occur with the client
client.on('error', (err) => console.log('Redis Client Error', err));
// Connect to Redis
client.connect();
// Log when the client is connected
client.on('connect', () => {
    console.log('Redis client connected.');
});
// Log when the client is ready to accept commands
client.on('ready', () => {
    console.log('Redis client ready.');
});
// Log when the client encounters a warning
client.on('warning', (warning) => {
    console.log('Redis client warning:', warning);
});
// Log when the client is closed
client.on('end', () => {
    console.log('Redis client closed.');
});
// Promisify Redis functions
const getAsync = (0, util_1.promisify)(client.get).bind(client);
exports.getAsync = getAsync;
const setAsync = (0, util_1.promisify)(client.set).bind(client);
exports.setAsync = setAsync;
// Log when the promisified functions are created
console.log('Promisified Redis functions created.');
