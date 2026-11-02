import { useEffect, useState } from "react";
import { useFinance } from "../context/FinanceContext";
import { initialData } from "../data/initialData";

const PROFILE_KEY = "fintrack_profile";
const SETTINGS_KEY = "fintrack_settings";

function Settings() {
  const { dispatch } = useFinance();

  const [profile, setProfile] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(PROFILE_KEY)) || {
        name: "",
        email: ""
      };
    } catch {
      return { name: "", email: "" };
    }
  });

  const [currency, setCurrency] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(SETTINGS_KEY))?.currency || "INR";
    } catch {
      return "INR";
    }
  });

  const [savedMessage, setSavedMessage] = useState("");

  useEffect(() => {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem(
      SETTINGS_KEY,
      JSON.stringify({ currency })
    );
  }, [currency]);

  const handleProfileSave = (e) => {
    e.preventDefault();

    if (!profile.name.trim() || !profile.email.trim()) {
      alert("Please enter your name and email.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)) {
      alert("Please enter a valid email address.");
      return;
    }

    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    setSavedMessage("Profile settings saved successfully.");

    setTimeout(() => setSavedMessage(""), 3000);
  };

  const handleReset = () => {
    const confirmed = window.confirm(
      "This will permanently delete your FinTrack transactions, budgets, goals and notifications. Continue?"
    );

    if (!confirmed) return;

    dispatch({
      type: "RESET_DATA",
      payload: initialData
    });
  };

  return (
    <div className="module-page">
      <div className="page-header">
        <div>
          <h1>Settings</h1>
          <p>Manage your profile and application preferences.</p>
        </div>
      </div>

      <div className="settings-card">
        <h3>Profile Information</h3>
        <p>Update your personal information.</p>

        <form className="module-form settings-form" onSubmit={handleProfileSave}>
          <label>
            Full Name
            <input
              value={profile.name}
              onChange={(e) =>
                setProfile({ ...profile, name: e.target.value })
              }
              placeholder="Enter your name"
            />
          </label>

          <label>
            Email Address
            <input
              type="email"
              value={profile.email}
              onChange={(e) =>
                setProfile({ ...profile, email: e.target.value })
              }
              placeholder="Enter your email"
            />
          </label>

          <button className="primary-btn" type="submit">
            Save Profile
          </button>

          {savedMessage && (
            <p className="success-message">{savedMessage}</p>
          )}
        </form>
      </div>

      <div className="settings-card">
        <h3>Regional Preferences</h3>
        <p>Choose your preferred currency.</p>

        <label>
          Currency
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
          >
            <option value="INR">Indian Rupee (INR ₹)</option>
            <option value="USD">US Dollar (USD $)</option>
            <option value="EUR">Euro (EUR €)</option>
            <option value="GBP">British Pound (GBP £)</option>
          </select>
        </label>

        <p className="settings-note">
          This setting is saved locally. To display a different currency
          throughout the application, the currency formatter in each module
          must also read this preference.
        </p>
      </div>

      <div className="settings-card danger-card">
        <h3>Reset Application Data</h3>
        <p>
          This will restore the sample data and remove your current
          transactions, budgets, savings goals and notifications.
        </p>

        <button className="danger-btn" onClick={handleReset}>
          Reset All Data
        </button>
      </div>
    </div>
  );
}

export default Settings;