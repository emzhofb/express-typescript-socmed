import express from 'express';
import { createComment, getComments } from '../controllers/comment.controller';
import { authenticateUser } from '../middlewares/auth.middleware';

const router = express.Router();

router.post('/create-comment', authenticateUser, createComment);
router.get('/get-comment', authenticateUser, getComments);

export default router;
