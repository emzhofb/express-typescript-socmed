import { Router } from 'express';
import { login } from '../controllers/auth.controller';

const router = Router();

// Use the login controller for the /login route
router.post('/login', login);

export default router;
