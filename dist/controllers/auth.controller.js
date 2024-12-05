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
exports.login = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const database_1 = __importDefault(require("../db/database"));
const helper_1 = __importDefault(require("../utils/helper"));
const respondWithError = (res, status, message) => {
    res.status(status).json({ message });
};
const getUserByUsername = (username) => __awaiter(void 0, void 0, void 0, function* () {
    const userQuery = 'SELECT * FROM users WHERE username = $1';
    const result = yield database_1.default.query(userQuery, [username]);
    return result.rows[0];
});
const createUser = (username, password) => __awaiter(void 0, void 0, void 0, function* () {
    const passwordHash = yield bcrypt_1.default.hash(password, 10);
    const insertQuery = `
    INSERT INTO users (username, password_hash)
    VALUES ($1, $2)
    RETURNING id, username
  `;
    const newUserResult = yield database_1.default.query(insertQuery, [username, passwordHash]);
    return newUserResult.rows[0];
});
const validateCredentials = (username, password) => {
    if (!username || !password) {
        return 'Username and password are required';
    }
    return null;
};
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    // Validate input
    const validationError = validateCredentials(username, password);
    if (validationError) {
        respondWithError(res, 400, validationError);
        return;
    }
    try {
        // Check if the user exists
        const existingUser = yield getUserByUsername(username);
        if (existingUser) {
            const isMatch = yield bcrypt_1.default.compare(password, existingUser.password_hash);
            if (!isMatch) {
                respondWithError(res, 401, 'Invalid credentials');
                return;
            }
            // Generate token for existing user
            const token = (0, helper_1.default)({
                id: existingUser.id,
                username: existingUser.username,
            });
            res.status(200).json({ token });
            return;
        }
        // New user: Create user and generate token
        const newUser = yield createUser(username, password);
        const token = (0, helper_1.default)({ id: newUser.id, username: newUser.username });
        res.status(201).json({ token });
        return;
    }
    catch (err) {
        console.error(err);
        respondWithError(res, 500, 'Internal server error');
        return;
    }
});
exports.login = login;
