import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  loading: false,
  error: false,
  orderDetails: {},
};

const orderDetailsSlice = createSlice({
  name: 'orderdetails',
  initialState,
  reducers: {
    loadingOrderDetailsStart: (state) => {
      state.loading = true;
    },
    loadingOrderDetailsEnd: (state) => {
      state.loading = false;
    },
    loadingOrderDetailsError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    orderDetailsSuccess: (state, action) => {
      state.loading = false;
      state.orderDetails = action.payload;
    },
  },
});

const {
  loadingOrderDetailsStart,
  loadingOrderDetailsEnd,
  loadingOrderDetailsError,
  orderDetailsSuccess,
} = orderDetailsSlice.actions;

export default orderDetailsSlice.reducer;

export const OrderDetailsAction = (orderId) => async (dispatch, getState) => {
  dispatch(loadingOrderDetailsStart());
  try {
    const {
      signin: { userInfo },
    } = getState();
    const { data } = await axios.get(
      import.meta.env.VITE_BACKEND_URL + `/api/orders/${orderId}`,
      {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      }
    );
    dispatch(orderDetailsSuccess(data));
    dispatch(loadingOrderDetailsEnd());
  } catch (error) {
    dispatch(
      loadingOrderDetailsError(
        error.response && error.response.data.msg
          ? error.response.data.msg
          : error.message
      )
    );
  }
};
