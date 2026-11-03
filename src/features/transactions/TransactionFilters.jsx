import { Search, SlidersHorizontal, RotateCcw } from "lucide-react";
import { ALL_CATEGORIES } from "../../utils/constants";

const TransactionFilters = ({ filters, setFilters, onReset }) => {
  const updateFilter = (name, value) => {
    setFilters((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const hasActiveFilters =
    filters.search.trim() !== "" ||
    filters.type !== "all" ||
    filters.category !== "all" ||
    filters.startDate !== "" ||
    filters.endDate !== "" ||
    filters.sort !== "newest";

  return (
    <div className="transaction-filters-container">
      <div className="transaction-filters">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search by title or notes..."
            value={filters.search}
            onChange={(event) =>
              updateFilter("search", event.target.value)
            }
            aria-label="Search transactions"
          />
        </div>

        <div className="filter-control">
          <SlidersHorizontal size={17} />
          <select
            value={filters.type}
            onChange={(event) =>
              updateFilter("type", event.target.value)
            }
            aria-label="Filter by type"
          >
            <option value="all">All Types</option>
            <option value="income">Income Only</option>
            <option value="expense">Expense Only</option>
          </select>
        </div>

        <div className="filter-control">
          <select
            value={filters.category}
            onChange={(event) =>
              updateFilter("category", event.target.value)
            }
            aria-label="Filter by category"
          >
            <option value="all">All Categories</option>
            {ALL_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-control">
          <label htmlFor="filter-from">From</label>
          <input
            id="filter-from"
            type="date"
            value={filters.startDate}
            onChange={(event) =>
              updateFilter("startDate", event.target.value)
            }
          />
        </div>

        <div className="filter-control">
          <label htmlFor="filter-to">To</label>
          <input
            id="filter-to"
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
            aria-label="Sort transactions"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="highest">Highest Amount</option>
            <option value="lowest">Lowest Amount</option>
          </select>
        </div>
      </div>

      {hasActiveFilters && (
        <div className="filters-reset-row">
          <button
            type="button"
            className="reset-filters-btn"
            onClick={onReset}
          >
            <RotateCcw size={13} /> Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default TransactionFilters;
