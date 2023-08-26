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
    loadingProductError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    productDetails: (state, action) => {
      state.product = action.payload;
      state.loading = false;
      state.error = false;
    },
  },
});

export const { loadingProductStart, loadingProductError, productDetails } =
  productDetailsSlice.actions;

export default productDetailsSlice.reducer;

export const fetchProductDetails = (id) => async (dispatch) => {
  dispatch(loadingProductStart());
  try {
    const { data } = await axios.get(
      import.meta.env.VITE_BACKEND_URL + `/api/products/${id}`
    );
    dispatch(productDetails(data));
  } catch (error) {
    dispatch(
      loadingProductError(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      )
    );
  }
};
