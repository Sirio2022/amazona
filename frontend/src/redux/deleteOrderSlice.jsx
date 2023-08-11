import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  loading: false,
  error: false,
  success: false,
  orderDeleted: {},
};

const deleteOrderSlice = createSlice({
  name: 'deleteOrder',
  initialState,
  reducers: {
    deleteOrderRequest: (state) => {
      state.loading = true;
    },
    deleteOrderSuccess: (state, action) => {
      state.loading = false;
      state.success = true;
      state.order = action.payload;
    },
    deleteOrderFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    deleteOrderReset: (state) => {
      state.loading = false;
      state.error = false;
      state.success = false;
      state.order = {};
    },
  },
});

export const {
  deleteOrderRequest,
  deleteOrderSuccess,
  deleteOrderFail,
  deleteOrderReset,
} = deleteOrderSlice.actions;

export default deleteOrderSlice.reducer;

export const deleteOrder = (id) => async (dispatch, getState) => {
  dispatch(deleteOrderRequest());
  const {
    signin: { userInfo },
  } = getState();
  try {
    const { data } = await axios.delete(
      import.meta.env.VITE_BACKEND_URL + `/api/orders/${id}`,
      {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      }
    );
    dispatch(deleteOrderSuccess(data));
  } catch (error) {
    dispatch(
      deleteOrderFail(
        error.response && error.response.data.msg
          ? error.response.data.msg
          : error.message
      )
    );
  }
};
