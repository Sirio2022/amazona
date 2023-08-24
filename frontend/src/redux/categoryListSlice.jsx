import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  loading: false,
  error: false,
  categories: [],
};

export const categoryListSlice = createSlice({
  name: 'categoryList',
  initialState,
  reducers: {
    loadingCategoriesRequest: (state) => {
      state.loading = true;
    },
    setListCategories: (state, action) => {
      state.categories = action.payload;
      state.loading = false;
    },
    loadingCategoriesError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
    loadingCategoriesRequest,
    setListCategories,
    loadingCategoriesError,
} = categoryListSlice.actions;

export default categoryListSlice.reducer;

export const fetchCategories = () => async (dispatch) => {
    dispatch(loadingCategoriesRequest());
    
    try {
        const { data } = await axios.get(
        import.meta.env.VITE_BACKEND_URL + '/api/products/categories'
        );
    
        dispatch(setListCategories(data));
    } catch (error) {
        dispatch(loadingCategoriesError(error.message));
    }
};
