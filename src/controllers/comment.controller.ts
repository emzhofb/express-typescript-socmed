import { Request, Response } from 'express';
import { Post } from '../models/post';
import { Comment } from '../models/comment'; // Assuming you have a Comment model

export const createComment = async (req: Request, res: Response) => {
  const { postId, content } = req.body; // postId and content are expected in the body

  // Validate postId and content
  if (!postId || !content || typeof content !== 'string') {
    res.status(400).json({ message: 'Invalid or missing postId or content' });
    return;
  }

  try {
    // Find the post by postId
    const post = await Post.findByPk(postId);

    // If the post is not found, return a 404 error
    if (!post) {
      res.status(404).json({ message: 'Post not found' });
      return;
    }

    // Create a comment associated with the post
    const comment = await Comment.create({
      postId,
      content,
      userId: req.user?.id, // Assuming req.user contains the authenticated user's ID
    });

    // Return the created comment
    res.status(201).json(comment);
    return;
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
    return;
  }
};
