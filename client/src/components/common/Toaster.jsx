import { Toaster } from "react-hot-toast";

export default function AppToaster() {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      gutter={8}
      toastOptions={{
        duration: 4000,
        style: {
          background: "#ffffff",
          color: "#111827",
          border: "1px solid #e5e7eb",
          borderRadius: "12px",
          boxShadow:
            "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
          padding: "12px 16px",
          fontSize: "14px",
          fontWeight: 500,
        },
        success: {
          iconTheme: {
            primary: "#16a34a",
            secondary: "#ffffff",
          },
        },
        error: {
          iconTheme: {
            primary: "#dc2626",
            secondary: "#ffffff",
          },
        },
      }}
    />
  );
}
