// controllers/placesController.js
const fetch = require('node-fetch');
require('dotenv').config();

const API_KEY = process.env.GOOGLE_MAPS_API_KEY;
const BASE = 'https://maps.googleapis.com/maps/api/place';

/**
 * GET /api/places/autocomplete?input=…
 */
exports.autocomplete = async (req, res) => {
  const input = req.query.input;
  if (!input) return res.status(400).json({ message: 'Missing input query' });

  const params = new URLSearchParams({
    input,
    key: API_KEY,
    components: 'country:us'
  });

  try {
    const resp = await fetch(`${BASE}/autocomplete/json?${params}`);
    const data = await resp.json();
    // return only what the frontend needs
    const suggestions = (data.predictions || []).map(p => ({
      description: p.description,
      place_id: p.place_id
    }));
    res.json(suggestions);
  } catch (err) {
    console.error('Places autocomplete error:', err);
    res.status(500).json({ message: 'Places autocomplete failed' });
  }
};

/**
 * GET /api/places/details?place_id=…
 */
exports.details = async (req, res) => {
  const placeId = req.query.place_id;
  if (!placeId) return res.status(400).json({ message: 'Missing place_id' });

  const params = new URLSearchParams({
    place_id: placeId,
    key: API_KEY,
    fields: 'formatted_address,geometry'
  });

  try {
    const resp = await fetch(`${BASE}/details/json?${params}`);
    const data = await resp.json();
    if (data.status !== 'OK') {
      return res.status(500).json({ message: 'Place details failed', detail: data.status });
    }
    const result = data.result;
    res.json({
      formatted_address: result.formatted_address,
      location: {
        lat: result.geometry.location.lat,
        lng: result.geometry.location.lng
      }
    });
  } catch (err) {
    console.error('Places details error:', err);
    res.status(500).json({ message: 'Places details failed' });
  }
};