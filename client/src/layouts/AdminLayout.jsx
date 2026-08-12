import { useState } from "react";
import { Outlet } from "react-router-dom";

import Navbar from "@/components/layout/Navbar";
import AdminSidebar from "@/components/layout/AdminSidebar";
import AdminMobileSidebar from "@/components/layout/AdminMobileSidebar";
import AdminMobileBottomNav from "@/components/layout/AdminMobileBottomNav";

function AdminLayout() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Navbar onMenuClick={() => setMenuOpen(true)} />

      <div className="flex min-h-[calc(100vh-4rem)]">
        <AdminSidebar />

        <main className="min-w-0 flex-1 pb-24 lg:pb-8">
          <div className="page-container">
            <Outlet />
          </div>
        </main>
      </div>

      <AdminMobileSidebar open={menuOpen} setOpen={setMenuOpen} />
      <AdminMobileBottomNav />
    </div>
  );
}

export default AdminLayout;
