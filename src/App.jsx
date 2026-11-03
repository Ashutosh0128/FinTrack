import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import DashboardLayout from "./components/layout/DashboardLayout";
import ErrorBoundary from "./components/common/ErrorBoundary";

const Dashboard = lazy(() => import("./pages/Dashboard"));
const Transactions = lazy(() => import("./pages/Transactions"));
const Budgets = lazy(() => import("./pages/Budgets"));
const Analytics = lazy(() => import("./pages/Analytics"));
const SavingsGoals = lazy(() => import("./pages/SavingsGoals"));
const Notifications = lazy(() => import("./pages/Notifications"));
const Settings = lazy(() => import("./pages/Settings"));
const NotFound = lazy(() => import("./pages/NotFound"));

const PageLoadingFallback = () => (
  <div className="page-loader-container">
    <div className="loading-spinner" />
    <span className="loading-text">Loading FinTrack...</span>
  </div>
);

function App() {
  return (
    <ErrorBoundary>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#161D27",
            color: "#F1F5F9",
            border: "1px solid #273140",
            fontSize: "13px",
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.5)",
          },
          success: {
            iconTheme: {
              primary: "#22C55E",
              secondary: "#0B0F14",
            },
          },
          error: {
            iconTheme: {
              primary: "#EF4444",
              secondary: "#0B0F14",
            },
          },
        }}
      />
      <Suspense fallback={<PageLoadingFallback />}>
        <Routes>
          <Route path="/" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="transactions" element={<Transactions />} />
            <Route path="budgets" element={<Budgets />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="savings-goals" element={<SavingsGoals />} />
            {/* Legacy route alias */}
            <Route path="savings" element={<Navigate to="/savings-goals" replace />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="settings" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;
