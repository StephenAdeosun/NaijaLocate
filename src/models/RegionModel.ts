import mongoose, { Document } from 'mongoose';

interface Metadata {
    population: number;
    area: string;
    languages: string[];
    landmarks: string[];
}

interface LGA {
    name: string;
    metadata: Metadata;
}

export interface PlaceDocument extends Document {
    name: string;
    type: 'region' | 'state' | 'lga';
    region?: string;
    metadata: Metadata;
    lgas?: LGA[];
}

const placeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, enum: ['region', 'state', 'lga'], required: true },
    region: { type: String },
    metadata: {
        population: { type: Number, required: true },
        area: { type: String, required: true },
        languages: [{ type: String, required: true }],
        landmarks: [{ type: String, required: true }]
    },
    lgas: [{
        name: { type: String, required: true },
        metadata: {
            population: { type: Number, required: true },
            area: { type: String, required: true },
            languages: [{ type: String, required: true }],
            landmarks: [{ type: String, required: true }]
        }
    }]
});

const Place = mongoose.model<PlaceDocument>('Place', placeSchema);

export default Place;
