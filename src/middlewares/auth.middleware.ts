import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/user'; // Import your User model

interface JwtPayload {
  id: string; // Or whatever fields are part of your JWT
}

export const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    res.status(401).json({ message: 'Authentication required' });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    const user = await User.findByPk(decoded.id); // Fetch user from DB using the ID from JWT

    if (!user) {
      res.status(401).json({ message: 'User not found' });
      return;
    }

    // Add the user to req.user
    req.user = user;

    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token' });
    return;
  }
};
