import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  loading: false,
  error: false,
  products: [],
};

export const productsSlice = createSlice({
  name: 'productsList',
  initialState,
  reducers: {
    listProducts: (state, action) => {
      state.products = action.payload;
    },
    loadingProductsStart: (state) => {
      state.loading = true;
    },
    loadingProductsEnd: (state) => {
      state.loading = false;
    },
    loadingProductsError: (state, action) => {
      state.error = action.payload;
    },
  },
});

const {
  listProducts,
  loadingProductsStart,
  loadingProductsEnd,
  loadingProductsError,
} = productsSlice.actions;

export default productsSlice.reducer;

export const fetchProducts = () => async (dispatch) => {
  dispatch(loadingProductsStart());
  try {
    const { data } = await axios.get(
      import.meta.env.VITE_BACKEND_URL + '/api/products'
    );

    dispatch(listProducts(data));
    dispatch(loadingProductsEnd());
  } catch (error) {
    dispatch(loadingProductsEnd());
    dispatch(loadingProductsError(error.message));
  }
};
