import { baseApi } from "@/app/api/baseApi";

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCustomerDashboard: builder.query({
      query: () => "/dashboard/customer",
      providesTags: ["Dashboard"],
    }),
  }),
});

export const { useGetCustomerDashboardQuery } = dashboardApi;
