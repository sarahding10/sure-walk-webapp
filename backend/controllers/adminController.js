const Driver = require("../models/Driver");
const Ride = require("../models/Ride");

// Get active drivers
exports.getActiveDrivers = async (req, res) => {
    try {
        // const activeDrivers = 
    } catch (err) {
        res.status(500).json({ message : 'Error fetching active drivers'})
    }
}

// Get live requests
// exports.getPendingRequests = async (req, res) => {
//     try {

//     } catch (err) {

//     }
// }
