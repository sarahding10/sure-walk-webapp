const { db } = require('../config/db');

exports.getUserProfile = async (userId) => {
  try {
    const userDoc = await db.collection('users').doc(userId).get();
    
    if (!userDoc.exists) {
      return null;
    }
    
    return userDoc.data();
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw error;
  }
};

exports.createUserProfile = async (userId, userData) => {
  try {
    await db.collection('users').doc(userId).set({
      ...userData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    
    return { userId };
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw error;
  }
};

exports.updateUserProfile = async (userId, userData) => {
  try {
    await db.collection('users').doc(userId).update({
      ...userData,
      updatedAt: new Date().toISOString()
    });
    
    return { userId };
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};