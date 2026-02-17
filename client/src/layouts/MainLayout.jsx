import Navbar from "../components/common/layout/Navbar";
import Sidebar from "../components/common/layout/Sidebar";
import { useSidebar } from "../context/SidebarContext";

const MainLayout = ({ children }) => {
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
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
