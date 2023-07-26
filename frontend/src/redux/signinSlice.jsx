import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  loading: false,
  error: false,
  userInfo: {},
};

export const signinSlice = createSlice({
  name: 'signin',
  initialState,
  reducers: {
    loadingSigninStart: (state) => {
      state.loading = true;
    },
    loadingSigninEnd: (state) => {
      state.loading = false;
    },
    loadingSigninError: (state, action) => {
      state.error = action.payload;
    },
    userInfo: (state, action) => {
      state.userInfo = action.payload;
    },
  },
});

export const {
  loadingSigninStart,
  loadingSigninEnd,
  loadingSigninError,
  userInfo,
} = signinSlice.actions;

export default signinSlice.reducer;

export const signin = (email, password) => async (dispatch) => {
  dispatch(loadingSigninStart());
  try {
    const { data } = await axios.post(
      import.meta.env.VITE_BACKEND_URL + '/api/users/login',
      { email, password }
    );

    dispatch(userInfo(data));
    dispatch(loadingSigninEnd());
  } catch (error) {
    dispatch(loadingSigninEnd());
    dispatch(
      loadingSigninError(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      )
    );
  }
};

export const signout = () => (dispatch) => {
    localStorage.removeItem('userInfo');
    dispatch(userInfo({}));
    localStorage.removeItem('cartItems');
};
