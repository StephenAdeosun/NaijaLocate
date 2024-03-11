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
    landmarks: string[];
}

interface State {
    name: string;
    lgas?: LGA[];
}

export interface PlaceDocument extends Document {
    name: string;
    states?: State[];
}

const placeSchema = new mongoose.Schema({
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

const Place = mongoose.model<PlaceDocument>('Place', placeSchema);

export default Place;
