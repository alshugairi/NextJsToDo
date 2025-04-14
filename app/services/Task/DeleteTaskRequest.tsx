// @/app/services/Task/DeleteTaskRequest.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import { APIDeleteTask } from "../stores/APINextLinks";
import Request from "../stores/RequestLocal";

export const DeleteTaskRequest = createAsyncThunk(
    "DeleteTaskRequest",
    async (taskId: string, { rejectWithValue }) => {
        try {
            const response = await Request.delete(`${APIDeleteTask}/${taskId}`);
            return response.data;
        } catch (error: any) {
            console.error("Delete Task Error:", error.response?.data, error.message);
            return rejectWithValue({
                message: error.response?.data?.message || error.message,
                status: error.response?.status,
                data: error.response?.data,
            });
        }
    }
);

export const DeleteTaskRequestHandler = (builder: any) => {
    builder
        .addCase(DeleteTaskRequest.pending, (state: any) => {
            state.delete_task.loading = true;
            state.delete_task.error = null;
        })
        .addCase(DeleteTaskRequest.fulfilled, (state: any, { payload }: any) => {
            state.delete_task.loading = false;
            state.delete_task.data = payload;
        })
        .addCase(DeleteTaskRequest.rejected, (state: any, action: any) => {
            state.delete_task.loading = false;
            state.delete_task.error = action.payload?.message || "Failed to delete task";
        });
};