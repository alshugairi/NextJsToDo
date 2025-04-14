import AuthReducer from "../Authentication/AuthReducer";
import TaskReducer from "@/app/services/Task/TaskReducer";

export const reducers = {
  auth: AuthReducer,
  task: TaskReducer,
};
