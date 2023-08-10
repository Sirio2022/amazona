import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  loading: false,
  error: false,
  success: false,
  productDeleted: {},
};

const deleteProductSlice = createSlice({
  name: 'deleteProduct',
  initialState,
  reducers: {
    deleteProductRequest: (state) => {
      state.loading = true;
    },
    deleteProductSuccess: (state, action) => {
      state.loading = false;
      state.productDeleted = action.payload;
      state.success = true;
    },
    deleteProductFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    deleteProductReset: (state) => {
      state.loading = false;
      state.error = false;
      state.success = false;
      state.productDeleted = {};
    },
  },
});

export const {
  deleteProductRequest,
  deleteProductSuccess,
  deleteProductFail,
  deleteProductReset,
} = deleteProductSlice.actions;

export default deleteProductSlice.reducer;

export const deleteProduct = (id) => async (dispatch, getState) => {
  dispatch(deleteProductRequest());
  const {
    signin: { userInfo },
  } = getState();
  try {
    const { data } = await axios.delete(
      import.meta.env.VITE_BACKEND_URL + `/api/products/${id}`,
      {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      }
    );
    dispatch(deleteProductSuccess(data));
  } catch (error) {
    dispatch(
      deleteProductFail(
        error.response && error.response.data.msg
          ? error.response.data.msg
          : error.message
      )
    );
  }
};
