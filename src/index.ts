import dotenv from 'dotenv';
dotenv.config({ path: './src/env/.env' });

import express, { Request, Response } from 'express';
import sequelize from './utils/database';
import { errorHandler } from './middlewares/error.handlers';
import authRoutes from './routes/auth.route';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, TypeScript with Express!');
});

// Routes
app.use('/api', authRoutes);

// Error handling
app.use(errorHandler);

// Database connection
sequelize.sync({ force: false }).then(() => {
  console.log('Database connected');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
