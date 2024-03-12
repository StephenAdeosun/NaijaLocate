"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
const JWT_SECRET = process.env.JWT_SECRET || 'your-default-secret-key';
const authenticate = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Extract the API key from the request headers, query parameters, or body
        const apiKey = req.headers['x-api-key'] || req.query.apiKey || req.body.apiKey;
        if (!apiKey) {
            return res.status(401).json({ message: 'API key is missing' });
        }
        // Verify the API key
        const decoded = jsonwebtoken_1.default.verify(apiKey, JWT_SECRET);
        const userEmail = decoded.email;
        // Check if the user exists in the database
        const user = yield User_1.UserModel.findOne({ email: userEmail });
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        // Proceed to the next middleware if authentication is successful
        next();
    }
    catch (error) { // Explicitly typing error as any
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid API key' });
        }
        console.error('Authentication error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.authenticate = authenticate;
