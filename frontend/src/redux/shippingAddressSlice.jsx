import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  loading: false,
  error: false,
  shippingAddress: localStorage.getItem('shippingAddress')
    ? JSON.parse(localStorage.getItem('shippingAddress'))
    : { location: {} },
 
};

export const shippingAddressSlice = createSlice({
  name: 'shippingAddress',
  initialState,
  reducers: {
    loadingShippingAddressStart: (state) => {
      state.loading = true;
    },
    loadingShippingAddressEnd: (state) => {
      state.loading = false;
    },
    shippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
    },
    saveShippingAddressMapLocation: (state, action) => {
      return {
        ...state,
        shippingAddress: {
          ...state.shippingAddress,
          location: action.payload,
        },
      };
    },
  },
});

const {
  loadingShippingAddressStart,
  loadingShippingAddressEnd,
  shippingAddress,
  saveShippingAddressMapLocation,
} = shippingAddressSlice.actions;

export default shippingAddressSlice.reducer;

export const saveShippingAddress = (data) => async (dispatch) => {
  dispatch(loadingShippingAddressStart());

  dispatch(shippingAddress(data));
  localStorage.setItem('shippingAddress', JSON.stringify(data));
  dispatch(loadingShippingAddressEnd());
};

export const saveShippingAddressMapLocationAction =
  (data) => async (dispatch) => {
    dispatch(saveShippingAddressMapLocation(data));
  };
