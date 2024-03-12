// signupValidationMiddleware.ts
import { Request, Response, NextFunction } from "express";
import Joi from "joi";

// Define the schema for sign-up data validation
const signupSchema = Joi.object({
  username: Joi.string().required().min(3).messages({
    "string.min": "Username must be at least 3 characters long",
    "any.required": "Username is required",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Invalid email format",
    "any.required": "Email is required",
  }),
  password: Joi.string().min(6).required().messages({
    "string.min": "Password must be at least 6 characters long",
    "any.required": "Password is required",
  }),
});

export const signupValidationMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Validate request body against the schema
  const { error } = signupSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  // If validation passes, proceed to the next middleware or route handler
  next();
};
