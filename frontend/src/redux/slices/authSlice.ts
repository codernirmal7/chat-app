import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface AuthState {
  user: {
    id: string;
    fullName: string;
    username: string;
    profileImage: string;
    email: string;
  } | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
};

// API base URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


// AsyncThunk for user signup
export const signup = createAsyncThunk(
  "auth/signup",
  async (
    {
      fullName,
      email,
      password,
      confirmPassword
    }: { fullName: string; email: string; password: string , confirmPassword : string; },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/signup`, {
        fullName,
        email,
        password,
        confirmPassword
      });
      const {  message } = response.data;
      return { message };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || error?.response?.data || "Signup failed");
    }
  }
);



const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    
  },
  extraReducers: (builder) => {
    builder
     
  },
});

export const { } = authSlice.actions;
export default authSlice.reducer;