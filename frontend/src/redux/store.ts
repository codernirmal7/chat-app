import { configureStore } from '@reduxjs/toolkit';
import authReducer from "./slices/authSlice"
import messageReducer from "./slices/messageSlice"

// Configure the Redux store
export const store = configureStore({
  reducer: {
    auth : authReducer,
    message : messageReducer
  },
});

// Define types for the store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;