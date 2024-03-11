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

/// Search API endpoint
router.get('/search', async (req: Request, res: Response) => {
    try {
        const { category, query } = req.query;

        if (!category || !query) {
            return res.status(400).json({ message: 'Category and query parameters are required.' });
        }

        let searchResults: any[] = [];

        // Perform the search based on the provided category and query
        if (category === 'region') {
            searchResults = await Place.aggregate([
                { $match: { name: { $regex: new RegExp(query as string, 'i') } } },
                { $unwind: '$states' },
                { $group: { _id: '$name', states: { $push: '$states.name' } } }
            ]);
        } else if (category === 'state') {
            searchResults = await Place.aggregate([
                { $unwind: '$states' },
                { $match: { 'states.name': { $regex: new RegExp(query as string, 'i') } } },
                { $group: { _id: '$name', states: { $push: '$states.name' } } }
            ]);
        } else if (category === 'lga') {
            searchResults = await Place.find({
                'states.lgas.name': { $regex: new RegExp(query as string, 'i') }
            }, { 'states.lgas.$': 1 });
        } else {
            return res.status(400).json({ message: 'Invalid category parameter.' });
        }

        // Return the search results
        res.json(searchResults);
    } catch (error) {
        console.error('Error occurred during search:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});


export default router;
