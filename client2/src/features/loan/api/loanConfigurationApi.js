import { baseApi } from "@/app/api/baseApi";

/*
 * Loan pricing lives in the backend and is versioned there.
 *
 * The customer wizard reads the applicable version so amounts,
 * tenures, rates and fees are never hardcoded in React, and the
 * admin screen creates NEW versions rather than editing pricing
 * in place.
 */
export const loanConfigurationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Customer + admin: the terms a new application is priced with
    getApplicableLoanConfiguration: builder.query({
      query: () => ({
        url: "/loan-interest-configurations/applicable",
        method: "GET",
      }),

      providesTags: [{ type: "LoanConfiguration", id: "APPLICABLE" }],
    }),

    // Admin: active configuration + full version timeline
    getLoanConfigurationOverview: builder.query({
      query: () => ({
        url: "/loan-interest-configurations/current",
        method: "GET",
      }),

      providesTags: [
        { type: "LoanConfiguration", id: "OVERVIEW" },
        { type: "LoanConfiguration", id: "APPLICABLE" },
      ],
    }),

    // Admin: supersede the current version with a new one
    createLoanConfigurationVersion: builder.mutation({
      query: (body) => ({
        url: "/loan-interest-configurations",
        method: "POST",
        body,
      }),

      invalidatesTags: [
        { type: "LoanConfiguration", id: "OVERVIEW" },
        { type: "LoanConfiguration", id: "APPLICABLE" },
      ],
    }),
  }),
});

export const {
  useGetApplicableLoanConfigurationQuery,
  useGetLoanConfigurationOverviewQuery,
  useCreateLoanConfigurationVersionMutation,
} = loanConfigurationApi;
