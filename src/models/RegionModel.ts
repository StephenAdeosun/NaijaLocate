import mongoose, { Document } from 'mongoose';

interface Metadata {
    population: number;
    area: string;
}

interface LGA {
    name: string;
    metadata: Metadata;
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
                
            },
        }]
    }]
});

const Place = mongoose.model<PlaceDocument>('Place', placeSchema);

export default Place;
