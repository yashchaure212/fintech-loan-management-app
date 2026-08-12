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
import Profile from "@/pages/Profile";
import Dashboard from "@/features/dashboard/pages/Dashboard";
import ApplyLoan from "@/features/loan/pages/ApplyLoan";
import MyLoans from "@/features/loan/pages/MyLoans";
import AdminDashboard from "@/features/admin/pages/AdminDashboard";
import AdminLoans from "@/features/admin/pages/AdminLoans";
import AdminLoanDetails from "@/features/admin/pages/AdminLoanDetails";
import LoanDetails from "@/features/loan/pages/LoanDetails";
import EmiCalculator from "@/pages/EmiCalculator";
import EmiPayments from "@/features/emi/pages/EmiPayments";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC ROUTES */}

        <Route element={<PublicLayout />}>
          <Route element={<PublicRoute />}>
            <Route path="/" element={<Landing />} />

            <Route path="/login" element={<Login />} />

            <Route path="/register" element={<Register />} />
          </Route>

          <Route path="/emi-calculator" element={<EmiCalculator />} />
        </Route>

        {/* CUSTOMER ROUTES */}

        <Route element={<ProtectedRoute role="CUSTOMER" />}>
          <Route path="/customer" element={<CustomerLayout />}>
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

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
