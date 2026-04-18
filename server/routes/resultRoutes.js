import express from 'express';
import { submitQuiz, getUserResults, getAllResults, getLeaderboard, getResultById } from '../controllers/resultController.js';
import { authenticateUser, isAdmin } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateUser);
router.post('/', submitQuiz);
router.get('/my-results', getUserResults);
router.get('/admin/all', isAdmin, getAllResults);
router.get('/leaderboard', getLeaderboard);
router.get('/:id', getResultById); 

export default router;
