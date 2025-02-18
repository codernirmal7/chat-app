import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import axios from "axios";
import { getSocket } from "../../socket/socket";
import { RootState } from "../store";

// Define the types for the state
interface User {
  _id: any;
  fullName: string;
  username: string;
  email: string;
  avatar: string;
}

interface Message {
  _id: string;
  senderId: string;
  receiverId: string;
  text: string;
  image: string;
  createdAt: string;
  senderAvatar: string;
}

interface MessageState {
  messages: Message[];
  users: User[];
  selectedUser: User | null;
  isUsersLoading: boolean;
  isMessagesLoading: boolean;
}

const initialState = {
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
} as MessageState;

// API base URL
const API_BASE_URL = "https://chat-app-7a1f.onrender.com/api";

// Async thunk for fetching users
export const getUsers = createAsyncThunk<User[], void, { rejectValue: any }>(
  "messages/getUsers",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/messages/users`, {
        withCredentials: true,
      });
      return res.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Error fetching users"
      );
    }
  }
);

// Async thunk for fetching messages
export const getMessages = createAsyncThunk<
  Message[],
  string,
  { rejectValue: any }
>("messages/getMessages", async (userId: string, { rejectWithValue }) => {
  try {
    const res = await axios.get(`${API_BASE_URL}/messages/${userId}`, {
      withCredentials: true,
    });
    return res.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.error || "Error fetching messages"
    );
  }
});

// Async thunk for sending a message
export const sendMessage = createAsyncThunk<Message, any, { rejectValue: any }>(
    "messages/sendMessage",
    async ({ text, image }: { text: string; image: File }, { rejectWithValue, getState }) => {
      const state = getState() as RootState; // Get the state from the store
      const { selectedUser } = state.message;
  
      if (!selectedUser) {
        return rejectWithValue("No selected user to send a message to");
      }
  
      try {
        // Create a FormData object
        const formData = new FormData();
        formData.append("text", text.trim()); // Append the text
        formData.append("image", image); // Append the image file
  
        const res = await axios.post(
          `${API_BASE_URL}/messages/send/${selectedUser._id}`,
          formData, // Send the FormData directly
          { withCredentials: true } // Ensure credentials (cookies, etc.) are included
        );
  
        return res.data;
      } catch (error: any) {
        return rejectWithValue(error.response?.data?.error || "Error sending message");
      }
    }
  );
  

// Slice for messages
const messageSlice = createSlice({
  name: "messages",
  initialState: initialState,
  reducers: {
    setSelectedUser: (state, action: PayloadAction<User | null>) => {
      state.selectedUser = action.payload;
    },

    // Socket actions
    subscribeToMessages: (state) => {
      const socket = getSocket();
      const { selectedUser } = state;

      if (selectedUser) {
        socket?.on("newMessage", (newMessage: Message) => {
          const isMessageSentFromSelectedUser =
            newMessage.senderId === selectedUser._id;
          if (isMessageSentFromSelectedUser) {
            state.messages.push(newMessage);
          }
        });
      }
    },

    unsubscribeFromMessages: () => {
      const socket = getSocket();
      socket?.off("newMessage");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUsers.pending, (state) => {
        state.isUsersLoading = true;
      })
      .addCase(getUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.isUsersLoading = false;
        state.users = action.payload;
      })
      .addCase(getUsers.rejected, (state, action: PayloadAction<string>) => {
        state.isUsersLoading = false;
        toast.error(action.payload);
      })

      .addCase(getMessages.pending, (state) => {
        state.isMessagesLoading = true;
      })
      .addCase(
        getMessages.fulfilled,
        (state, action: PayloadAction<Message[]>) => {
          state.isMessagesLoading = false;
          state.messages = action.payload;
        }
      )
      .addCase(getMessages.rejected, (state, action: PayloadAction<string>) => {
        state.isMessagesLoading = false;
        toast.error(action.payload);
      })

      .addCase(
        sendMessage.fulfilled,
        (state, action: PayloadAction<Message>) => {
          state.messages.push(action.payload);
        }
      )
      .addCase(sendMessage.rejected, (_, action: PayloadAction<string>) => {
        toast.error(action.payload);
      });
  },
});

export const { setSelectedUser, subscribeToMessages, unsubscribeFromMessages } =
  messageSlice.actions;
export default messageSlice.reducer;
