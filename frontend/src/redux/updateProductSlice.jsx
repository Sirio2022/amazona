import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { productDetails } from './productSlice';

const initialState = {
  loading: false,
  error: false,
  success: false,
};

const updateProductSlice = createSlice({
  name: 'updateProduct',
  initialState,
  reducers: {
    updateProductRequest: (state) => {
      state.loading = true;
    },
    updateProductSuccess: (state) => {
      state.loading = false;
      state.success = true;
    },
    updateProductFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    productUpdateReset: (state) => {
      state.loading = false;
      state.error = false;
      state.success = false;
    },
  },
});

export const {
  updateProductRequest,
  updateProductSuccess,
  updateProductFail,
  productUpdateReset,
} = updateProductSlice.actions;

export default updateProductSlice.reducer;

export const updateProduct = (product) => async (dispatch, getState) => {
  updateProductRequest();
  const {
    signin: { userInfo },
  } = getState();
  try {
    const { data } = await axios.put(
      import.meta.env.VITE_BACKEND_URL + `/api/products/${product._id}`,
      product,
      {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      }
    );
    dispatch(productDetails(data));
    dispatch(updateProductSuccess());
  } catch (error) {
    dispatch(
      updateProductFail(
        error.message && error.response.data.msg
          ? error.response.data.msg
          : error.message
      )
    );
  }
};
