"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.search = exports.getMetadataByLga = exports.getLgasByState = exports.getStatesByRegion = exports.getLgas = exports.getStates = exports.getRegions = exports.getLocations = void 0;
const node_cache_1 = __importDefault(require("node-cache"));
const RegionModel_1 = __importDefault(require("../models/RegionModel"));
// Create a new cache instance
const cache = new node_cache_1.default();
const defaultTTL = () => {
    return 24 * 60 * 60;
};
// get all locations
const getLocations = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Query the database to fetch all geographic data
        const allPlaces = yield RegionModel_1.default.find();
        if (allPlaces.length === 0) {
            // Return a 404 response if no geographic data is found
            res.status(404).json({ message: "No geographic data found" });
            return;
        }
        // Return the retrieved data as the response
        res.json(allPlaces);
    }
    catch (error) {
        // Handle any errors that occur during the database query
        console.error("Error fetching geographic data:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getLocations = getLocations;
// get all regions
const getRegions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Check if the data exists in the cache
        if (cache.has("regions")) {
            console.log("Data fetched from cache");
            return res.json(cache.get("regions"));
        }
        // Fetch the data from the database
        // fetch region with its states
        const regions = yield RegionModel_1.default.aggregate([
            { $project: { _id: 0, region: "$name", states: "$states.name" } },
        ]);
        // Cache the data
        cache.set("regions", regions, defaultTTL());
        // Return the data
        res.json(regions);
    }
    catch (error) {
        console.error("Error fetching regions:", error);
        res.status(500).json({ message: "Internal server error." });
    }
});
exports.getRegions = getRegions;
// get all states
const getStates = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Check if the data exists in the cache
        if (cache.has("states")) {
            console.log("Data fetched from cache");
            return res.json(cache.get("states"));
        }
        // Fetch the data from the database
        const states = yield RegionModel_1.default.aggregate([
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
        res.json(states);
    }
    catch (error) {
        console.error("Error fetching states:", error);
        res.status(500).json({ message: "Internal server error." });
    }
});
exports.getStates = getStates;
// get all lgas
const getLgas = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Check if the data exists in the cache
        if (cache.has("lgas")) {
            console.log("Data fetched from cache");
            return res.json(cache.get("lgas"));
        }
        // Fetch the data from the database
        const lgas = yield RegionModel_1.default.aggregate([
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
        res.json(lgas);
    }
    catch (error) {
        console.error("Error fetching lgas:", error);
        res.status(500).json({ message: "Internal server error." });
    }
});
exports.getLgas = getLgas;
// get states by region
const getStatesByRegion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const region = req.params.region;
        // Check if the data exists in the cache
        if (cache.has(region)) {
            console.log("Data fetched from cache");
            return res.json(cache.get(region));
        }
        // Fetch the data from the database
        const states = yield RegionModel_1.default.aggregate([
            { $match: { name: region } },
            { $unwind: "$states" },
            { $project: { _id: 0, state: "$states.name" } },
        ]);
        // Cache the data
        cache.set(region, states, defaultTTL());
        // Return the data
        res.json(states);
    }
    catch (error) {
        console.error("Error fetching states by region:", error);
        res.status(500).json({ message: "Internal server error." });
    }
});
exports.getStatesByRegion = getStatesByRegion;
// get lgas by state
const getLgasByState = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const state = req.params.state;
        // Check if the data exists in the cache
        if (cache.has(state)) {
            console.log("Data fetched from cache");
            return res.json(cache.get(state));
        }
        // Fetch the data from the database
        const lgas = yield RegionModel_1.default.aggregate([
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
        res.json(lgas);
    }
    catch (error) {
        console.error("Error fetching lgas by state:", error);
        res.status(500).json({ message: "Internal server error." });
    }
});
exports.getLgasByState = getLgasByState;
// get metadata by lga
const getMetadataByLga = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const lga = req.params.lga;
        // Check if the data exists in the cache
        if (cache.has(lga)) {
            console.log("Data fetched from cache");
            return res.json(cache.get(lga));
        }
        // Fetch the data from the database
        const metadata = yield RegionModel_1.default.aggregate([
            { $unwind: "$states" },
            { $unwind: "$states.lgas" },
            { $match: { "states.lgas.name": lga } },
            { $project: { _id: 0, metadata: "$states.lgas.metadata" } },
        ]);
        // Cache the data
        cache.set(lga, metadata, defaultTTL());
        // Return the data
        res.json(metadata);
    }
    catch (error) {
        console.error("Error fetching metadata by lga:", error);
        res.status(500).json({ message: "Internal server error." });
    }
});
exports.getMetadataByLga = getMetadataByLga;
// Search API endpoint
const search = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { category, query } = req.query;
        if (!category || !query) {
            return res
                .status(400)
                .json({ message: "Category and query parameters are required." });
        }
        // Adjust the query to allow for optional whitespace between characters
        const adjustedQuery = query.split("").join("\\s*");
        let searchResults = [];
        // Perform the search based on the provided category and adjusted query
        if (category === "region") {
            searchResults = yield RegionModel_1.default.aggregate([
                { $match: { name: { $regex: new RegExp(adjustedQuery, "i") } } },
                { $unwind: "$states" },
                { $group: { _id: "$name", states: { $push: "$states.name" } } },
                { $project: { region: "$_id", states: 1, _id: 0 } },
            ]);
        }
        else if (category === "state") {
            searchResults = yield RegionModel_1.default.aggregate([
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
        }
        else if (category === "lga") {
            searchResults = yield RegionModel_1.default.aggregate([
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
        }
        else {
            return res.status(400).json({ message: "Invalid category parameter." });
        }
        // Return a message if no results are found
        if (searchResults.length === 0) {
            return res.status(404).json({
                message: `No results found for query '${query}' in the '${category}' category.`,
            });
        }
        // Return the search results
        res.json(searchResults);
    }
    catch (error) {
        console.error("Error occurred during search:", error);
        res.status(500).json({ message: "Internal server error." });
    }
});
exports.search = search;
