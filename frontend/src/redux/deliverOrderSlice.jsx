import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  loading: false,
  error: false,
  success: false,
  order: {},
};

const orderDeliverSlice = createSlice({
  name: 'orderDeliver',
  initialState,
  reducers: {
    loadingDeliverOrderRequest: (state) => {
      state.loading = true;
    },
    loadingDeliverOrderSuccess: (state, action) => {
      state.loading = false;
      state.success = true;
      state.order = action.payload;
    },
    loadingDeliverOrderFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    deliverOrderReset: (state) => {
      state.loading = false;
      state.error = false;
      state.success = false;
      state.order = {};
    },
  },
});

export const {
  loadingDeliverOrderRequest,
  loadingDeliverOrderSuccess,
  loadingDeliverOrderFail,
  deliverOrderReset,
} = orderDeliverSlice.actions;

export default orderDeliverSlice.reducer;

export const deliverOrder = (id) => async (dispatch, getState) => {
  dispatch(loadingDeliverOrderRequest());
  try {
    const {
      signin: { userInfo },
    } = getState();
    const { data } = await axios.put(
      import.meta.env.VITE_BACKEND_URL + `/api/orders/${id}/deliver`,
      {},
      {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      }
    );
    dispatch(loadingDeliverOrderSuccess(data));
  } catch (error) {
    dispatch(
      loadingDeliverOrderFail(
        error.response && error.response.data.msg
          ? error.response.data.msg
          : error.message
      )
    );
  }
};
