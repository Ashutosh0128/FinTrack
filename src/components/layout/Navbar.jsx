import { Link, useLocation } from "react-router-dom";
import { Bell, Menu, X } from "lucide-react";
import { useFinance } from "../../hooks/useFinance";
import { getInitials } from "../../utils/formatters";

const pageTitles = {
  "/": {
    title: "Financial Overview",
    subtitle: "Manage your money and analytics with confidence."
  },
  "/transactions": {
    title: "Transactions",
    subtitle: "Track, filter and manage income and expense records."
  },
  "/analytics": {
    title: "Analytics & Trends",
    subtitle: "Gain insights into your cash flow and spending patterns."
  },
  "/budgets": {
    title: "Budget Management",
    subtitle: "Set category limits and control monthly expenditure."
  },
  "/savings-goals": {
    title: "Savings Goals",
    subtitle: "Plan ahead and track milestones for your targets."
  },
  "/notifications": {
    title: "Notifications",
    subtitle: "Alerts, updates and budget limit notifications."
  },
  "/settings": {
    title: "Settings",
    subtitle: "Customize your profile and application preferences."
  }
};

function Navbar({ onToggleMenu, isMobileMenuOpen }) {
  const location = useLocation();
  const { user, unreadCount } = useFinance();
  const initials = getInitials(user?.name);

  const pageInfo = pageTitles[location.pathname] || {
    title: "FinTrack",
    subtitle: "Personal Finance & Analytics Platform"
  };

  return (
    <header className="navbar">
      <div className="navbar-left">
        <button
          type="button"
          className="mobile-menu-toggle"
          onClick={onToggleMenu}
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        <div className="navbar-heading">
          <h2>{pageInfo.title}</h2>
          <p>{pageInfo.subtitle}</p>
        </div>
      </div>

      <div className="navbar-actions">
        <Link
          to="/notifications"
          className="icon-button notification-bell-btn"
          aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ""}`}
        >
          <Bell size={19} />
          {unreadCount > 0 && (
            <span className="bell-badge">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Link>

        <Link
          to="/settings"
          className="navbar-avatar-link"
          title={`Signed in as ${user?.name || "User"}`}
        >
          <div className="navbar-avatar">{initials}</div>
        </Link>
      </div>
    </header>
  );
}

export default Navbar;
