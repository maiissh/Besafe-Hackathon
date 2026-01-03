import express from 'express';
import {
  signUp,
  signIn,
  getStudent,
  updateStudentProfile,
  updateStudentProgress,
  deleteStudentAccount,
  getAll,
  searchStudent
} from '../controllers/studentController.js';
import { adminAuth } from '../middleware/auth.js';

const router = express.Router();

// Authentication routes
router.post('/signup', signUp);
router.post('/signin', signIn);

// Student CRUD routes
// IMPORTANT: Specific routes must come before parameterized routes
router.get('/admin/search', adminAuth, searchStudent); // Protected - admin only (must be before /:id)
router.get('/', adminAuth, getAll); // Protected - admin only
router.get('/:id', getStudent);
router.put('/:id', updateStudentProfile);
router.patch('/:id/progress', updateStudentProgress);
router.delete('/:id', deleteStudentAccount);

export default router;

