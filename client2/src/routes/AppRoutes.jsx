import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import PublicLayout from "@/layouts/PublicLayout";
import CustomerLayout from "@/layouts/CustomerLayout";
import AdminLayout from "@/layouts/AdminLayout";

import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";

import Landing from "@/pages/Landing";
import NotFound from "@/pages/NotFound";

import Login from "@/features/auth/pages/Login";
import Register from "@/features/auth/pages/Register";
import ForgotPassword from "@/features/auth/pages/ForgotPassword";
import ResetPassword from "@/features/auth/pages/ResetPassword";

import Profile from "@/pages/Profile";
import EmiCalculator from "@/pages/EmiCalculator";

const Dashboard = lazy(() => import("@/features/dashboard/pages/Dashboard"));
const ApplyLoan = lazy(() => import("@/features/loan/pages/ApplyLoan"));
const MyLoans = lazy(() => import("@/features/loan/pages/MyLoans"));
const LoanDetails = lazy(() => import("@/features/loan/pages/LoanDetails"));
const EmiPayments = lazy(() => import("@/features/emi/pages/EmiPayments"));

const AdminDashboard = lazy(
  () => import("@/features/admin/pages/AdminDashboard"),
);
const AdminLoans = lazy(() => import("@/features/admin/pages/AdminLoans"));
const AdminLoanDetails = lazy(
  () => import("@/features/admin/pages/AdminLoanDetails"),
);

function RouteLoader() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center px-4">
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />
        <p className="text-sm font-medium text-primary">Loading...</p>
      </div>
    </div>
  );
}

function AppRoutes() {
  return (
    <BrowserRouter>
      <Suspense fallback={<RouteLoader />}>
        <Routes>
          {/* PUBLIC ROUTES */}
          <Route element={<PublicLayout />}>
            <Route element={<PublicRoute />}>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
            </Route>

            <Route path="/emi-calculator" element={<EmiCalculator />} />
          </Route>

          {/* CUSTOMER ROUTES */}
          <Route element={<ProtectedRoute role="CUSTOMER" />}>
            <Route path="/customer" element={<CustomerLayout />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="profile" element={<Profile />} />

              <Route path="loans/apply" element={<ApplyLoan />} />
              <Route path="loans/:id/edit" element={<ApplyLoan />} />
              <Route path="loans" element={<MyLoans />} />
              <Route path="loans/:id" element={<LoanDetails />} />

              <Route path="payments" element={<EmiPayments />} />
            </Route>
          </Route>

          {/* ADMIN ROUTES */}
          <Route element={<ProtectedRoute role="ADMIN" />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="loans" element={<AdminLoans />} />
              <Route path="loans/:id" element={<AdminLoanDetails />} />
            </Route>
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default AppRoutes;
