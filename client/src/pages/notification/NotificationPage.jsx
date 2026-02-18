import { useState } from "react";
import "./NotificationPage.css";

const mockNotifications = [
  {
    id: 1,
    type: "solution",
    seen: false,
    time: "2m ago",
    actor: "Priya Sharma",
    actorAvatar: "PS",
    avatarColor: "#e67e22",
    action: "added a solution to your problem",
    problemTitle: "Fixing the UI layout for Helpchain to ensure components don't overlap.",
    tags: ["React", "CSS"],
    meta: "3 solutions total",
  },
  {
    id: 2,
    type: "reaction",
    seen: false,
    time: "1h ago",
    actor: "Rahul Mehta",
    actorAvatar: "RM",
    avatarColor: "#2980b9",
    action: "and 4 others reacted to your problem",
    problemTitle: "How to implement real-time chat in a React app using WebSockets?",
    tags: ["React", "WebSocket"],
    meta: "12 reactions • 2 comments",
  },
  {
    id: 3,
    type: "solution",
    seen: false,
    time: "3h ago",
    actor: "Neha Gupta",
    actorAvatar: "NG",
    avatarColor: "#27ae60",
    action: "added a solution to your problem",
    problemTitle: "Sample Problem: Fixing the UI layout for Helpchain to ensure components don't overlap.",
    tags: ["React", "CSS"],
    meta: "5 solutions total",
  },
  {
    id: 4,
    type: "comment",
    seen: true,
    time: "5h ago",
    actor: "Dev Community",
    actorAvatar: "DC",
    avatarColor: "#8e44ad",
    action: "People with similar interests are following your problem",
    problemTitle: "Best practices for state management in large React applications.",
    tags: ["React", "Redux"],
    meta: "18 followers",
  },
  {
    id: 5,
    type: "solution",
    seen: true,
    time: "1d ago",
    actor: "Arjun Patel",
    actorAvatar: "AP",
    avatarColor: "#c0392b",
    action: "added a solution to your problem",
    problemTitle: "Database indexing strategies for high-traffic applications.",
    tags: ["SQL", "Performance"],
    meta: "2 solutions total",
  },
  {
    id: 6,
    type: "reaction",
    seen: true,
    time: "2d ago",
    actor: "Anjali Singh",
    actorAvatar: "AS",
    avatarColor: "#16a085",
    action: "and 7 others reacted to your problem",
    problemTitle: "How to handle async errors gracefully in JavaScript?",
    tags: ["JavaScript", "Error Handling"],
    meta: "30 reactions • 5 comments",
  },
];

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

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [notifications, setNotifications] = useState(mockNotifications);

  const myPostNotifications = notifications.filter((n) => n.type === "solution");
  const displayed = activeTab === "all" ? notifications : myPostNotifications;
  const unseenCount = notifications.filter((n) => !n.seen).length;
  const unseenMyPosts = myPostNotifications.filter((n) => !n.seen).length;

  const markAllSeen = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, seen: true })));
  };

  const markSeen = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, seen: true } : n))
    );
  };

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
              {/* Unseen dot */}
              {!notif.seen && <div className="unseen-dot" />}

              {/* Avatar */}
              <div className="avatar-wrap">
                <div
                  className="avatar"
                  style={{ background: notif.avatarColor }}
                >
                  {notif.actorAvatar}
                </div>
                <div className={`type-icon ${notif.type}`}>
                  {typeIcons[notif.type]}
                </div>
              </div>

              {/* Content */}
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
                    <span key={tag} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>
                <p className="notif-meta">{notif.meta}</p>
              </div>

              {/* Time */}
              <div className="time-wrap">
                <span className="notif-time">{notif.time}</span>
                <button
                  className="more-btn"
                  onClick={(e) => e.stopPropagation()}
                >
                  •••
                </button>
              </div>
            </div>
          ))}

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