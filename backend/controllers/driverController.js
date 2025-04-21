const { db } = require('../config/db');

const typeToCapacity = new Map([["Van", 4]]);

// Driver login and vehicle assignment
exports.login = async (req, res) => {
    try {
        const { vehicleType, driverId } = req.body;

        if (!vehicleType || !driverId) {
            return res.status(400).json({ message: 'Missing vehicleType or driverId' });
        }

        const vehiclesSnapshot = await db
        .collection('vehicles')
        .where('vehicleType', '==', vehicleType)
        .orderBy('typeIndex', 'asc')
        .get();

        let lastAvailable = "";

        // Loop through each vehicle to check driver assignment
        for (const doc of vehiclesSnapshot.docs) {
          const vehicle = doc.data();

          // Check if driver is assigned (not null or empty)
          if (!vehicle.driver || vehicle.driver == '') {
            await db.collection('vehicles').doc(doc.id).update({
                driver: driverId,
                lastLocation: 'Jester West Dormitory',
              });

              assignedVehicle = {
                id: doc.id,
                ...vehicle,
                driver: driverId,
                lastLocation: 'Jester West Dormitory',
              };
              break;
          }
        }
        if (!lastAvailable) {
            // Get the last sorted value - should be current largest index to add to
            const currMaxIndex = vehiclesSnapshot.docs.length > 0
                ? vehiclesSnapshot.docs[vehiclesSnapshot.docs.length - 1].data().typeIndex: 0;

            const newVehicle = {
                type: vehicleType,
                driver: driverId,
                typeIndex: currMaxIndex + 1,
                lastLocation: 'Jester West Dormitory',
                capacity: typeToCapacity.get(vehicleType),
                assignedRequests: []
            };

            const vehicleRef = db.collection('vehicles');
            const newDocRef = await vehicleRef.add(newVehicle);

            return res.status(201).json({ message: 'New vehicle created and assigned', vehicle: { id: newDocRef.id, ...newVehicle } });
        }

        return res.status(200).json({ message: 'Assigned to available vehicle', vehicle: lastAvailable });
      } catch (err) {
        res.status(500).json({ message: 'Error assigning driver' });
      }
}

// Driver status update
exports.statusUpdate = async (req, res) => {
    try {
        const { requestId, newStatus } = req.body;

        if (!requestId || !newStatus) {
            console.log('missing');
            console.log(requestId);
            console.log(newStatus);
            return res.status(400).json({ message: 'Missing requestId or newStatus' });
        }

        const requestRef = db.collection('requests').doc(requestId);
        const doc = await requestRef.get();

        if (!doc.exists) {
            console.log('missing request');
            return res.status(404).json({ message: 'Request not found' });
        }

        await requestRef.update({
            status: newStatus,
        });

        res.status(200).json({ message: 'Request status updated successfully' });
    } catch (err) {
        console.error('Error updating driver status:', err);
        res.status(500).json({ message: 'Error updating driver status' });
    }
}


// Driver logout
exports.logout = async (req, res) => {
    try {
        // Remove driver from vehicle - will deactivate vehicle
    } catch (err) {
        res.status(500).json({ message : 'Error logging out driver'})
    }
}