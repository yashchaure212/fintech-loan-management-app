import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import PublicLayout from "@/layouts/PublicLayout";
import CustomerLayout from "@/layouts/CustomerLayout";
import AdminLayout from "@/layouts/AdminLayout";

import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";

import Landing from "@/pages/public/Landing";
import NotFound from "@/pages/public/NotFound";

import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import ForgotPassword from "@/pages/auth/ForgotPassword";
import ResetPassword from "@/pages/auth/ResetPassword";

import Profile from "@/pages/customer/Profile";
import EmiCalculator from "@/pages/public/EmiCalculator";
import FullPageLoader from "@/components/shared/FullPageLoader";
import Menu from "@/pages/public/Menu";
import More from "@/pages/public/More";
import Services from "@/pages/public/Services";
import HelpCentre from "@/pages/public/HelpCentre";
import FrequentlyAskedQuestions from "@/pages/public/FrequentlyAskedQuestions";
import ContactSupport from "@/pages/public/ContactSupport";
import ReportIssue from "@/pages/public/ReportIssue";
import GrievanceRedressal from "@/pages/public/GrievanceRedressal";
import AboutLoanPro from "@/pages/public/AboutLoanPro";
import LoanGuide from "@/pages/public/LoanGuide";
import Security from "@/pages/public/Security";
import Privacy from "@/pages/public/Privacy";
import Terms from "@/pages/public/Terms";
import LoanTerms from "@/pages/public/LoanTerms";
import NotificationPreferences from "@/pages/customer/NotificationPreferences";
import AppExperience from "@/pages/public/AppExperience";
import KYC from "@/pages/customer/KYC";
import Notifications from "@/pages/customer/Notifications";
import SchoolStudentLoan from "@/features/loan/pages/SchoolStudentLoan";
import Assistant from "@/pages/public/Assistant";

const Dashboard = lazy(() => import("@/features/dashboard/pages/Dashboard"));
const ApplyLoan = lazy(() => import("@/features/loan/pages/ApplyLoan"));
const MyLoans = lazy(() => import("@/features/loan/pages/MyLoans"));
const LoanDetails = lazy(() => import("@/features/loan/pages/LoanDetails"));
const EmiPayments = lazy(() => import("@/features/emi/pages/EmiPayments"));

const AdminLoans = lazy(() => import("@/features/admin/pages/AdminLoans"));
const AdminDashboard = lazy(
  () => import("@/features/admin/pages/AdminDashboard"),
);
const AdminLoanDetails = lazy(
  () => import("@/features/admin/pages/AdminLoanDetails"),
);
const AdminLoanConfiguration = lazy(
  () => import("@/features/admin/pages/AdminLoanConfiguration"),
);

function AppRoutes() {
  return (
    <BrowserRouter>
      <Suspense fallback={<FullPageLoader />}>
        <Routes>
          {/* PUBLIC ROUTES */}
          <Route element={<PublicLayout />}>
            <Route element={<PublicRoute />}>
              <Route path="/" element={<Landing />} />
              <Route path="/menu" element={<Menu />} />
              <Route path="/login" element={<Login />} />
              <Route path="/more" element={<More />} />
              <Route path="/services" element={<Services />} />
              <Route path="/help" element={<HelpCentre />} />
              <Route path="/faq" element={<FrequentlyAskedQuestions />} />
              <Route path="/contact-support" element={<ContactSupport />} />
              <Route path="/report-issue" element={<ReportIssue />} />
              <Route path="/grievance" element={<GrievanceRedressal />} />
              <Route path="/app-experience" element={<AppExperience />} />
              <Route path="/about" element={<AboutLoanPro />} />
              <Route path="/loan-guide" element={<LoanGuide />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/security" element={<Security />} />
              <Route path="/register" element={<Register />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/loan-terms" element={<LoanTerms />} />
              <Route path="/assistant" element={<Assistant />} />
              <Route
                path="/notification-preferences"
                element={<NotificationPreferences />}
              />
              <Route
                path="/school-student-loan"
                element={<SchoolStudentLoan />}
              />
              <Route path="/notifications" element={<Notifications />} />
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
              <Route path="kyc" element={<KYC />} />

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
              <Route
                path="loan-configuration"
                element={<AdminLoanConfiguration />}
              />
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
