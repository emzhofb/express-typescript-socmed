import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import User from '../models/user';
import { generateToken } from '../utils/jwt';

export const loginOrRegister = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    let user = await User.findOne({ where: { username } });

    if (!user) {
      // Register new user
      user = await User.create({ username, password });
    } else {
      // Verify password for existing user
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        res.status(401).json({ message: 'Invalid credentials' });
        return;
      }
    }

    // Generate JWT token
    const token = generateToken({ id: user.id, username: user.username });

    res.json({ token });
  } catch (error) {
    console.log('here', error);

    res.status(500).json({ message: 'Internal Server Error' });
  }
};
