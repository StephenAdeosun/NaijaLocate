"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signupValidationMiddleware = void 0;
const joi_1 = __importDefault(require("joi"));
// Define the schema for sign-up data validation
const signupSchema = joi_1.default.object({
    username: joi_1.default.string().required().min(3).messages({
        "string.min": "Username must be at least 3 characters long",
        "any.required": "Username is required",
    }),
    email: joi_1.default.string().email().required().messages({
        "string.email": "Invalid email format",
        "any.required": "Email is required",
    }),
    password: joi_1.default.string().min(6).required().messages({
        "string.min": "Password must be at least 6 characters long",
        "any.required": "Password is required",
    }),
});
const signupValidationMiddleware = (req, res, next) => {
    // Validate request body against the schema
    const { error } = signupSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    // If validation passes, proceed to the next middleware or route handler
    next();
};
exports.signupValidationMiddleware = signupValidationMiddleware;
