import {createSlice} from "@reduxjs/toolkit";
import {TaskRequestHandler} from "@/app/services/Task/TaskRequest";
import {AddTaskRequestHandler} from "@/app/services/Task/AddTaskRequest";
import {DeleteTaskRequestHandler} from "@/app/services/Task/DeleteTaskRequest";

interface todoStates {
    tasks: {
        loading: false,
        error: null,
        data:null,
    },
    add_task: {
        loading: false,
        error: null,
        data:null
    },
    delete_task: {
        loading: false,
        error: null,
        data:null
    },
    pagination: {}
}

const initialState: todoStates = {
    tasks: {
        loading: false,
        error: null,
        data:null,
    },
    add_task: {
        loading: false,
        error: null,
        data:null
    },
    delete_task: {
        loading: false,
        error: null,
        data:null
    },
    pagination: {}
};

export const todoSlice = createSlice({
    name: "task",
    initialState,
    reducers: {
        fun:  ()=>{}
    },
    extraReducers: (builder) => {
        TaskRequestHandler(builder);
        AddTaskRequestHandler(builder);
        DeleteTaskRequestHandler(builder);
    }
});
export const {} = todoSlice.actions;
export default todoSlice.reducer;

