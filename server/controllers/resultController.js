import Result from '../models/Result.js';
import Quiz from '../models/Quiz.js';
import User from '../models/User.js';
import { calculateQuizScore } from '../utils/quizHelper.js';
import { sendSuccess, sendError } from '../utils/responseHelper.js';
import { logInfo, logError } from '../utils/logger.js';
import { HTTP_STATUS } from '../utils/constants.js';

export const submitQuiz = async (req, res, next) => {
    try {
        const { quizId, answers, timeTaken } = req.body;
        const quiz = await Quiz.findById(quizId);
        if (!quiz) return sendError(res, HTTP_STATUS.NOT_FOUND, 'Quiz not found');
        const scoreResult = calculateQuizScore(quiz.questions, answers);
        const result = new Result({
            userId: req.userId,
            quizId,
            score: scoreResult.score,
            totalPossibleScore: scoreResult.totalPossible,
            percentage: scoreResult.percentage,
            answers: scoreResult.detailedAnswers.map(a => ({
                questionId: a.questionId,
                selectedAnswer: a.userAnswer,
                isCorrect: a.isCorrect,
                pointsEarned: a.pointsEarned
            })),
            timeTaken
        });
        await result.save();
        logInfo(`Quiz submitted: User ${req.userId} scored ${scoreResult.score}/${scoreResult.totalPossible}`);
        return sendSuccess(res, HTTP_STATUS.CREATED, 'Quiz result saved', {
            score: scoreResult.score,
            totalPossible: scoreResult.totalPossible,
            percentage: scoreResult.percentage,
            passed: scoreResult.passed,
            resultId: result._id
        });
    } catch (error) {
        logError('Quiz submission error', error);
        next(error);
    }
};
export const getUserResults = async (req, res, next) => {
    try {
        const results = await Result.find({ userId: req.userId })
            .populate('quizId', 'title category difficulty')
            .sort({ completedAt: -1 });
        return sendSuccess(res, HTTP_STATUS.OK, 'Results fetched', results);
    } catch (error) {
        next(error);
    }
};
export const getAllResults = async (req, res, next) => {
    if (req.userRole !== 'admin') {
        return sendError(res, HTTP_STATUS.FORBIDDEN, 'Admin access required');
    }
    try {
        const results = await Result.find()
            .populate('userId', 'username email')
            .populate('quizId', 'title')
            .sort({ completedAt: -1 });
        return sendSuccess(res, HTTP_STATUS.OK, 'All results fetched', results);
    } catch (error) {
        next(error);
    }
};
export const getLeaderboard = async (req, res, next) => {
    try {
        const leaderboard = await Result.aggregate([
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            { $unwind: '$user' },
            { $match: { 'user.role': 'user' } },
            {
                $group: {
                    _id: '$userId',
                    username: { $first: '$user.username' },
                    totalScore: { $sum: '$score' },
                    totalQuizzes: { $sum: 1 },
                    averagePercentage: { $avg: '$percentage' }
                }
            },
            { $sort: { totalScore: -1 } },
            { $limit: 50 }
        ]);
        return sendSuccess(res, HTTP_STATUS.OK, 'Leaderboard fetched', leaderboard);
    } catch (error) {
        next(error);
    }
};
export const getResultById = async (req, res, next) => {
    try {
        const result = await Result.findById(req.params.id)
            .populate('userId', 'username email')
            .populate('quizId', 'title description');
        if (!result) {
            return sendError(res, HTTP_STATUS.NOT_FOUND, 'Result not found');
        }
        if (req.userRole !== 'admin' && result.userId._id.toString() !== req.userId) {
            return sendError(res, HTTP_STATUS.FORBIDDEN, 'Access denied');
        }
        return sendSuccess(res, HTTP_STATUS.OK, 'Result fetched', result);
    } catch (error) {
        next(error);
    }
};
