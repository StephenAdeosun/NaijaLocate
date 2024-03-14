import express, { Request, Response } from "express";
import Place, { PlaceDocument } from "../models/RegionModel";
import { authenticateUser } from "../middleware/authMiddleware";
import {
  getLocations,
  getRegions,
  getStates,
  getLgas,
  getStatesByRegion,
  getLgasByState,
  getMetadataByLga,
  search,
} from "../controllers/placesController";

const router = express.Router();

// get all locations
router.get("/locations", getLocations);
// global middleware
router.use(authenticateUser);



// get all regions
router.get("/regions", getRegions);

// get all states
router.get("/states", getStates);

// get all lgas
router.get("/lgas", getLgas);

// get states by region
router.get("/states/:region", getStatesByRegion);

// get lgas by state
router.get("/lgas/:state", getLgasByState);

// get metadata by lga
router.get("/metadata/:lga", getMetadataByLga);

// Search API endpoint
router.get("/search", search);

export default router;
