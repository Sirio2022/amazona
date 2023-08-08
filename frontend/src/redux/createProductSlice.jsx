import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  loading: false,
  error: null,
  success: false,
  product: {},
};

const createProductSlice = createSlice({
  name: 'createProduct',
  initialState,
  reducers: {
    createProductRequest: (state) => {
      state.loading = true;
    },
    setCreateProductSuccess: (state, action) => {
      state.loading = false;
      state.success = true;
      state.product = action.payload;
    },
    setCreateProductFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    productReset: (state) => {
      state.loading = false;
      state.error = null;
      state.product = {};
    },
  },
});

export const {
  createProductRequest,
  setCreateProductSuccess,
  setCreateProductFail,
  productReset,
} = createProductSlice.actions;

export default createProductSlice.reducer;

export const createProduct = () => async (dispatch, getState) => {
  try {
    dispatch(createProductRequest());
    const {
      signin: { userInfo },
    } = getState();
    const { data } = await axios.post(
      import.meta.env.VITE_BACKEND_URL + '/api/products',
      {},
      {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      }
    );
    dispatch(setCreateProductSuccess(data));
  } catch (error) {
    dispatch(
      setCreateProductFail(
        error.response && error.response.data.msg
          ? error.response.data.msg
          : error.message
      )
    );
  }
};
