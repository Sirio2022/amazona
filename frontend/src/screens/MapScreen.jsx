import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { useEffect, useMemo, useState } from 'react';
import LoadingBox from '../components/LoadingBox';
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { setSelectedAddressAndLocation } from '../redux/mapSlice';

import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from 'use-places-autocomplete';
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from '@reach/combobox';

export default function MapScreen() {
  const center = useMemo(() => ({ lat: 6.2120627, lng: -75.5575222 }), []);
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_API_KEY,
    libraries: ['places'],
  });

  const [selected, setSelected] = useState(null);
  const [map, setMap] = useState(null);

  const [selectedAddress, setSelectedAddress] = useState('');
  const [currentLocation, setCurrentLocation] = useState(null);

  const dispatch = useDispatch();

  useEffect(() => {
    const storedSelected = localStorage.getItem('selected');
    if (storedSelected) {
      setSelected(JSON.parse(storedSelected));
    }
  }, []);

  useEffect(() => {
    if (selected) {
      localStorage.setItem('selected', JSON.stringify(selected));
    } else {
      localStorage.removeItem('selected');
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error('Error getting current location:', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }

    if (selected && map) {
      map.panTo(center, { animation: 'smooth' });
      map.setZoom(18);
    }
    if (selected || selectedAddress) {
      dispatch(
        setSelectedAddressAndLocation({
          address: selectedAddress,
          location: selected,
        })
      );
    }
  }, [selected, map, dispatch, selectedAddress, center]);

  const handleMapLoad = (map) => {
    setMap(map);
  };

  if (!isLoaded) {
    return <LoadingBox />;
  }

  return (
    <>
     <GoogleMap
        zoom={18}
        center={center}
        mapContainerClassName="full-container"
        onLoad={handleMapLoad}
        onClick={(e) => {
          const lat = e.latLng.lat();
          const lng = e.latLng.lng();
          setSelected({ lat, lng });
        }}
      >
        {isLoaded && currentLocation && (
          <Marker
            position={currentLocation}
            icon={{
              url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
            }}
            draggable={true}
            onDragEnd={(e) => {
              const lat = e.latLng.lat();
              const lng = e.latLng.lng();
              setSelected({ lat, lng });
            }}
            visible={true}
          />
        )}
        {isLoaded && selected && (
          <Marker
            position={selected}
            icon={{
              url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
            }}
            draggable={true}
            onDragEnd={(e) => {
              const lat = e.latLng.lat();
              const lng = e.latLng.lng();
              setSelected({ lat, lng });
            }}
            visible={true}
          />
        )}
        <div>
          <PlacesAutocomplete
            setSelected={setSelected}
            setSelectedAddress={setSelectedAddress}
            selectedAddress={selectedAddress}
            selected={selected}
          />
        </div>
      </GoogleMap>
    </>
  );
}

function PlacesAutocomplete({
  setSelected,
  setSelectedAddress,
  selectedAddress,
  selected,
}) {
  const navigate = useNavigate();
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete();

  const handleSelect = async (address) => {
    setValue(address, false);
    clearSuggestions();

    const results = await getGeocode({ address });
    const { lat, lng } = getLatLng(results[0]);
    setSelected({ lat, lng });
    setSelectedAddress(address);
    if (address || selectedAddress || selected) {
      Swal.fire({
        title: 'Address selected',
        text: 'Do you want to continue?',
        icon: 'success',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/shipping');
        }
      });
    }
  };

  useEffect(() => {
    if (selected || selectedAddress) {
      Swal.fire({
        title: 'Dirección seleccionada',
        text: '¿Deseas continuar?',
        icon: 'success',
        showCancelButton: true,
        confirmButtonText: 'Sí',
        cancelButtonText: 'No',
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/shipping');
        }
      });
    }
  }, [selected, selectedAddress, navigate]);

  return (
    <Combobox onSelect={handleSelect}>
      <ComboboxInput
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
        }}
        disabled={!ready}
        placeholder="Enter an address"
        className="map-input-box"
      />
      <ComboboxPopover>
        <ComboboxList className="combobox-list">
          {status === 'OK' &&
            data.map(({ place_id, description }) => (
              <ComboboxOption
                key={place_id}
                value={description}
                className="combobox-option"
              />
            ))}
        </ComboboxList>
      </ComboboxPopover>
    </Combobox>
  );
}

PlacesAutocomplete.propTypes = {
  setSelected: PropTypes.func.isRequired,
  setSelectedAddress: PropTypes.func.isRequired,
  selectedAddress: PropTypes.string.isRequired,
  selected: PropTypes.object,
};
