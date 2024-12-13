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
      confirmPassword,
    }: {
      fullName: string;
      email: string;
      password: string;
      confirmPassword: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/signup`, {
        fullName,
        email,
        password,
        confirmPassword,
      });
      const { message } = response.data;
      return { message };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || error?.response?.data || "Signup failed"
      );
    }
  }
);

// AsyncThunk for user verify email
export const verifyEmail = createAsyncThunk(
  "auth/verifiy-email",
  async (
    { email, token }: { email: string; token: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/verify-email`, {
        email,
        token,
      });
      const { message } = response.data;
      return { message };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error ||
          error?.response?.data ||
          "Email verification failed"
      );
    }
  }
);

// AsyncThunk for user resend verify email code
export const resendVerificationCodeEmail = createAsyncThunk(
  "auth/resend-verification-email",
  async ({ email }: { email: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/auth/resend-verification-email`,
        {
          email,
        }
      );
      const { message } = response.data;
      return { message };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error ||
          error?.response?.data ||
          "Error while resending verification code."
      );
    }
  }
);

// AsyncThunk for sign in
export const signIn = createAsyncThunk(
  "auth/signin",
  async (
    { identifier, password }: { identifier: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/signin`, {
        identifier,
        password,
      },{ withCredentials: true });
      const { message } = response.data;
      return { message };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error ||
          error?.response?.data ||
          "Error while sign in."
      );
    }
  }
);

// AsyncThunk for request password reset
export const sendResetPasswordToken = createAsyncThunk(
  "auth/request-password-reset",
  async ({ email }: { email: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/auth/request-password-reset`,
        {
          email,
        }
      );
      const { message } = response.data;
      return { message };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error ||
          error?.response?.data ||
          "Error while sending password reset token."
      );
    }
  }
);

// AsyncThunk for reset password
export const resetPassword = createAsyncThunk(
  "auth/reset-password",
  async (
    {
      email,
      token,
      newPassword,
      newConfirmPassword,
    }: {
      email: string;
      token: string;
      newPassword: string;
      newConfirmPassword: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/auth/reset-password`,
        {
          email,
          token,
          newPassword,
          newConfirmPassword,
        }
      );
      const { message } = response.data;
      return { message };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error ||
          error?.response?.data ||
          "Error while sending resetting the password."
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder;
  },
});

export const {} = authSlice.actions;
export default authSlice.reducer;
