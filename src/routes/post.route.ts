import express from 'express';
import { createPost } from '../controllers/post.controller';
// import authenticateUser from '../middlewares/auth.middleware';

const router = express.Router();

router.post('/post', createPost);

export default router;
