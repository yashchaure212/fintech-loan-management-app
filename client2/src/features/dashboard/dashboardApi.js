import { baseApi } from "@/app/api/baseApi";

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCustomerDashboard: builder.query({
      query: () => "/dashboard/customer",
      providesTags: ["Dashboard"],
    }),

    getAdminDashboard: builder.query({
      query: () => "/dashboard/admin",
      providesTags: ["Dashboard"],
    }),
  }),
});

export const { useGetCustomerDashboardQuery, useGetAdminDashboardQuery } =
  dashboardApi;
