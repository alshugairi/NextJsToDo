import {createSlice} from "@reduxjs/toolkit";
import { RequestLoginHandler } from "./LoginRequest";
import { LogoutAction } from "./LogoutAction";
import {RegisterRequestHandler} from "@/app/services/Authentication/RegisterRequest";


interface authStates {
    token: any;
    login: {
        loading: boolean,
        error: null | string
        data: null;
    };
    register: {
        loading: boolean,
        error: null | string
    };
}

const initialState: authStates = {
    token:  null,
    login: {
        loading: false,
        error: null,
        data:null
    },
    register: {
        loading: false,
        error: null
    },
};
export const AuthSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logoutAction: LogoutAction
    },
    extraReducers: (builder) => {
        RequestLoginHandler(builder);
        RegisterRequestHandler(builder);
    }
});

export const {logoutAction} = AuthSlice.actions;
export default AuthSlice.reducer;

