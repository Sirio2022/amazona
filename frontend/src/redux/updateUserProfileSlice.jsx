import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { setUserInfo } from './signinSlice';

const initialState = {
  loading: false,
  error: false,
  userProfile: {},
};

export const updateUserProfileSlice = createSlice({
  name: 'updateUserProfile',
  initialState,
  reducers: {
    loadingUpdateUserProfileStart: (state) => {
      state.loading = true;
    },
    loadingUpdateUserProfileError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    updateUserProfile: (state, action) => {
      state.userProfile = action.payload;
      state.loading = false;
    },
    clearUserProfile: (state) => {
      state.userProfile = {};
      state.loading = false;
      state.error = false;
    },
  },
});

export const {
  loadingUpdateUserProfileStart,
  loadingUpdateUserProfileError,
  updateUserProfile,
  clearUserProfile,
} = updateUserProfileSlice.actions;

export default updateUserProfileSlice.reducer;

export const updateUserProfileAction = (user) => async (dispatch, getState) => {
  dispatch(loadingUpdateUserProfileStart());
  const {
    signin: { userInfo },
  } = getState();
  try {
    const { data } = await axios.put(
      import.meta.env.VITE_BACKEND_URL + `/api/users/profile`,
      user,
      {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      }
    );
    dispatch(updateUserProfile(data));
    dispatch(setUserInfo(data));
    localStorage.setItem('userInfo', JSON.stringify(data));
  } catch (error) {
    dispatch(
      loadingUpdateUserProfileError(
        error.response && error.response.data.msg
          ? error.response.data.msg
          : error.message
      )
    );
  }
};
