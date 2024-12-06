// src/types/express.d.ts
import { User } from '../../models/user'; // Replace with the actual path to your User model

declare global {
  namespace Express {
    interface Request {
      user?: User; // Make sure this matches the user data stored in the JWT
    }
  }
}
