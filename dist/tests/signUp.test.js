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
const supertest_1 = __importDefault(require("supertest"));
const index_1 = require("../index"); // Assuming your Express app is exported as 'app'
const RegionModel_1 = __importDefault(require("../models/RegionModel"));
describe('GET /regions', () => {
    it('should return all regions', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(index_1.app).get('/regions');
        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(3); // Assuming there are three regions in the database
        // Add more assertions as needed to verify the response body
    }));
    it('should return 404 if no regions are found', () => __awaiter(void 0, void 0, void 0, function* () {
        // Mock the behavior of Place.find() to return an empty array
        jest.spyOn(RegionModel_1.default, 'find').mockResolvedValueOnce([]);
        const response = yield (0, supertest_1.default)(index_1.app).get('/regions');
        expect(response.status).toBe(404);
        expect(response.body).toEqual({ message: 'No geographic data found' });
    }));
    it('should handle internal server errors', () => __awaiter(void 0, void 0, void 0, function* () {
        // Mock the behavior of Place.find() to throw an error
        jest.spyOn(RegionModel_1.default, 'find').mockImplementationOnce(() => {
            throw new Error('Internal server error');
        });
        const response = yield (0, supertest_1.default)(index_1.app).get('/regions');
        expect(response.status).toBe(500);
        expect(response.body).toEqual({ message: 'Internal server error' });
    }));
});
