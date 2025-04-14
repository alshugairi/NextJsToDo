import {createAsyncThunk} from "@reduxjs/toolkit";
import {APITask} from "../stores/APINextLinks";
import Request from "../stores/RequestLocal";

export const TaskRequest = createAsyncThunk("TaskRequest", async (arg: any, {rejectWithValue}) => {
    try {
        const response = await Request.get(APITask, {params:arg});
        return response.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const TaskRequestHandler = (builder: any) => {
    builder
        .addCase(TaskRequest.pending, (state: any, {payload}: any) => {
            state.tasks.loading = true;
            state.tasks.error = "";
        })
        .addCase(TaskRequest.fulfilled, (state: any, {payload}: any) => {
            state.tasks.loading = false;
            state.tasks.data = payload.data;
            state.pagination = payload.pagination;
        })
        .addCase(TaskRequest.rejected, (state: any, action: any) => {
            state.tasks.loading = false;
            state.tasks.error = action.payload.response?.data.message;
        });
};
