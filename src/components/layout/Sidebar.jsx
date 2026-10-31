import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ArrowLeftRight,
  ChartNoAxesCombined,
  Wallet,
  Target,
  Settings,
  CircleDollarSign
} from "lucide-react";

const menuItems = [
  { name: "Dashboard", path: "/", icon: LayoutDashboard },
  { name: "Transactions", path: "/transactions", icon: ArrowLeftRight },
  { name: "Analytics", path: "/analytics", icon: ChartNoAxesCombined },
  { name: "Budgets", path: "/budgets", icon: Wallet },
  { name: "Savings Goals", path: "/savings", icon: Target },
  { name: "Settings", path: "/settings", icon: Settings }
];

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-icon">
          <CircleDollarSign size={25} />
        </div>
        <span>FinTrack</span>
      </div>

      <p className="menu-label">MENU</p>

      <nav className="sidebar-menu">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                isActive ? "nav-item active" : "nav-item"
              }
            >
              <Icon size={19} />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="avatar">AP</div>
        <div>
          <strong>My Account</strong>
          <small>Personal Finance</small>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;