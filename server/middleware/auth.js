const ADMIN_API_KEY = process.env.ADMIN_API_KEY || 'admin-secret-key-12345';

// Middleware to check if user is admin (has valid API key)
export const adminAuth = (req, res, next) => {
  try {
    // Check for API key in header
    const apiKey = req.headers['x-admin-api-key'] || req.query.apiKey;
    
    if (!apiKey) {
      return res.status(401).json({
        success: false,
        message: 'Admin API key required'
      });
    }

    if (apiKey !== ADMIN_API_KEY) {
      return res.status(403).json({
        success: false,
        message: 'Invalid admin API key'
      });
    }

    // API key is valid, proceed
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Authentication error',
      error: error.message
    });
  }
};

