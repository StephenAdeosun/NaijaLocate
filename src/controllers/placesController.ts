import { Request, Response } from "express";
import NodeCache from "node-cache";
import Place, { PlaceDocument } from "../models/RegionModel";

// Create a new cache instance
const cache = new NodeCache();
const defaultTTL = (): number => {
  return 24 * 60 * 60;
};

// get all locations
const getLocations = async (req: Request, res: Response) => {
  try {
    // Query the database to fetch all geographic data
    const allPlaces = await Place.find();

    if (allPlaces.length === 0) {
      // Return a 404 response if no geographic data is found
      res.status(404).json({
        message: "No geographic data found in the database.",
      });
      return;
    }
    // Return the retrieved data as the response
    res.json({
      message: "Geographic data fetched successfully",
      data: allPlaces,
    });
  } catch (error) {
    // Handle any errors that occur during the database query
    console.error("Error fetching geographic data:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error.",
    });
  }
};

// get all regions
const getRegions = async (req: Request, res: Response) => {
  try {
    // Check if the data exists in the cache
    if (cache.has("regions")) {
      console.log("Data fetched from cache");
      return res.json({
        message: "Regions fetched successfully from cache",
        data: cache.get("regions"),
      });
    }

    // Fetch the data from the database
    // fetch region with its states
    const regions = await Place.aggregate([
      { $project: { _id: 0, region: "$name", states: "$states.name" } },
    ]);

    // Cache the data
    cache.set("regions", regions, defaultTTL());

    // Return the data
    res.json({
      message: "Regions fetched successfully",
      data: regions,
    });
  } catch (error) {
    console.error("Error fetching regions:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error.",
    });
  }
};

// get all states
const getStates = async (req: Request, res: Response) => {
  try {
    // Check if the data exists in the cache
    if (cache.has("states")) {
      console.log("Data fetched from cache");
      return res.json({
        message: "States fetched successfully from cache",
        data: cache.get("states"),
      });
    }

    // Fetch the data from the database
    const states = await Place.aggregate([
      { $unwind: "$states" },
      {
        $project: {
          _id: 0,
          state: "$states.name",
          region: "$name",
          lgas: "$states.lgas.name",
        },
      },
    ]);

    // Cache the data
    cache.set("states", states, defaultTTL());

    // Return the data
    res.json({
      message: "States fetched successfully",
      data: states,
    });
  } catch (error) {
    console.error("Error fetching states:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// get all lgas
const getLgas = async (req: Request, res: Response) => {
  try {
    // Check if the data exists in the cache
    if (cache.has("lgas")) {
      console.log("Data fetched from cache");
      return res.json({
        message: "LGAs fetched successfully from cache",
        data: cache.get("lgas"),
      });
    }

    // Fetch the data from the database
    const lgas = await Place.aggregate([
      { $unwind: "$states" },
      { $unwind: "$states.lgas" },
      {
        $project: {
          _id: 0,
          lga: "$states.lgas.name",
          state: "$states.name",
          metadata: "$states.lgas.metadata",
        },
      },
    ]);

    // Cache the data
    cache.set("lgas", lgas, defaultTTL());

    // Return the data
    res.json({
      message: "LGAs fetched successfully",
      data: lgas,
    });
  } catch (error) {
    console.error("Error fetching lgas:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// get states by region
const getStatesByRegion = async (req: Request, res: Response) => {
  try {
    const region = req.params.region;

    // Check if the data exists in the cache
    if (cache.has(region)) {
      console.log("Data fetched from cache");
      return res.json({
        message: "States fetched successfully from cache",
        data: cache.get(region),
      });
    }

    // Fetch the data from the database
    const states = await Place.aggregate([
      { $match: { name: region } },
      { $unwind: "$states" },
      { $project: { _id: 0, state: "$states.name" } },
    ]);

    // Cache the data
    cache.set(region, states, defaultTTL());

    // Return the data
    res.json({
      message: "States fetched successfully",
      data: states,
    });
  } catch (error) {
    console.error("Error fetching states by region:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// get lgas by state
const getLgasByState = async (req: Request, res: Response) => {
  try {
    const state = req.params.state;

    // Check if the data exists in the cache
    if (cache.has(state)) {
      console.log("Data fetched from cache");
      return res.json({
        message: "LGAs fetched successfully from cache",
        data: cache.get(state),
      });
    }

    // Fetch the data from the database
    const lgas = await Place.aggregate([
      { $unwind: "$states" },
      { $unwind: "$states.lgas" },
      { $match: { "states.name": state } },
      {
        $project: {
          _id: 0,
          lga: "$states.lgas.name",
          metadata: "$states.lgas.metadata",
        },
      },
    ]);

    // Cache the data
    cache.set(state, lgas, defaultTTL());

    // Return the data
    res.json({
      message: "LGAs fetched successfully",
      data: lgas,
    });
  } catch (error) {
    console.error("Error fetching lgas by state:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// get metadata by lga
const getMetadataByLga = async (req: Request, res: Response) => {
  try {
    const lga = req.params.lga;

    // Check if the data exists in the cache
    if (cache.has(lga)) {
      console.log("Data fetched from cache");
      return res.json({
        message: "Metadata fetched successfully from cache",
        data: cache.get(lga),
      });
    }

    // Fetch the data from the database
    const metadata = await Place.aggregate([
      { $unwind: "$states" },
      { $unwind: "$states.lgas" },
      { $match: { "states.lgas.name": lga } },
      { $project: { _id: 0, metadata: "$states.lgas.metadata" } },
    ]);

    // Cache the data
    cache.set(lga, metadata, defaultTTL());

    // Return the data
    res.json({
      message: "Metadata fetched successfully",
      data: metadata,
    });
  } catch (error) {
    console.error("Error fetching metadata by lga:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Search API endpoint
const search = async (req: Request, res: Response) => {
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
      return res.status(404).json({
        message: `No results found for query '${query}' in the '${category}' category.`,
      });
    }
    // Return the search results
    res.json({
      message: `Search results for '${query}' in the '${category}' category`,
      data: searchResults,
    });
  } catch (error) {
    console.error("Error occurred during search:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export {
  getLocations,
  getRegions,
  getStates,
  getLgas,
  getStatesByRegion,
  getLgasByState,
  getMetadataByLga,
  search,
};
