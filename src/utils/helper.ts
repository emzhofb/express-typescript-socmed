import jwt from 'jsonwebtoken';

// Utility function to generate a JWT token
const generateToken = (user: { id: number; username: string }) => {
  return jwt.sign(user, process.env.JWT_SECRET as string, { expiresIn: '1h' });
};

export default generateToken;
