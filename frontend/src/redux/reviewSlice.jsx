import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  loading: false,
  error: '',
  success: false,
  review: {},
};

const reviewSlice = createSlice({
  name: 'review',
  initialState,
  reducers: {
    reviewRequest: (state) => {
      state.loading = true;
    },
    reviewSuccess: (state, action) => {
      state.loading = false;
      state.review = action.payload;
      state.success = true;
    },
    reviewFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
    },
    reviewReset: (state) => {
      state.loading = false;
      state.error = '';
      state.success = false;
      state.review = {};
    },
  },
});

export const { reviewRequest, reviewSuccess, reviewFail, reviewReset } =
  reviewSlice.actions;

export default reviewSlice.reducer;

export const createReviewAction =
  (id, review) => async (dispatch, getState) => {
    dispatch(reviewRequest);
    const {
      signin: { userInfo },
    } = getState();
    try {
      const { data } = await axios.put(
        import.meta.env.VITE_BACKEND_URL + `/api/products/${id}/reviews`,
        review,
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );

      dispatch(reviewSuccess(data));
    } catch (error) {
      dispatch(
        reviewFail(
          error.message && error.response.data.msg
            ? error.response.data.msg
            : error.message
        )
      );
    }
  };
