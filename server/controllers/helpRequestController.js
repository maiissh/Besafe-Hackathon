import HelpRequest from '../models/HelpRequest.js';

// Create a new help request
export const createHelpRequest = async (req, res) => {
  try {
    const {
      userId,
      studentName,
      studentUsername,
      contactType,
      schoolName,
      counselorName,
      counselorContact,
      organizationName,
      message
    } = req.body;

    // Validation
    if (!userId || !studentName || !studentUsername || !contactType) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: userId, studentName, studentUsername, contactType'
      });
    }

    const helpRequestData = {
      userId,
      studentName,
      studentUsername,
      contactType,
      schoolName: schoolName || null,
      counselorName: counselorName || null,
      counselorContact: counselorContact || null,
      organizationName: organizationName || null,
      message: message || null,
      status: 'pending'
    };

    const newHelpRequest = await HelpRequest.create(helpRequestData);

    res.status(201).json({
      success: true,
      message: 'Help request created successfully',
      data: {
        ...newHelpRequest.toObject(),
        id: newHelpRequest._id.toString()
      }
    });
  } catch (error) {
    console.error('Create help request error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating help request',
      error: error.message
    });
  }
};

// Get all help requests (admin only)
export const getAllHelpRequests = async (req, res) => {
  try {
    const helpRequests = await HelpRequest.find({})
      .sort({ createdAt: -1 })
      .populate('userId', 'username full_name email phone')
      .lean();

    const formattedRequests = helpRequests.map(request => ({
      ...request,
      id: request._id.toString()
    }));

    res.status(200).json({
      success: true,
      data: formattedRequests
    });
  } catch (error) {
    console.error('Get all help requests error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching help requests',
      error: error.message
    });
  }
};

// Get help requests by user ID
export const getHelpRequestsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const helpRequests = await HelpRequest.find({ userId })
      .sort({ createdAt: -1 })
      .lean();

    const formattedRequests = helpRequests.map(request => ({
      ...request,
      id: request._id.toString()
    }));

    res.status(200).json({
      success: true,
      data: formattedRequests
    });
  } catch (error) {
    console.error('Get help requests by user error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching help requests',
      error: error.message
    });
  }
};

// Update help request status
export const updateHelpRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !['pending', 'contacted', 'resolved'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be: pending, contacted, or resolved'
      });
    }

    const updatedRequest = await HelpRequest.findByIdAndUpdate(
      id,
      { $set: { status } },
      { new: true }
    );

    if (!updatedRequest) {
      return res.status(404).json({
        success: false,
        message: 'Help request not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Help request status updated successfully',
      data: {
        ...updatedRequest.toObject(),
        id: updatedRequest._id.toString()
      }
    });
  } catch (error) {
    console.error('Update help request status error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating help request status',
      error: error.message
    });
  }
};

