import { configureStore } from "@reduxjs/toolkit";

import { baseApi } from "./api/baseApi";
import "@/features/auth/authApi";
import "@/features/loan/api/studentLoanApi";
import "@/features/loan/api/schoolLoanApi";
import "@/features/loan/api/institutionApi";
import "@/features/loan/api/existingLoanApi";
import "@/features/loan/api/businessRegistrationApi";
import "@/features/loan/api/loanApi";
import "@/features/loan/api/loanDocumentApi";
import "@/features/admin/api/adminLoanApi";
import "@/features/emi/api/emiApi";
import "@/features/dashboard/dashboardApi";
import "@/features/profile/api/profileApi";

import authReducer from "@/features/auth/authSlice";

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,

    auth: authReducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),

  devTools: import.meta.env.MODE !== "production",
});
