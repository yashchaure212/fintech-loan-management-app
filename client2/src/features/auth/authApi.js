import { baseApi } from "@/app/api/baseApi";
import { logout, setInitialized } from "./authSlice";

function clearClientAuth(dispatch) {
  dispatch(logout());
  dispatch(setInitialized());
  dispatch(baseApi.util.resetApiState());
}

async function clearSessionAfterPasswordChange(
  _,
  { dispatch, queryFulfilled },
) {
  try {
    await queryFulfilled;

    clearClientAuth(dispatch);
  } catch {
    // Keep the current session when the request fails.
  }
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (data) => ({
        url: "/auth/register",
        method: "POST",
        body: data,
      }),
    }),

    login: builder.mutation({
      query: (data) => ({
        url: "/auth/login",
        method: "POST",
        body: data,
      }),
    }),

    logout: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
        body: {},
      }),

      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } finally {
          clearClientAuth(dispatch);
        }
      },
    }),

    getMe: builder.query({
      query: () => "/auth/me",
      providesTags: ["Auth"],
    }),

    refreshToken: builder.mutation({
      query: () => ({
        url: "/auth/refresh-token",
        method: "POST",
        body: {},
      }),
    }),

    forgotPassword: builder.mutation({
      query: (data) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body: data,
      }),
    }),

    resetPassword: builder.mutation({
      query: (data) => ({
        url: "/auth/reset-password",
        method: "POST",
        body: data,
      }),

      async onQueryStarted(arg, api) {
        await clearSessionAfterPasswordChange(arg, api);
      },
    }),

    changePassword: builder.mutation({
      query: (data) => ({
        url: "/auth/change-password",
        method: "PUT",
        body: data,
      }),

      async onQueryStarted(arg, api) {
        await clearSessionAfterPasswordChange(arg, api);
      },
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useGetMeQuery,
  useRefreshTokenMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
} = authApi;
