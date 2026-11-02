import { Routes, Route } from "react-router-dom";

import DashboardLayout from "./components/layout/DashboardLayout";

import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Budgets from "./pages/Budgets";
import Analytics from "./pages/Analytics";
import SavingsGoals from "./pages/SavingsGoals";
import Notifications from "./pages/Notifications";
import Settings from "./pages/Settings";

function App() {
  return (
    <Routes>
      <Route path="/" element={<DashboardLayout />}>
        <Route index element={<Dashboard />} />

        <Route path="transactions" element={<Transactions />} />

        <Route path="budgets" element={<Budgets />} />

        <Route path="analytics" element={<Analytics />} />

        <Route path="savings-goals" element={<SavingsGoals />} />

        <Route path="notifications" element={<Notifications />} />

        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}

export default App;