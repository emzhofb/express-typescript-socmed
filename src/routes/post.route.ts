import express from 'express';
import { createPost, getPost } from '../controllers/post.controller';
import { authenticateUser } from '../middlewares/auth.middleware';

const router = express.Router();

router.post('/post', authenticateUser, createPost);
router.get('/get-post', authenticateUser, getPost);

export default router;
