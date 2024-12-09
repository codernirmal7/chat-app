import { configureStore } from '@reduxjs/toolkit';

// Configure the Redux store
export const store = configureStore({
  reducer: {
    
  },
});

// Define types for the store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;