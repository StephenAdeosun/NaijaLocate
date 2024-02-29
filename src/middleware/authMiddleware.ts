// authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import {UserModel} from '../models/User'; // Import your User model
import jwt from 'jsonwebtoken';



export const authenticateApiKey = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const apiKey = req.headers['api-key'];

        if (!apiKey) {
            return res.status(401).json({ message: 'Unauthorized - API key is missing' });
        }

        // Verify the API key with the User model
        const user = await UserModel.findOne({ apiKey });

        if (!user) {
            return res.status(401).json({ message: 'Unauthorized - Invalid API key' });
        }

        // Attach the user object to the request for future use
        req.user = user;

        // Continue to the next middleware
        next();
    } catch (error) {
        console.error('Error authenticating API key:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

  