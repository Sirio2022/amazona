import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  loading: false,
  error: false,
  success: false,
  payOrderDetails: {},
};

const payOrderSlice = createSlice({
  name: 'payOrder',
  initialState,

  reducers: {
    payOrderRequest: (state) => {
      state.loading = true;
    },
    payOrderSuccess: (state, action) => {
      state.loading = false;
      state.payOrderDetails = action.payload;
      state.success = true;
    },

    payOrderFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    payOrderReset: (state) => {
      state.loading = false;
      state.error = false;
      state.success = false;
      state.payOrderDetails = {};
    },
  },
});

export const {
  payOrderRequest,
  payOrderSuccess,
  payOrderFail,
  payOrderEnd,
  payOrderReset,
} = payOrderSlice.actions;

export default payOrderSlice.reducer;

export const payOrder =
  (order, paymentResult) => async (dispatch, getState) => {
    dispatch(payOrderRequest());
    const {
      signin: { userInfo },
    } = getState();
    try {
      const { data } = await axios.put(
        import.meta.env.VITE_BACKEND_URL + `/api/orders/${order._id}/pay`,
        paymentResult,
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      dispatch(payOrderSuccess(data));
      dispatch(payOrderReset());
    } catch (error) {
      dispatch(
        payOrderFail(
          error.response && error.response.data.msg
            ? error.response.data.msg
            : error.message
        )
      );
    }
  };
