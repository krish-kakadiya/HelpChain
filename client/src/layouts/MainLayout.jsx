import Navbar from "../components/common/layout/Navbar";
import Sidebar from "../components/common/layout/Sidebar";
import { useSidebar } from "../context/SidebarContext";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  const { isOpen } = useSidebar();

  return (
    <div className="app">
      <Navbar />
      <Sidebar />

      <main
        className={`app__main-content ${
          !isOpen ? "app__main-content--sidebar-closed" : ""
        }`}
      >
        <Outlet />   {/* 🔥 This renders Dashboard and other pages */}
      </main>
    </div>
  );
};

export default MainLayout;
