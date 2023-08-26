import PropTypes from 'prop-types';

import { useEffect, useMemo, useState } from 'react';
import LoadingBox from '../components/LoadingBox';
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';
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
  const center = useMemo(() => ({ lat: 6.230833, lng: -75.590553 }), []);
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_API_KEY,
    libraries: ['places'],
  });

  const [selected, setSelected] = useState(null);
  const [map, setMap] = useState(null);

  useEffect(() => {
    if (selected && map) {
      map.panTo(selected, { animation: 'smooth' });
      map.setZoom(14);
    }
  }, [selected, map]);

  const handleMapLoad = (map) => {
    setMap(map);
  };

  if (!isLoaded) {
    return <LoadingBox />;
  }

  return (
    <>
      <GoogleMap
        zoom={8}
        center={center}
        mapContainerClassName="full-container"
        onLoad={handleMapLoad}
      >
        <div>
          <PlacesAutocomplete setSelected={setSelected} />
        </div>
        {selected && <Marker position={selected} />}
      </GoogleMap>
    </>
  );
}

function PlacesAutocomplete({ setSelected }) {
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
  };

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
};
