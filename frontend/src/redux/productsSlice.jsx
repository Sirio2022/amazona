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

export const fetchProducts =
  ({ seller = '', name = '', category = '', min = 0, max = 0 }) =>
  async (dispatch) => {
    dispatch(loadingProductsStart());

    try {
      const { data } = await axios.get(
        import.meta.env.VITE_BACKEND_URL + '/api/products',
        {
          params: {
            seller,
            name,
            category,
            min,
            max,
          },
        }
      );

      dispatch(setListProducts(data));
    } catch (error) {
      dispatch(loadingProductsError(error.message));
    }
  };
