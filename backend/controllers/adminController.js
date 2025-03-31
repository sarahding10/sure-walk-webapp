const { admin, db } = require('../config/db');

// Get available vehicles
exports.getAvailableVehicles = async (req, res) => {
    try {
      const vehiclesSnapshot = await db.collection('vehicles').get();

      const availableVehicles = [];

      // Loop through each vehicle to check driver assignment
      for (const doc of vehiclesSnapshot.docs) {
        const vehicle = doc.data();

        // Check if driver is assigned (not null or empty)
        if (vehicle.driver && vehicle.driver !== '') {
          availableVehicles.push({ id: doc.id, ...vehicle });
        }
      }

      res.status(200).json(availableVehicles);
    } catch (err) {
      console.error('Error fetching available vehicles:', err);
      res.status(500).json({ message: 'Error fetching available vehicles' });
    }
  };


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
// exports.getDetailedData = async (req, res) => {
//     try {
//         // const activeDrivers =
//     } catch (err) {
//         res.status(500).json({ message : 'Error fetching active drivers'})
//     }
// }

// Assign request to vehicle
exports.assignRideToVehicle = async (req, res) => {
    try {
      const { requestIds, vehicleId, vehicleName } = req.body;

      if (!requestIds || requestIds.length === 0 || !vehicleId || !vehicleName) {
        return res.status(400).json({ message: "Missing requestIds, vehicleId, or vehicleName" });
      }

      const vehicleRef = db.collection("vehicles").doc(vehicleId);

      // Run a transaction to update all requests and the vehicle atomically
      await db.runTransaction(async (transaction) => {
        // Update all request documents in batch
        requestIds.forEach((requestId) => {
          const requestRef = db.collection("requests").doc(requestId);
          transaction.update(requestRef, {
            vehicleId: vehicleId,
            status: "assigned",
            assignedVehicle: vehicleName,
          });
        });

        // Add all request IDs to the vehicle's assignedRequests array
        transaction.update(vehicleRef, {
          assignedRequests: admin.firestore.FieldValue.arrayUnion(...requestIds),
        });
      });

      res.status(200).json({
        message: "Requests assigned successfully and vehicle updated",
      });
    } catch (err) {
      console.error("Error assigning rides:", err);
      res.status(500).json({ message: "Error assigning rides" });
    }
  };


// Admin logout
exports.logout = async (req, res) => {
    try {
        // const activeDrivers =
    } catch (err) {
        res.status(500).json({ message : 'Error fetching active drivers'})
    }
}