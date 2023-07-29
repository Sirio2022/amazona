import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  cartItems: localStorage.getItem('cartItems')
    ? JSON.parse(localStorage.getItem('cartItems'))
    : [],
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const existItem = state.cartItems.find((x) => x.product === item.product);
      if (existItem) {
        return {
          ...state,
          cartItems: state.cartItems.map((x) =>
            x.product === existItem.product ? item : x
          ),
        };
      } else {
        return {
          ...state,
          cartItems: [...state.cartItems, item],
        };
      }
    },
    removeFromCart: (state, action) => {
      return {
        ...state,
        cartItems: state.cartItems.filter((x) => x.product !== action.payload),
      };
    },
    clearItems: (state) => {
      return {
        ...state,
        cartItems: [],
      };
    },
  },
});

export const { addToCart, removeFromCart, clearItems } = cartSlice.actions;

export default cartSlice.reducer;

export const addToCartAction = (id, qty) => async (dispatch, getState) => {
  const { data } = await axios.get(
    import.meta.env.VITE_BACKEND_URL + `/api/products/${id}`
  );
  dispatch(
    addToCart({
      product: data._id,
      name: data.name,
      image: data.image,
      price: data.price,
      countInStock: data.countInStock,
      qty,
    })
  );
  localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems));
};

export const removeFromCartAction = (id) => async (dispatch) => {
  dispatch(removeFromCart(id));
};

export const clearItemsAction = () => async (dispatch) => {
  dispatch(clearItems());
};
