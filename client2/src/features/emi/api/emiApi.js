import { baseApi } from "@/app/api/baseApi";

export const emiApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPendingEmis: builder.query({
      query: () => ({
        url: "/emi/pending",
        method: "GET",
      }),
      providesTags: ["Emi", "Dashboard"],
    }),

    getLoanEmiSchedule: builder.query({
      query: (loanId) => ({
        url: `/emi/loan/${loanId}`,
        method: "GET",
      }),
      providesTags: (result, error, loanId) => [
        { type: "Emi", id: loanId },
      ],
    }),

    createEmiPayment: builder.mutation({
      query: (body) => ({
        url: "/emi-payments",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Emi", "Dashboard", "Loan"],
    }),

    getPaymentConfig: builder.query({
      query: () => "/emi-payments/config",
    }),

    createEmiPaymentOrder: builder.mutation({
      query: (body) => ({
        url: "/emi-payments/orders",
        method: "POST",
        body,
      }),
    }),

    verifyEmiPayment: builder.mutation({
      query: (body) => ({
        url: "/emi-payments/verify",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Emi", "Dashboard", "Loan"],
    }),
  }),
});

export const {
  useGetPendingEmisQuery,
  useGetLoanEmiScheduleQuery,
  useCreateEmiPaymentMutation,
  useGetPaymentConfigQuery,
  useCreateEmiPaymentOrderMutation,
  useVerifyEmiPaymentMutation,
} = emiApi;
