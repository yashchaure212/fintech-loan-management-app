import { baseApi } from "@/app/api/baseApi";

export const loanApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ==================================================
    // PUBLIC LOAN TYPES
    // ==================================================

    getPublicLoanTypes: builder.query({
      query: () => ({
        url: "/loan-types/public",
        method: "GET",
      }),
      providesTags: ["LoanType"],
    }),

    // ==================================================
    // CUSTOMER LOAN TYPES
    // ==================================================

    getActiveLoanTypes: builder.query({
      query: () => ({
        url: "/loan-types/active",
        method: "GET",
      }),
      providesTags: ["LoanType"],
    }),

    // ==================================================
    // LOAN APPLICATIONS
    // ==================================================

    createLoanApplication: builder.mutation({
      query: (body) => ({
        url: "/loan-applications",
        method: "POST",
        body,
      }),

      invalidatesTags: ["Loan"],
    }),

    getMyLoanApplications: builder.query({
      query: () => ({
        url: "/loan-applications",
        method: "GET",
      }),

      providesTags: ["Loan"],
    }),

    getLoanApplication: builder.query({
      query: (loanApplicationId) => ({
        url: `/loan-applications/${loanApplicationId}`,
        method: "GET",
      }),

      providesTags: (result, error, loanApplicationId) => [
        {
          type: "Loan",
          id: loanApplicationId,
        },
      ],
    }),

    updateLoanApplication: builder.mutation({
      query: ({ loanApplicationId, data }) => ({
        url: `/loan-applications/${loanApplicationId}`,
        method: "PATCH",
        body: data,
      }),

      invalidatesTags: (result, error, { loanApplicationId }) => [
        {
          type: "Loan",
          id: loanApplicationId,
        },
        "Loan",
      ],
    }),

    submitLoanApplication: builder.mutation({
      query: (arg) => {
        const loanApplicationId =
          typeof arg === "string" ? arg : arg.loanApplicationId;

        const data = typeof arg === "string" ? {} : arg.data || {};

        return {
          url: `/loan-applications/${loanApplicationId}/submit`,
          method: "POST",
          body: data,
        };
      },

      invalidatesTags: (result, error, arg) => {
        const loanApplicationId =
          typeof arg === "string" ? arg : arg.loanApplicationId;

        return [
          {
            type: "Loan",
            id: loanApplicationId,
          },
          "Loan",
        ];
      },
    }),
  }),
});

export const {
  useGetPublicLoanTypesQuery,
  useGetActiveLoanTypesQuery,
  useCreateLoanApplicationMutation,
  useGetMyLoanApplicationsQuery,
  useGetLoanApplicationQuery,
  useUpdateLoanApplicationMutation,
  useSubmitLoanApplicationMutation,
} = loanApi;
