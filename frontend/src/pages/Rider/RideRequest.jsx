// // src/components/rider/RideRequestScreen.jsx
// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
// import { getAuth } from 'firebase/auth';
// import { db } from '../../firebase';
// import MapComponent from './MapComponent';

// const RideRequestScreen = () => {
//   const [pickupLocation, setPickupLocation] = useState('');
//   const [dropoffLocation, setDropoffLocation] = useState('');
//   const [suggestions, setSuggestions] = useState([
//     { id: 1, name: 'Jester West Dormitory', isFavorite: true },
//     { id: 2, name: 'Belmont Hall', isFavorite: false },
//     { id: 3, name: 'University Teaching Center (UTC)', isFavorite: false },
//     { id: 4, name: 'Gates-Dell Complex (GDC)', isFavorite: false },
//     { id: 5, name: 'Texas Union', isFavorite: false },
//     { id: 6, name: 'NHB Stadium', isFavorite: false },
//     { id: 7, name: 'Perry-Castañeda Library (PCL)', isFavorite: true },
//     { id: 8, name: 'Parlin Hall (PAR)', isFavorite: true }
//   ]);
//   const [favorites, setFavorites] = useState([]);
//   const [step, setStep] = useState('pickup'); // pickup, dropoff, confirm
//   const [errorMessage, setErrorMessage] = useState('');
//   const [userProfile, setUserProfile] = useState(null);
//   const [isLocationValid, setIsLocationValid] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
  
//   const navigate = useNavigate();
//   const auth = getAuth();
  
//   useEffect(() => {
//     // Filter favorites from suggestions
//     const favs = suggestions.filter(suggestion => suggestion.isFavorite);
//     setFavorites(favs);
    
//     // Get user profile
//     const user = auth.currentUser;
//     if (user) {
//       setUserProfile({
//         uid: user.uid,
//         phoneNumber: user.phoneNumber,
//         // Other profile info would be fetched from Firestore here
//         name: 'John' // Placeholder
//       });
//     } else {
//       navigate('/login');
//     }
//   }, [auth, navigate, suggestions]);
  
//   const validateLocation = (location) => {
//     // This would normally validate against a set of coordinates for campus boundaries
//     // For now, we'll simply check if the location is not empty and contains recognized keywords
//     const validKeywords = ['UT', 'University', 'Campus', 'Austin', 'Jester', 'Dormitory', 'Hall', 'Library', 'Center'];
//     return location && validKeywords.some(keyword => location.includes(keyword));
//   };
  
//   const handlePickupSelection = (location) => {
//     setPickupLocation(location);
//     setIsLocationValid(validateLocation(location));
//   };
  
//   const handleDropoffSelection = (location) => {
//     setDropoffLocation(location);
//     setIsLocationValid(validateLocation(location));
//   };
  
//   const handleNext = () => {
//     if (step === 'pickup') {
//       if (!validateLocation(pickupLocation)) {
//         setErrorMessage('Please select a valid on-campus location');
//         return;
//       }
//       setStep('dropoff');
//       setErrorMessage('');
//     } else if (step === 'dropoff') {
//       if (!validateLocation(dropoffLocation)) {
//         setErrorMessage('Please select a valid on-campus location');
//         return;
//       }
//       setStep('confirm');
//       setErrorMessage('');
//     }
//   };
  
//   const handleBack = () => {
//     if (step === 'dropoff') {
//       setStep('pickup');
//     } else if (step === 'confirm') {
//       setStep('dropoff');
//     }
//   };
  
//   const handleSubmitRequest = async () => {
//     if (!userProfile) return;
    
//     setIsLoading(true);
//     try {
//       // Check if locations are within valid boundaries
//       if (!validateLocation(pickupLocation) || !validateLocation(dropoffLocation)) {
//         setErrorMessage('One or both locations are outside the service area');
//         setIsLoading(false);
//         return;
//       }
      
//       // Add the ride request to Firestore
//       const rideRequest = {
//         riderId: userProfile.uid,
//         riderName: userProfile.name,
//         riderPhone: userProfile.phoneNumber,
//         pickupLocation,
//         dropoffLocation,
//         status: 'pending',
//         createdAt: serverTimestamp(),
//         updatedAt: serverTimestamp()
//       };
      
//       await addDoc(collection(db, 'rideRequests'), rideRequest);
      
//       // Navigate to the waiting screen
//       navigate('/rider/waiting');
//     } catch (error) {
//       console.error('Error submitting ride request:', error);
//       setErrorMessage('Failed to submit ride request. Please try again.');
//     }
//     setIsLoading(false);
//   };
  
