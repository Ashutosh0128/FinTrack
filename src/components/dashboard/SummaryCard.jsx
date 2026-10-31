function SummaryCard({ title, amount, icon, color, subtitle }) {
  return (
    <div className="summary-card">
      <div className="summary-top">
        <span>{title}</span>
        <div className={`summary-icon ${color}`}>
          {icon}
        </div>
      </div>

      <h2>{amount}</h2>
      <p>{subtitle}</p>
    </div>
  );
}

export default SummaryCard;