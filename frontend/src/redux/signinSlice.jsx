import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  loading: false,
  error: false,
  userInfo: localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : {},
};

export const signinSlice = createSlice({
  name: 'signin',
  initialState,
  reducers: {
    loadingSigninStart: (state) => {
      state.loading = true;
    },
    loadingSigninError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    userInfo: (state, action) => {
      state.userInfo = action.payload;
      state.loading = false;
    },
  },
});

const { loadingSigninStart, loadingSigninError, userInfo } =
  signinSlice.actions;

export default signinSlice.reducer;

export const signin = (email, password) => async (dispatch) => {
  dispatch(loadingSigninStart());
  try {
    const { data } = await axios.post(
      import.meta.env.VITE_BACKEND_URL + '/api/users/login',
      { email, password }
    );

    dispatch(userInfo(data));
    localStorage.setItem('userInfo', JSON.stringify(data));
  } catch (error) {
    dispatch(
      loadingSigninError(
        error.response && error.response.data.msg
          ? error.response.data.msg
          : error.message
      )
    );
  }
};

export const signout = () => (dispatch) => {
  localStorage.removeItem('userInfo');
  localStorage.removeItem('cartItems');
  localStorage.removeItem('shippingAddress');
  dispatch(userInfo({}));
};
