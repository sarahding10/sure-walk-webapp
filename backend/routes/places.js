// routes/places.js
const express = require('express');
const router = express.Router();
const placesCtrl = require('../controllers/placesController');
const { verifyToken } = require('../middleware/authMiddleware');

// No auth needed for autocomplete/details if you want them public,
// but you can add verifyToken if you prefer.
router.get('/autocomplete', placesCtrl.autocomplete);
router.get('/details',     placesCtrl.details);

module.exports = router;