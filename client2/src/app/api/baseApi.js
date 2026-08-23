import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { logout, setTokens } from "@/features/auth/authSlice";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL,
  credentials: "include",

  prepareHeaders: (headers, { getState }) => {
    const accessToken = getState().auth.accessToken;

    if (accessToken) {
      headers.set("Authorization", `Bearer ${accessToken}`);
    }

    return headers;
  },
});

let refreshPromise = null;

const AUTH_ROUTES = [
  "/auth/login",
  "/auth/register",
  "/auth/refresh-token",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/auth/logout",
];

const getRequestUrl = (args) =>
  typeof args === "string" ? args : (args?.url ?? "");

const isAuthRoute = (url = "") => {
  const path = url.split("?")[0];

  return AUTH_ROUTES.some(
    (route) => path === route || path.endsWith(route),
  );
};

const isRefreshRoute = (url = "") => {
  const path = url.split("?")[0];

  return path === "/auth/refresh-token" || path.endsWith("/auth/refresh-token");
};

const REFRESH_LOCK = "fintech-auth-refresh";

const applyRefreshResult = (api, refreshResult) => {
  const newAccessToken = refreshResult.data?.data?.accessToken;

  if (newAccessToken) {
    api.dispatch(setTokens({ accessToken: newAccessToken }));
  }

  return refreshResult;
};

const performRefresh = (api, extraOptions) => {
  if (!refreshPromise) {
    refreshPromise = rawBaseQuery(
      {
        url: "/auth/refresh-token",
        method: "POST",
        body: {},
      },
      api,
      extraOptions,
    )
      .then((refreshResult) => applyRefreshResult(api, refreshResult))
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
};

const refreshAccessToken = (api, extraOptions) => {
  if (refreshPromise) {
    return refreshPromise;
  }

  const locks = globalThis.navigator?.locks;

  if (locks?.request) {
    refreshPromise = locks
      .request(REFRESH_LOCK, () =>
        rawBaseQuery(
          {
            url: "/auth/refresh-token",
            method: "POST",
            body: {},
          },
          api,
          extraOptions,
        ).then((refreshResult) => applyRefreshResult(api, refreshResult)),
      )
      .finally(() => {
        refreshPromise = null;
      });

    return refreshPromise;
  }

  return performRefresh(api, extraOptions);
};

const clearClientSession = (api) => {
  api.dispatch(logout());
  api.dispatch(baseApi.util.resetApiState());
};

const baseQueryWithReauth = async (args, api, extraOptions) => {
  const url = getRequestUrl(args);

  if (isRefreshRoute(url)) {
    return refreshAccessToken(api, extraOptions);
  }

  let result = await rawBaseQuery(args, api, extraOptions);

  if (result.error?.status !== 401 || isAuthRoute(url)) {
    return result;
  }

  const refreshResult = await refreshAccessToken(api, extraOptions);
  const newAccessToken = refreshResult.data?.data?.accessToken;

  if (!newAccessToken) {
    clearClientSession(api);
    return result;
  }

  result = await rawBaseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    clearClientSession(api);
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
    "Loan",
    "LoanType",
    "Dashboard",
    "Admin",
    "LoanDocument",
    "StudentLoan",
    "Emi",
    "SchoolLoan",
    "Institution",
    "ExistingLoan",
    "BusinessRegistration",
  ],

  endpoints: () => ({}),
});
