import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// AsyncThunk for update-profile
export const updateProfile = createAsyncThunk(
  "user/update-profile",
  async (
    {
      fullName,
      username,
    }: {
      fullName: string;
      username: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/user/update-profile`, {
        fullName,
        username,
      },
    {
        withCredentials: true, 
    }
    );
      const { message } = response.data;
      return { message };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error ||
          error?.response?.data ||
          "Error while updating profile."
      );
    }
  }
);

// AsyncThunk for update-profile-image
export const updateProfileImage = createAsyncThunk(
  "user/update-profile-image",
  async ({ avatar }: { avatar: File }, { rejectWithValue }) => {
    try {
      // Create a FormData object to send the file
      const formData = new FormData();
      formData.append("avatar", avatar);

      // Make the request
      const response = await axios.post(
        `${API_BASE_URL}/user/update-profile-image`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true, // If the API requires cookies for authentication
        }
      );

      const { message } = response.data;
      return { message };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error ||
          error?.response?.data ||
          "Error while updating profile avatar."
      );
    }
  }
);
