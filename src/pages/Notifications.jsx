import { useState } from "react";
import { Bell, CheckCheck, Trash2, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";

import { useFinance } from "../hooks/useFinance";
import { formatDate } from "../utils/formatters";
import ConfirmModal from "../components/common/ConfirmModal";

function Notifications() {
  const { state, dispatch, unreadCount } = useFinance();
  const notifications = state?.notifications || [];

  const [confirmClearOpen, setConfirmClearOpen] = useState(false);

  const markAsRead = (id) => {
    dispatch({
      type: "MARK_NOTIFICATION_READ",
      payload: id
    });
  };

  const markAllAsRead = () => {
    if (unreadCount === 0) return;
    dispatch({
      type: "MARK_ALL_NOTIFICATIONS_READ"
    });
    toast.success("All notifications marked as read");
  };

  const handleClearAllConfirm = () => {
    dispatch({
      type: "CLEAR_NOTIFICATIONS"
    });
    toast.success("All notifications cleared");
    setConfirmClearOpen(false);
  };

  const sortedNotifications = [...notifications].sort((a, b) => {
    const timeA = new Date(a.date || 0).getTime();
    const timeB = new Date(b.date || 0).getTime();
    return timeB - timeA;
  });

  return (
    <div className="module-page">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1>Notification Center</h1>
          <p>Review alerts, budget warnings, and financial updates.</p>
        </div>

        <div className="notification-actions">
          {unreadCount > 0 && (
            <button
              type="button"
              className="secondary-btn"
              onClick={markAllAsRead}
            >
              <CheckCheck size={16} /> Mark all read
            </button>
          )}

          {notifications.length > 0 && (
            <button
              type="button"
              className="secondary-btn"
              onClick={() => setConfirmClearOpen(true)}
            >
              <Trash2 size={16} /> Clear all
            </button>
          )}
        </div>
      </div>

      {/* Summary Banner */}
      <div className="notification-summary">
        <div className="notification-summary-icon">
          <Bell size={24} />
        </div>
        <div>
          <strong>
            {unreadCount > 0
              ? `${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}`
              : "All caught up!"}
          </strong>
          <p>
            You have {notifications.length} total notification
            {notifications.length !== 1 ? "s" : ""} recorded in this session.
          </p>
        </div>
      </div>

      {/* Notification List */}
      <div className="notification-list">
        {sortedNotifications.length > 0 ? (
          sortedNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`notification-item ${
                notification.read ? "read" : "unread"
              }`}
            >
              <div className="notification-icon">
                {notification.read ? (
                  <CheckCircle2 size={18} />
                ) : (
                  <Bell size={18} />
                )}
              </div>

              <div className="notification-content">
                <div className="notification-item-header">
                  <h3>{notification.title}</h3>
                  <span className="notification-date">
                    {formatDate(notification.date, {
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                  </span>
                </div>
                <p>{notification.message}</p>
              </div>

              {!notification.read && (
                <button
                  type="button"
                  className="secondary-btn btn-sm"
                  onClick={() => markAsRead(notification.id)}
                >
                  Mark read
                </button>
              )}
            </div>
          ))
        ) : (
          <div className="empty-state notification-empty-state">
            <Bell size={32} className="empty-state-icon" />
            <h3>No notifications</h3>
            <p>You have no recent alerts or budget limit warnings.</p>
          </div>
        )}
      </div>

      {/* Clear Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmClearOpen}
        onClose={() => setConfirmClearOpen(false)}
        onConfirm={handleClearAllConfirm}
        title="Clear All Notifications"
        message="Are you sure you want to clear your entire notification history? This action cannot be undone."
        confirmText="Clear All"
        variant="danger"
      />
    </div>
  );
}

export default Notifications;
