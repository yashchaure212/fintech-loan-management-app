import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { storage } from "@/utils/storage";
import { logout, setTokens } from "@/features/auth/authSlice";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL,

  credentials: "include",

  prepareHeaders: (headers) => {
    const token = storage.getAccessToken();

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    return headers;
  },
});

// Prevent multiple refresh requests running simultaneously.
let refreshPromise = null;

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  const url = typeof args === "string" ? args : args.url;

  const isAuthRoute =
    url?.includes("/auth/login") ||
    url?.includes("/auth/register") ||
    url?.includes("/auth/refresh-token");

  if (result.error?.status === 401 && !isAuthRoute) {
    const refreshToken = storage.getRefreshToken();

    // No refresh token means the session cannot be refreshed.
    if (!refreshToken) {
      api.dispatch(logout());

      return result;
    }

    if (!refreshPromise) {
      refreshPromise = rawBaseQuery(
        {
          url: "/auth/refresh-token",
          method: "POST",
          body: {
            refreshToken,
          },
        },
        api,
        extraOptions,
      ).finally(() => {
        refreshPromise = null;
      });
    }

    const refreshResult = await refreshPromise;

    const newAccessToken = refreshResult.data?.data?.accessToken;
    const newRefreshToken = refreshResult.data?.data?.refreshToken;

    if (newAccessToken) {
      api.dispatch(
        setTokens({
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
        }),
      );

      // Retry the original request with the new access token.
      result = await rawBaseQuery(args, api, extraOptions);
    } else {
      // Refresh failed.
      api.dispatch(logout());
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "api",

  baseQuery: baseQueryWithReauth,

  tagTypes: [
    "Auth",
    "Profile",
    "Address",
    "Employment",
    "Kyc",
    "Education",
    "Loan",
    "Dashboard",
    "Admin",
    "LoanDocument",
    "EducationLoan",
    "Emi",
    "Notification",
  ],

  endpoints: () => ({}),
});
