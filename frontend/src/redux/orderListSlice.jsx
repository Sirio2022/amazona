import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  loading: false,
  error: false,
  orderList: [],
};

const orderListSlice = createSlice({
  name: 'orderList',
  initialState,
  reducers: {
    orderListRequest: (state) => {
      state.loading = true;
    },
    orderListSuccess: (state, action) => {
      state.loading = false;
      state.orderList = action.payload;
    },
    orderListFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { orderListRequest, orderListSuccess, orderListFail } =
  orderListSlice.actions;

export default orderListSlice.reducer;

export const listOrders = () => async (dispatch, getState) => {
  dispatch(orderListRequest());
  try {
    const {
      signin: { userInfo },
    } = getState();
    const { data } = await axios.get(
      import.meta.env.VITE_BACKEND_URL + '/api/orders',
      {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      }
    );
    dispatch(orderListSuccess(data));
  } catch (error) {
    dispatch(
      orderListFail(
        error.message && error.response.data.msg
          ? error.response.data.msg
          : error.message
      )
    );
  }
};
