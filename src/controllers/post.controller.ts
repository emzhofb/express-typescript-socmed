import { Request, Response } from 'express';
import upload from '../utils/multer';
import cloudinary from '../utils/cloudinary';
import { compressImage } from '../utils/compress';
import { Post } from '../models/post';
import User from '../models/user';

export const createPost = async (req: Request, res: Response) => {
  const user = req.user as User;

  // Use Multer to handle file upload (this is where you handle the file)
  upload.single('media')(req, res, async (err) => {
    // Handle any Multer errors
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    // Ensure a file is uploaded
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    try {
      let mediaUrl = '';
      let mediaWidth = 0;
      let mediaHeight = 0;

      // If the uploaded file is an image, compress and upload to Cloudinary
      if (req.file.mimetype.startsWith('image/')) {
        const compressedImage = await compressImage(req.file.path);
        const uploadResult = await cloudinary.v2.uploader.upload(
          compressedImage,
          {
            resource_type: 'image',
          },
        );

        mediaUrl = uploadResult.secure_url;
        mediaWidth = uploadResult.width;
        mediaHeight = uploadResult.height;
      } else if (req.file.mimetype.startsWith('video/')) {
        // For videos, upload directly to Cloudinary (no compression here)
        const uploadResult = await cloudinary.v2.uploader.upload(
          req.file.path,
          {
            resource_type: 'video',
          },
        );

        mediaUrl = uploadResult.secure_url;
      }

      // Destructure text fields from req.body
      const { title, isPrivate } = req.body;

      // Create a new post in the database
      const post = await Post.create({
        title,
        mediaUrl,
        mediaWidth,
        mediaHeight,
        isPrivate,
        userId: user.id,
      });

      // Respond with the created post
      res.status(201).json(post);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
};
