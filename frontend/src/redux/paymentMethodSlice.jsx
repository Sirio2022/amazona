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

    paymentMethod: (state, action) => {
      return { ...state, paymentMethod: action.payload };
    },
  },
});

const { loadingPaymentMethodStart, loadingPaymentMethodEnd, paymentMethod } =
  paymentMethodSlice.actions;

export default paymentMethodSlice.reducer;

export const savePaymentMethod = (data) => async (dispatch) => {
  dispatch(loadingPaymentMethodStart());

  dispatch(paymentMethod(data));

  dispatch(loadingPaymentMethodEnd());
};
