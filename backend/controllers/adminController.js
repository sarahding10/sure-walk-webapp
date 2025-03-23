import { onDocumentCreated, onDocumentDeleted } from 'firebase-functions/v2/firestore';
const { db } = require('../config/db');

// onDocumentCreated - when a new ride request is created
exports.getNewRequests = onDocumentCreated("requests/{requestId}", async (event) => {
    try {
        const request = event.data?.data(); // Extract request data
        if (!request) {
            console.error("No request data found");
            return;
        }

        console.log("New ride request received:", request);
        // TODO: Process the request (e.g., notify admin/frontend)

    } catch (err) {
        console.error("Error processing new request:", err);
    }
})

// onDocumentDeleted - when a ride request is canceled
exports.updateCanceledRide = onDocumentDeleted("requests/{requestId}", async (event) => {
    try {
        const request = event.data?.data(); // Extract request data
        if (!request) {
            console.error("No request data found");
            return;
        }

        console.log("New ride request received:", request);
        // TODO: Process the request (e.g., notify admin/frontend)

    } catch (err) {
        console.error("Error deleting new request:", err);
    }
})

// Get active drivers
exports.getAvailableDrivers = async (req, res) => {
    try {
        // Fetch all drivers
        const driversSnapshot = await db.collection("drivers").get();

        const availableDrivers = [];

        // Loop through each driver to check their capacity against assigned requests
        for (const doc of driversSnapshot.docs) {
            const driver = doc.data();
            const assignedRequestsCount = driver.assignedRequests ? driver.assignedRequests.length : 0;

            // If current assignment count is less than capacity
            if (driver.capacity > assignedRequestsCount) {
                availableDrivers.push({ id: doc.id, ...driver });
            }
        }

        res.status(200).json(availableDrivers);
    } catch (err) {
        console.error("Error fetching active drivers:", err);
        res.status(500).json({ message: 'Error fetching active drivers' });
    }
}

// Get pending requests
exports.getUnhandledRides = async (req, res) => {
    try {
        const requestsSnapshot = await db.collection("requests").where("status", "==", "pending").get();
        const pendingRequests = requestsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        res.status(200).json(pendingRequests);
    } catch (err) {
        console.error("Error fetching unhandled rides:", err);
        res.status(500).json({ message: 'Error fetching unhandled rides' });
    }
}

// Get detailed data about cars/riders/drivers
exports.getDetailedData = async (req, res) => {
    try {
        // const activeDrivers =
    } catch (err) {
        res.status(500).json({ message : 'Error fetching active drivers'})
    }
}

// Assign rider to driver
exports.assignRideToDriver = async (req, res) => {
    try {
        const { requestId, driverId } = req.body;
        if (!requestId || !driverId) {
            return res.status(400).json({ message: "Missing requestId or driverId" });
        }

        await db.collection("requests").doc(requestId).update({
            driverId,
            status: "assigned"
        });

        res.status(200).json({ message: "Ride assigned successfully" });
    } catch (err) {
        console.error("Error assigning ride:", err);
        res.status(500).json({ message: 'Error assigning ride' });
    }
}

// Admin logout
exports.logout = async (req, res) => {
    try {
        // const activeDrivers =
    } catch (err) {
        res.status(500).json({ message : 'Error fetching active drivers'})
    }
}