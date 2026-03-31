/**
 * ExpertConnect.jsx — Unified Expert Connect Page
 *
 * Handles both roles in one clean UI:
 *   • "Need Help" tab  → browse problems, connect to experts (existing flow)
 *   • "My Sessions" tab → problems where YOU are the assigned expert
 *
 * AI chatbot is powered by Anthropic API (claude-sonnet-4-20250514).
 * The simulated "aiAssignExpert" is replaced with a real Claude API call.
 *
 * Drop-in replacement for ExpertConnectPage.jsx + all sub-components.
 * No separate CSS files — all styles are scoped inline / CSS-in-JS style
 * using a single <style> tag injected once at the top.
 *
 * Backend contract (unchanged from original schema):
 *   Problem  { _id, title, tags[], difficulty, solutions, user: { username } }
 *   Expert   { name, initial, badge, specialty }
 */

import { useState, useEffect, useRef } from "react";

/* ─── Design tokens ─────────────────────────────────────────────────── */
const T = {
  bg:       "#f4f5f9",
  surface:  "#ffffff",
  border:   "#e4e6ee",
  borderHover: "#c5cae9",
  text:     "#1a1d2e",
  textMid:  "#52556a",
  textMute: "#9295a8",
  indigo:   "#4f46e5",
  indigoDk: "#4338ca",
  indigoLt: "#eef2ff",
  indigoBd: "#c7d2fe",
  green:    "#16a34a",
  greenLt:  "#f0fdf4",
  greenBd:  "#bbf7d0",
  amber:    "#92400e",
  amberLt:  "#fffbeb",
  amberBd:  "#fde68a",
  red:      "#b91c1c",
  redLt:    "#fef2f2",
  redBd:    "#fecaca",
};

/* ─── Mock data ─────────────────────────────────────────────────────── */
const EXPERT_POOL = [
  { name: "Arjun K.",  initial: "AK", badge: "React Expert",  specialty: "React · NodeJS · 3 yrs" },
  { name: "Sneha R.",  initial: "SR", badge: "Redux Expert",  specialty: "React · Redux · 4 yrs" },
  { name: "Dev M.",    initial: "DM", badge: "C++ Expert",    specialty: "C++ · DSA · 5 yrs" },
  { name: "Priya S.",  initial: "PS", badge: "C++ Expert",    specialty: "C++ · Algorithms · 3 yrs" },
  { name: "Vikram N.", initial: "VN", badge: "DB Expert",     specialty: "SQL · MongoDB · 4 yrs" },
  { name: "Leena V.",  initial: "LV", badge: "CSS Expert",    specialty: "CSS · HTML · UI · 3 yrs" },
];

const MOCK_PROBLEMS = [
  { _id: "p1", title: "I Have One React Problem",          tags: ["NodeJS","React"],       difficulty: "Medium", solutions: 0, user: { username: "hardik21" } },
  { _id: "p2", title: "React JS redux toolkit",            tags: ["react","NodeJS"],       difficulty: "Hard",   solutions: 0, user: { username: "hardik21" } },
  { _id: "p3", title: "Dynamic Programming",               tags: ["C++"],                  difficulty: "Hard",   solutions: 0, user: { username: "hardik21" } },
  { _id: "p4", title: "C++ language",                      tags: ["C++"],                  difficulty: "Easy",   solutions: 2, user: { username: "hardik21" } },
  { _id: "p5", title: "SQL JOIN not returning expected rows", tags: ["SQL","Database"],    difficulty: "Medium", solutions: 1, user: { username: "rahul99" } },
  { _id: "p6", title: "CSS Grid layout breaking on mobile", tags: ["CSS","HTML"],          difficulty: "Easy",   solutions: 0, user: { username: "leena_v" } },
];

// Problems where the current user is the assigned expert
const MY_EXPERT_SESSIONS = [
  {
    _id: "e1",
    title: "Async/Await confusion in Node",
    tags: ["NodeJS"],
    difficulty: "Medium",
    user: { username: "priya_dev" },
    assignedAt: "2h ago",
    unread: 2,
  },
  {
    _id: "e2",
    title: "React state not updating on click",
    tags: ["React"],
    difficulty: "Easy",
    user: { username: "sam_codes" },
    assignedAt: "5h ago",
    unread: 0,
  },
];

