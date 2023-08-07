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
    setListProducts: (state, action) => {
      state.products = action.payload;
      state.loading = false;
    },
    loadingProductsStart: (state) => {
      state.loading = true;
    },
    loadingProductsError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { setListProducts, loadingProductsStart, loadingProductsError } =
  productsSlice.actions;

export default productsSlice.reducer;

export const fetchProducts = () => async (dispatch) => {
  dispatch(loadingProductsStart());
  try {
    const { data } = await axios.get(
      import.meta.env.VITE_BACKEND_URL + '/api/products'
    );
    dispatch(setListProducts(data));
  } catch (error) {
    dispatch(loadingProductsError(error.message));
  }
};
