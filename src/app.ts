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
app.use('/api/geography/', router);
app.use('/api/', router);





// app.get('/api/geography', (req: Request, res: Response) => {
//     // Define the absolute path to the JSON file
//     const filePath = path.resolve(__dirname, 'nigeria-geography.json');

//     // Read the JSON file containing the geographic data
//     fs.readFile(filePath, 'utf8', (err, data) => {
//         if (err) {
//             console.error('Error reading file:', err);
//             res.status(500).json({ error: 'Internal Server Error' });
//             return;
//         }

//         // Parse the JSON data and send it as the response
//         const geographyData = JSON.parse(data);
//         res.json(geographyData);
//     });
// });

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
