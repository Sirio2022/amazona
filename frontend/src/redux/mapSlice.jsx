import { createSlice } from '@reduxjs/toolkit';

const mapSlice = createSlice({
  name: 'map',
  initialState: {
    selectedAddress: '',
    selectedLocation: null,
  },
  reducers: {
    setSelectedAddressAndLocation: (state, action) => {
      state.selectedAddress = action.payload.address;
      state.selectedLocation = action.payload.location;
    },
  },
});

export const { setSelectedAddressAndLocation } = mapSlice.actions;

export default mapSlice.reducer;