import express from 'express';
import {
  createHelpRequest,
  getAllHelpRequests,
  getHelpRequestsByUser,
  updateHelpRequestStatus
} from '../controllers/helpRequestController.js';
import { adminAuth } from '../middleware/auth.js';

const router = express.Router();

// Create a new help request (any authenticated user)
router.post('/', createHelpRequest);

// Get help requests by user ID
router.get('/user/:userId', getHelpRequestsByUser);

// Admin routes (protected)
router.get('/admin/all', adminAuth, getAllHelpRequests);
router.patch('/admin/:id/status', adminAuth, updateHelpRequestStatus);

export default router;