const COST_MAP = { Easy: 20, Medium: 40, Hard: 60 };

/* ─── Helpers ───────────────────────────────────────────────────────── */
function diffColor(d) {
  if (d === "Easy")   return { bg: T.greenLt, color: T.green,  border: T.greenBd };
  if (d === "Hard")   return { bg: T.redLt,   color: T.red,    border: T.redBd };
  return                     { bg: T.amberLt, color: T.amber,  border: T.amberBd };
}

function Avatar({ initials, size = 32, style = {} }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: "linear-gradient(135deg,#5c6bc0 0%,#3f51b5 100%)",
      color: "#fff", display: "flex", alignItems: "center",
      justifyContent: "center", fontWeight: 700,
      fontSize: size * 0.35, flexShrink: 0, ...style,
    }}>{initials}</div>
  );
}

function Badge({ label, bg, color, border }) {
  return (
    <span style={{
      background: bg, color, border: `1px solid ${border}`,
      padding: "2px 8px", borderRadius: 20, fontSize: 11, fontWeight: 700,
      whiteSpace: "nowrap",
    }}>{label}</span>
  );
}

/* ─── AI Chat via Anthropic API ─────────────────────────────────────── */
async function callClaude(messages, systemPrompt) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system: systemPrompt,
      messages,
    }),
  });
  const data = await res.json();
  return data.content?.map(b => b.text || "").join("") || "Sorry, I couldn't respond right now.";
}

