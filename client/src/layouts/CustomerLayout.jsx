import { Outlet } from "react-router-dom";

import Navbar from "@/components/layout/Navbar";
import MobileBottomNav from "@/components/layout/MobileBottomNav";

function CustomerLayout() {
  return (
    <div className="min-h-screen bg-background">
      {/* Customer top navigation */}
      <Navbar />

      {/* Page content */}
      <main className="min-w-0">
        <div className="page-container pb-24 lg:pb-8">
          <Outlet />
        </div>
      </main>

      {/* Mobile customer navigation */}
      <MobileBottomNav />
    </div>
  );
}

export default CustomerLayout;
