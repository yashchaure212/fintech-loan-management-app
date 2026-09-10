import { Outlet } from "react-router-dom";
import Navbar from "@/components/navigation/navigation/Navbar";
import BottomNav from "@/components/navigation/BottomNav";
import AssistantFloatingButton from "@/features/assistant/AssistantFloatingButton";

function CustomerLayout() {
  return (
    <div className="app-shell min-h-screen bg-background">
      <Navbar />

      <main className="min-w-0 pb-16 md:pb-0">
        <div className="page-container pb-8">
          <Outlet />
        </div>
      </main>

      <AssistantFloatingButton />
      <BottomNav />
    </div>
  );
}

export default CustomerLayout;