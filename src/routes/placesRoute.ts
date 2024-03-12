import express, { Request, Response } from "express";
import Place, { PlaceDocument } from "../models/RegionModel"; // Import your Mongoose model
import { authenticate } from "../middleware/authMiddleware";

const router = express.Router();

// Define a route to get all regions, states, and LGAs
router.get("/places", authenticate, async (req: Request, res: Response) => {
  try {
    // Query the database to fetch all geographic data
    const allPlaces = await Place.find(); 

    if (allPlaces.length === 0) {
      // Return a 404 response if no geographic data is found
      res.status(404).json({ message: "No geographic data found" });
      return;
    }
    // Return the retrieved data as the response
    res.json(allPlaces);
  } catch (error) {
    // Handle any errors that occur during the database query
    console.error("Error fetching geographic data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Search API endpoint
router.get("/search", authenticate, async (req: Request, res: Response) => {
  try {
    const { category, query } = req.query;

    if (!category || !query) {
      return res
        .status(400)
        .json({ message: "Category and query parameters are required." });
    }

    // Adjust the query to allow for optional whitespace between characters
    const adjustedQuery = (query as string).split("").join("\\s*");

    let searchResults: any[] = [];

    // Perform the search based on the provided category and adjusted query
    if (category === "region") {
      searchResults = await Place.aggregate([
        { $match: { name: { $regex: new RegExp(adjustedQuery, "i") } } },
        { $unwind: "$states" },
        { $group: { _id: "$name", states: { $push: "$states.name" } } },
        { $project: { region: "$_id", states: 1, _id: 0 } },
      ]);
    } else if (category === "state") {
      searchResults = await Place.aggregate([
        { $unwind: "$states" },
        {
          $match: { "states.name": { $regex: new RegExp(adjustedQuery, "i") } },
        },
        {
          $group: {
            _id: "$name",
            states: {
              $push: {
                name: "$states.name",
                lgas: "$states.lgas.name",
              },
            },
          },
        },
        {
          $project: {
            _id: 0,
            region: "$_id",
            states: 1,
          },
        },
      ]);
    } else if (category === "lga") {
      searchResults = await Place.aggregate([
        { $unwind: "$states" },
        { $unwind: "$states.lgas" },
        {
          $match: {
            "states.lgas.name": { $regex: new RegExp(adjustedQuery, "i") },
          },
        },
        {
          $project: {
            _id: 0,
            state: "$states.name",
            lga: "$states.lgas.name",
            metadata: "$states.lgas.metadata",
          },
        },
      ]);
    } else {
      return res.status(400).json({ message: "Invalid category parameter." });
    }

    // Return a message if no results are found
    if (searchResults.length === 0) {
      return res
        .status(404)
        .json({
          message: `No results found for query '${query}' in the '${category}' category.`,
        });
    }
    // Return the search results
    res.json(searchResults);
  } catch (error) {
    console.error("Error occurred during search:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

export default router;
