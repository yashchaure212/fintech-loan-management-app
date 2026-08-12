import { createSlice } from "@reduxjs/toolkit";
import { storage } from "@/utils/storage";

const initialState = {
  user: null,
  accessToken: storage.getAccessToken(),
  isAuthenticated: !!storage.getAccessToken(),
  isInitialized: false,
};

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    setCredentials: (state, action) => {
      const { user, accessToken } = action.payload;

      state.user = user;
      state.accessToken = accessToken;
      state.isAuthenticated = true;

      storage.setAccessToken(accessToken);
    },

    setAccessToken: (state, action) => {
      state.accessToken = action.payload;
      state.isAuthenticated = true;

      storage.setAccessToken(action.payload);
    },

    setTokens: (state, action) => {
      const { accessToken, refreshToken } = action.payload;

      state.accessToken = accessToken;
      state.isAuthenticated = Boolean(accessToken);

      storage.setAccessToken(accessToken);

      if (refreshToken) {
        storage.setRefreshToken(refreshToken);
      }
    },

    setUser: (state, action) => {
      state.user = action.payload;
    },

    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;

      storage.clear();
    },

    setInitialized: (state) => {
      state.isInitialized = true;
    },
  },
});

export const {
  setCredentials,
  setAccessToken,
  setTokens,
  setUser,
  logout,
  setInitialized,
} = authSlice.actions;

export default authSlice.reducer;
