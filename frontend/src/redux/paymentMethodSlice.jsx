import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  loading: false,
  error: false,
  paymentMethod: 'PayPal',
};

export const paymentMethodSlice = createSlice({
  name: 'paymentMethod',
  initialState,
  reducers: {
    loadingPaymentMethodStart: (state) => {
      state.loading = true;
    },
    loadingPaymentMethodEnd: (state) => {
      state.loading = false;
    },
    loadingPaymentMethodError: (state, action) => {
      state.error = action.payload;
    },
    paymentMethod: (state, action) => {
      return { ...state, paymentMethod: action.payload };
    },
  },
});

export const {
  loadingPaymentMethodStart,
  loadingPaymentMethodEnd,
  loadingPaymentMethodError,
  paymentMethod,
} = paymentMethodSlice.actions;

export default paymentMethodSlice.reducer;

export const savePaymentMethod = (paymentMethod) => async (dispatch) => {
  dispatch(loadingPaymentMethodStart());
  dispatch(paymentMethod(paymentMethod));
  dispatch(loadingPaymentMethodEnd());
};
