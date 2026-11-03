import {
  Wallet,
  TrendingUp,
  TrendingDown,
  PiggyBank
} from "lucide-react";

const icons = {
  balance: Wallet,
  income: TrendingUp,
  expense: TrendingDown,
  savings: PiggyBank
};

function SummaryCard({ title, value, type, subtitle }) {
  const Icon = icons[type] || Wallet;

  return (
    <div className="summary-card">
      <div className={`summary-icon ${type}`}>
        <Icon size={22} />
      </div>

      <div className="summary-details">
        <p>{title}</p>
        <h2>{value}</h2>
        {subtitle && <small className="summary-subtext">{subtitle}</small>}
      </div>
    </div>
  );
}

export default SummaryCard;