/* ─── Chat Drawer ───────────────────────────────────────────────────── */
function ChatDrawer({ open, problem, expert, role, onClose }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput]       = useState("");
  const [loading, setLoading]   = useState(false);
  const bottomRef               = useRef();

  useEffect(() => {
    if (open && problem) {
      const isExpert = role === "expert";
      setMessages([{
        id: 1, from: "assistant",
        text: isExpert
          ? `Hi! You're connected as the assigned expert for this problem. The user needs help with: "${problem.title}". They will message you shortly.`
          : `Hi! I'm ${expert?.name ?? "your expert"} — I hold the ${expert?.badge ?? "Expert"} badge. I've been matched to your problem. What have you tried so far?`,
        time: "now",
      }]);
    }
  }, [open, problem?._id, role]);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userText = input.trim();
    const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setInput("");
    const nextMessages = [...messages, { id: Date.now(), from: "user", text: userText, time }];
    setMessages(nextMessages);
    setLoading(true);

    try {
      const systemPrompt = role === "expert"
        ? `You are a community expert helping a user with: "${problem?.title}". Tags: ${problem?.tags?.join(", ")}. Be concise, helpful, and technical.`
        : `You are ${expert?.name ?? "a community expert"} with the badge "${expert?.badge ?? "Expert"}. Specialty: ${expert?.specialty}". Help the user with: "${problem?.title}". Tags: ${problem?.tags?.join(", ")}. Be concise, friendly, and technical.`;

      const apiMessages = nextMessages
        .filter(m => m.from !== "assistant" || m.id !== 1)
        .map(m => ({ role: m.from === "user" ? "user" : "assistant", content: m.text }));

      const reply = await callClaude(apiMessages, systemPrompt);
      setMessages(prev => [...prev, {
        id: Date.now() + 1, from: "assistant", text: reply,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }]);
    } catch {
      setMessages(prev => [...prev, {
        id: Date.now() + 1, from: "assistant",
        text: "Connection error. Please try again.",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } };

  const isExpert = role === "expert";

  return (
    <>
      {open && (
        <div onClick={onClose} style={{
          position: "fixed", top: 64, left: 0, right: 0, bottom: 0, zIndex: 98,
        }} />
      )}
      <div style={{
        position: "fixed", top: 64, right: 0,
        height: "calc(100vh - 64px)", width: 420,
        background: "#f8f9fb", borderLeft: `1px solid ${T.border}`,
        boxShadow: "-4px 0 24px rgba(63,81,181,0.08)",
        zIndex: 99, display: "flex", flexDirection: "column",
        transform: open ? "translateX(0)" : "translateX(100%)",
        transition: "transform 0.28s cubic-bezier(0.4,0,0.2,1)",
      }}>
        {/* Top bar */}
        <div style={{
          display: "flex", alignItems: "center", gap: 12,
          padding: "14px 18px", borderBottom: `1px solid ${T.border}`,
          background: T.surface, flexShrink: 0,
        }}>
          <button onClick={onClose} style={{
            width: 28, height: 28, border: `1px solid ${T.border}`,
            background: "none", borderRadius: 7, cursor: "pointer",
            color: T.textMute, fontSize: 16, display: "flex",
            alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}>×</button>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: T.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {problem?.title ?? "Expert Chat"}
            </div>
            <div style={{ fontSize: 11, color: T.textMute, marginTop: 1 }}>
              {problem?.tags?.join(" · ")}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: T.green, fontWeight: 600, flexShrink: 0 }}>
            <div style={{
              width: 7, height: 7, borderRadius: "50%", background: "#22c55e",
              animation: "ecPulse 1.8s ease-in-out infinite",
            }} />
            Online
          </div>
        </div>

        {/* Expert strip */}
        {(expert || isExpert) && (
          <div style={{
            display: "flex", alignItems: "flex-start", gap: 12,
            padding: "14px 18px", borderBottom: `1px solid ${T.border}`,
            background: T.surface, flexShrink: 0, position: "relative",
          }}>
            <Avatar initials={isExpert ? "ME" : expert?.initial} size={42} />
            <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 3 }}>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: T.text }}>
                {isExpert ? "You (Expert)" : expert?.name}
              </div>
              <span style={{
                display: "inline-flex", alignItems: "center", gap: 4,
                fontSize: 11.5, fontWeight: 600, color: T.text,
                background: T.surface, border: `1.5px solid ${T.border}`,
                padding: "2px 10px", borderRadius: 20, width: "fit-content",
              }}>
                🏅 {isExpert ? "Your Badge" : expert?.badge}
              </span>
              <div style={{ fontSize: 11.5, color: T.textMute }}>
                {isExpert ? `Helping: ${problem?.user?.username}` : expert?.specialty}
              </div>
            </div>
            <span style={{
              position: "absolute", top: 12, right: 14,
              fontSize: 11, color: T.textMid,
              background: "#f3f4f6", border: `1px solid ${T.border}`,
              padding: "3px 9px", borderRadius: 20, whiteSpace: "nowrap",
            }}>
              🤖 AI powered
            </span>
          </div>
        )}

        {/* Messages */}
        <div style={{
          flex: 1, overflowY: "auto", padding: "18px 16px",
          display: "flex", flexDirection: "column", gap: 16,
          background: "#f8f9fb",
        }}>
          {messages.map(msg => {
            const isUser = msg.from === "user";
            return (
              <div key={msg.id} style={{
                display: "flex", gap: 8,
                flexDirection: isUser ? "row-reverse" : "row",
              }}>
                <div style={{
                  width: 32, height: 32, borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 11, fontWeight: 700, color: "#fff", flexShrink: 0,
                  background: isUser
                    ? "linear-gradient(135deg,#34d399,#22c55e)"
                    : "linear-gradient(135deg,#5c6bc0,#3f51b5)",
                  alignSelf: "flex-start", marginTop: 2,
                }}>
                  {isUser ? "Me" : (isExpert ? "U" : expert?.initial)}
                </div>
                <div style={{
                  display: "flex", flexDirection: "column",
                  maxWidth: "76%", alignItems: isUser ? "flex-end" : "flex-start",
                }}>
                  <div style={{
                    padding: "11px 14px", borderRadius: 16, fontSize: 13.5,
                    lineHeight: 1.65,
                    background: isUser ? T.indigo : "#eeeff4",
                    color: isUser ? "#fff" : T.text,
                    borderBottomRightRadius: isUser ? 4 : 16,
                    borderBottomLeftRadius: isUser ? 16 : 4,
                  }}>{msg.text}</div>
                  <div style={{ fontSize: 11, color: T.textMute, marginTop: 4, padding: "0 2px" }}>
                    {msg.time}
                  </div>
                </div>
              </div>
            );
          })}
          {loading && (
            <div style={{ display: "flex", gap: 8 }}>
              <Avatar initials={isExpert ? "U" : expert?.initial} size={32} />
              <div style={{
                padding: "11px 16px", borderRadius: 16, borderBottomLeftRadius: 4,
                background: "#eeeff4", color: T.textMid, fontSize: 13,
              }}>Typing…</div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input bar */}
        <div style={{
          borderTop: `1px solid ${T.border}`, padding: "14px 16px",
          display: "flex", gap: 10, alignItems: "flex-end",
          background: T.surface, flexShrink: 0,
        }}>
          <textarea
            style={{
              flex: 1, fontFamily: "inherit", fontSize: 13.5, color: T.text,
              background: "#f3f4f6", border: `1px solid ${T.border}`,
              borderRadius: 12, padding: "10px 14px", outline: "none",
              resize: "none", lineHeight: 1.5, minHeight: 40, maxHeight: 110,
            }}
            placeholder="Type a message… (Enter to send)"
            rows={1}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
          />
          <button
            onClick={send}
            disabled={!input.trim() || loading}
            style={{
              background: T.indigo, color: "#fff", border: "none",
              borderRadius: 12, width: 40, height: 40,
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: input.trim() && !loading ? "pointer" : "not-allowed",
              fontSize: 14, opacity: input.trim() && !loading ? 1 : 0.4,
              transition: "all 0.15s",
            }}
          >➤</button>
        </div>
      </div>
    </>
  );
}

