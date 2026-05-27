import { Outlet } from "react-router-dom";
import { useState } from "react";
import { Sidebar } from "../components/Sidebar.jsx";
import { Header } from "../components/Header.jsx";
import { useIsMobile } from "../hooks/use-mobile.jsx";

function PatientLayout() {
  const isMobile = useIsMobile();

  const [isOpen, setIsOpen] = useState(!isMobile);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-100">
      {/* Sidebar */}
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

      {/* Right Side */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <Header onMenuClick={() => setIsOpen(!isOpen)} />

        {/* Scrollable Content Only */}
        <main className="flex-1 overflow-y-auto p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default PatientLayout;
