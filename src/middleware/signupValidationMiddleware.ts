// signupValidationMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

// Define the schema for sign-up data validation
const signupSchema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
});

export const signupValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    // Validate request body against the schema
    const { error } = signupSchema.validate(req.body);

    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    // If validation passes, proceed to the next middleware or route handler
    next();
};
