import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Student from '../models/Student.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Helper function to remove password from student object and add id field
const sanitizeStudent = (student) => {
  if (!student) return null;
  const studentObj = student.toObject ? student.toObject() : student;
  // eslint-disable-next-line no-unused-vars
  const { password, ...sanitized } = studentObj;
  // Add id field for compatibility with frontend
  if (sanitized._id) {
    sanitized.id = sanitized._id.toString();
  }
  return sanitized;
};

// Sign up a new student
export const signUp = async (req, res) => {
  try {
    const {
      full_name,
      username,
      email,
      phone,
      password,
      grade_level,
      region,
      school_name,
      id_number
    } = req.body;

    // Validation
    if (!full_name || !username || !password || !grade_level) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: full_name, username, password, grade_level'
      });
    }

    // Check if username already exists
    const existingUsername = await Student.findOne({ username: username.toLowerCase() });
    if (existingUsername) {
      return res.status(409).json({
        success: false,
        message: 'Username already exists'
      });
    }

    // Check if email already exists (if provided)
    if (email) {
      const existingEmail = await Student.findOne({ email: email.toLowerCase() });
      if (existingEmail) {
        return res.status(409).json({
          success: false,
          message: 'Email already registered'
        });
      }
    }

    // Check if phone already exists (if provided)
    if (phone) {
      const existingPhone = await Student.findOne({ phone });
      if (existingPhone) {
        return res.status(409).json({
          success: false,
          message: 'Phone number already registered'
        });
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create student
    const studentData = {
      full_name,
      username: username.toLowerCase(),
      email: email ? email.toLowerCase() : null,
      phone: phone || null,
      password: hashedPassword,
      grade_level,
      region: region || null,
      school_name: school_name || null,
      id_number: id_number || null,
      points: 0,
      streak: 0,
      currentLevel: 1,
      completedLevels: 0
    };

    const newStudent = await Student.create(studentData);

    // Generate JWT token
    const token = jwt.sign(
      { id: newStudent._id.toString(), username: newStudent.username },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      data: {
        student: sanitizeStudent(newStudent),
        token
      }
    });
  } catch (error) {
    console.error('Sign up error:', error);
    
    // Handle MongoDB duplicate key error
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(409).json({
        success: false,
        message: `${field} already exists`
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Sign in a student
export const signIn = async (req, res) => {
  try {
    const { emailOrPhone, password } = req.body;

    if (!emailOrPhone || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email/phone/username and password are required'
      });
    }

    // Find student by email, phone, or username
    const student = await Student.findOne({
      $or: [
        { email: emailOrPhone.toLowerCase() },
        { phone: emailOrPhone },
        { username: emailOrPhone.toLowerCase() }
      ]
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'User not found. Please sign up first.'
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, student.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Incorrect password'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: student._id.toString(), username: student.username },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      success: true,
      message: 'Sign in successful',
      data: {
        student: sanitizeStudent(student),
        token
      }
    });
  } catch (error) {
    console.error('Sign in error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Get student by ID
export const getStudent = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if id is a valid MongoDB ObjectId
    if (!id || id === 'search' || !/^[0-9a-fA-F]{24}$/.test(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid student ID'
      });
    }
    
    const student = await Student.findById(id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    res.status(200).json({
      success: true,
      data: sanitizeStudent(student)
    });
  } catch (error) {
    console.error('Get student error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Update student
export const updateStudentProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Don't allow password updates through this endpoint
    delete updates.password;
    delete updates._id;
    delete updates.id;

    const updatedStudent = await Student.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!updatedStudent) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Student updated successfully',
      data: sanitizeStudent(updatedStudent)
    });
  } catch (error) {
    console.error('Update student error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Update student points/streak/level
export const updateStudentProgress = async (req, res) => {
  try {
    const { id } = req.params;
    const { points, streak, currentLevel, completedLevels } = req.body;

    const updates = {};
    if (points !== undefined) updates.points = points;
    if (streak !== undefined) updates.streak = streak;
    if (currentLevel !== undefined) updates.currentLevel = currentLevel;
    if (completedLevels !== undefined) updates.completedLevels = completedLevels;

    const updatedStudent = await Student.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true }
    );

    if (!updatedStudent) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Progress updated successfully',
      data: sanitizeStudent(updatedStudent)
    });
  } catch (error) {
    console.error('Update progress error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Delete student
export const deleteStudentAccount = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Student.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Student deleted successfully'
    });
  } catch (error) {
    console.error('Delete student error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Get all students (admin endpoint)
export const getAll = async (req, res) => {
  try {
    const allStudents = await Student.find({}).select('-password');
    res.status(200).json({
      success: true,
      data: allStudents
    });
  } catch (error) {
    console.error('Get all students error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Search student by name, username, or ID number (with full details and activities)
export const searchStudent = async (req, res) => {
  try {
    const { query } = req.query; // Can be name, username, or id_number
    
    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    // Search in multiple fields
    const student = await Student.findOne({
      $or: [
        { full_name: { $regex: query, $options: 'i' } }, // Case-insensitive search
        { username: { $regex: query, $options: 'i' } },
        { id_number: query },
        { email: { $regex: query, $options: 'i' } },
        { phone: query }
      ]
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Get all stories by this student
    const Story = (await import('../models/Story.js')).default;
    const stories = await Story.find({ userId: student._id })
      .sort({ createdAt: -1 })
      .lean();

    // Get all help requests by this student
    const HelpRequest = (await import('../models/HelpRequest.js')).default;
    const helpRequests = await HelpRequest.find({ userId: student._id })
      .sort({ createdAt: -1 })
      .lean();

    // Format stories
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

    // Format help requests
    const formattedHelpRequests = helpRequests.map(request => {
      const now = new Date();
      const created = new Date(request.createdAt);
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
        ...request,
        id: request._id.toString(),
        date: dateStr
      };
    });

    // Return full student data with activities
    const studentData = sanitizeStudent(student);
    
    res.status(200).json({
      success: true,
      data: {
        student: {
          ...studentData,
          // Include password hash for admin purposes (not the actual password)
          passwordHash: student.password ? '***encrypted***' : null
        },
        activities: {
          stories: formattedStories,
          totalStories: formattedStories.length,
          totalLikes: formattedStories.reduce((sum, story) => sum + (story.likes || 0), 0),
          helpRequests: formattedHelpRequests,
          totalHelpRequests: formattedHelpRequests.length
        },
        statistics: {
          points: student.points || 0,
          streak: student.streak || 0,
          currentLevel: student.currentLevel || 1,
          completedLevels: student.completedLevels || 0,
          accountCreated: student.createdAt,
          lastUpdated: student.updatedAt
        }
      }
    });
  } catch (error) {
    console.error('Search student error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};
