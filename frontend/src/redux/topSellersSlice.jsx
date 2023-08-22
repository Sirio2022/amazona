import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = { loading: true, error: null, topSellers: [] };

const topSellersSlice = createSlice({
  name: 'topSellers',
  initialState,
  reducers: {
    topSellersRequest: (state) => {
      state.loading = true;
    },
    topSellersSuccess: (state, action) => {
      state.loading = false;
      state.topSellers = action.payload;
    },
    topSellersFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  
  },
});

export default topSellersSlice.reducer;

export const { topSellersRequest, topSellersSuccess, topSellersFail} =
  topSellersSlice.actions;

export const listTopSollers = () => async (dispatch, getState) => {
  dispatch(topSellersRequest());
  const {
    signin: { userInfo },
  } = getState();
  try {
    const { data } = await axios.get(
      import.meta.env.VITE_BACKEND_URL + '/api/users/top-sellers',
      {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      }
    );
    dispatch(topSellersSuccess(data));
  } catch (error) {
    dispatch(topSellersFail(error.message));
  }
};
