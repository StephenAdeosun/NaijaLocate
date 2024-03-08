import express, { Request, Response } from 'express';
import Place,{ PlaceDocument } from '../models/RegionModel'; // Import your Mongoose model

const router = express.Router();

// Define a route to get all regions, states, and LGAs
router.get('/places', async (req: Request, res: Response) => {
    try {
        // Query the database to fetch all geographic data
        const allPlaces = await Place.find(); // Exclude _id and __v fields from the response

        if (allPlaces.length === 0) {
            // Return a 404 response if no geographic data is found
            res.status(404).json({ message: 'No geographic data found' });
            return;
        }
        // Return the retrieved data as the response
        res.json(allPlaces);
    } catch (error) {
        // Handle any errors that occur during the database query
        console.error('Error fetching geographic data:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Define a route for searching regions, states, and LGAs
router.get('/search', async (req: Request, res: Response) => {
    try {
        const { query } = req.query;

        if (!query) {
            return res.status(400).json({ message: 'Query parameter is required.' });
        }

        let searchResults: PlaceDocument[] = [];

        // Perform the search based on the query parameter
        searchResults = await Place.find({
            $or: [
                { type: 'region', name: { $regex: new RegExp(query as string, 'i') } },
                { type: 'state', name: { $regex: new RegExp(query as string, 'i') } },
                { type: 'lga', name: { $regex: new RegExp(query as string, 'i') } }
            ]
        });

        // Return the search results
        res.json(searchResults);
    } catch (error) {
        console.error('Error occurred during search:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

export default router;
