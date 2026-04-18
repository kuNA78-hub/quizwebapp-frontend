import dotenv from 'dotenv';
dotenv.config();

console.log('JWT_SECRET loaded:', !!process.env.JWT_SECRET);

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';
import quizRoutes from './routes/quizRoutes.js';
import resultRoutes from './routes/resultRoutes.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import { isDatabaseConnected, getConnectionStatus } from './utils/dbHelper.js';
import { logInfo, logError } from './utils/logger.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/quizwebapp')
    .then(() => {
        logInfo('MongoDB connected');
        logInfo(`Connection status: ${getConnectionStatus()}`);
    })
    .catch(err => logError('MongoDB error:', err));

app.use('/api/users', userRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/results', resultRoutes);

app.get('/api/health', (req, res) => {
    const dbConnected = isDatabaseConnected();
    res.json({
        status: 'OK',
        message: 'Server running',
        database: dbConnected ? 'connected' : 'disconnected',
        timestamp: new Date().toISOString()
    });
});

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
    logInfo(`Server running on http://localhost:${PORT}`);
});