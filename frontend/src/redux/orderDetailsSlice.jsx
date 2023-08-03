import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  loading: true,
  error: false,
  success: false,
  orderdetails: {},
};

const orderDetailsSlice = createSlice({
  name: 'orderdetails',
  initialState,
  reducers: {
    loadingOrderDetailsStart: (state) => {
      state.loading = true;
    },

    loadingOrderDetailsError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    orderDetailsSuccess: (state, action) => {
      state.orderdetails = action.payload;
      state.success = true;
      state.loading = false;
    },
  },
});

const {
  loadingOrderDetailsStart,
  loadingOrderDetailsError,
  orderDetailsSuccess,
} = orderDetailsSlice.actions;

export default orderDetailsSlice.reducer;

export const OrderDetailsAction = (id) => async (dispatch, getState) => {
  dispatch(loadingOrderDetailsStart());
  try {
    const {
      signin: { userInfo },
    } = getState();
    const { data } = await axios.get(
      import.meta.env.VITE_BACKEND_URL + `/api/orders/${id}`,
      {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      }
    );
    dispatch(orderDetailsSuccess(data));
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
