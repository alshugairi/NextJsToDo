import {createAsyncThunk} from "@reduxjs/toolkit";
import {APIRegister} from "../stores/APINextLinks";
import Request from "../stores/RequestLocal";
import Cookies from "js-cookie";


export const RegisterRequest = createAsyncThunk("RegisterRequest", async (arg: any, {rejectWithValue}) => {
    try {
        const response = await Request.post(APIRegister, arg);
        return response.data.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});
export const RegisterRequestHandler = (builder: any) => {
    builder
        .addCase(RegisterRequest.pending, (state: any, {payload}: any) => {
            state.login.loading = true;
            state.login.error = "";
        })
        .addCase(RegisterRequest.fulfilled, (state: any, {payload}: any) => {
            state.login.loading = false;
            state.token = payload.token;
            localStorage.setItem("token", payload.token);
            Cookies.set("token", payload.token, { expires: 7, secure: true, sameSite: "Strict" });
        })
        .addCase(RegisterRequest.rejected, (state: any, action: any) => {
            state.login.loading = false;
            state.login.error = action.payload.response?.data.message;
        });
};
