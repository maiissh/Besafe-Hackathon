import express from 'express';
import {
  getAllLevels,
  getLevel,
  checkLevelUnlock
} from '../controllers/levelController.js';

const router = express.Router();

// Level routes
router.get('/', getAllLevels);
router.get('/:levelNumber', getLevel);
router.get('/:levelNumber/unlock', checkLevelUnlock);

export default router;

