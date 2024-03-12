import { Request } from 'express';
import { User } from './models/User'; // Adjust the path as per your project structure

declare module 'express' {
    interface Request {
        user?: User;
    }
}
