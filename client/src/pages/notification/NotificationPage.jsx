import { useState, useEffect, useCallback } from "react";
import "./NotificationPage.css";
import api from "../../api/axios"; // ✅ same as Dashboard.jsx

// ─────────────────────────────────────────────
// Helper: format createdAt timestamp → "2m ago"
// ─────────────────────────────────────────────
function timeAgo(dateString) {
  const now = new Date();
  const date = new Date(dateString);
  const diff = Math.floor((now - date) / 1000);

  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return date.toLocaleDateString();
}

// ─────────────────────────────────────────────
// Helper: avatar initials from username
// ─────────────────────────────────────────────
function getInitials(username = "") {
  return username
    .split(" ")
    .map((w) => w[0]?.toUpperCase())
    .slice(0, 2)
    .join("");
}

// ─────────────────────────────────────────────
// Helper: consistent color per username
// ─────────────────────────────────────────────
const AVATAR_COLORS = [
  "#e67e22", "#2980b9", "#27ae60", "#8e44ad",
  "#c0392b", "#16a085", "#d35400", "#2c3e50",
];
function getAvatarColor(username = "") {
  let hash = 0;
  for (const ch of username) hash += ch.charCodeAt(0);
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

// ─────────────────────────────────────────────
// Helper: action text from notification type
// ─────────────────────────────────────────────
function actionText(type) {
  switch (type) {
    case "solution": return "added a solution to your problem";
    case "reaction": return "reacted to your problem";
    case "comment":  return "commented on your problem";
    default:         return "interacted with your problem";
  }
}

// ─────────────────────────────────────────────
// SVG icons per notification type
// ─────────────────────────────────────────────
const typeIcons = {
  solution: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
    </svg>
  ),
  reaction: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  ),
  comment: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
    </svg>
  ),
};

// =============================================
// MAIN COMPONENT
// =============================================
export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // ─── Fetch notifications — same pattern as Dashboard ───
  const fetchNotifications = useCallback(async () => {
    try {
      const res = await api.get("/notifications");
      console.log("Notifications:", res.data.notifications);

      // Transform API shape → display shape
      const transformed = res.data.notifications.map((n) => {
        const actorUsername = n.actor?.username || "Someone";
        return {
          id: n._id,
          type: n.type,
          seen: n.seen,
          time: timeAgo(n.createdAt),
          actor: actorUsername,
          actorAvatar: getInitials(actorUsername),
          avatarColor: getAvatarColor(actorUsername),
          action: n.message || actionText(n.type),
          problemTitle: n.problem?.title || "a problem",
          tags: n.problem?.tags || [],
          problemId: n.problem?._id,
          answerId: n.answer?._id,
        };
      });

      setNotifications(transformed);
    } catch (error) {
      console.log("Failed to fetch notifications", error);
      alert("Failed to fetch notifications");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // ─── Derived state ───
  const myPostNotifications = notifications.filter((n) => n.type === "solution");
  const displayed = activeTab === "all" ? notifications : myPostNotifications;
  const unseenCount = notifications.filter((n) => !n.seen).length;
  const unseenMyPosts = myPostNotifications.filter((n) => !n.seen).length;

  // ─── Mark ALL as seen ───
  const markAllSeen = async () => {
    // Optimistic update
    setNotifications((prev) => prev.map((n) => ({ ...n, seen: true })));
    try {
      await api.patch("/notifications/mark-all-seen");
    } catch (error) {
      console.log("Failed to mark all seen", error);
      fetchNotifications(); // re-sync on failure
    }
  };

  // ─── Mark ONE as seen ───
  const markSeen = async (id) => {
    const notif = notifications.find((n) => n.id === id);
    if (!notif || notif.seen) return; // skip if already seen

    // Optimistic update
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, seen: true } : n))
    );
    try {
      await api.patch(`/notifications/${id}/seen`);
    } catch (error) {
      console.log("Failed to mark seen", error);
      // Revert on failure
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, seen: false } : n))
      );
    }
  };

  // ─── Loading state ───
  if (loading) {
    return (
      <div className="notifications-page">
        <div className="notifications-container">
          <div className="empty-state">
            <div className="empty-icon">⏳</div>
            <p className="empty-text">Loading notifications...</p>
          </div>
        </div>
      </div>
    );
  }

  // ─── Main render ───
  return (
    <div className="notifications-page">
      <div className="notifications-container">

        {/* Header */}
        <div className="notifications-header">
          <div className="notifications-header-left">
            <h1 className="notifications-title">Notifications</h1>
            {unseenCount > 0 && (
              <span className="notifications-badge">{unseenCount} new</span>
            )}
          </div>
          {unseenCount > 0 && (
            <button className="mark-all-btn" onClick={markAllSeen}>
              Mark all as seen
            </button>
          )}
        </div>

        {/* Tab Bar */}
        <div className="tab-bar">
          {[
            { key: "all", label: "All" },
            { key: "my posts", label: "My Posts" },
          ].map((tab) => (
            <button
              key={tab.key}
              className={`tab-btn ${activeTab === tab.key ? "active" : ""}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
              {tab.key === "my posts" && unseenMyPosts > 0 && (
                <span className="tab-count">{unseenMyPosts}</span>
              )}
            </button>
          ))}
        </div>

        {/* Notification List */}
        <div className="notifications-list">
          {displayed.map((notif) => (
            <div
              key={notif.id}
              className={`notif-card ${notif.seen ? "seen" : "unseen"}`}
              onClick={() => markSeen(notif.id)}
            >
              {/* Unseen blue dot */}
              {!notif.seen && <div className="unseen-dot" />}

              {/* Avatar + type icon badge */}
              <div className="avatar-wrap">
                <div className="avatar" style={{ background: notif.avatarColor }}>
                  {notif.actorAvatar}
                </div>
                <div className={`type-icon ${notif.type}`}>
                  {typeIcons[notif.type]}
                </div>
              </div>

              {/* Main content */}
              <div className="notif-content">
                <p className="notif-text">
                  <span className="actor-name">{notif.actor}</span>{" "}
                  <span className={`action-text ${notif.seen ? "seen" : ""}`}>
                    {notif.action}
                  </span>
                </p>
                <p className="problem-title">"{notif.problemTitle}"</p>
                <div className="tag-row">
                  {notif.tags.map((tag) => (
                    <span key={tag} className="tag">{tag}</span>
                  ))}
                </div>
              </div>

              {/* Timestamp + more button */}
              <div className="time-wrap">
                <span className="notif-time">{notif.time}</span>
                <button className="more-btn" onClick={(e) => e.stopPropagation()}>
                  •••
                </button>
              </div>
            </div>
          ))}

          {/* Empty state */}
          {displayed.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">🔔</div>
              <p className="empty-text">No notifications yet</p>
              <p className="empty-subtext">
                When someone adds a solution to your problems, you'll see it here.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}