// import { useEffect, useState, useContext } from 'react';
// import { ShiftContext } from '../../context/ShiftContext';
// import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
// import 'leaflet/dist/leaflet.css';
// import L from 'leaflet';

// // Fix for default marker icon in Leaflet with React
// // This is needed because the default marker icons don't load correctly in React
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
//   iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
//   shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
// });

// // Component to recenter the map
// const MapUpdater = ({ center }) => {
//   const map = useMap();
//   useEffect(() => {
//     if (center) {
//       map.setView(center, map.getZoom());
//     }
//   }, [center, map]);
//   return null;
// };

// const LocationMap = () => {
//   const { currentShift, getCurrentPosition } = useContext(ShiftContext);
//   const [currentLocation, setCurrentLocation] = useState(null);
//   const [mapCenter, setMapCenter] = useState([0, 0]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     // Try to get current location from shift
//     if (currentShift && currentShift.location) {
//       const { latitude, longitude } = currentShift.location;
//       setMapCenter([latitude, longitude]);
//       setIsLoading(false);
//     } else {
//       // Otherwise get current location
//       fetchCurrentLocation();
//     }
//   }, [currentShift]);

//   const fetchCurrentLocation = async () => {
//     setIsLoading(true);
//     setError(null);
//     try {
//       const position = await getCurrentPosition();
//       setCurrentLocation(position);
//       setMapCenter([position.latitude, position.longitude]);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Show loading state
//   if (isLoading) {
//     return (
//       <div className="w-full max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
//         <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Location</h2>
//         <div className="flex justify-center items-center h-64 bg-gray-100 dark:bg-gray-700 rounded-lg">
//           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
//         </div>
//       </div>
//     );
//   }

//   // Show error state
//   if (error) {
//     return (
//       <div className="w-full max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
//         <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Location</h2>
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative dark:bg-red-900 dark:text-red-200 dark:border-red-700" role="alert">
//           <span className="block sm:inline">{error}</span>
//         </div>
//         <button 
//           onClick={fetchCurrentLocation}
//           className="mt-4 btn btn-primary"
//         >
//           Try Again
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="w-full max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
//       <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Location</h2>
      
//       <div className="h-64 rounded-lg overflow-hidden">
//         <MapContainer 
//           center={mapCenter} 
//           zoom={15} 
//           style={{ height: '100%', width: '100%' }}
//         >
//           <TileLayer
//             attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//             url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//           />
//           <Marker position={mapCenter}>
//             <Popup>
//               {currentShift ? 'Check-in location' : 'Your current location'}
//             </Popup>
//           </Marker>
//           <MapUpdater center={mapCenter} />
//         </MapContainer>
//       </div>
      
//       {currentShift && currentShift.location && (
//         <div className="mt-4 grid grid-cols-2 gap-2">
//           <div className="text-sm">
//             <span className="font-medium text-gray-500 dark:text-gray-400">Latitude: </span>
//             <span className="text-gray-800 dark:text-gray-200">{currentShift.location.latitude.toFixed(6)}</span>
//           </div>
//           <div className="text-sm">
//             <span className="font-medium text-gray-500 dark:text-gray-400">Longitude: </span>
//             <span className="text-gray-800 dark:text-gray-200">{currentShift.location.longitude.toFixed(6)}</span>
//           </div>
//         </div>
//       )}
      
//       <button 
//         onClick={fetchCurrentLocation}
//         className="mt-4 w-full btn btn-secondary flex items-center justify-center"
//       >
//         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
//           <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
//         </svg>
//         Update Location
//       </button>
//     </div>
//   );
// };

// export default LocationMap;

import { useEffect, useState, useContext, useCallback } from 'react';
import { ShiftContext } from '../../context/ShiftContext';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon in Leaflet with React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Component to recenter the map
const MapUpdater = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] !== 0 && center[1] !== 0) { // Avoid invalid center
      map.setView(center, map.getZoom());
    }
  }, [center, map]);
  return null;
};

const LocationMap = () => {
  const { currentShift, getCurrentPosition } = useContext(ShiftContext);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState([0, 0]); // Default to [0,0] or use a fallback location
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Memoized location fetch function
  const fetchCurrentLocation = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const position = await getCurrentPosition();
      if (!position || !position.latitude || !position.longitude) {
        throw new Error('Invalid position data received');
      }
      setCurrentLocation(position);
      setMapCenter([position.latitude, position.longitude]);
    } catch (err) {
      console.error('Location error:', err);
      setError(err.message || 'Failed to get current location');
      // Optionally set a fallback location here if needed
    } finally {
      setIsLoading(false);
    }
  }, [getCurrentPosition]);

  useEffect(() => {
    // Try to get current location from shift
    if (currentShift?.location?.latitude && currentShift?.location?.longitude) {
      setMapCenter([currentShift.location.latitude, currentShift.location.longitude]);
      setIsLoading(false);
    } else {
      // Otherwise get current location
      fetchCurrentLocation();
    }
  }, [currentShift, fetchCurrentLocation]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="w-full max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Location</h2>
        <div className="flex flex-col items-center justify-center h-64 bg-gray-100 dark:bg-gray-700 rounded-lg">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Fetching your location...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="w-full max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Location</h2>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative dark:bg-red-900 dark:text-red-200 dark:border-red-700" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
        <button 
          onClick={fetchCurrentLocation}
          className="mt-4 btn btn-primary w-full"
          disabled={isLoading}
        >
          {isLoading ? 'Retrying...' : 'Try Again'}
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Location</h2>
      
      <div className="h-64 rounded-lg overflow-hidden relative">
        {mapCenter[0] === 0 && mapCenter[1] === 0 ? (
          <div className="absolute inset-0 bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
            <p className="text-gray-600 dark:text-gray-300">Location not available</p>
          </div>
        ) : (
          <MapContainer 
            center={mapCenter} 
            zoom={15} 
            style={{ height: '100%', width: '100%' }}
            zoomControl={false} // Optional: disable zoom controls if not needed
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={mapCenter}>
              <Popup>
                {currentShift ? 'Check-in location' : 'Your current location'}
              </Popup>
            </Marker>
            <MapUpdater center={mapCenter} />
          </MapContainer>
        )}
      </div>
      
      {(currentShift?.location || currentLocation) && (
        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="text-sm">
            <span className="font-medium text-gray-500 dark:text-gray-400">Latitude: </span>
            <span className="text-gray-800 dark:text-gray-200">
              {(currentShift?.location?.latitude || currentLocation?.latitude)?.toFixed(6)}
            </span>
          </div>
          <div className="text-sm">
            <span className="font-medium text-gray-500 dark:text-gray-400">Longitude: </span>
            <span className="text-gray-800 dark:text-gray-200">
              {(currentShift?.location?.longitude || currentLocation?.longitude)?.toFixed(6)}
            </span>
          </div>
        </div>
      )}
      
      <button 
        onClick={fetchCurrentLocation}
        className="mt-4 w-full btn btn-secondary flex items-center justify-center"
        disabled={isLoading}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
        </svg>
        {isLoading ? 'Updating...' : 'Update Location'}
      </button>
    </div>
  );
};

export default LocationMap;