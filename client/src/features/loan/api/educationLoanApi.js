import { baseApi } from "@/app/api/baseApi";

export const educationLoanApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get education loan details
    getEducationLoanDetails: builder.query({
      query: (loanApplicationId) => ({
        url: `/education-loans/application/${loanApplicationId}`,
        method: "GET",
      }),

      providesTags: (result, error, loanApplicationId) => [
        {
          type: "EducationLoan",
          id: loanApplicationId,
        },
      ],
    }),

    // Create education loan details - Step 2
    createEducationLoanDetails: builder.mutation({
      query: ({ loanApplicationId, data }) => ({
        url: `/education-loans/application/${loanApplicationId}`,
        method: "POST",
        body: data,
      }),

      invalidatesTags: (result, error, { loanApplicationId }) => [
        {
          type: "EducationLoan",
          id: loanApplicationId,
        },
        {
          type: "Loan",
          id: loanApplicationId,
        },
        "Loan",
      ],
    }),

    // Update education loan + parents - Step 3
    updateEducationLoanDetails: builder.mutation({
      query: ({ loanApplicationId, data }) => ({
        url: `/education-loans/application/${loanApplicationId}`,
        method: "PATCH",
        body: data,
      }),

      invalidatesTags: (result, error, { loanApplicationId }) => [
        {
          type: "EducationLoan",
          id: loanApplicationId,
        },
        {
          type: "Loan",
          id: loanApplicationId,
        },
        "Loan",
      ],
    }),

    // Update one parent directly
    updateParentEmployment: builder.mutation({
      query: ({ parentId, data }) => ({
        url: `/education-loans/parent/${parentId}`,
        method: "PATCH",
        body: data,
      }),

      invalidatesTags: (result, error, { parentId }) => [
        {
          type: "EducationLoan",
          id: parentId,
        },
      ],
    }),
  }),
});

export const {
  useGetEducationLoanDetailsQuery,
  useCreateEducationLoanDetailsMutation,
  useUpdateEducationLoanDetailsMutation,
  useUpdateParentEmploymentMutation,
} = educationLoanApi;
