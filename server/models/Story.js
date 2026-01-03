import mongoose from 'mongoose';

const storySchema = new mongoose.Schema({
  story: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500
  },
  incidentType: {
    type: String,
    required: true,
    trim: true
  },
  displayName: {
    type: String,
    required: true,
    trim: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  likes: {
    type: Number,
    default: 0,
    min: 0
  }
}, {
  timestamps: true // Adds createdAt and updatedAt automatically
});

// Index for faster queries
storySchema.index({ userId: 1 });
storySchema.index({ createdAt: -1 }); // For sorting by newest first

const Story = mongoose.model('Story', storySchema);

export default Story;

