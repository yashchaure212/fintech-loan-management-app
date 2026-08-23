import { Outlet } from "react-router-dom";

import Navbar from "@/components/layout/Navbar";

function CustomerLayout() {
  return (
    <div className="app-shell min-h-screen">
      <Navbar />

      <main className="min-w-0">
        <div className="page-container pb-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default CustomerLayout;
