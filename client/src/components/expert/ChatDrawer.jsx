// ChatDrawer.jsx
// Slide-in chat drawer from the right side.
// Shows assigned expert (AI-assigned community user with badge) + chat interface.
// Completely independent component — no backend changes.

import { useState, useEffect, useRef } from "react";
import "./ChatDrawer.css";

const ChatDrawer = ({ open, problem, expert, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const bottomRef = useRef();

  // Seed first message when expert is assigned and drawer opens
  useEffect(() => {
    if (open && expert && problem) {
      setMessages([
        {
          id: 1,
          from: "expert",
          text: `Hi! I'm ${expert.name} — I hold the ${expert.badge} badge here on HelpChain. I've been matched to your problem. What have you tried so far?`,
          time: "now",
        },
      ]);
    }
  }, [open, expert?.name, problem?._id]);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const send = () => {
    if (!input.trim()) return;
    const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setMessages((m) => [...m, { id: Date.now(), from: "user", text: input.trim(), time }]);
    setInput("");
    // Simulated expert reply
    setTimeout(() => {
      setMessages((m) => [
        ...m,
        {
          id: Date.now() + 1,
          from: "expert",
          text: "Got it! Let me walk you through the correct approach step by step.",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    }, 1100);
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  };

  return (
    <>
      {/* Invisible backdrop — clicking outside closes drawer */}
      {open && <div className="ec-drawer__backdrop" onClick={onClose} />}

      <div className={`ec-drawer ${open ? "ec-drawer--open" : ""}`}>

        {/* ── Top bar ── */}
        <div className="ec-drawer__topbar">
          <button className="ec-drawer__close" onClick={onClose}>×</button>
          <div className="ec-drawer__topbar-info">
            <div className="ec-drawer__problem-name">
              {problem?.title || "Expert Chat"}
            </div>
            <div className="ec-drawer__problem-tags">
              {problem?.tags?.join(" · ")}
            </div>
          </div>
          <div className="ec-drawer__online">
            <div className="ec-drawer__online-dot" />
            Online
          </div>
        </div>

        {/* ── Expert strip ── */}
        {expert && (
          <div className="ec-drawer__expert">
            <div className="ec-drawer__expert-avatar">{expert.initial}</div>
            <div className="ec-drawer__expert-info">
              <div className="ec-drawer__expert-name">{expert.name}</div>
              <span className="ec-drawer__badge-pill">🏅 {expert.badge}</span>
              <div className="ec-drawer__expert-meta">{expert.specialty}</div>
            </div>
            <span className="ec-drawer__ai-tag">🤖 AI assigned</span>
          </div>
        )}

        {/* ── Messages ── */}
        <div className="ec-drawer__messages">
          {messages.map((msg) => (
            <div key={msg.id} className={`ec-drawer__msg ec-drawer__msg--${msg.from}`}>
              <div className="ec-drawer__msg-av">
                {msg.from === "expert" ? expert?.initial : "Me"}
              </div>
              <div className="ec-drawer__bubble-wrap">
                <div className="ec-drawer__bubble">{msg.text}</div>
                <div className="ec-drawer__msg-time">{msg.time}</div>
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* ── Input bar ── */}
        <div className="ec-drawer__input-bar">
          <textarea
            className="ec-drawer__input"
            placeholder="Type your message… (Enter to send)"
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
          />
          <button
            className="ec-drawer__send"
            onClick={send}
            disabled={!input.trim()}
          >
            ➤
          </button>
        </div>

      </div>
    </>
  );
};

export default ChatDrawer;