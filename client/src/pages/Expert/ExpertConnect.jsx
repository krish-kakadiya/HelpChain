// ExpertConnectPage.jsx
// Main Expert Connect page.
// Wires together: ExpertProblemCard + ConfirmModal + ChatDrawer.
// AI expert assignment is simulated here — replace the aiAssignExpert()
// call with your real LLM/API call when ready. No backend schema changes needed.

import { useState, useEffect } from "react";
import ExpertProblemCard from "../../components/expert/ExpertProblemCard";
import ConfirmModal from "../../components/expert/ConfirmModal";
import ChatDrawer from "../../components/expert/ChatDrawer";
import "./ExpertConnect.css";

// ── Expert pool (community users with earned badges) ──────────────────────────
// In production, this list comes from your backend — users who earned a badge.
const EXPERT_POOL = [
  { name: "Arjun K.",  initial: "AK", badge: "React Expert",  specialty: "React · NodeJS · 3 yrs"  },
  { name: "Sneha R.",  initial: "SR", badge: "Redux Expert",  specialty: "React · Redux · 4 yrs"   },
  { name: "Dev M.",    initial: "DM", badge: "C++ Expert",    specialty: "C++ · DSA · 5 yrs"       },
  { name: "Priya S.",  initial: "PS", badge: "C++ Expert",    specialty: "C++ · Algorithms · 3 yrs"},
  { name: "Vikram N.", initial: "VN", badge: "DB Expert",     specialty: "SQL · MongoDB · 4 yrs"   },
  { name: "Leena V.",  initial: "LV", badge: "CSS Expert",    specialty: "CSS · HTML · UI · 3 yrs" },
];

// ── Simulated AI assignment ───────────────────────────────────────────────────
// Replace this with your real LLM API call.
// The function receives the full problem object (with tags, difficulty, title)
// and should return an expert object from EXPERT_POOL (or from your backend).
function aiAssignExpert(problem) {
  // Simple deterministic mock — swap with real AI call
  return EXPERT_POOL[problem._id
    ? problem._id.charCodeAt(problem._id.length - 1) % EXPERT_POOL.length
    : 0];
}

// ── Mock problems ─────────────────────────────────────────────────────────────
// Remove this block when you fetch real problems from your API.
// Each object matches your Mongoose Problem schema exactly.
const MOCK_PROBLEMS = [
  {
    _id: "p1",
    title: "I Have One React Problem",
    tags: ["NodeJS", "React"],
    difficulty: "Medium",
    solutions: 0,
    user: { username: "hardik21" },
  },
  {
    _id: "p2",
    title: "React JS redux toolkit",
    tags: ["react", "NodeJS"],
    difficulty: "Hard",
    solutions: 0,
    user: { username: "hardik21" },
  },
  {
    _id: "p3",
    title: "Dynamic Programing",
    tags: ["C++"],
    difficulty: "Hard",
    solutions: 0,
    user: { username: "hardik21" },
  },
  {
    _id: "p4",
    title: "C++ language",
    tags: ["C++"],
    difficulty: "Easy",
    solutions: 2,
    user: { username: "hardik21" },
  },
  {
    _id: "p5",
    title: "SQL JOIN not returning expected rows",
    tags: ["SQL", "Database"],
    difficulty: "Medium",
    solutions: 1,
    user: { username: "rahul99" },
  },
  {
    _id: "p6",
    title: "CSS Grid layout breaking on mobile",
    tags: ["CSS", "HTML"],
    difficulty: "Easy",
    solutions: 0,
    user: { username: "leena_v" },
  },
];

// ── Toast ─────────────────────────────────────────────────────────────────────
function Toast({ message, sub, onDone }) {
  const [hiding, setHiding] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setHiding(true), 3000);
    const t2 = setTimeout(() => onDone(), 3300);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <div className={`ec-page__toast ${hiding ? "ec-page__toast--hide" : ""}`}>
      <div className="ec-page__toast-icon">🤖</div>
      <div className="ec-page__toast-body">
        <div className="ec-page__toast-msg">{message}</div>
        {sub && <div className="ec-page__toast-sub">{sub}</div>}
      </div>
      <div className="ec-page__toast-progress" />
    </div>
  );
}

