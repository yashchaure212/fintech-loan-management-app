import { baseApi } from "@/app/api/baseApi";

export const existingLoanApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getExistingLoans: builder.query({
      query: (loanApplicationId) => ({
        url: `/loan-applications/${loanApplicationId}/existing-loans`,
        method: "GET",
      }),

      providesTags: (result, error, loanApplicationId) => [
        {
          type: "ExistingLoan",
          id: loanApplicationId,
        },
      ],
    }),

    addExistingLoan: builder.mutation({
      query: ({ loanApplicationId, data }) => ({
        url: `/loan-applications/${loanApplicationId}/existing-loans`,
        method: "POST",
        body: data,
      }),

      invalidatesTags: (result, error, { loanApplicationId }) => [
        {
          type: "ExistingLoan",
          id: loanApplicationId,
        },
        {
          type: "Loan",
          id: loanApplicationId,
        },
      ],
    }),

    updateExistingLoan: builder.mutation({
      query: ({ existingLoanId, data }) => ({
        url: `/loan-applications/existing-loans/${existingLoanId}`,
        method: "PATCH",
        body: data,
      }),

      invalidatesTags: (result, error, { loanApplicationId }) => [
        {
          type: "ExistingLoan",
          id: loanApplicationId,
        },
      ],
    }),

    deleteExistingLoan: builder.mutation({
      query: ({ existingLoanId }) => ({
        url: `/loan-applications/existing-loans/${existingLoanId}`,
        method: "DELETE",
      }),

      invalidatesTags: (result, error, { loanApplicationId }) => [
        {
          type: "ExistingLoan",
          id: loanApplicationId,
        },
      ],
    }),
  }),
});

export const {
  useGetExistingLoansQuery,
  useAddExistingLoanMutation,
  useUpdateExistingLoanMutation,
  useDeleteExistingLoanMutation,
} = existingLoanApi;
