import { useState } from "react";
import toast from "react-hot-toast";
import { User, Globe, AlertTriangle, RotateCcw, Check } from "lucide-react";

import { useFinance } from "../hooks/useFinance";
import { initialData } from "../data/initialData";
import { CURRENCIES } from "../utils/constants";
import ConfirmModal from "../components/common/ConfirmModal";

function Settings() {
  const { user, currency, dispatch } = useFinance();

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [profileError, setProfileError] = useState("");
  const [resetModalOpen, setResetModalOpen] = useState(false);

  const handleProfileSave = (e) => {
    e.preventDefault();

    const cleanName = name.trim();
    const cleanEmail = email.trim();

    if (!cleanName) {
      setProfileError("Full name is required.");
      return;
    }

    if (!cleanEmail) {
      setProfileError("Email address is required.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setProfileError("Please enter a valid email address.");
      return;
    }

    dispatch({
      type: "UPDATE_USER_PROFILE",
      payload: {
        name: cleanName,
        email: cleanEmail
      }
    });

    setProfileError("");
    toast.success("Profile updated successfully");
  };

  const handleCurrencyChange = (newCurrency) => {
    dispatch({
      type: "UPDATE_SETTINGS",
      payload: {
        currency: newCurrency
      }
    });

    toast.success(`Currency switched to ${CURRENCIES[newCurrency]?.name || newCurrency}`);
  };

  const handleResetConfirm = () => {
    dispatch({
      type: "RESET_DATA",
      payload: initialData
    });

    setName(initialData.user.name);
    setEmail(initialData.user.email);
    toast.success("FinTrack application restored to default initial data.");
    setResetModalOpen(false);
  };

  return (
    <div className="module-page">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1>Preferences & Settings</h1>
          <p>Manage your account identity, regional currency, and app data.</p>
        </div>
      </div>

      {/* Profile Card */}
      <div className="settings-card">
        <div className="settings-card-header">
          <div className="settings-icon-title">
            <User size={19} className="settings-section-icon" />
            <div>
              <h3>Profile Information</h3>
              <p>Update your personal name and contact email for the platform.</p>
            </div>
          </div>
        </div>

        <form className="settings-form" onSubmit={handleProfileSave}>
          <div className="form-group">
            <label htmlFor="settings-name">Full Name *</label>
            <input
              id="settings-name"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (profileError) setProfileError("");
              }}
              placeholder="e.g. Alex Morgan"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="settings-email">Email Address *</label>
            <input
              id="settings-email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (profileError) setProfileError("");
              }}
              placeholder="e.g. alex.morgan@example.com"
              required
            />
          </div>

          {profileError && (
            <p className="form-error" style={{ marginBottom: "14px" }}>
              {profileError}
            </p>
          )}

          <button className="primary-btn" type="submit">
            <Check size={16} /> Save Profile Changes
          </button>
        </form>
      </div>

      {/* Regional & Currency Preferences */}
      <div className="settings-card">
        <div className="settings-card-header">
          <div className="settings-icon-title">
            <Globe size={19} className="settings-section-icon" />
            <div>
              <h3>Regional & Currency Preferences</h3>
              <p>Select your default currency. All financial values and charts adapt instantly.</p>
            </div>
          </div>
        </div>

        <div className="currency-options-grid">
          {Object.entries(CURRENCIES).map(([code, cur]) => {
            const isSelected = currency === code;
            return (
              <button
                key={code}
                type="button"
                className={`currency-option-card ${isSelected ? "selected" : ""}`}
                onClick={() => handleCurrencyChange(code)}
              >
                <div className="currency-symbol-circle">{cur.symbol}</div>
                <div className="currency-details">
                  <strong>{cur.code}</strong>
                  <span>{cur.name}</span>
                </div>
                {isSelected && <span className="currency-active-indicator">Active</span>}
              </button>
            );
          })}
        </div>

        <p className="settings-note">
          Current active currency: <strong>{CURRENCIES[currency]?.name || currency}</strong>.
          Every module (Dashboard, Transactions, Budgets, Analytics, Goals) is immediately synchronized.
        </p>
      </div>

      {/* Danger Zone: Reset Application Data */}
      <div className="settings-card danger-card">
        <div className="settings-card-header">
          <div className="settings-icon-title">
            <AlertTriangle size={19} style={{ color: "#F87171" }} />
            <div>
              <h3>Danger Zone: Reset Application Data</h3>
              <p>
                Restore initial sample datasets. All custom transactions, budgets, goals,
                and notifications will be replaced.
              </p>
            </div>
          </div>
        </div>

        <div className="danger-zone-content">
          <p className="danger-warning-text">
            This operation resets FinTrack to factory default seed data in local storage.
            Make sure you have exported or noted any critical records before resetting.
          </p>

          <button
            type="button"
            className="danger-btn"
            onClick={() => setResetModalOpen(true)}
          >
            <RotateCcw size={16} /> Reset All Data
          </button>
        </div>
      </div>

      {/* Confirm Reset Modal */}
      <ConfirmModal
        isOpen={resetModalOpen}
        onClose={() => setResetModalOpen(false)}
        onConfirm={handleResetConfirm}
        title="Reset Application Data"
        message="Are you sure you want to restore the initial sample dataset? All your current transactions, budgets, savings goals, and notification records will be replaced."
        confirmText="Yes, Reset Everything"
        variant="danger"
      />
    </div>
  );
}

export default Settings;
