import {createAsyncThunk} from "@reduxjs/toolkit";
import {APIAddTask} from "../stores/APINextLinks";
import Request from "../stores/RequestLocal";

export const AddTaskRequest = createAsyncThunk("AddTaskRequest", async (arg: any, {rejectWithValue}) => {
    try {
        const response = await Request.post(APIAddTask, arg);
        return response.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const AddTaskRequestHandler = (builder: any) => {
    builder
        .addCase(AddTaskRequest.pending, (state: any, {payload}: any) => {
            state.add_task.loading = true;
            state.add_task.error = "";
        })
        .addCase(AddTaskRequest.fulfilled, (state: any, {payload}: any) => {
            state.add_task.loading = false;
            state.add_task.data = payload.data;
        })
        .addCase(AddTaskRequest.rejected, (state: any, action: any) => {
            state.add_task.loading = false;
            state.add_task.error = action.payload.response?.data.message;
        });
};
