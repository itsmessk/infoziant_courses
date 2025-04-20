import express from 'express';
import {
  getCourses,
  getCourseById,
  getEnrolledCourses,
  checkEnrollment,
  addSampleCourses
} from '../controllers/courseController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getCourses);
router.post('/sample', addSampleCourses); // For development only

// Protected routes
router.get('/user/enrolled', protect, getEnrolledCourses); // Route for getting enrolled courses
router.get('/:id/enrolled', protect, checkEnrollment);

// This route should come after specific routes
router.get('/:id', getCourseById);

export default router; 