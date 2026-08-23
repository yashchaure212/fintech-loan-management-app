import { Outlet } from "react-router-dom";

import Navbar from "@/components/layout/Navbar";

function AdminLayout() {
  return (
    <div className="app-shell min-h-screen bg-background">
      <Navbar />

      <div className="flex min-h-[calc(100vh-4.25rem)]">
        <main className="min-w-0 flex-1">
          <div className="page-container pb-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
