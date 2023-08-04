import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    loading: false,
    error: false,
    user: {},
};

export const userDetailSlice = createSlice({
    name: "userDetail",
    initialState,
    reducers: {
        loadingUserDetailStart: (state) => {
            state.loading = true;
        },
        loadingUserDetailError: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
        userDetail: (state, action) => {
            state.user = action.payload;
            state.loading = false;
        },
    },
});

const { loadingUserDetailStart, loadingUserDetailError, userDetail } = userDetailSlice.actions;

export default userDetailSlice.reducer;

export const detailsUser = (id) => async (dispatch, getState) => {
    dispatch(loadingUserDetailStart());
    const {
        signin: { userInfo },
    } = getState();
    try {
        const { data } = await axios.get(import.meta.env.VITE_BACKEND_URL + `/api/users/${id}`, {
            headers: {
                Authorization: `Bearer ${userInfo.token}`,
            },
        });
        dispatch(userDetail(data));
    } catch (error) {
        dispatch(
            loadingUserDetailError(
                error.response && error.response.data.msg
                    ? error.response.data.msg
                    : error.message
            )
        );
    }
};