import { configureStore } from '@reduxjs/toolkit';
import productsReducer from './productsSlice';
import productDetailReducer from './productSlice';

export const store = configureStore({
  reducer: {
    // Define a top-level state field named `products`, handled by `productsReducer`
    productsList: productsReducer,
    productDetails: productDetailReducer,
  },
});
