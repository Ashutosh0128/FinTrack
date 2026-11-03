import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  ArrowRight,
  Wallet,
  Target,
  Calendar
} from "lucide-react";

import { useFinance } from "../hooks/useFinance";
import { calculateTotals, getCurrentMonthString } from "../utils/calculations";
import { formatCurrency, formatMonthYear } from "../utils/formatters";

import SummaryCard from "../components/dashboard/SummaryCard";
import IncomeExpenseChart from "../components/dashboard/IncomeExpenseChart";
import CategoryChart from "../components/dashboard/CategoryChart";
import RecentTransactions from "../components/dashboard/RecentTransactions";

function Dashboard() {
  const { state, currency, user } = useFinance();
  const [currentDate] = useState(() => new Date());

  const transactions = state?.transactions;
  const budgets = state?.budgets;
  const goals = state?.goals;

  const [categoryView, setCategoryView] = useState("current"); // 'current' | 'all'

  const currentMonthStr = useMemo(() => getCurrentMonthString(), []);
  const currentMonthLabel = useMemo(
    () => formatMonthYear(currentMonthStr),
    [currentMonthStr]
  );

  // Overall Financial Totals
  const totals = useMemo(() => {
    return calculateTotals(transactions || []);
  }, [transactions]);

  // Income vs Expenses over last 6 months
  const monthlyData = useMemo(() => {
    const result = [];
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const txList = transactions || [];

    for (let i = 5; i >= 0; i--) {
      const targetDate = new Date(currentYear, currentMonth - i, 1);
      const targetYear = targetDate.getFullYear();
      const targetMonthIndex = targetDate.getMonth();
      const monthKey = `${targetYear}-${String(targetMonthIndex + 1).padStart(2, "0")}`;

      let income = 0;
      let expenses = 0;

      txList.forEach((tx) => {
        if (!tx || !tx.date) return;
        const txMonthKey = tx.date.slice(0, 7);

        if (txMonthKey === monthKey) {
          const amt = Number(tx.amount) || 0;
          if (tx.type === "income") {
            income += amt;
          } else if (tx.type === "expense") {
            expenses += amt;
          }
        }
      });

      result.push({
        month: targetDate.toLocaleDateString("en-IN", { month: "short" }),
        income,
        expenses
      });
    }

    return result;
  }, [transactions, currentDate]);

  // Category breakdown for Current Month vs All Time
  const categoryData = useMemo(() => {
    const categoryTotals = {};
    const txList = transactions || [];

    txList.forEach((tx) => {
      if (!tx || tx.type !== "expense") return;

      if (categoryView === "current") {
        if (tx.date && tx.date.slice(0, 7) !== currentMonthStr) {
          return;
        }
      }

      const category = tx.category || "Other";
      const amt = Number(tx.amount) || 0;
      categoryTotals[category] = (categoryTotals[category] || 0) + amt;
    });

    return Object.entries(categoryTotals)
      .map(([category, amount]) => ({
        category,
        amount
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [transactions, categoryView, currentMonthStr]);

  // Budget progress calculations for current month
  const activeBudgets = useMemo(() => {
    const budgetList = budgets || [];
    const txList = transactions || [];

    return budgetList.filter((b) => b.month === currentMonthStr).map((budget) => {
      const spent = txList
        .filter(
          (t) =>
            t.type === "expense" &&
            t.category === budget.category &&
            t.date &&
            t.date.slice(0, 7) === budget.month
        )
        .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

      const limit = Number(budget.limit) || 0;
      const percentage = limit > 0 ? (spent / limit) * 100 : 0;

      return {
        ...budget,
        spent,
        limit,
        percentage,
        remaining: limit - spent
      };
    });
  }, [budgets, transactions, currentMonthStr]);

  // Top savings goals overview
  const topGoals = useMemo(() => {
    const goalList = goals || [];
    return [...goalList].slice(0, 3).map((g) => {
      const saved = Number(g.savedAmount) || 0;
      const target = Number(g.targetAmount) || 0;
      const percentage = target > 0 ? Math.min((saved / target) * 100, 100) : 0;
      return {
        ...g,
        saved,
        target,
        percentage
      };
    });
  }, [goals]);

  return (
    <div className="dashboard-page">
      {/* Header section with welcome and quick action */}
      <div className="page-header">
        <div>
          <h1>Welcome back, {user?.name?.split(" ")[0] || "there"}</h1>
          <p>Here is your financial pulse and analytics overview for {currentMonthLabel}.</p>
        </div>

        <div className="dashboard-header-actions">
          <div className="dashboard-date">
            <Calendar size={15} />
            <span>{currentMonthLabel}</span>
          </div>

          <Link to="/transactions" className="primary-button">
            <Plus size={16} /> Add Transaction
          </Link>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="summary-grid">
        <SummaryCard
          title="Net Balance"
          value={formatCurrency(totals.balance, currency)}
          type="balance"
          subtitle="All-time net position"
        />

        <SummaryCard
          title="Total Income"
          value={formatCurrency(totals.income, currency)}
          type="income"
          subtitle="Cumulative earnings"
        />

        <SummaryCard
          title="Total Expenses"
          value={formatCurrency(totals.expenses, currency)}
          type="expense"
          subtitle="Cumulative expenditure"
        />

        <SummaryCard
          title="Net Savings"
          value={formatCurrency(totals.savings, currency)}
          type="savings"
          subtitle={`Savings rate: ${totals.savingsRate.toFixed(1)}%`}
        />
      </div>

      {/* Charts Section */}
      <div className="dashboard-charts">
        <IncomeExpenseChart data={monthlyData} currency={currency} />

        <div>
          <div className="category-chart-wrapper">
            <div className="chart-view-toggle">
              <button
                type="button"
                className={`chart-toggle-btn ${categoryView === "current" ? "active" : ""}`}
                onClick={() => setCategoryView("current")}
              >
                {currentMonthLabel}
              </button>
              <button
                type="button"
                className={`chart-toggle-btn ${categoryView === "all" ? "active" : ""}`}
                onClick={() => setCategoryView("all")}
              >
                All Time
              </button>
            </div>

            <CategoryChart
              data={categoryData}
              currency={currency}
              subtitle={
                categoryView === "current"
                  ? `Expenses for ${currentMonthLabel}`
                  : "All-time spending by category"
              }
            />
          </div>
        </div>
      </div>

      {/* Bottom Section: Recent Transactions + Budget & Goals Overview */}
      <div className="dashboard-bottom">
        <RecentTransactions transactions={transactions || []} currency={currency} />

        <div className="dashboard-side-panels">
          {/* Active Budgets Overview Widget */}
          <div className="dashboard-panel">
            <div className="panel-heading">
              <div>
                <h3>Monthly Budgets</h3>
                <p>{currentMonthLabel} limits</p>
              </div>
              <Link to="/budgets" className="panel-link">
                Manage <ArrowRight size={14} />
              </Link>
            </div>

            {activeBudgets.length > 0 ? (
              <div className="dashboard-budget-list">
                {activeBudgets.slice(0, 3).map((b) => {
                  const status =
                    b.percentage >= 100
                      ? "over-budget"
                      : b.percentage >= 80
                      ? "near-limit"
                      : "within-budget";

                  return (
                    <div key={b.id} className="dashboard-budget-item">
                      <div className="budget-item-top">
                        <span className="budget-category-label">{b.category}</span>
                        <span className="budget-spent-label">
                          {formatCurrency(b.spent, currency)} / {formatCurrency(b.limit, currency)}
                        </span>
                      </div>
                      <div className="progress-track">
                        <div
                          className={`progress-fill ${status}`}
                          style={{ width: `${Math.min(b.percentage, 100)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="empty-state">
                <Wallet size={20} className="empty-state-icon" />
                <p>No active budgets for {currentMonthLabel}.</p>
                <Link to="/budgets" className="panel-text-link">Create a budget</Link>
              </div>
            )}
          </div>

          {/* Savings Goals Overview Widget */}
          <div className="dashboard-panel">
            <div className="panel-heading">
              <div>
                <h3>Savings Goals</h3>
                <p>Progress towards targets</p>
              </div>
              <Link to="/savings-goals" className="panel-link">
                View all <ArrowRight size={14} />
              </Link>
            </div>

            {topGoals.length > 0 ? (
              <div className="dashboard-goals-list">
                {topGoals.map((g) => (
                  <div key={g.id} className="dashboard-goal-item">
                    <div className="goal-item-top">
                      <span className="goal-title-label">{g.title}</span>
                      <span className="goal-pct-label">{g.percentage.toFixed(0)}%</span>
                    </div>
                    <div className="progress-track">
                      <div
                        className="progress-fill"
                        style={{ width: `${g.percentage}%` }}
                      />
                    </div>
                    <div className="goal-item-bottom">
                      <small>
                        {formatCurrency(g.saved, currency)} of {formatCurrency(g.target, currency)}
                      </small>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <Target size={20} className="empty-state-icon" />
                <p>No savings goals set up yet.</p>
                <Link to="/savings-goals" className="panel-text-link">Add a goal</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
