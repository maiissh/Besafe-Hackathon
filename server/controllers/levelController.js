// Level controller for managing game levels and progress

// Level configuration data
const LEVELS = [
  {
    level_number: 1,
    title: 'Cyberbullying Basics',
    subtitle: 'Learn the fundamentals of online safety',
    color: '#F6C1D1',
    unlocked: true,
    requiredPoints: 0
  },
  {
    level_number: 2,
    title: 'Harassment Prevention',
    subtitle: 'Advanced techniques to stay safe online',
    color: '#C9B7E2',
    unlocked: false,
    requiredPoints: 50
  },
  {
    level_number: 3,
    title: 'Digital Safety Master',
    subtitle: 'Master level cybersecurity knowledge',
    color: '#CFE7F5',
    unlocked: false,
    requiredPoints: 100
  }
];

// Get all levels
export const getAllLevels = (req, res) => {
  try {
    res.status(200).json({
      success: true,
      data: LEVELS
    });
  } catch (error) {
    console.error('Get all levels error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Get level by number
export const getLevel = (req, res) => {
  try {
    const { levelNumber } = req.params;
    const level = LEVELS.find(l => l.level_number === parseInt(levelNumber));

    if (!level) {
      return res.status(404).json({
        success: false,
        message: 'Level not found'
      });
    }

    res.status(200).json({
      success: true,
      data: level
    });
  } catch (error) {
    console.error('Get level error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Check if student can unlock a level
export const checkLevelUnlock = (req, res) => {
  try {
    const { levelNumber } = req.params;
    const { studentPoints } = req.query;

    const level = LEVELS.find(l => l.level_number === parseInt(levelNumber));

    if (!level) {
      return res.status(404).json({
        success: false,
        message: 'Level not found'
      });
    }

    const canUnlock = parseInt(studentPoints) >= level.requiredPoints;

    res.status(200).json({
      success: true,
      data: {
        level,
        canUnlock,
        unlocked: canUnlock
      }
    });
  } catch (error) {
    console.error('Check level unlock error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

