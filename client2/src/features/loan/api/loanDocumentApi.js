import { baseApi } from "@/app/api/baseApi";

export const loanDocumentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getLoanDocuments: builder.query({
      query: (loanApplicationId) => ({
        url: `/loan-documents/application/${loanApplicationId}`,
        method: "GET",
      }),

      providesTags: (result, error, loanApplicationId) => [
        {
          type: "LoanDocument",
          id: `APPLICATION-${loanApplicationId}`,
        },
        ...(Array.isArray(result?.data) ? result.data : []).map((document) => ({
          type: "LoanDocument",
          id: document.id,
        })),
      ],
    }),

    uploadLoanDocument: builder.mutation({
      query: ({ file, loanApplicationId, ownerType, documentType }) => {
        const formData = new FormData();

        formData.append("file", file);
        formData.append("loanApplicationId", loanApplicationId);
        formData.append("ownerType", ownerType);
        formData.append("documentType", documentType);

        return {
          url: "/loan-documents",
          method: "POST",
          body: formData,
        };
      },

      invalidatesTags: (result, error, { loanApplicationId }) => [
        {
          type: "LoanDocument",
          id: `APPLICATION-${loanApplicationId}`,
        },
        {
          type: "LoanDocument",
          id: `CHECKLIST-${loanApplicationId}`,
        },
        {
          type: "Loan",
          id: loanApplicationId,
        },
      ],
    }),

    deleteLoanDocument: builder.mutation({
      query: ({ documentId }) => ({
        url: `/loan-documents/${documentId}`,
        method: "DELETE",
      }),

      invalidatesTags: (result, error, { loanApplicationId, documentId }) => [
        {
          type: "LoanDocument",
          id: documentId,
        },
        {
          type: "LoanDocument",
          id: `APPLICATION-${loanApplicationId}`,
        },
        {
          type: "LoanDocument",
          id: `CHECKLIST-${loanApplicationId}`,
        },
        {
          type: "Loan",
          id: loanApplicationId,
        },
      ],
    }),

    /*
     * The document checklist is resolved by the backend: which slots
     * apply to THIS application, their customer-facing labels and their
     * customer-facing state. The UI renders exactly this list, so the
     * screen and the submission validator can never disagree.
     */
    getLoanDocumentChecklist: builder.query({
      query: (loanApplicationId) => ({
        url: `/loan-documents/application/${loanApplicationId}/checklist`,
        method: "GET",
      }),

      providesTags: (result, error, loanApplicationId) => [
        {
          type: "LoanDocument",
          id: `CHECKLIST-${loanApplicationId}`,
        },
        {
          type: "LoanDocument",
          id: `APPLICATION-${loanApplicationId}`,
        },
      ],
    }),

    getRequiredLoanDocuments: builder.query({
      query: (loanApplicationId) => ({
        url: `/loan-documents/application/${loanApplicationId}/requirements`,
        method: "GET",
      }),

      providesTags: (result, error, loanApplicationId) => [
        {
          type: "LoanDocument",
          id: `REQUIREMENTS-${loanApplicationId}`,
        },
      ],
    }),
  }),
});

export const {
  useGetLoanDocumentChecklistQuery,
  useGetLoanDocumentsQuery,
  useUploadLoanDocumentMutation,
  useDeleteLoanDocumentMutation,
  useGetRequiredLoanDocumentsQuery,
} = loanDocumentApi;
