import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  loading: false,
  error: false,
  success: false,
  userInfo: {},
};

export const registerSlice = createSlice({
  name: 'register',
  initialState,
  reducers: {
    userRegisterRequest: (state) => {
      state.loading = true;
    },
    userRegisterSuccess: (state, action) => {
      state.success = true;
      state.userInfo = action.payload;
      state.loading = false;
    },

    userRegisterFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

const { userRegisterRequest, userRegisterFail, userRegisterSuccess } =
  registerSlice.actions;

export default registerSlice.reducer;

export const register = (name, email, password) => async (dispatch) => {
  dispatch(userRegisterRequest());
  try {
    const { data } = await axios.post(
      import.meta.env.VITE_BACKEND_URL + '/api/users',
      { name, email, password }
    );

    dispatch(userRegisterSuccess(data));
  } catch (error) {
    dispatch(
      userRegisterFail(
        error.response && error.response.data.msg
          ? error.response.data.msg
          : error.message
      )
    );
  }
};
