// Redux store configuration, defining the root reducer
// and exporting the store instance, as well as types for the root state
// and dispatch function.

import { configureStore } from "@reduxjs/toolkit";
import todosReducer from "../slice/todoSlice";

export const store = configureStore({
  reducer: {
    todos: todosReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
