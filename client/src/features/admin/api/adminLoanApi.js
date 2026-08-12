import { baseApi } from "@/app/api/baseApi";

export const adminLoanApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminLoanDashboard: builder.query({
      query: () => "/admin/loans/dashboard",
      providesTags: ["Admin"],
    }),

    getAdminLoans: builder.query({
      query: () => "/admin/loans",
      providesTags: ["Admin"],
    }),

    getAdminLoanById: builder.query({
      query: (id) => `/admin/loans/${id}`,
      providesTags: ["Admin"],
    }),

    updateLoanStatus: builder.mutation({
      query: ({ id, status, remarks }) => ({
        url: `/loan-workflow/${id}/status`,
        method: "PATCH",
        body: {
          status,
          remarks,
        },
      }),
      invalidatesTags: ["Admin"],
    }),

    verifyLoanDocument: builder.mutation({
      query: (documentId) => ({
        url: `/loan-documents/${documentId}/verify`,
        method: "PATCH",
        body: {
          status: "VERIFIED",
        },
      }),
      invalidatesTags: ["Admin"],
    }),

    rejectLoanDocument: builder.mutation({
      query: ({ documentId, rejectionReason }) => ({
        url: `/loan-documents/${documentId}/reject`,
        method: "PATCH",
        body: {
          status: "REJECTED",
          rejectionReason,
        },
      }),
      invalidatesTags: ["Admin"],
    }),
  }),
});

export const {
  useGetAdminLoanDashboardQuery,
  useGetAdminLoansQuery,
  useGetAdminLoanByIdQuery,
  useUpdateLoanStatusMutation,
  useVerifyLoanDocumentMutation,
  useRejectLoanDocumentMutation,
} = adminLoanApi;
