import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { disconnectSocket } from "../../socket/socket";

interface AuthState {
  user: {
    userId: string;
    fullName: string;
    username: string;
    avatar: string;
    email: string;
    accountCreatedAt: string;
  } | null;
  isAuthenticated: boolean;
  error : string | unknown;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  error: null, 
};

const API = "https://chat-web-app-e8q5.onrender.com";


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
      const response = await axios.post(`${API}/api/auth/signup`, {
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
      const response = await axios.post(`${API}/api/auth/verify-email`, {
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
        `${API}/api/auth/resend-verification-email`,
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
      const response = await axios.post(
        `${API}/api/auth/signin`,
        {
          identifier,
          password,
        },
        { withCredentials: true }
      );
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
        `${API}/api/auth/request-password-reset`,
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
      const response = await axios.post(`${API}/api/auth/reset-password`, {
        email,
        token,
        newPassword,
        newConfirmPassword,
      });
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

// AsyncThunk for get user data
export const getUserData = createAsyncThunk(
  "user/me",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API}/api/user/me`, {
        withCredentials: true, 
      });
      const { user } = response.data;
      return { user };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error ||
        error?.response?.data ||
        "Error while fetching user data."
      );
    }
  }
);

// AsyncThunk for logout
export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API}/api/auth/logout`, {
        withCredentials: true, 
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error ||
        error?.response?.data ||
        "Error while logging out."
      );
    }
  }
);


const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
    .addCase(getUserData.fulfilled, (state, action) => {
      state.user = action.payload.user;
      state.isAuthenticated = true;
    })
    .addCase(getUserData.rejected, (state) => {
      state.user = null;
      state.isAuthenticated = false;
    })
    .addCase(getUserData.pending, (state) => {
      state.error = null; // Clear any error while fetching
    })
    .addCase(logout.fulfilled, () => {
      // Disconnect the socket on logout
      disconnectSocket();
    })
  },
});

export default authSlice.reducer;
