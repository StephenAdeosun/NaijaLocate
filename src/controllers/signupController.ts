// signupController.ts
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'your-default-secret-key';

export const signUp = async (req: Request, res: Response) => {
    try {
        const { username, email, password } = req.body;

        // Check if the email is already registered
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email is already registered' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate API key using JWT
        const apiKey = jwt.sign({ email }, JWT_SECRET);

        // Create a new user record
        const newUser = new UserModel({
            username,
            email,
            password: hashedPassword,
            apiKey
        });

        // Save the user record to the database
        await newUser.save();

        // Return the API key to the client
        res.status(201).json({ 
            message: 'User registered successfully',
            apiKey
         });
    } catch (error) {
        console.error('Sign-up error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
