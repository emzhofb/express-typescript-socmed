import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Secret key used to sign the JWT token
const SECRET_KEY = process.env.JWT_SECRET_KEY || 'your-secret-key';

// Middleware to authenticate the user
const authenticateUser = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1]; // Get the token from the 'Authorization' header (Bearer <token>)

  if (!token) {
    res
      .status(401)
      .json({ message: 'No token provided, authorization denied' });
    return;
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, SECRET_KEY);
    // Attach the decoded user data to the request object for use in the next middleware or route
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

export default authenticateUser;
