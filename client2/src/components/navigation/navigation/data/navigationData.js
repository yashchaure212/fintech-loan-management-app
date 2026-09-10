import {
  BookOpen,
  CircleHelp,
  FileText,
  Home,
  ShieldCheck,
  SlidersHorizontal,
} from "lucide-react";

export const adminNavigation = [
  {
    label: "Dashboard",
    path: "/admin/dashboard",
    icon: Home,
  },
  {
    label: "Loan Applications",
    path: "/admin/loans",
    icon: FileText,
  },
  {
    label: "Loan Configuration",
    path: "/admin/loan-configuration",
    icon: SlidersHorizontal,
  },
];

export const customerNavigation = [
  {
    label: "Dashboard",
    path: "/customer/dashboard",
  },
  {
    label: "My Loans",
    path: "/customer/loans",
  },
  {
    label: "Payments",
    path: "/customer/payments",
  },
];

export const publicResources = [
  {
    label: "How It Works",
    hash: "#how-it-works",
    icon: BookOpen,
  },
  {
    label: "Eligibility",
    hash: "#eligibility",
    icon: ShieldCheck,
  },
  {
    label: "FAQs",
    hash: "#faq",
    icon: CircleHelp,
  },
];

export const notificationData = {
  customer: [
    {
      id: 1,
      type: "application",
      title: "Application saved",
      message:
        "Your loan application has been saved. You can continue whenever you're ready.",
      time: "Just now",
      unread: true,
    },
    {
      id: 2,
      type: "document",
      title: "Documents may be required",
      message:
        "Check your application to see which documents are required for the next step.",
      time: "Today",
      unread: true,
    },
    {
      id: 3,
      type: "payment",
      title: "Payment schedule available",
      message:
        "Your repayment schedule is available to view from the payments section.",
      time: "Yesterday",
      unread: false,
    },
    {
      id: 4,
      type: "info",
      title: "Welcome to LoanPro",
      message:
        "You can manage your application, documents and payments from your account.",
      time: "2 days ago",
      unread: false,
    },
  ],

  admin: [
    {
      id: 1,
      type: "application",
      title: "New application received",
      message:
        "A new loan application is ready for review in the admin workspace.",
      time: "Just now",
      unread: true,
    },
    {
      id: 2,
      type: "document",
      title: "Application requires review",
      message:
        "A submitted application has moved to the review stage.",
      time: "Today",
      unread: true,
    },
    {
      id: 3,
      type: "info",
      title: "Configuration update",
      message:
        "Review the current loan product configuration from the admin panel.",
      time: "Yesterday",
      unread: false,
    },
  ],

  guest: [
    {
      id: 1,
      type: "info",
      title: "Welcome to LoanPro",
      message:
        "Explore loan products, calculate your EMI and learn how the application journey works.",
      time: "Today",
      unread: true,
    },
  ],
};