// authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { UserModel } from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'your-default-secret-key';

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Extract the API key from the request headers, query parameters, or body
        const apiKey = req.headers['x-api-key'] || req.query.apiKey || req.body.apiKey;

        if (!apiKey) {
            return res.status(401).json({ message: 'API key is missing' });
        }

        // Verify the API key
        const decoded = jwt.verify(apiKey, JWT_SECRET) as JwtPayload;
        const userEmail = decoded.email;

        // Check if the user exists in the database
        const user = await UserModel.findOne({ email: userEmail });

        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        // Proceed to the next middleware if authentication is successful
        next();
    } catch (error: any) { // Explicitly typing error as any
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid API key' });
        }
        console.error('Authentication error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
