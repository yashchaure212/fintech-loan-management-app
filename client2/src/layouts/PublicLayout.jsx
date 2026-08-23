import { Outlet } from "react-router-dom";

import Navbar from "@/components/layout/Navbar";

function PublicLayout() {
  return (
    <div className="app-shell min-h-screen bg-background">
      <Navbar />

      <main className="min-w-0">
        <Outlet />
      </main>
    </div>
  );
}

export default PublicLayout;
