import { configureStore } from '@reduxjs/toolkit';
import productsReducer from './productsSlice';
import productDetailReducer from './productSlice';
import signinReducer from './signinSlice';
import registerReducer from './registerSlice';
import cartReducer from './cartSlice';
import shippingAddressReducer from './shippingAddressSlice';
import paymentMethodReducer from './paymentMethodSlice';
import placeOrderReducer from './orderSlice';
import orderDetailsReducer from './orderDetailsSlice';
import userDetailsReducer from './userDetailSlice';
import orderHistoryReducer from './orderHistorySlice';
import userUpdateProfileReducer from './updateUserProfileSlice';
import createProductReducer from './createProductSlice';
import updateProductReducer from './updateProductSlice';
import orderListReducer from './orderListSlice';
import productDeleteReducer from './deleteProductSlice';
import orderDeleteReducer from './deleteOrderSlice';
import orderDeliverReducer from './deliverOrderSlice';
import userListReducer from './userListSlice';
import deleteUserReducer from './deleteUserSlice';
import updateUserReducer from './updateUserSlice';
import topSellersReducer from './topSellersSlice';
import productsCategoryReducer from './categoryListSlice';

export const store = configureStore({
  reducer: {
    // Define a top-level state field named `productsList`, handled by `productsReducer`
    productsList: productsReducer,
    productDetails: productDetailReducer,
    cart: cartReducer,
    signin: signinReducer,
    register: registerReducer,
    shippingAddress: shippingAddressReducer,
    paymentMethod: paymentMethodReducer,
    placeOrder: placeOrderReducer,
    orderDetails: orderDetailsReducer,
    userDetails: userDetailsReducer,
    orderHistory: orderHistoryReducer,
    userUpdateProfile: userUpdateProfileReducer,
    createProduct: createProductReducer,
    updateProduct: updateProductReducer,
    orderList: orderListReducer,
    productDelete: productDeleteReducer,
    orderDelete: orderDeleteReducer,
    orderDeliver: orderDeliverReducer,
    userList: userListReducer,
    userDelete: deleteUserReducer,
    userUpdated: updateUserReducer,
    topSellers: topSellersReducer,
    productsCategory: productsCategoryReducer,
  },
});
