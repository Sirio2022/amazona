import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  summary: {},
  loading: false,
  error: null,
};

const orderSummarySlice = createSlice({
  name: 'orderSummary',
  initialState,
  reducers: {
    orderSummaryRequest: (state) => {
      state.loading = true;
    },
    orderSummarySuccess: (state, action) => {
      state.loading = false;
      state.summary = action.payload;
    },
    orderSummaryFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { orderSummaryRequest, orderSummarySuccess, orderSummaryFail } =
  orderSummarySlice.actions;

export default orderSummarySlice.reducer;

export const getOrderSummary = () => async (dispatch, getState) => {
  dispatch(orderSummaryRequest());
  try {
    const {
      signin: { userInfo },
    } = getState();
    const { data } = await axios.get(
      import.meta.env.VITE_BACKEND_URL + '/api/orders/summary',
      {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      }
    );
    dispatch(orderSummarySuccess(data));
  } catch (error) {
    dispatch(
      orderSummaryFail(
        error.response && error.response.data.msg
          ? error.response.data.msg
          : error.message
      )
    );
  }
};
