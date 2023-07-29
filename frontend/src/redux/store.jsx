import { configureStore } from '@reduxjs/toolkit';
import productsReducer from './productsSlice';
import productDetailReducer from './productSlice';
import signinReducer from './signinSlice';
import registerReducer from './registerSlice';
import cartReducer from './cartSlice';
import shippingAddressReducer from './shippingAddressSlice';

export const store = configureStore({
  reducer: {
    // Define a top-level state field named `productsList`, handled by `productsReducer`
    productsList: productsReducer,
    productDetails: productDetailReducer,
    cart: cartReducer,
    signin: signinReducer,
    register: registerReducer,
    shippingAddress: shippingAddressReducer,
  },
});
