import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  GoogleMap,
  useLoadScript,
  MarkerF,
  StandaloneSearchBox,
} from '@react-google-maps/api';
import { saveShippingAddressMapLocationAction } from '../redux/shippingAddressSlice';

const defaultLocation = { lat: 6.1993998, lng: -75.5625925 };

export default function MapScreen() {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: ['places'],
  });

  const [center, setCenter] = useState(defaultLocation);
  const [location, setLocation] = useState(center);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const mapRef = useRef(null);
  const placeRef = useRef(null);
  const markerRef = useRef(null);

  const getUserCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation os not supported by this browser');
    } else {
      navigator.geolocation.getCurrentPosition((position) => {
        setCenter({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      });
    }
  };

  useEffect(() => {
    getUserCurrentLocation();
  }, []);

  const onLoad = (map) => {
    mapRef.current = map;
  };

  const onIdle = () => {
    setLocation({
      lat: mapRef.current.center.lat(),
      lng: mapRef.current.center.lng(),
    });
  };

  const onLoadPlaces = (place) => {
    placeRef.current = place;
  };

  const onMarkerLoad = (marker) => {
    markerRef.current = marker;
  };

  const onPlacesChanged = () => {
    const place = placeRef.current.getPlaces()[0].geometry.location;
    setCenter({ lat: place.lat(), lng: place.lng() });
    setLocation({ lat: place.lat(), lng: place.lng() });
  };

  const onConfirm = () => {
    const places = placeRef.current.getPlaces() || [{}];
    console.log(places);
    dispatch(
      saveShippingAddressMapLocationAction({
        lat: location.lat,
        lng: location.lng,
        address: places[0].formatted_address,
        name: places[0].name,
        vicinity: places[0].vicinity,
        googleAddressId: places[0].place_id,
      })
    );

    navigate('/shipping');
  };

  return (
    <div className="full-container">
      {!isLoaded && <div>Loading...</div>}
      {loadError && <div>Error loading maps</div>}
      {isLoaded && (
        <GoogleMap
          id="sample-map"
          mapContainerStyle={{ height: '100%', width: '100%' }}
          center={center}
          zoom={18}
          onLoad={onLoad}
          onIdle={onIdle}
        >
          <StandaloneSearchBox
            onLoad={onLoadPlaces}
            onPlacesChanged={onPlacesChanged}
          >
            <div className="map-input-box">
              <input type="text" placeholder="Enter your address" />
              <button type="button" className="primary" onClick={onConfirm}>
                Confirm
              </button>
            </div>
          </StandaloneSearchBox>

          <MarkerF position={location} onLoad={onMarkerLoad}></MarkerF>
        </GoogleMap>
      )}
    </div>
  );
}
