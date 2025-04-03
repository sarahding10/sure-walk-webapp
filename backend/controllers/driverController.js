// Assign a name (vehicle.displayName) on vehicle creation in format f"{vehicle.type} #{index}"
// Default lastLocation on signin is jester west

// Driver logout
exports.logout = async (req, res) => {
    // Remove driver from vehicle
    try {
        //const activeVehicles =
    } catch (err) {
        res.status(500).json({ message : 'Error fetching active vehicles'})
    }
}