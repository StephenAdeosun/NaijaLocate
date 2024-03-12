// Import required modules
import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './services/database';
import userRoutes from './routes/UserRoutes';
import fs from 'fs';
import path from 'path';
import  router from './routes/placesRoute';

// Load environment variables from .env file
dotenv.config();

// Create an Express application
const app = express();

// Use middleware to parse JSON bodies
app.use(bodyParser.json());

// Enable CORS
app.use(cors());

// Connect to the MongoDB database
connectDB().catch(err => console.error('Error connecting to MongoDB:', err));

// Define routes
app.use('/api/users/', userRoutes);
app.use('/api/', router);



// Define a basic route
app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to Locale API!');
});

// Handle 404 errors
app.use((req: Request, res: Response, next: NextFunction) => {
    res.status(404).send('404 - Not Found');
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).send('500 - Internal Server Error');
});

// Define the port to listen on
const PORT = process.env.PORT || 3000;

// Start the Express server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
