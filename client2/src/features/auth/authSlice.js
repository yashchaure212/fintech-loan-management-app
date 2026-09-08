import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isInitialized: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const payload = action.payload ?? {};
      const user = payload.user ?? null;
      const accessToken = payload.accessToken ?? null;

      state.user = user;
      state.accessToken = accessToken;
      state.isAuthenticated = Boolean(accessToken);
    },

    setAccessToken: (state, action) => {
      const accessToken = action.payload ?? null;

      state.accessToken = accessToken;
      state.isAuthenticated = Boolean(accessToken);

      if (!accessToken) {
        state.user = null;
      }
    },

    setTokens: (state, action) => {
      const payload = action.payload ?? {};

      const accessToken = payload.accessToken ?? null;

      state.accessToken = accessToken;
      state.isAuthenticated = Boolean(accessToken);

      if (Object.prototype.hasOwnProperty.call(payload, "user")) {
        state.user = payload.user ?? null;
      }

      if (!accessToken) {
        state.user = null;
      }
    },

    setUser: (state, action) => {
      state.user = action.payload ?? null;
    },

    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
    },

    setInitialized: (state, action) => {
      state.isInitialized = action.payload ?? true;
    },

    beginInitialization: (state) => {
      state.isInitialized = false;
    },

    resetAuth: () => ({
      ...initialState,
    }),
  },
});

export const {
  setCredentials,
  setAccessToken,
  setTokens,
  setUser,
  logout,
  setInitialized,
  beginInitialization,
  resetAuth,
} = authSlice.actions;

export default authSlice.reducer;
