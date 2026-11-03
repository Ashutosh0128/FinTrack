import { Link } from "react-router-dom";
import { AlertCircle, ArrowLeft, Home } from "lucide-react";

export function NotFound() {
  return (
    <div className="not-found-container">
      <div className="not-found-card">
        <div className="not-found-badge">
          <AlertCircle size={28} />
          <span>404</span>
        </div>
        <h1>Page Not Found</h1>
        <p>
          The page you are looking for doesn't exist or may have been moved.
        </p>

        <div className="not-found-actions">
          <Link to="/" className="primary-btn">
            <Home size={16} /> Back to Dashboard
          </Link>
          <Link to="/transactions" className="secondary-btn">
            <ArrowLeft size={16} /> View Transactions
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NotFound;

