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
    /*
     * -----------------------------------------------------------
     * SET CREDENTIALS
     * -----------------------------------------------------------
     *
     * Used after:
     * - login
     * - token refresh
     * - session restoration
     */
    setCredentials: (state, action) => {
      const payload = action.payload ?? {};

      const user = payload.user ?? null;
      const accessToken = payload.accessToken ?? null;

      state.user = user;
      state.accessToken = accessToken;
      state.isAuthenticated = Boolean(accessToken);
    },

    /*
     * -----------------------------------------------------------
     * SET ACCESS TOKEN
     * -----------------------------------------------------------
     *
     * Useful after a refresh-token request.
     *
     * Existing user information is intentionally preserved.
     */
    setAccessToken: (state, action) => {
      const accessToken = action.payload ?? null;

      state.accessToken = accessToken;
      state.isAuthenticated = Boolean(accessToken);

      /*
       * If the token disappears, the user should no longer be
       * considered authenticated.
       */
      if (!accessToken) {
        state.user = null;
      }
    },

    /*
     * -----------------------------------------------------------
     * SET TOKENS
     * -----------------------------------------------------------
     *
     * Supports payloads such as:
     *
     * {
     *   accessToken,
     *   refreshToken
     * }
     *
     * Refresh token is normally handled by the backend/http
     * layer and is intentionally not stored here.
     */
    setTokens: (state, action) => {
      const payload = action.payload ?? {};

      const accessToken = payload.accessToken ?? null;

      state.accessToken = accessToken;
      state.isAuthenticated = Boolean(accessToken);

      /*
       * Some authentication implementations return the user
       * together with refreshed credentials.
       *
       * Preserve it when supplied.
       */
      if (Object.prototype.hasOwnProperty.call(payload, "user")) {
        state.user = payload.user ?? null;
      }

      if (!accessToken) {
        state.user = null;
      }
    },

    /*
     * -----------------------------------------------------------
     * SET USER
     * -----------------------------------------------------------
     */
    setUser: (state, action) => {
      state.user = action.payload ?? null;
    },

    /*
     * -----------------------------------------------------------
     * LOGOUT
     * -----------------------------------------------------------
     *
     * IMPORTANT:
     *
     * isInitialized remains TRUE.
     *
     * Logout means:
     *
     * "the application has initialized and there is no session"
     *
     * It does NOT mean:
     *
     * "the application has not initialized yet."
     */
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
    },

    /*
     * -----------------------------------------------------------
     * AUTH INITIALIZATION
     * -----------------------------------------------------------
     *
     * Call this once the application has finished checking the
     * existing session.
     */
    setInitialized: (state, action) => {
      /*
       * Default behavior remains:
       *
       * dispatch(setInitialized())
       *
       * -> true
       */
      state.isInitialized = action.payload ?? true;
    },

    /*
     * -----------------------------------------------------------
     * BEGIN AUTH INITIALIZATION
     * -----------------------------------------------------------
     *
     * Useful when your app explicitly starts a fresh session
     * restoration process.
     */
    beginInitialization: (state) => {
      state.isInitialized = false;
    },

    /*
     * -----------------------------------------------------------
     * RESET AUTH
     * -----------------------------------------------------------
     *
     * Full reset.
     *
     * Unlike logout, this intentionally resets initialization.
     * Useful for complete auth lifecycle resets or app bootstrap.
     */
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
