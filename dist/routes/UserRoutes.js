"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// userRoutes.ts
const express_1 = __importDefault(require("express"));
const signupController_1 = require("../controllers/signupController");
const signupValidationMiddleware_1 = require("../middleware/signupValidationMiddleware");
const router = express_1.default.Router();
// Route for user sign-up
router.post("/signup", signupValidationMiddleware_1.signupValidationMiddleware, signupController_1.signUp);
exports.default = router;
