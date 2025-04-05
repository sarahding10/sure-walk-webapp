class Request {
    static typeToCapacity = new Map([["Van", 4]]);

    constructor(id, data) {
        this.id = id;
        this.vehicleType = data.vehicleType;
        this.driverId = data.driverId;
        this.typeIndex = data.typeIndex;
        this.lastLocation = data.lastLocation || "Jester West Dormitory";
        this.capacity = typeToCapacity.get(data.vehicleType) || 0;
        this.assignedRequests = data.assignedRequests || [];
    }

    static fromFirestore(doc) {
      const data = doc.data();
      return new Request(doc.id, data);
    }

    toFirestore() {
      return {
        vehicleType: this.vehicleType,
        driverId: this.driverId,
        typeIndex: this.typeIndex,
        lastLocation: this.lastLocation,
        capacity: this.capacity,
        assignedRequests: this.assignedRequests,
      };
    }
  }