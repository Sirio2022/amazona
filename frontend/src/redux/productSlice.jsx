import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  loading: false,
  error: false,
  product: {},
};

export const productDetailsSlice = createSlice({
  name: 'productDetails',
  initialState,
  reducers: {
    loadingProductStart: (state) => {
      state.loading = true;
    },
    loadingProductEnd: (state) => {
      state.loading = false;
    },
    loadingProductError: (state, action) => {
      state.error = action.payload;
    },
    productDetails: (state, action) => {
      state.product = action.payload;
    },
  },
});

const {
  loadingProductStart,
  loadingProductEnd,
  loadingProductError,
  productDetails,
} = productDetailsSlice.actions;

export default productDetailsSlice.reducer;

export const fetchProductDetails = (id) => async (dispatch) => {
  dispatch(loadingProductStart());
  try {
    const { data } = await axios.get(
      import.meta.env.VITE_BACKEND_URL + `/api/products/${id}`
    );

    dispatch(productDetails(data));
    dispatch(loadingProductEnd());
  } catch (error) {
    dispatch(loadingProductEnd());
    dispatch(
      loadingProductError(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      )
    );
  }
};
