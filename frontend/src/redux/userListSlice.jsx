import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  users: [],
  loading: true,
  error: false,
  success: false,
};

const userListSlice = createSlice({
  name: 'userList',
  initialState,
  reducers: {
    listUsersRequest: (state) => {
      state.loading = true;
    },
    listUsersSuccess: (state, action) => {
      state.loading = false;
      state.users = action.payload;
      state.success = true;
    },
    listUsersFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    listUsersReset: (state) => {
      state.loading = false;
      state.error = false;
      state.success = false;
    },
  },
});

export default userListSlice.reducer;

export const {
  listUsersRequest,
  listUsersSuccess,
  listUsersFail,
  listUsersReset,
} = userListSlice.actions;

export const listUsers = () => async (dispatch, getState) => {
  dispatch(listUsersRequest());
  try {
    const {
      signin: { userInfo },
    } = getState();
    const { data } = await axios.get(
      import.meta.env.VITE_BACKEND_URL + '/api/users',
      {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      }
    );

    dispatch(listUsersSuccess(data));
    dispatch(listUsersReset());
  } catch (error) {
    dispatch(
      listUsersFail(
        error.response && error.response.data.msg
          ? error.response.data.msg
          : error.message
      )
    );
  }
};
