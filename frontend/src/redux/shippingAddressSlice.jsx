import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  loading: false,
  error: false,
  shippingAddress: localStorage.getItem('shippingAddress')
    ? JSON.parse(localStorage.getItem('shippingAddress'))
    : {},
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
    loadingShippingAddressError: (state, action) => {
      state.error = action.payload;
    },
    shippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
    },
  },
});

export const {
  loadingShippingAddressStart,
  loadingShippingAddressEnd,
  loadingShippingAddressError,
  shippingAddress,
} = shippingAddressSlice.actions;

export default shippingAddressSlice.reducer;

export const saveShippingAddress = (data) => async (dispatch) => {
  dispatch(loadingShippingAddressStart());

  dispatch(shippingAddress(data));
  localStorage.setItem('shippingAddress', JSON.stringify(data));
  dispatch(loadingShippingAddressEnd());
};
