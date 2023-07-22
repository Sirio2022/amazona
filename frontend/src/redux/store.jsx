import { configureStore } from '@reduxjs/toolkit';
import productsReducer from './productsSlice';
import productDetailReducer from './productSlice';
import cartReducer from './cartSlice';
import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';
import { combineReducers } from 'redux';
import thunk from 'redux-thunk';

const peristConfig = {
  key: 'root',
  storage,
  whitelist: ['cart'],
};

const rootReducer = combineReducers({
  cart: cartReducer,
});

const persistedReducer = persistReducer(peristConfig, rootReducer);


export const store = configureStore({

  reducer: {
    // Define a top-level state field named `productsList`, handled by `productsReducer`
    productsList: productsReducer,
    productDetails: productDetailReducer,
    cart: persistedReducer,
  },
  middleware: [thunk],
});
