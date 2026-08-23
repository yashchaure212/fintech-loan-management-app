import { baseApi } from "@/app/api/baseApi";

export const schoolLoanApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get school loan details
    getSchoolLoanDetails: builder.query({
      query: (loanApplicationId) => ({
        url: `/school-loans/application/${loanApplicationId}`,
        method: "GET",
      }),

      providesTags: (result, error, loanApplicationId) => [
        {
          type: "SchoolLoan",
          id: loanApplicationId,
        },
      ],
    }),

    // Create school loan student details - Step 1
    createSchoolLoanDetails: builder.mutation({
      query: ({ loanApplicationId, data }) => ({
        url: `/school-loans/application/${loanApplicationId}`,
        method: "POST",
        body: data,
      }),

      invalidatesTags: (result, error, { loanApplicationId }) => [
        {
          type: "SchoolLoan",
          id: loanApplicationId,
        },
        {
          type: "Loan",
          id: loanApplicationId,
        },
        "Loan",
      ],
    }),

    // Update school loan details (student, co-applicants, loan
    // requirement / education-expense fields) - Steps 1, 2, 5
    updateSchoolLoanDetails: builder.mutation({
      query: ({ loanApplicationId, data }) => ({
        url: `/school-loans/application/${loanApplicationId}`,
        method: "PATCH",
        body: data,
      }),

      invalidatesTags: (result, error, { loanApplicationId }) => [
        {
          type: "SchoolLoan",
          id: loanApplicationId,
        },
        {
          type: "Loan",
          id: loanApplicationId,
        },
        "Loan",
      ],
    }),

    // Update one co-applicant (personal / family / address / employment)
    updateSchoolLoanCoApplicant: builder.mutation({
      query: ({ coApplicantId, data }) => ({
        url: `/school-loans/co-applicant/${coApplicantId}`,
        method: "PATCH",
        body: data,
      }),

      invalidatesTags: (result, error, { coApplicantId, loanApplicationId }) => [
        {
          type: "SchoolLoan",
          id: loanApplicationId,
        },
        {
          type: "SchoolLoan",
          id: coApplicantId,
        },
      ],
    }),
  }),
});

export const {
  useGetSchoolLoanDetailsQuery,
  useCreateSchoolLoanDetailsMutation,
  useUpdateSchoolLoanDetailsMutation,
  useUpdateSchoolLoanCoApplicantMutation,
} = schoolLoanApi;
