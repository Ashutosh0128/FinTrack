import { useFinance } from "../context/FinanceContext";
import { Bell, CheckCheck, Trash2 } from "lucide-react";

function Notifications() {
  const { state, dispatch } = useFinance();

  const notifications = state.notifications || [];

  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  const markAsRead = (id) => {
    dispatch({
      type: "MARK_NOTIFICATION_READ",
      payload: id
    });
  };

  const markAllAsRead = () => {
    notifications.forEach((notification) => {
      if (!notification.read) {
        markAsRead(notification.id);
      }
    });
  };

  const clearAll = () => {
    if (window.confirm("Are you sure you want to clear all notifications?")) {
      dispatch({
        type: "CLEAR_NOTIFICATIONS"
      });
    }
  };

  return (
    <div className="module-page">
      <div className="page-header">
        <div>
          <h1>Notifications</h1>
          <p>Stay updated with your financial activities.</p>
        </div>

        <div className="notification-actions">
          <button className="secondary-btn" onClick={markAllAsRead}>
            <CheckCheck size={16} /> Mark all read
          </button>

          <button className="secondary-btn" onClick={clearAll}>
            <Trash2 size={16} /> Clear all
          </button>
        </div>
      </div>

      <div className="notification-summary">
        <Bell size={22} />
        <div>
          <strong>{unreadCount} unread notifications</strong>
          <p>You have {notifications.length} total notifications.</p>
        </div>
      </div>

      <div className="notification-list">
        {notifications.length > 0 ? (
          [...notifications]
            .sort(
              (a, b) =>
                new Date(b.date).getTime() - new Date(a.date).getTime()
            )
            .map((notification) => (
              <div
                key={notification.id}
                className={`notification-item ${
                  notification.read ? "read" : "unread"
                }`}
              >
                <div className="notification-icon">
                  <Bell size={19} />
                </div>

                <div className="notification-content">
                  <h3>{notification.title}</h3>
                  <p>{notification.message}</p>
                  <span>
                    {new Date(notification.date).toLocaleString("en-IN")}
                  </span>
                </div>

                {!notification.read && (
                  <button
                    className="secondary-btn"
                    onClick={() => markAsRead(notification.id)}
                  >
                    Mark read
                  </button>
                )}
              </div>
            ))
        ) : (
          <div className="empty-state">
            <Bell size={30} />
            <p>No notifications yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Notifications;