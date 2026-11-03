import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ArrowLeftRight,
  ChartNoAxesCombined,
  Wallet,
  Target,
  Bell,
  Settings,
  CircleDollarSign,
  X
} from "lucide-react";
import { useFinance } from "../../hooks/useFinance";
import { getInitials } from "../../utils/formatters";

const menuItems = [
  { name: "Dashboard", path: "/", icon: LayoutDashboard },
  { name: "Transactions", path: "/transactions", icon: ArrowLeftRight },
  { name: "Analytics", path: "/analytics", icon: ChartNoAxesCombined },
  { name: "Budgets", path: "/budgets", icon: Wallet },
  { name: "Savings Goals", path: "/savings-goals", icon: Target },
  { name: "Notifications", path: "/notifications", icon: Bell, badge: true },
  { name: "Settings", path: "/settings", icon: Settings }
];

function Sidebar({ isOpen, onClose }) {
  const { user, unreadCount } = useFinance();
  const initials = getInitials(user?.name);

  return (
    <aside className={`sidebar ${isOpen ? "open" : ""}`}>
      <div className="brand-header">
        <div className="brand">
          <div className="brand-icon">
            <CircleDollarSign size={26} />
          </div>
          <span>FinTrack</span>
        </div>

        {onClose && (
          <button
            type="button"
            className="mobile-close-btn"
            onClick={onClose}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        )}
      </div>

      <p className="menu-label">MENU</p>

      <nav className="sidebar-menu">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const showBadge = item.badge && unreadCount > 0;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              onClick={() => onClose && onClose()}
              className={({ isActive }) =>
                isActive ? "nav-item active" : "nav-item"
              }
            >
              <Icon size={19} />
              <span className="nav-item-text">{item.name}</span>
              {showBadge && (
                <span className="nav-badge">{unreadCount > 9 ? "9+" : unreadCount}</span>
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="avatar">{initials}</div>
        <div className="sidebar-user-info">
          <strong>{user?.name || "My Account"}</strong>
          <small>{user?.email || "Personal Finance"}</small>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
