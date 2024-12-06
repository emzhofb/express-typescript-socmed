import { Request, Response } from 'express';
import { Post } from '../models/post';
import { Comment } from '../models/comment'; // Assuming you have a Comment model
import { generateAvatar } from '../utils/avatar';
import User from '../models/user';

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

export const getComments = async (req: Request, res: Response) => {
  let { postId, cursor } = req.query;

  if (!postId) {
    res.status(400).json({ message: 'Missing postId' });
    return;
  }

  if (Array.isArray(postId)) {
    postId = postId[0]; // Take the first element from the array
  }

  if (!postId || typeof postId !== 'string') {
    res.status(400).json({ message: 'Invalid or missing postId' });
    return;
  }

  // Handle cursor
  if (Array.isArray(cursor)) {
    cursor = cursor[0]; // Take the first element if cursor is an array
  }

  if (cursor && typeof cursor !== 'string') {
    res.status(400).json({ message: 'Invalid cursor format' });
    return;
  }

  try {
    // Find the post by postId
    const post = await Post.findByPk(postId);

    // If post not found, return 404 error
    if (!post) {
      res.status(404).json({ message: 'Post not found' });
      return;
    }

    // Convert cursor to the page number (default to 1 if not provided)
    const limit = '5';
    const page = cursor ? parseInt(cursor as string, 10) : 1;
    const parsedLimit = parseInt(limit as string, 10);

    // Fetch comments with pagination using cursor
    const comments = await Comment.findAll({
      where: {
        postId,
      },
      limit: parsedLimit, // Adjust limit as needed
      offset: (page - 1) * parsedLimit, // Calculate the offset based on the page
      order: [['createdAt', 'DESC']], // Sorting by createdAt in descending order
    });

    // Attach user information (avatar and username) to each comment
    const commentsWithUserInfo = await Promise.all(
      comments.map(async (comment) => {
        const user = await User.findByPk(comment.userId); // Assuming comment has userId
        const avatar = await generateAvatar(user?.username || 'Anonymous'); // Generate avatar based on username
        return {
          id: comment.id,
          content: comment.content,
          user: {
            username: user?.username,
            avatar: avatar,
          },
        };
      }),
    );

    // Return the comments with user information
    res.status(200).json({
      comments: commentsWithUserInfo,
      hasMore: comments.length === 10, // Indicates whether there are more comments to fetch
    });
    return;
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
    return;
  }
};
