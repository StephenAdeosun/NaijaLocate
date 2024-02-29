import { User } from './models/User'; // Import your User model
import { Document } from 'mongoose';

declare module 'express' {
    interface Request {
        user?: User; // Define the 'user' property on the Request object
    }

}
// custom.d.ts


// Define the UserDocument interface
export interface UserDocument extends Document {
    username: string;
    email: string;
    password: string;
    apiKey: string;
}

