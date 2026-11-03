import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

function DashboardLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <div className={`app-layout ${mobileMenuOpen ? "mobile-menu-active" : ""}`}>
      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div
          className="sidebar-backdrop"
          onClick={closeMobileMenu}
          aria-hidden="true"
        />
      )}

      <Sidebar isOpen={mobileMenuOpen} onClose={closeMobileMenu} />

      <main className="main-content">
        <Navbar
          onToggleMenu={toggleMobileMenu}
          isMobileMenuOpen={mobileMenuOpen}
        />
        <div className="page-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default DashboardLayout;
