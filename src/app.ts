import express from 'express';
import connectDB from './config/db';

import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';

const app = express();

app.use(express.json());

connectDB();

app.use('/api', authRoutes);
app.use('/api', userRoutes);

app.get('/', (_req, res) => {
    res.json({ status: 'success' });
});

export default app;
