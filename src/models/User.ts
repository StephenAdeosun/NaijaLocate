// User.ts
import mongoose, { Schema, Document } from 'mongoose';



export interface UserDocument extends Document {
    username: string;
    email: string;
    password: string;
    apiKey: string;
}

const userSchema: Schema = new Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    apiKey: { type: String, required: true, unique: true }
});

export const UserModel = mongoose.model<UserDocument>('User', userSchema);

