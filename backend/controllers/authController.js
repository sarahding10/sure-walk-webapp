const { db } = require('../config/db');
const userService = require('../services/userService');

exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.user.uid;
    
    const userProfile = await userService.getUserProfile(userId);
    
    if (!userProfile) {
      return res.status(404).json({ message: 'User profile not found' });
    }
    
    res.status(200).json({ userProfile });
  } catch (error) {
    console.error('Error getting user profile:', error);
    res.status(500).json({ message: 'Failed to get user profile', error: error.message });
  }
};

exports.createOrUpdateUserProfile = async (req, res) => {
  try {
    const userId = req.user.uid;
    const userData = req.body;
    
    // Check if user already exists
    const existingUser = await userService.getUserProfile(userId);
    
    let result;
    if (existingUser) {
      // Update user
      result = await userService.updateUserProfile(userId, userData);
    } else {
      // Create new user
      result = await userService.createUserProfile(userId, {
        phoneNumber: req.user.phoneNumber,
        ...userData
      });
    }
    
    res.status(200).json({ 
      message: existingUser ? 'User profile updated' : 'User profile created',
      userId: result.userId
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ message: 'Failed to update user profile', error: error.message });
  }
};