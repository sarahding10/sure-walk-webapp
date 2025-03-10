const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.applicationDefault(), 
    });
}

async function verifyToken(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    const idToken = authHeader.split(' ')[1]; // Extract token

    try {
        // Verify Firebase ID token
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        req.user = decodedToken; // Attach user data to request
        next(); 
    } catch (error) {
        return res.status(403).json({ message: 'Unauthorized: Invalid token', error: error.message });
    }
}

module.exports = { verifyToken };