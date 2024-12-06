import dotenv from 'dotenv';
dotenv.config({ path: './src/env/real.env' });

import express, { Request, Response } from 'express';
import sequelize from './utils/database';
import authRoutes from './routes/auth.route';
import postRoutes from './routes/post.route';
import commentRoutes from './routes/comment.route';

const app = express();

// Middleware for handling JSON and URL-encoded form data (for text fields)
app.use(express.json()); // handles raw JSON bodies
app.use(express.urlencoded({ extended: true })); // handles form-data for non-file fields

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, TypeScript with Express!');
});

// Routes
app.use('/api', authRoutes);
app.use('/api', postRoutes);
app.use('/api', commentRoutes);

// Database connection
sequelize.sync({ force: false }).then(() => {
  console.log('Database connected');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
