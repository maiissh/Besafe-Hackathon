import Story from '../models/Story.js';

// Get all stories
export const getAll = async (req, res) => {
  try {
    const stories = await Story.find({})
      .sort({ createdAt: -1 }) // Newest first
      .populate('userId', 'username full_name')
      .lean();
    
    // Format date for display
    const formattedStories = stories.map(story => {
      const now = new Date();
      const created = new Date(story.createdAt);
      const diffTime = Math.abs(now - created);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      let dateStr = 'Just now';
      if (diffDays === 1) dateStr = '1 day ago';
      else if (diffDays < 7) dateStr = `${diffDays} days ago`;
      else if (diffDays < 14) dateStr = '1 week ago';
      else if (diffDays < 21) dateStr = '2 weeks ago';
      else if (diffDays < 30) dateStr = '3 weeks ago';
      else dateStr = `${Math.floor(diffDays / 7)} weeks ago`;
      
      return {
        ...story,
        id: story._id.toString(),
        date: dateStr
      };
    });
    
    res.json({
      success: true,
      data: formattedStories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching stories',
      error: error.message
    });
  }
};

// Get story by ID
export const getStory = async (req, res) => {
  try {
    const { id } = req.params;
    const story = await Story.findById(id).populate('userId', 'username full_name');
    
    if (!story) {
      return res.status(404).json({
        success: false,
        message: 'Story not found'
      });
    }
    
    res.json({
      success: true,
      data: {
        ...story.toObject(),
        id: story._id.toString()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching story',
      error: error.message
    });
  }
};

// Get stories by user ID
export const getStoriesByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const userStories = await Story.find({ userId })
      .sort({ createdAt: -1 })
      .populate('userId', 'username full_name')
      .lean();
    
    const formattedStories = userStories.map(story => ({
      ...story,
      id: story._id.toString()
    }));
    
    res.json({
      success: true,
      data: formattedStories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user stories',
      error: error.message
    });
  }
};

// Create a new story
export const create = async (req, res) => {
  try {
    const { story, incidentType, displayName, userId } = req.body;
    
    // Validation
    if (!story || !incidentType || !displayName || !userId) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: story, incidentType, displayName, userId'
      });
    }
    
    const storyData = {
      story: story.trim(),
      incidentType,
      displayName,
      userId,
      likes: 0
    };
    
    const newStory = await Story.create(storyData);
    
    res.status(201).json({
      success: true,
      message: 'Story created successfully',
      data: {
        ...newStory.toObject(),
        id: newStory._id.toString(),
        date: 'Just now'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating story',
      error: error.message
    });
  }
};

// Update story (for likes, etc.)
export const update = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const updatedStory = await Story.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );
    
    if (!updatedStory) {
      return res.status(404).json({
        success: false,
        message: 'Story not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Story updated successfully',
      data: {
        ...updatedStory.toObject(),
        id: updatedStory._id.toString()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating story',
      error: error.message
    });
  }
};

// Delete story
export const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Story.findByIdAndDelete(id);
    
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Story not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Story deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting story',
      error: error.message
    });
  }
};

// Like a story
export const likeStory = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedStory = await Story.findByIdAndUpdate(
      id,
      { $inc: { likes: 1 } },
      { new: true }
    );
    
    if (!updatedStory) {
      return res.status(404).json({
        success: false,
        message: 'Story not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Story liked successfully',
      data: {
        ...updatedStory.toObject(),
        id: updatedStory._id.toString()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error liking story',
      error: error.message
    });
  }
};

// Unlike a story
export const unlikeStoryController = async (req, res) => {
  try {
    const { id } = req.params;
    const story = await Story.findById(id);
    
    if (!story) {
      return res.status(404).json({
        success: false,
        message: 'Story not found'
      });
    }
    
    const updatedStory = await Story.findByIdAndUpdate(
      id,
      { $inc: { likes: -1 } },
      { new: true }
    );
    
    // Ensure likes doesn't go below 0
    if (updatedStory.likes < 0) {
      updatedStory.likes = 0;
      await updatedStory.save();
    }
    
    res.json({
      success: true,
      message: 'Story unliked successfully',
      data: {
        ...updatedStory.toObject(),
        id: updatedStory._id.toString()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error unliking story',
      error: error.message
    });
  }
};
