import express, { Request, Response } from 'express';
import nigeriaData from './nigeria-geography.json';

const router = express.Router();

// Define a route to get the geographic data
router.get('/search', (req: Request, res: Response) => {
    const { category, query } = req.query;

    if (!category || !query) {
        return res.status(400).json({ message: 'Category and query parameters are required.' });
    }

    // Perform the search based on the provided category and query
    let searchResults;
    if (category === 'region') {
        searchResults = nigeriaData.filter((region: any) => region.name.toLowerCase().includes((query as string).toLowerCase()));
    } else  if (category === 'state') {
        searchResults = nigeriaData.flatMap(region => region.states
            .filter(state => state.name.toLowerCase().includes((query as string).toLowerCase()))
            .map((state: any) => ({
                region: region.name,
                state: state.name,
                lgas: state.lgas.map((lga: any) => ({ name: lga.name,
                    population: lga.population,
                    area: lga.area,
                    postalCode: lga.postalCode
                
                }))
            }))
        );
    }
     else if (category === 'lga') {
        searchResults = nigeriaData.flatMap((region: any) => region.states.flatMap((state: any) => state.lgas.filter((lga: any) => lga.name.toLowerCase().includes((query as string).toLowerCase()))));
    } else {
        return res.status(400).json({ message: 'Invalid category parameter.' });
    }

    // Return the search results
    res.json(searchResults);
});

export default router;
