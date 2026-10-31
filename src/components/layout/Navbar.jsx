import { Bell, Search } from "lucide-react";

function Navbar() {
  return (
    <header className="navbar">
      <div>
        <h2>Financial Overview</h2>
        <p>Manage your money with confidence.</p>
      </div>

      <div className="navbar-actions">
        <button className="icon-button" aria-label="Search">
          <Search size={19} />
        </button>

        <button className="icon-button" aria-label="Notifications">
          <Bell size={19} />
        </button>

        <div className="navbar-avatar">AP</div>
      </div>
    </header>
  );
}

export default Navbar;