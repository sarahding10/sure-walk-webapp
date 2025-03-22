const CarComponent = ({ type, lastLocation, assignedRequests, capacity }) => {

    return (
        <div className="car-component">
            <div className="car-section">
                <h2>{type}</h2>
                <p>Last Ride Location: {lastLocation}</p>
            </div>

            <div className="car-section">
                <span>{assignedRequests.length}/{capacity}</span>
            </div>
      </div>
    )
}

export default CarComponent;

