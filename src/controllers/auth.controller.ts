import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import pool from '../db/database';
import generateToken from '../utils/helper';

const respondWithError = (res: Response, status: number, message: string) => {
  res.status(status).json({ message });
};

const getUserByUsername = async (username: string) => {
  const userQuery = 'SELECT * FROM users WHERE username = $1';
  const result = await pool.query(userQuery, [username]);
  return result.rows[0];
};

const createUser = async (username: string, password: string) => {
  const passwordHash = await bcrypt.hash(password, 10);
  const insertQuery = `
    INSERT INTO users (username, password_hash)
    VALUES ($1, $2)
    RETURNING id, username
  `;
  const newUserResult = await pool.query(insertQuery, [username, passwordHash]);
  return newUserResult.rows[0];
};

const validateCredentials = (username: string, password: string) => {
  if (!username || !password) {
    return 'Username and password are required';
  }
  return null;
};

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  // Validate input
  const validationError = validateCredentials(username, password);
  if (validationError) {
    respondWithError(res, 400, validationError);
    return;
  }

  try {
    // Check if the user exists
    const existingUser = await getUserByUsername(username);

    if (existingUser) {
      const isMatch = await bcrypt.compare(
        password,
        existingUser.password_hash,
      );

      if (!isMatch) {
        respondWithError(res, 401, 'Invalid credentials');
        return;
      }

      // Generate token for existing user
      const token = generateToken({
        id: existingUser.id,
        username: existingUser.username,
      });
      res.status(200).json({ token });
      return;
    }

    // New user: Create user and generate token
    const newUser = await createUser(username, password);
    const token = generateToken({ id: newUser.id, username: newUser.username });
    res.status(201).json({ token });
    return;
  } catch (err) {
    console.error(err);
    respondWithError(res, 500, 'Internal server error');
    return;
  }
};
