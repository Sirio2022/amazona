import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  loading: false,
  error: false,
  userInfo: {},
};

export const registerSlice = createSlice({
  name: 'register',
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

const { loadingSigninStart, loadingSigninEnd, loadingSigninError, userInfo } =
  registerSlice.actions;

export default registerSlice.reducer;

export const register = (name, email, password) => async (dispatch) => {
  dispatch(loadingSigninStart());
  try {
    const { data } = await axios.post(
      import.meta.env.VITE_BACKEND_URL + '/api/users',
      { name, email, password }
    );

    dispatch(userInfo(data));
    dispatch(loadingSigninEnd());
  } catch (error) {
    dispatch(loadingSigninEnd());
    dispatch(
      loadingSigninError(
        error.response && error.response.data.msg
          ? error.response.data.msg
          : error.message
      )
    );
  }
};
