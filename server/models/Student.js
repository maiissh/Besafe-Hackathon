import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  full_name: {
    type: String,
    required: true,
    trim: true
  },
  username: {
    type: String,
    required: true,
    unique: true, // This automatically creates an index
    trim: true,
    lowercase: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    sparse: true, // Allows multiple null values, creates index automatically
    validate: {
      validator: function(v) {
        return !v || /^\S+@\S+\.\S+$/.test(v);
      },
      message: 'Please enter a valid email'
    }
  },
  phone: {
    type: String,
    trim: true,
    sparse: true // Allows multiple null values, creates index automatically
  },
  password: {
    type: String,
    required: true
  },
  grade_level: {
    type: String,
    required: true,
    enum: ['middle', 'high']
  },
  region: {
    type: String,
    trim: true
  },
  school_name: {
    type: String,
    trim: true
  },
  id_number: {
    type: String,
    trim: true
  },
  points: {
    type: Number,
    default: 0,
    min: 0
  },
  streak: {
    type: Number,
    default: 0,
    min: 0
  },
  currentLevel: {
    type: Number,
    default: 1,
    min: 1
  },
  completedLevels: {
    type: Number,
    default: 0,
    min: 0
  }
}, {
  timestamps: true // Adds createdAt and updatedAt automatically
});

// Note: unique: true and sparse: true automatically create indexes
// No need to manually create them to avoid duplicate index warnings

const Student = mongoose.model('Student', studentSchema);

export default Student;

