import { configureStore } from '@reduxjs/toolkit';
import productsReducer from './productsSlice';

export const store = configureStore({
  reducer: {
    // Define a top-level state field named `products`, handled by `productsReducer`
    products: productsReducer,
  },
});
