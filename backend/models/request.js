class Request {
    constructor(id, data) {
      this.id = id;
      this.riderId = data.riderId;
      this.driverId = data.driverId;
      this.assignedCar = data.assignedCar;
      this.pickupLocation = data.pickupLocation;
      this.dropoffLocation = data.dropoffLocation;
      this.status = data.status || 'pending'; // pending, approved, assigned, inProgress, arrived, completed, cancelled
      this.createdAt = data.createdAt || new Date().toISOString();
      this.updatedAt = data.updatedAt || new Date().toISOString();
      this.assignedAt = data.assignedAt;
      this.completedAt = data.completedAt;
    }
  
    static fromFirestore(doc) {
      const data = doc.data();
      return new Request(doc.id, data);
    }
  
    toFirestore() {
      return {
        riderId: this.riderId,
        driverId: this.driverId,
        pickupLocation: this.pickupLocation,
        dropoffLocation: this.dropoffLocation,
        status: this.status,
        createdAt: this.createdAt,
        updatedAt: new Date().toISOString(),
        assignedAt: this.assignedAt,
        completedAt: this.completedAt,
      };
    }
  }