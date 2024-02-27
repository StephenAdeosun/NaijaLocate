// userRoutes.ts
import express from "express";
import { signUp } from "../controllers/signupController";
import { signupValidationMiddleware } from "../middleware/signupValidationMiddleware";

const router = express.Router();

// Route for user sign-up
router.post("/signup", signupValidationMiddleware, signUp);

export default router;
