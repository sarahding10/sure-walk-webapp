const Driver = require("../models/Driver");
const Ride = require("../models/Ride");
import { onDocumentWritten } from 'firebase-functions/v2/firestore';

function createNewRequest(doc) {
    // Create and add new request component
}

function updateRequest (doc) {
    // Update existing request component
}

// Firestore trigger for any change in 'requests' collection
exports.getUnhandledRides = onDocumentWritten("requests/{requestId}", async (event) => {
    const before = event.data.previous.data(); // Before state
    const after = event.data.after.data();     // After state

    try {
        // If the document is deleted - should not happen
        if (!after.exists) {
            console.log(`Document ${event.params.requestId} was deleted.`);
            return null;
        }

        // If document was created
        if (!before.exists) {
            // Handle new document creation
            after.forEach(doc =>
                createNewRequest(doc))
        }

        // If document was updated
        else {
            after.forEach(doc =>
                updateRequest(doc))

        }

        return null;
    } catch (err) {
        console.error("Error getting unhandled rides:", err);
        return null;
    }
});

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
