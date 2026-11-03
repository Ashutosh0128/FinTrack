# FinTrack – Personal Finance & Expense Analytics Platform

[![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-purple.svg)](https://vitejs.dev/)
[![React Router](https://img.shields.io/badge/React_Router-7-red.svg)](https://reactrouter.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

FinTrack is a modern, responsive personal finance and expense analytics web application built with React 19 and Vite. It empowers users to monitor their cash flow, manage category-based monthly budgets, track savings milestones, and gain actionable financial insights through interactive charts and real-time alerts.

Designed with a fintech dark design system (`#0B0F14`, `#161D27`, `#22C55E`), FinTrack delivers a software-as-a-service (SaaS) experience directly in the browser with full client-side state persistence.

---

## Table of Contents

- [Key Features](#key-features)
- [Architecture & State Management](#architecture--state-management)
- [Tech Stack](#tech-stack)
- [Design System & Palette](#design-system--palette)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Screenshots & Showcase](#screenshots--showcase)
- [Manual Testing Checklist](#manual-testing-checklist)
- [GitHub Presentation Guidance](#github-presentation-guidance)

---

## Key Features

### 1. Dashboard Overview
- **Real-Time Financial Totals**: Net Balance, Total Income, Total Expenses, Net Savings, and Savings Rate updated dynamically.
- **Income vs Expenses Comparison**: 6-month historical cash flow bar chart powered by Recharts with custom tooltips.
- **Category Expense Breakdown**: Interactive donut chart with current month vs all-time view toggles.
- **Recent Transactions Feed**: Quick view of latest income and expense activities with type badges.
- **Active Budget & Goal Widgets**: Visual progress bars showing current month's budget utilization and goal milestones.

### 2. Transaction Management
- **Full CRUD Operations**: Create, view, edit, and delete transactions.
- **Dynamic Category Sync**: Unified income and expense categories (Salary, Freelance, Food, Shopping, Travel, Bills, etc.).
- **Advanced Filtering & Search**: Instant case-insensitive search by title/notes, type filtering (Income/Expense), category dropdown, date range picker (From/To), and sorting (Newest, Oldest, Highest, Lowest).
- **Accidental Deletion Protection**: Custom confirmation modal dialog preventing accidental data loss.
- **Live Notifications**: Toast notifications via `react-hot-toast` for user actions.

### 3. Monthly Budget Management
- **Category Limits**: Set monthly spending limits per expense category.
- **Month Selector**: Easily browse budgets across any current, past, or future month.
- **Utilization Gauges**: Color-coded progress bars (Normal `<80%`, Near Limit `80-99%`, Over Budget `≥100%`).
- **Duplicate Prevention**: Rejects duplicate budgets for the same category and month with clear feedback.
- **Smart Notification Triggers**: Dispatches alerts when spending hits 80% or exceeds 100%, with deduplication keys to prevent spam.

### 4. Interactive Financial Analytics
- **Flexible Timeframes**: Analyze cash flow over 3-month, 6-month, or 12-month periods.
- **Synchronized Visuals**: Interactive comparison charts and category distribution with dark-themed tooltips.
- **Detailed Monthly Report Table**: Tabular breakdown of monthly income, expenses, net savings, and savings rate.
- **Zero-Data Resilience**: Graceful empty states when transactions are sparse.

### 5. Savings Goals
- **Milestone Tracking**: Define target amounts, track current deposits, and set target completion deadlines.
- **Deposit / Contribution Flow**: In-app contribution modal with quick preset chips (`+₹500`, `+₹1000`, `+₹2500`, `+₹5000`, or Full Remaining).
- **Progress Badges**: Real-time progress percentage, overdue indicator for past deadlines, and completion celebrations.

### 6. Notifications Center
- **Activity & Alert History**: Budget limit alerts, contribution receipts, and platform updates.
- **Read / Unread State Management**: Filter unread count badges in Navbar and Sidebar.
- **Batch Actions**: One-click "Mark All Read" and "Clear All Notifications" with confirmation.

### 7. Regional Preferences & Data Settings
- **Multi-Currency Support**: Switch seamlessly between **INR (₹)**, **USD ($)**, **EUR (€)**, and **GBP (£)** with instant global UI updates.
- **User Profile Management**: Update personal name and contact email with immediate header and avatar synchronization.
- **Safe Data Reset**: Restore factory seed dataset with a confirmation dialog.

---

## Architecture & State Management

FinTrack follows a clean, decoupled architecture:

```
┌────────────────────────────────────────────────────────┐
│                     React 19 UI                        │
│  (Dashboard, Transactions, Budgets, Analytics, Goals) │
└───────────────▲────────────────────────▲───────────────┘
                │                        │
         useFinance Hook          UI Components
                │                        │
┌───────────────▼────────────────────────▼───────────────┐
│               Central Finance Context                  │
│       (State, Dispatch, Active Currency, User Profile) │
└──────────────────────────▲─────────────────────────────┘
                           │
                 financeReducer (Pure)
             (Immutable actions & updates)
                           │
┌──────────────────────────▼─────────────────────────────┐
│                 storageService.js                      │
│        (Schema validation & localStorage sync)         │
└────────────────────────────────────────────────────────┘
```

- **Unidirectional Data Flow**: Powered by React Context API and `useReducer`.
- **Zero Render Loops**: All memoized calculations use stable references from state.
- **Purity & React Compiler Ready**: Eliminates impure calls during rendering; dates are initialized via functional state or localized utilities.
- **Route-Based Code Splitting**: `React.lazy` and `Suspense` chunk every page independently, reducing initial bundle size to < 290 kB.
- **Error Boundary**: Catches unexpected runtime errors and offers a one-click reload without losing persisted state.

---

## Tech Stack

| Technology | Purpose |
|---|---|
| **React 19** | Modern UI library with concurrent features and hooks |
| **Vite 8** | High-performance build tool and development server |
| **React Router v7** | Single Page Application (SPA) declarative routing |
| **Recharts v3** | Responsive, composable SVG charts |
| **Lucide React** | Consistent, modern fintech iconography |
| **React Hot Toast** | Minimalist toast notifications |
| **UUID v14** | Unique identifier generation for records |

---

## Design System & Palette

FinTrack follows a dark-mode fintech aesthetic:

| Token | Hex Value | Usage |
|---|---|---|
| **Main Background** | `#0B0F14` | Primary viewport background |
| **Sidebar Background** | `#111720` | Navigation drawer and headers |
| **Card Background** | `#161D27` | Content cards, widgets, panels |
| **Border / Divider** | `#273140` | Subtle boundaries and table lines |
| **Primary Accent** | `#22C55E` | Positive cash flow, actions, active states |
| **Danger Accent** | `#EF4444` | Negative cash flow, over-budget alerts |
| **Main Text** | `#F1F5F9` | High-contrast headings and primary labels |
| **Muted Text** | `#94A3B8` | Subtitles, helper text, and placeholders |

---

## Project Structure

```
fintrack/
├── public/                 # Static assets (favicons, manifest)
├── src/
│   ├── assets/             # Brand logos and images
│   ├── components/
│   │   ├── common/         # Button, Modal, ConfirmModal, ErrorBoundary
│   │   ├── dashboard/      # SummaryCard, IncomeExpenseChart, CategoryChart, RecentTransactions
│   │   └── layout/         # DashboardLayout, Navbar, Sidebar
│   ├── context/            # FinanceContext, Context Provider, Instance
│   ├── data/               # Seed initialData
│   ├── features/
│   │   ├── budgets/        # BudgetForm, BudgetList
│   │   ├── goals/          # GoalForm, GoalList, ContributionModal
│   │   └── transactions/   # TransactionForm, TransactionFilters, TransactionList
│   ├── hooks/              # useFinance, useLocalStorage
│   ├── pages/              # Dashboard, Transactions, Budgets, Analytics, Goals, Notifications, Settings, NotFound
│   ├── reducers/           # financeReducer (Pure reducer logic)
│   ├── services/           # storageService (localStorage resilience)
│   ├── styles/             # global.css (Unified design system)
│   ├── utils/              # calculations, constants, formatters
│   ├── App.jsx             # Route definitions & Toaster setup
│   └── main.jsx            # React root mount
├── package.json
└── vite.config.js
```

---

## Getting Started

### Prerequisites
- Node.js (version 18 or higher recommended)
- npm or pnpm

### Installation

1. Navigate to the project directory:
   ```bash
   cd fintrack
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Launch the development server:
   ```bash
   npm run dev
   ```

4. Open `http://localhost:5173` in your browser.

---

## Available Scripts

- `npm run dev` – Starts Vite local development server with Hot Module Replacement (HMR).
- `npm run build` – Performs a production build with code splitting and minification.
- `npm run lint` – Runs Oxlint static code analysis.
- `npm run preview` – Serves the production build locally for verification.

---

## Manual Testing Checklist

| Test Item | Verification Steps | Result |
|---|---|---|
| **Add Transaction** | Go to Transactions -> Click Add -> Enter Title, Amount, Category, Date -> Submit. | Card updates, table shows record, toast notification appears. |
| **Edit Transaction** | Click edit icon on any row -> Modify amount/title -> Save. | Row updates, totals recalculate. |
| **Delete Transaction** | Click delete icon -> Confirm in custom modal dialog. | Record removed, toast appears. |
| **Budget Limit Alert** | Add an expense pushing a category over 80% or 100% of its budget limit. | Alert notification appears in Notification Center & navbar bell badge increments. |
| **Goal Contribution** | Go to Savings Goals -> Click "Add Contribution" -> Enter ₹1000 or chip -> Submit. | Progress bar advances, deposit notification logged. |
| **Currency Switching** | Go to Settings -> Select USD ($) or EUR (€). | All numbers on Dashboard, Analytics, Budgets change currency symbol and format instantly. |
| **Data Persistence** | Add a transaction -> Hard refresh browser (Ctrl+F5). | Data persists cleanly from localStorage. |
| **Invalid Route (404)** | Navigate to `/unknown-path`. | Professional 404 page renders with recovery navigation buttons. |

---

## GitHub Presentation Guidance

To showcase this project effectively on GitHub:
1. **Repository Name**: `fintrack-finance-analytics` or `fintrack`.
2. **Short Description**: *"Personal Finance & Expense Analytics Platform built with React 19, Recharts, and Context API."*
3. **Topics / Tags**: `react`, `react19`, `finance`, `expense-tracker`, `analytics`, `recharts`, `vite`, `portfolio-project`.
4. **Live Demo Link**: Deploy via Vercel, Netlify, or GitHub Pages and link in the repository header.
