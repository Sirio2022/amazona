import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  loading: false,
  error: false,
  success: false,
  deletedUser: {},
};

const deleteUserSlice = createSlice({
  name: 'deleteUser',
  initialState,
  reducers: {
    deleteUserRequest: (state) => {
      state.loading = true;
    },
    deleteUserSuccess: (state, action) => {
      state.loading = false;
      state.success = true;
      state.deletedUser = action.payload;
    },
    deleteUserFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    deleteUserReset: (state) => {
      state.loading = false;
      state.error = false;
      state.success = false;
    },
  },
});

export default deleteUserSlice.reducer;

export const { deleteUserRequest, deleteUserSuccess, deleteUserFail, deleteUserReset } =
  deleteUserSlice.actions;

export const deleteUser = (id) => async (dispatch, getState) => {
  dispatch(deleteUserRequest());
  try {
    const {
      signin: { userInfo },
    } = getState();
    const { data } = await axios.delete(
      import.meta.env.VITE_BACKEND_URL + `/api/users/${id}`,
      {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      }
    );
    dispatch(deleteUserSuccess(data));
    dispatch(deleteUserReset());
  } catch (error) {
    dispatch(
      deleteUserFail(
        error.response && error.response.data.msg
          ? error.response.data.msg
          : error.message
      )
    );
  }
};
