import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    loading: false,
    error: false,
    orderHistory: [],
};

export const orderHistorySlice = createSlice({
    name: "orderHistory",
    initialState,
    reducers: {
        loadingOrderHistoryStart: (state) => {
            state.loading = true;
        },
        loadingOrderHistoryError: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
        orderHistory: (state, action) => {
            state.orderHistory = action.payload;
            state.loading = false;
        },
    },
});

const { loadingOrderHistoryStart, loadingOrderHistoryError, orderHistory } = orderHistorySlice.actions;

export default orderHistorySlice.reducer;


export const listOrderHistory = () => async (dispatch, getState) => {
    dispatch(loadingOrderHistoryStart());
    const {
        signin: { userInfo },
    } = getState();
    try {
        const { data } = await axios.get(import.meta.env.VITE_BACKEND_URL + "/api/orders/myorders", {
            headers: {
                Authorization: `Bearer ${userInfo.token}`,
            },
        });
        dispatch(orderHistory(data));
    } catch (error) {
        dispatch(
            loadingOrderHistoryError(
                error.response && error.response.data.msg
                    ? error.response.data.msg
                    : error.message
            )
        );
    }
};