//   const renderLocationInputScreen = () => {
//     const isPickup = step === 'pickup';
//     const locationLabel = isPickup ? 'Pick up location' : 'Drop off location';
//     const currentValue = isPickup ? pickupLocation : dropoffLocation;
//     const handleSelection = isPickup ? handlePickupSelection : handleDropoffSelection;
    
//     return (
//       <div className="location-input-screen">
//         <h2>Hello, {userProfile?.name}!</h2>
//         <h3>Where would you like to be {isPickup ? 'picked up' : 'dropped off'}?</h3>
//         <p className="location-note">{isPickup ? 'Must be on-campus!' : 'Must be a residence!'}</p>
        
//         <div className="search-container">
//           <input
//             type="text"
//             value={currentValue}
//             onChange={(e) => handleSelection(e.target.value)}
//             placeholder={`${locationLabel}...`}
//             className="location-search"
//           />
//         </div>
        
//         {!isPickup && pickupLocation && (
//           <div className="selected-location">
//             <strong>Pick up at:</strong> {pickupLocation}
//           </div>
//         )}
        
//         <div className="location-lists">
//           {favorites.length > 0 && (
//             <div className="favorites-list">
//               <h4>Favorites <span className="see-more">see more</span></h4>
//               <ul>
//                 {favorites.map(favorite => (
//                   <li 
//                     key={favorite.id} 
//                     onClick={() => handleSelection(favorite.name)}
//                     className={currentValue === favorite.name ? 'selected' : ''}
//                   >
//                     <span className="star-icon">★</span> {favorite.name}
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           )}
          
//           <div className="suggestions-list">
//             <h4>Suggestions <span className="see-more">see more</span></h4>
//             <ul>
//               {suggestions
//                 .filter(suggestion => suggestion.name.toLowerCase().includes(currentValue.toLowerCase()) || !currentValue)
//                 .map(suggestion => (
//                   <li 
//                     key={suggestion.id} 
//                     onClick={() => handleSelection(suggestion.name)}
//                     className={currentValue === suggestion.name ? 'selected' : ''}
//                   >
//                     <span className="location-icon">📍</span> {suggestion.name}
//                   </li>
//                 ))}
//             </ul>
//           </div>
          
//           <div className="traveling-alone">
//             <p>Traveling alone?</p>
//             <div className="toggle-container">
//               <button className="toggle-button active">1</button>
//               <button className="toggle-button">2+</button>
//             </div>
//           </div>
//         </div>
        
//         <div className="action-buttons">
//           {step !== 'pickup' && (
//             <button onClick={handleBack} className="back-button">Back</button>
//           )}
//           <button 
//             onClick={handleNext} 
//             disabled={!currentValue || !isLocationValid}
//             className="next-button"
//           >
//             Next
//           </button>
//         </div>
//       </div>
//     );
//   };
  
//   const renderConfirmScreen = () => {
//     return (
//       <div className="confirm-screen">
//         <h2>Confirm your ride!</h2>
//         <p className="confirm-note">Make sure everything below is correct</p>
        
//         <div className="ride-details">
//           <div className="location-detail">
//             <span className="icon">🚶</span>
//             <strong>Pick up at</strong>
//             <p>{pickupLocation}</p>
//           </div>
          
//           <div className="location-detail">
//             <span className="icon">🏠</span>
//             <strong>Drop off at</strong>
//             <p>{dropoffLocation}</p>
//           </div>
//         </div>
        
//         <MapComponent 
//           pickupLocation={pickupLocation}
//           dropoffLocation={dropoffLocation}
//         />
        
//         {errorMessage && <div className="error-message">{errorMessage}</div>}
        
//         <div className="action-buttons">
//           <button onClick={handleBack} className="back-button">Back</button>
//           <button 
//             onClick={handleSubmitRequest} 
//             disabled={isLoading}
//             className="request-button"
//           >
//             {isLoading ? 'Submitting...' : 'Request'}
//           </button>
//         </div>
//       </div>
//     );
//   };
  
//   // Show loading spinner if user profile is not loaded yet
//   if (!userProfile) {
//     return <div className="loading">Loading...</div>;
//   }
  
//   return (
//     <div className="ride-request-container">
//       {step === 'confirm' ? renderConfirmScreen() : renderLocationInputScreen()}
//     </div>
//   );
// };

export default RideRequestScreen;