/* ─── Confirm Modal ─────────────────────────────────────────────────── */
function ConfirmModal({ problem, cost, onClose, onConfirm }) {
  if (!problem) return null;
  const diff = problem.difficulty || "Medium";
  const dc = diffColor(diff);
  return (
    <div onClick={e => e.target === e.currentTarget && onClose()} style={{
      position: "fixed", inset: 0, background: "rgba(17,24,39,0.35)",
      backdropFilter: "blur(2px)", zIndex: 200,
      display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
    }}>
      <div style={{
        background: T.surface, border: `1px solid ${T.border}`,
        borderRadius: 14, boxShadow: "0 4px 24px rgba(0,0,0,0.1)",
        width: "100%", maxWidth: 400, overflow: "hidden",
      }}>
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "14px 16px", borderBottom: `1px solid #f0f0f6`,
        }}>
          <span style={{ fontSize: 14.5, fontWeight: 700, color: T.text }}>Connect with Expert</span>
          <button onClick={onClose} style={{
            width: 28, height: 28, border: `1px solid ${T.border}`, background: "none",
            borderRadius: 7, cursor: "pointer", color: T.textMute, fontSize: 17,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>×</button>
        </div>
        <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: 12 }}>
          {/* Problem chip */}
          <div style={{
            display: "flex", alignItems: "flex-start", gap: 10,
            background: "#f4f5f9", border: `1px solid ${T.border}`,
            borderRadius: 10, padding: "10px 12px",
          }}>
            <Avatar initials={(problem.user?.username ?? "U").charAt(0).toUpperCase()} size={30} />
            <div>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: T.text, marginBottom: 5 }}>
                {problem.title}
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                {problem.tags?.map((t, i) => (
                  <Badge key={i} label={t} bg={T.indigoLt} color={T.indigo} border={T.indigoBd} />
                ))}
                <Badge label={diff} bg={dc.bg} color={dc.color} border={dc.border} />
              </div>
            </div>
          </div>
          {/* Cost */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            background: T.amberLt, border: `1px solid ${T.amberBd}`,
            borderRadius: 10, padding: "10px 12px", fontSize: 13, color: T.amber,
          }}>
            <span>🪙 Expert session cost</span>
            <strong style={{ fontSize: 15 }}>{cost} coins</strong>
          </div>
          {/* AI note */}
          <div style={{
            display: "flex", alignItems: "flex-start", gap: 8,
            fontSize: 12.5, color: "#4338ca", background: T.indigoLt,
            border: `1px solid ${T.indigoBd}`, borderRadius: 10, padding: "10px 12px",
            lineHeight: 1.55,
          }}>
            <span style={{ fontSize: 14, flexShrink: 0, marginTop: 1 }}>🤖</span>
            <span>
              Our AI will automatically assign the best-matched community expert based on
              your problem tags and difficulty. No manual picking needed.
            </span>
          </div>
          {/* Actions */}
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={onClose} style={{
              background: "none", border: `1px solid ${T.border}`, borderRadius: 8,
              padding: "9px 14px", fontSize: 13.5, fontWeight: 500, color: T.textMid,
              cursor: "pointer", fontFamily: "inherit",
            }}>Cancel</button>
            <button onClick={() => onConfirm(problem, cost)} style={{
              flex: 1, background: T.indigo, color: "#fff", border: "none",
              borderRadius: 8, padding: "9px 14px", fontSize: 13.5, fontWeight: 700,
              cursor: "pointer", fontFamily: "inherit",
            }}>
              Confirm — {cost} coins
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Toast ─────────────────────────────────────────────────────────── */
function Toast({ message, sub, onDone }) {
  const [hiding, setHiding] = useState(false);
  useEffect(() => {
    const t1 = setTimeout(() => setHiding(true), 3000);
    const t2 = setTimeout(onDone, 3300);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);
  return (
    <div style={{
      position: "fixed", top: 76, right: 20, zIndex: 500,
      background: T.surface, border: `1px solid ${T.indigoBd}`,
      borderLeft: `4px solid ${T.indigo}`,
      borderRadius: 10, padding: "12px 14px",
      display: "flex", alignItems: "flex-start", gap: 10,
      minWidth: 270, maxWidth: 330,
      boxShadow: "0 4px 20px rgba(79,70,229,0.12)",
      opacity: hiding ? 0 : 1, transform: hiding ? "translateX(20px)" : "translateX(0)",
      transition: "opacity 0.2s ease, transform 0.2s ease",
    }}>
      <div style={{
        width: 32, height: 32, borderRadius: "50%",
        background: T.indigoLt, border: `1px solid ${T.indigoBd}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 15, flexShrink: 0,
      }}>🤖</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 600, fontSize: 13, color: T.text, lineHeight: 1.4 }}>{message}</div>
        {sub && <div style={{ fontSize: 11.5, color: T.textMid, marginTop: 2 }}>{sub}</div>}
      </div>
    </div>
  );
}

/* ─── Problem Card ──────────────────────────────────────────────────── */
function ProblemCard({ problem, status, onConnect, onOpenChat, isExpertView }) {
  const diff    = problem.difficulty || "Medium";
  const dc      = diffColor(diff);
  const cost    = COST_MAP[diff] ?? 40;
  const initial = (problem.user?.username ?? "U").charAt(0).toUpperCase();

  return (
    <div style={{
      background: T.surface, borderRadius: 10,
      border: `1px solid ${T.border}`, marginBottom: 6, overflow: "hidden",
      transition: "box-shadow 0.18s, border-color 0.18s",
    }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 3px 12px rgba(63,81,181,0.09)"; e.currentTarget.style.borderColor = T.borderHover; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = T.border; }}
    >
      <div style={{ display: "grid", gridTemplateColumns: "1fr auto", alignItems: "center" }}>
        {/* Left */}
        <div style={{ padding: "10px 14px", display: "flex", flexDirection: "column", gap: 5, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Avatar initials={initial} size={22} />
            <span style={{ fontSize: 12, color: T.textMid, fontWeight: 500 }}>
              {problem.user?.username ?? "Anonymous"}
            </span>
            {isExpertView && problem.unread > 0 && (
              <span style={{
                background: T.indigo, color: "#fff", borderRadius: 20,
                padding: "1px 7px", fontSize: 10.5, fontWeight: 700, marginLeft: 2,
              }}>{problem.unread} new</span>
            )}
            {isExpertView && (
              <span style={{ fontSize: 11, color: T.textMute, marginLeft: "auto" }}>
                {problem.assignedAt}
              </span>
            )}
          </div>
          <h3 style={{
            fontSize: 13.5, fontWeight: 700, color: T.text, margin: 0,
            lineHeight: 1.3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          }}>{problem.title}</h3>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, flexWrap: "wrap" }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4, alignItems: "center" }}>
              {problem.tags?.map((t, i) => (
                <Badge key={i} label={t} bg={T.indigoLt} color={T.indigo} border={T.indigoBd} />
              ))}
              <Badge label={diff} bg={dc.bg} color={dc.color} border={dc.border} />
              {!isExpertView && (
                <span style={{
                  background: T.amberLt, color: T.amber, border: `1px solid ${T.amberBd}`,
                  padding: "2px 8px", borderRadius: 20, fontSize: 11, fontWeight: 700,
                }}>🪙 {cost}</span>
              )}
            </div>
            {!isExpertView && (
              <span style={{ fontSize: 11.5, color: T.indigo, fontWeight: 600 }}>
                {problem.solutions ?? 0} {problem.solutions === 1 ? "Solution" : "Solutions"}
              </span>
            )}
          </div>
        </div>
        {/* Right action */}
        <div style={{ padding: "0 14px 0 8px", display: "flex", alignItems: "center", justifyContent: "flex-end", flexShrink: 0 }}>
          {isExpertView ? (
            <button
              onClick={e => { e.stopPropagation(); onOpenChat(problem, "expert"); }}
              style={{
                background: T.indigo, color: "#fff", border: "none",
                borderRadius: 8, padding: "6px 14px", fontSize: 12,
                fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
              }}
            >Open Chat ↗</button>
          ) : !status ? (
            <button
              onClick={e => { e.stopPropagation(); onConnect(problem, cost); }}
              style={{
                background: T.indigo, color: "#fff", border: "none",
                borderRadius: 8, padding: "6px 14px", fontSize: 12,
                fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
              }}
            >Connect Expert</button>
          ) : status === "pending" ? (
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 5,
              fontSize: 11.5, fontWeight: 600, padding: "5px 11px", borderRadius: 20,
              background: T.amberLt, color: T.amber, border: `1px solid ${T.amberBd}`,
            }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "currentColor", animation: "ecPulse 1.8s ease-in-out infinite" }} />
              Finding…
            </span>
          ) : (
            <span
              onClick={e => { e.stopPropagation(); onOpenChat(problem, "user"); }}
              style={{
                display: "inline-flex", alignItems: "center", gap: 5,
                fontSize: 11.5, fontWeight: 600, padding: "5px 11px", borderRadius: 20,
                background: T.greenLt, color: T.green, border: `1px solid ${T.greenBd}`,
                cursor: "pointer",
              }}
            >
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "currentColor", animation: "ecPulse 1.8s ease-in-out infinite" }} />
              Open Chat ↗
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Main Page ─────────────────────────────────────────────────────── */
export default function ExpertConnectPage() {
  const problems = MOCK_PROBLEMS;
  const myExpertSessions = MY_EXPERT_SESSIONS;

  const [tab, setTab]           = useState("need-help"); // "need-help" | "my-sessions"
  const [statuses, setStatuses] = useState({});
  const [expertMap, setExpertMap] = useState({});
  const [confirmData, setConfirmData] = useState(null);
  const [toast, setToast]         = useState(null);
  const [drawer, setDrawer]       = useState({ open: false, problem: null, expert: null, role: "user" });

  const activeSessions = problems.filter(p => statuses[p._id] === "active");

  const handleConnect = (problem, cost) => setConfirmData({ problem, cost });

  const handleConfirm = (problem, cost) => {
    setConfirmData(null);
    setStatuses(s => ({ ...s, [problem._id]: "pending" }));
    setTimeout(() => {
      const expert = EXPERT_POOL[problem._id.charCodeAt(problem._id.length - 1) % EXPERT_POOL.length];
      setExpertMap(m => ({ ...m, [problem._id]: expert }));
      setStatuses(s => ({ ...s, [problem._id]: "active" }));
      setToast({ message: `Expert assigned for "${problem.title}"`, sub: `${expert.name} · ${expert.badge}` });
    }, 1800);
  };

  const handleOpenChat = (problem, role = "user") => {
    setDrawer({ open: true, problem, expert: expertMap[problem._id] ?? null, role });
  };

  const TABS = [
    { id: "need-help",    label: "Need Help",     count: problems.length },
    { id: "my-sessions",  label: "My Sessions",   count: myExpertSessions.length },
  ];

  return (
    <>
      <style>{`
        @keyframes ecPulse { 0%,100%{opacity:1}50%{opacity:0.35} }
        * { box-sizing: border-box; }
        textarea:focus { border-color: #5c6bc0 !important; background: #fff !important; }
      `}</style>

      <div style={{
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        background: T.bg, minHeight: "100vh",
        padding: "28px 24px",
        marginRight: drawer.open ? 420 : 0,
        transition: "margin-right 0.28s cubic-bezier(0.4,0,0.2,1)",
        color: T.text,
      }}>
        {/* Header */}
        <div style={{ marginBottom: 20 }}>
          <h1 style={{ fontSize: 21, fontWeight: 700, color: T.text, margin: "0 0 4px" }}>
            Expert Connect
          </h1>
          <p style={{ fontSize: 13.5, color: T.textMid, margin: 0 }}>
            AI-powered expert matching for your toughest problems.
          </p>
        </div>

        {/* Tabs */}
        <div style={{
          display: "flex", gap: 4, marginBottom: 18,
          background: T.surface, border: `1px solid ${T.border}`,
          borderRadius: 10, padding: 4, width: "fit-content",
        }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              background: tab === t.id ? T.indigo : "transparent",
              color: tab === t.id ? "#fff" : T.textMid,
              border: "none", borderRadius: 7, padding: "6px 16px",
              fontSize: 13, fontWeight: 600, cursor: "pointer",
              display: "flex", alignItems: "center", gap: 7,
              transition: "all 0.15s",
              fontFamily: "inherit",
            }}>
              {t.label}
              <span style={{
                background: tab === t.id ? "rgba(255,255,255,0.22)" : T.indigoLt,
                color: tab === t.id ? "#fff" : T.indigo,
                borderRadius: 20, padding: "1px 7px", fontSize: 11, fontWeight: 700,
              }}>{t.count}</span>
            </button>
          ))}
        </div>

        {/* Active session banner */}
        {tab === "need-help" && activeSessions.length > 0 && (
          <div
            onClick={() => handleOpenChat(activeSessions[0], "user")}
            style={{
              display: "flex", alignItems: "center", gap: 10,
              background: T.greenLt, border: `1px solid ${T.greenBd}`,
              borderRadius: 10, padding: "10px 14px", marginBottom: 14,
              fontSize: 13, color: T.green, fontWeight: 600, cursor: "pointer",
            }}
          >
            <div style={{
              width: 8, height: 8, borderRadius: "50%", background: "#22c55e",
              animation: "ecPulse 1.8s ease-in-out infinite",
            }} />
            {activeSessions.length === 1
              ? `Active session: "${activeSessions[0].title}"`
              : `${activeSessions.length} active expert sessions`}
            <span style={{ marginLeft: "auto", opacity: 0.6 }}>↗</span>
          </div>
        )}

        {/* Expert role note */}
        {tab === "my-sessions" && (
          <div style={{
            display: "flex", alignItems: "flex-start", gap: 8,
            background: T.indigoLt, border: `1px solid ${T.indigoBd}`,
            borderRadius: 10, padding: "10px 14px", marginBottom: 14,
            fontSize: 12.5, color: "#4338ca", lineHeight: 1.55,
          }}>
            <span style={{ fontSize: 14, flexShrink: 0 }}>🏅</span>
            <span>
              These are problems where <strong>you've been assigned as an expert</strong> by our AI.
              Open the chat to help the user and earn coins.
            </span>
          </div>
        )}

        {/* Problem list */}
        <div>
          {tab === "need-help"
            ? problems.map(p => (
                <ProblemCard
                  key={p._id}
                  problem={p}
                  status={statuses[p._id]}
                  onConnect={handleConnect}
                  onOpenChat={handleOpenChat}
                  isExpertView={false}
                />
              ))
            : myExpertSessions.map(p => (
                <ProblemCard
                  key={p._id}
                  problem={p}
                  onConnect={() => {}}
                  onOpenChat={handleOpenChat}
                  isExpertView={true}
                />
              ))
          }
        </div>
      </div>

      {/* Modals / overlays */}
      {confirmData && (
        <ConfirmModal
          problem={confirmData.problem}
          cost={confirmData.cost}
          onClose={() => setConfirmData(null)}
          onConfirm={handleConfirm}
        />
      )}
      {toast && <Toast message={toast.message} sub={toast.sub} onDone={() => setToast(null)} />}
      <ChatDrawer
        open={drawer.open}
        problem={drawer.problem}
        expert={drawer.expert}
        role={drawer.role}
        onClose={() => setDrawer(d => ({ ...d, open: false }))}
      />
    </>
  );
}