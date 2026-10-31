import { Search, SlidersHorizontal } from "lucide-react";

const TransactionFilters = ({ filters, setFilters }) => {
  const updateFilter = (name, value) => {
    setFilters((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  return (
    <div className="transaction-filters">
      <div className="search-box">
        <Search size={18} />
        <input
          type="text"
          placeholder="Search transactions..."
          value={filters.search}
          onChange={(event) =>
            updateFilter("search", event.target.value)
          }
        />
      </div>

      <div className="filter-control">
        <SlidersHorizontal size={17} />
        <select
          value={filters.type}
          onChange={(event) =>
            updateFilter("type", event.target.value)
          }
        >
          <option value="all">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expenses</option>
        </select>
      </div>

      <div className="filter-control">
        <select
          value={filters.category}
          onChange={(event) =>
            updateFilter("category", event.target.value)
          }
        >
          <option value="all">All Categories</option>
          {[
            "Salary",
            "Freelance",
            "Business",
            "Investment",
            "Food",
            "Shopping",
            "Travel",
            "Bills",
            "Entertainment",
            "Health",
            "Education",
            "Other",
          ].map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-control">
        <label>From</label>
        <input
          type="date"
          value={filters.startDate}
          onChange={(event) =>
            updateFilter("startDate", event.target.value)
          }
        />
      </div>

      <div className="filter-control">
        <label>To</label>
        <input
          type="date"
          value={filters.endDate}
          min={filters.startDate || undefined}
          onChange={(event) =>
            updateFilter("endDate", event.target.value)
          }
        />
      </div>

      <div className="filter-control">
        <select
          value={filters.sort}
          onChange={(event) =>
            updateFilter("sort", event.target.value)
          }
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="highest">Highest Amount</option>
          <option value="lowest">Lowest Amount</option>
        </select>
      </div>
    </div>
  );
};

export default TransactionFilters;