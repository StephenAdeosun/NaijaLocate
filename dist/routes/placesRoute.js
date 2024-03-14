"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const placesController_1 = require("../controllers/placesController");
const router = express_1.default.Router();
// global middleware
router.use(authMiddleware_1.authenticateUser);
// get all locations
router.get("/locations", placesController_1.getLocations);
// get all regions
router.get("/regions", placesController_1.getRegions);
// get all states
router.get("/states", placesController_1.getStates);
// get all lgas
router.get("/lgas", placesController_1.getLgas);
// get states by region
router.get("/states/:region", placesController_1.getStatesByRegion);
// get lgas by state
router.get("/lgas/:state", placesController_1.getLgasByState);
// get metadata by lga
router.get("/metadata/:lga", placesController_1.getMetadataByLga);
// Search API endpoint
router.get("/search", placesController_1.search);
exports.default = router;
