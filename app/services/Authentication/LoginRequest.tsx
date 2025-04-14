import {createAsyncThunk} from "@reduxjs/toolkit";
import {APILogin} from "../stores/APINextLinks";
import Request from "../stores/RequestLocal";
import Cookies from "js-cookie";


export const RequestLogin = createAsyncThunk("RequestLogin", async (arg: any, {rejectWithValue}) => {
    try {
        const response = await Request.post(APILogin, arg);
        if (response.status >= 200 && response.status < 300) {
            return response.data;
        } else {
            return rejectWithValue(response.data.message || "An error occurred");
        }
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || "An error occurred");
    }
});
export const RequestLoginHandler = (builder: any) => {
    builder
        .addCase(RequestLogin.pending, (state: any, {payload}: any) => {
            state.login.loading = true;
            state.login.error = "";
        })
        .addCase(RequestLogin.fulfilled, (state: any, {payload}: any) => {
            state.login.loading = false;
            state.login.data = payload.data.user;
            state.token = payload.data.token;
            localStorage.setItem("token", payload.data.token);
            Cookies.set("token", payload.data.token, {
                expires: 7,
                //secure: true,
                sameSite: "Strict",
            });

        })
        .addCase(RequestLogin.rejected, (state: any, action: any) => {
            state.login.loading = false;
            state.login.error = action.payload;
        });
};
