"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Utility function to generate a JWT token
const generateToken = (user) => {
    return jsonwebtoken_1.default.sign(user, process.env.JWT_SECRET, { expiresIn: '1h' });
};
exports.default = generateToken;
