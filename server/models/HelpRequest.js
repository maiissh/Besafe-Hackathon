import mongoose from 'mongoose';

const helpRequestSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  studentName: {
    type: String,
    required: true,
    trim: true
  },
  studentUsername: {
    type: String,
    required: true,
    trim: true
  },
  contactType: {
    type: String,
    required: true,
    enum: ['school', 'national', 'counselor']
  },
  schoolName: {
    type: String,
    trim: true
  },
  counselorName: {
    type: String,
    trim: true
  },
  counselorContact: {
    type: String,
    trim: true
  },
  organizationName: {
    type: String,
    trim: true
  },
  message: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  status: {
    type: String,
    enum: ['pending', 'contacted', 'resolved'],
    default: 'pending'
  }
}, {
  timestamps: true // Adds createdAt and updatedAt automatically
});

// Index for faster queries
helpRequestSchema.index({ userId: 1 });
helpRequestSchema.index({ createdAt: -1 });
helpRequestSchema.index({ contactType: 1 });

const HelpRequest = mongoose.model('HelpRequest', helpRequestSchema);

export default HelpRequest;