// ── ExpertConnectPage ─────────────────────────────────────────────────────────
const ExpertConnectPage = () => {
  // Replace MOCK_PROBLEMS with your real API fetch (useEffect + setState)
  const problems = MOCK_PROBLEMS;

  // { [problemId]: "pending" | "active" }
  const [statuses,  setStatuses]  = useState({});
  // { [problemId]: expert }
  const [expertMap, setExpertMap] = useState({});

  const [confirmData, setConfirmData] = useState(null); // { problem, cost }
  const [toast,       setToast]       = useState(null); // { message, sub }
  const [drawer,      setDrawer]      = useState({ open: false, problem: null, expert: null });

  // Active sessions
  const activeSessions = problems.filter((p) => statuses[p._id] === "active");

  // ── User clicks "Connect Expert" on a card ──
  const handleConnect = (problem, cost) => {
    setConfirmData({ problem, cost });
  };

  // ── User confirms in modal ──
  const handleConfirm = (problem, cost) => {
    setConfirmData(null);
    setStatuses((s) => ({ ...s, [problem._id]: "pending" }));

    // AI assigns expert in background — replace setTimeout with real LLM call
    setTimeout(() => {
      const expert = aiAssignExpert(problem);
      setExpertMap((m) => ({ ...m, [problem._id]: expert }));
      setStatuses((s) => ({ ...s, [problem._id]: "active" }));
      setToast({
        message: `Expert assigned for "${problem.title}"`,
        sub: `${expert.name} · ${expert.badge}`,
      });
    }, 1800);
  };

  // ── User opens chat for an active session ──
  const handleOpenChat = (problem) => {
    setDrawer({ open: true, problem, expert: expertMap[problem._id] });
  };

  return (
    <>
      <div className={`ec-page ${drawer.open ? "ec-page--shifted" : ""}`}>

        {/* Page header */}
        <div className="ec-page__header">
          <h1 className="ec-page__title">Expert Connect</h1>
          <p className="ec-page__subtitle">
            Stuck on a problem? Our AI finds the best-matched community expert for you automatically.
          </p>
        </div>

        {/* Active session banner */}
        {activeSessions.length > 0 && (
          <div
            className="ec-page__banner"
            onClick={() => handleOpenChat(activeSessions[0])}
          >
            <span className="ec-page__banner-dot" />
            {activeSessions.length === 1
              ? `Active session: "${activeSessions[0].title}"`
              : `${activeSessions.length} active expert sessions`}
            <span className="ec-page__banner-arrow">↗</span>
          </div>
        )}

        {/* Problem cards */}
        <div className="ec-page__list">
          {problems.map((problem) => (
            <ExpertProblemCard
              key={problem._id}
              problem={problem}
              status={statuses[problem._id]}
              onConnect={handleConnect}
              onOpenChat={handleOpenChat}
            />
          ))}
        </div>

      </div>

      {/* Confirm modal */}
      {confirmData && (
        <ConfirmModal
          problem={confirmData.problem}
          cost={confirmData.cost}
          onClose={() => setConfirmData(null)}
          onConfirm={handleConfirm}
        />
      )}

      {/* Toast notification */}
      {toast && (
        <Toast
          message={toast.message}
          sub={toast.sub}
          onDone={() => setToast(null)}
        />
      )}

      {/* Slide-in chat drawer */}
      <ChatDrawer
        open={drawer.open}
        problem={drawer.problem}
        expert={drawer.expert}
        onClose={() => setDrawer((d) => ({ ...d, open: false }))}
      />
    </>
  );
};

export default ExpertConnectPage;