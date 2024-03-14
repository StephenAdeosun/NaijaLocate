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
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
const signupController_1 = require("./signupController");
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');
jest.mock('../models/User');
describe('signupController', () => {
    let req;
    let res;
    beforeEach(() => {
        req = {
            body: {
                username: 'testuser',
                email: 'test@example.com',
                password: 'password123'
            }
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('should create a new user and return the API key', () => __awaiter(void 0, void 0, void 0, function* () {
        // Mock UserModel.findOne to return null, indicating that the email is not registered
        User_1.UserModel.findOne.mockResolvedValue(null);
        // Mock bcrypt.hash to return the hashed password
        bcryptjs_1.default.hash.mockResolvedValue('hashedPassword');
        // Mock jwt.sign to return the API key
        jsonwebtoken_1.default.sign.mockReturnValue('mockedApiKey');
        yield (0, signupController_1.signUp)(req, res);
        expect(User_1.UserModel.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
        expect(bcryptjs_1.default.hash).toHaveBeenCalledWith('password123', 10);
        expect(jsonwebtoken_1.default.sign).toHaveBeenCalledWith({ email: 'test@example.com' }, 'your-default-secret-key');
        expect(User_1.UserModel).toHaveBeenCalledWith({
            username: 'testuser',
            email: 'test@example.com',
            password: 'hashedPassword',
            apiKey: 'mockedApiKey'
        });
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ apiKey: 'mockedApiKey' });
    }));
    it('should return 400 if email is already registered', () => __awaiter(void 0, void 0, void 0, function* () {
        // Mock UserModel.findOne to return an existing user
        User_1.UserModel.findOne.mockResolvedValue({});
        yield (0, signupController_1.signUp)(req, res);
        expect(User_1.UserModel.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Email is already registered' });
    }));
    it('should return 500 if an error occurs during sign-up', () => __awaiter(void 0, void 0, void 0, function* () {
        // Mock UserModel.findOne to throw an error
        User_1.UserModel.findOne.mockRejectedValue(new Error('Database error'));
        yield (0, signupController_1.signUp)(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
    }));
});
