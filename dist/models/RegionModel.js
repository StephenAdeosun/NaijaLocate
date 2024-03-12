"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const placeSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    states: [{
            name: { type: String, required: true },
            lgas: [{
                    name: { type: String, required: true },
                    metadata: {
                        population: { type: Number, required: true },
                        area: { type: String, required: true },
                        languages: [{ type: String, required: true }],
                        landmarks: [{ type: String, required: true }]
                    },
                    landmarks: [{ type: String, required: true }]
                }]
        }]
});
const Place = mongoose_1.default.model('Place', placeSchema);
exports.default = Place;
