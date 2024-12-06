import express from 'express';
import { createComment } from '../controllers/comment.controller';
import { authenticateUser } from '../middlewares/auth.middleware';

const router = express.Router();

router.post('/create-comment', authenticateUser, createComment);

export default router;
