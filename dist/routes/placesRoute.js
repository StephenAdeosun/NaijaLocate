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
const express_1 = __importDefault(require("express"));
const RegionModel_1 = __importDefault(require("../models/RegionModel")); // Import your Mongoose model
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
// Define a route to get all regions, states, and LGAs
router.get("/places", authMiddleware_1.authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
}));
// Search API endpoint
router.get("/search", authMiddleware_1.authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
            return res
                .status(404)
                .json({
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
}));
exports.default = router;
