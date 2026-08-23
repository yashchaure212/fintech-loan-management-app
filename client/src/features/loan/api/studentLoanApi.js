import { baseApi } from "@/app/api/baseApi";

export const studentLoanApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getStudentLoanDetails: builder.query({
      query: (loanApplicationId) => ({
        url: `/student-loans/application/${loanApplicationId}`,
        method: "GET",
      }),
      providesTags: (result, error, loanApplicationId) => [
        { type: "StudentLoan", id: loanApplicationId },
      ],
    }),

    createStudentLoanDetails: builder.mutation({
      query: ({ loanApplicationId, data }) => ({
        url: `/student-loans/application/${loanApplicationId}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: (result, error, { loanApplicationId }) => [
        { type: "StudentLoan", id: loanApplicationId },
        { type: "Loan", id: loanApplicationId },
        "Loan",
      ],
    }),

    updateStudentLoanDetails: builder.mutation({
      query: ({ loanApplicationId, data }) => ({
        url: `/student-loans/application/${loanApplicationId}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { loanApplicationId }) => [
        { type: "StudentLoan", id: loanApplicationId },
        { type: "Loan", id: loanApplicationId },
        "Loan",
      ],
    }),

    updateParentEmployment: builder.mutation({
      query: ({ parentId, data }) => ({
        url: `/student-loans/parent/${parentId}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["StudentLoan"],
    }),
  }),
});

export const {
  useGetStudentLoanDetailsQuery,
  useCreateStudentLoanDetailsMutation,
  useUpdateStudentLoanDetailsMutation,
  useUpdateParentEmploymentMutation,
} = studentLoanApi;
