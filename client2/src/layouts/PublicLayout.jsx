import { Outlet } from "react-router-dom";
import Navbar from "@/components/navigation/navigation/Navbar";
import BottomNav from "@/components/navigation/BottomNav";
import AssistantFloatingButton from "@/features/assistant/AssistantFloatingButton";

function PublicLayout() {
  return (
    <div className="app-shell min-h-screen bg-background">
      <Navbar />

      <main className="min-w-0 pb-16 md:pb-0">
        <Outlet />
      </main>

      <AssistantFloatingButton />
      <BottomNav />
    </div>
  );
}

export default PublicLayout;