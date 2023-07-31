import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  loading: false,
  error: false,
  order: {},
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    loadingCreateOrderStart: (state) => {
      state.loading = true;
    },
    loadingCreateOrderEnd: (state) => {
      state.loading = false;
    },
    loadingCreateOrderError: (state, action) => {
      state.error = action.payload;
    },
    orderCreateSuccess: (state, action) => {
      state.order = action.payload;
    },
  },
});

export const {
  loadingCreateOrderStart,
  loadingCreateOrderEnd,
  loadingCreateOrderError,
  orderCreateSuccess,
} = orderSlice.actions;

export default orderSlice.reducer;

export const createOrder = (order) => async (dispatch, getState) => {
  dispatch(loadingCreateOrderStart());
  try {
    const {
      signin: { userInfo },
    } = getState();
    const { data } = await axios.post(
      import.meta.env.VITE_BACKEND_URL + '/api/orders',
      order,
      {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      }
    );
    dispatch(orderCreateSuccess(data.order));
    dispatch(loadingCreateOrderEnd());
  } catch (error) {
    dispatch(
      loadingCreateOrderError(
        error.response && error.response.data.msg
          ? error.response.data.msg
          : error.message
      )
    );
  }
};
