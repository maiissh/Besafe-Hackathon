import express from 'express';
import {
  getAll,
  getStory,
  getStoriesByUser,
  create,
  update,
  remove,
  likeStory,
  unlikeStoryController
} from '../controllers/storyController.js';

const router = express.Router();

// Get all stories
router.get('/', getAll);

// Get story by ID
router.get('/:id', getStory);

// Get stories by user ID
router.get('/user/:userId', getStoriesByUser);

// Create a new story
router.post('/', create);

// Update story
router.patch('/:id', update);

// Delete story
router.delete('/:id', remove);

// Like a story
router.post('/:id/like', likeStory);

// Unlike a story
router.post('/:id/unlike', unlikeStoryController);

export default router;

