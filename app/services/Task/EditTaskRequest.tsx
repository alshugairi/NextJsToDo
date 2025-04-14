import { createAsyncThunk } from "@reduxjs/toolkit";
import Request from "../stores/RequestLocal";

export const EditTaskRequest = createAsyncThunk(
    "EditTaskRequest",
    async (
        taskData: { id: string; title: string; description: string; priority: string; completed: boolean },
        { rejectWithValue }
    ) => {
        try {
            const response = await Request.post(`/api/tasks/edit/${taskData.id}`, taskData);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to update task");
        }
    }
);

export const EditTaskRequestHandler = (builder: any) => {
    builder
        .addCase(EditTaskRequest.pending, (state: any) => {
            state.edit_task.loading = true;
            state.edit_task.error = null;
        })
        .addCase(EditTaskRequest.fulfilled, (state: any, { payload }: any) => {
            state.edit_task.loading = false;
            state.edit_task.data = payload;
        })
        .addCase(EditTaskRequest.rejected, (state: any, action: any) => {
            state.edit_task.loading = false;
            state.edit_task.error = action.payload || "Failed to update task";
        });
};