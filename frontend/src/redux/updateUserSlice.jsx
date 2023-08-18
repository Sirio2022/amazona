import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  loading: false,
  error: false,
  success: false,
  user: {},
};

const updateUserSlice = createSlice({
  name: 'updateUser',
  initialState,
  reducers: {
    updateUserRequest: (state) => {
      state.loading = true;
    },
    updateUserSuccess: (state, action) => {
      state.loading = false;
      state.success = true;
      state.user = action.payload;
    },
    updateUserFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateUserReset: (state) => {
      state.loading = false;
      state.error = false;
      state.success = false;
    },
  },
});

export default updateUserSlice.reducer;
export const {
  updateUserRequest,
  updateUserSuccess,
  updateUserFail,
  updateUserReset,
} = updateUserSlice.actions;

export const updateUser = (user) => async (dispatch, getState) => {
  dispatch(updateUserRequest());
  const {
    signin: { userInfo },
  } = getState();

  try {
    const { data } = await axios.put(
      import.meta.env.VITE_BACKEND_URL + `/api/users/${user._id}`,
      user,
      {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      }
    );
    dispatch(updateUserSuccess(data));
    
  } catch (error) {
    dispatch(
      updateUserFail(
        error.response && error.response.data.msg
          ? error.response.data.msg
          : error.message
      )
    );
  }
};
