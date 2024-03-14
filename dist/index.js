"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Import required modules
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
// import cors from "cors";
const database_1 = require("./services/database");
const UserRoutes_1 = __importDefault(require("./routes/UserRoutes"));
const placesRoute_1 = __importDefault(require("./routes/placesRoute"));
const express_rate_limit_1 = require("express-rate-limit");
// Load environment variables from .env file
dotenv_1.default.config();
// Create an Express application
const app = (0, express_1.default)();
// Use middleware to parse JSON bodies
app.use(body_parser_1.default.json());
// Enable CORS
// app.use(cors());
// Connect to the MongoDB database
(0, database_1.connectDB)().catch((err) => console.error("Error connecting to MongoDB:", err));
const limiter = (0, express_rate_limit_1.rateLimit)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 1, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
    standardHeaders: "draft-7", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
    message: "Too many requests from this IP, please try again later.",
});
// Apply the rate limiting middleware to all requests with '/api'.
// app.use("/api", limiter);
//  routes
app.use("/api/users/", UserRoutes_1.default);
app.use("/api/", placesRoute_1.default);
// Define a basic route
app.get("/", (req, res) => {
    res.send("Welcome to Locale API!");
});
// Handle 404 errors
app.use((req, res, next) => {
    res.status(404).send("404 - Not Found");
});
// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("500 - Internal Server Error");
});
// Define the port to listen on
const PORT = process.env.PORT || 3000;
// Start the Express server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
