import { useState, useMemo } from "react";
import "./SolutionsPage.css";

/* ─────────────────────────────────────────────
   MOCK DATA — each solution has the question
   object shape you shared + answer body
───────────────────────────────────────────── */
const MOCK_SOLUTIONS = [
  {
    id: "sol_001",
    rank: 1,
    votes: 87,
    userVoted: true,
    status: "accepted",
    date: "2025-01-14",
    question: {
      id: 1,
      title: "How to implement JWT refresh token rotation in a stateless Node.js API?",
      tags: ["Node.js", "JWT", "Auth", "Security"],
      uploaderName: "Sarah Chen",
      solutions: 4,
      image: null,
    },
    body: "Use a short-lived access token (15 min) paired with a rotating refresh token stored as an httpOnly cookie. On each refresh, invalidate the old token, issue a new pair, and maintain a server-side denylist for revoked tokens.",
  },
  {
    id: "sol_002",
    rank: 2,
    votes: 64,
    userVoted: false,
    status: "accepted",
    date: "2025-01-09",
    question: {
      id: 2,
      title: "Optimizing SQL query performance for a 50M+ row table with complex JOINs",
      tags: ["SQL", "Performance", "Indexing"],
      uploaderName: "Ali Raza",
      solutions: 6,
      image: null,
    },
    body: "Partition the table by date range and add composite indexes on frequently joined columns. Use query planner hints to avoid sequential scans and consider materialized views for repeated aggregation patterns.",
  },
  {
    id: "sol_003",
    rank: 3,
    votes: 51,
    userVoted: true,
    status: "accepted",
    date: "2024-12-28",
    question: {
      id: 3,
      title: "Best pattern for managing global state without Redux in React 18?",
      tags: ["React", "State", "Zustand"],
      uploaderName: "Priya Nair",
      solutions: 8,
      image: null,
    },
    body: "Combine useContext with useReducer for structured state slices, and use Zustand for performance-critical shared state. Avoid prop drilling with strategic context boundaries.",
  },
  {
    id: "sol_004",
    rank: 0,
    votes: 29,
    userVoted: false,
    status: "accepted",
    date: "2024-12-20",
    question: {
      id: 4,
      title: "How to handle race conditions in concurrent API requests using async/await?",
      tags: ["JavaScript", "Async", "Concurrency"],
      uploaderName: "John Doe",
      solutions: 3,
      image: null,
    },
    body: "Use AbortController paired with a debounce timer. Cancel the previous controller on each new keystroke, then create a fresh controller for the next fetch call.",
  },
  {
    id: "sol_005",
    rank: 0,
    votes: 11,
    userVoted: false,
    status: "pending",
    date: "2025-01-18",
    question: {
      id: 5,
      title: "Fixing the UI layout for Helpchain to ensure components don't overlap.",
      tags: ["React", "CSS"],
      uploaderName: "John Doe",
      solutions: 3,
      image: null,
    },
    body: "AbortController with a debounce timer prevents stale responses. Cancel on each keystroke and create a fresh controller before dispatching the next fetch.",
  },
  {
    id: "sol_006",
    rank: 0,
    votes: 18,
    userVoted: false,
    status: "accepted",
    date: "2025-01-02",
    question: {
      id: 6,
      title: "How to structure a monorepo with shared TypeScript configs?",
      tags: ["TypeScript", "Monorepo", "Turborepo"],
      uploaderName: "Marcus Webb",
      solutions: 5,
      image: null,
    },
    body: "Use a root tsconfig.base.json with path aliases, then extend it in each package. Turborepo handles task orchestration while keeping configs DRY across workspaces.",
  },
];

/* ─────────────────────────────────────────────
   RANK CONFIG
───────────────────────────────────────────── */
const RANK = {
  1: { medal: "🥇", label: "1st Place", stripe: "linear-gradient(180deg,#fbbf24,#d97706)", accent: "#d97706", tint: "#fffbeb", border: "#fde68a" },
  2: { medal: "🥈", label: "2nd Place", stripe: "linear-gradient(180deg,#b0bec5,#78909c)", accent: "#607d8b", tint: "#f8fafc", border: "#cfd8dc" },
  3: { medal: "🥉", label: "3rd Place", stripe: "linear-gradient(180deg,#d4956a,#bf6f3a)", accent: "#b45309", tint: "#fdf6f0", border: "#f4c89a" },
};

/* ─────────────────────────────────────────────
   ICONS
───────────────────────────────────────────── */
const UpIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 15l-6-6-6 6"/></svg>
);
const CalIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
);
const UserIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
);
const MsgIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
);
const ChevL = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
);
const ChevR = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
);

/* ─────────────────────────────────────────────
   SOLUTION CARD
───────────────────────────────────────────── */
function SolutionCard({ sol, onVote }) {
  const ranked = sol.rank > 0;
  const cfg    = ranked ? RANK[sol.rank] : null;
  const accent = cfg ? cfg.accent : "#3f51b5";

  const fmt = (d) => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  return (
    <div
      className={`ms-card${ranked ? " ms-card--ranked" : ""}`}
      style={ranked ? { borderColor: cfg.border, backgroundColor: cfg.tint } : {}}
    >
      {ranked && <div className="ms-card__stripe" style={{ background: cfg.stripe }} />}

      <div className="ms-card__content">

        {/* ── Question block ── */}
        <div className="ms-q">
          <div className="ms-q__header">
            <span className="ms-q__eyebrow">Question</span>
            <div className="ms-q__meta">
              <span className="ms-meta-item"><UserIcon />{sol.question.uploaderName}</span>
              <span className="ms-meta-item"><MsgIcon />{sol.question.solutions} answers</span>
            </div>
          </div>
          <p className="ms-q__title">{sol.question.title}</p>
          <div className="ms-q__tags">
            {sol.question.tags.map(t => <span key={t} className="ms-tag">{t}</span>)}
          </div>
        </div>

        {/* ── Your Answer label row ── */}
        <div className="ms-sep">
          <div className="ms-sep__line" />
          <span className="ms-sep__text">Your Answer</span>
          <div className="ms-sep__line" />
        </div>

        {/* ── Answer + vote ── */}
        <div className="ms-answer-row">
          <div className="ms-answer">
            <p className="ms-answer__body">{sol.body}</p>

            <div className="ms-answer__footer">
              {/* Status */}
              <span className={`ms-status ms-status--${sol.status}`}>
                <span className="ms-status__dot" />
                {sol.status === "accepted" ? "Accepted" : "Under Review"}
              </span>

              {/* Rank pill */}
              {ranked && (
                <span className="ms-rank-pill" style={{ color: cfg.accent, background: cfg.accent + "15", border: `1px solid ${cfg.accent}35` }}>
                  {cfg.medal} {cfg.label}
                </span>
              )}

              {/* Date */}
              <span className="ms-date"><CalIcon />{fmt(sol.date)}</span>
            </div>
          </div>

          {/* Vote column */}
          <div className="ms-vote">
            <button
              className={`ms-vote__btn${sol.userVoted ? " ms-vote__btn--active" : ""}`}
              style={sol.userVoted ? { color: accent, background: accent + "18", borderColor: accent + "45" } : {}}
              onClick={(e) => { e.stopPropagation(); onVote(sol.id); }}
              aria-label="Upvote"
            >
              <UpIcon />
            </button>
            <span className="ms-vote__count" style={{ color: accent }}>{sol.votes}</span>
            <span className="ms-vote__label">votes</span>
          </div>
        </div>

      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   STAT PILL
───────────────────────────────────────────── */
function StatPill({ iconSvg, value, label, valColor }) {
  return (
    <div className="ms-stat">
      <div className="ms-stat__icon">{iconSvg}</div>
      <span className="ms-stat__val" style={valColor ? { color: valColor } : {}}>{value}</span>
      <span className="ms-stat__lbl">{label}</span>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────── */
export default function SolutionsPage() {
  const [solutions, setSolutions] = useState(MOCK_SOLUTIONS);
  const [filter, setFilter]       = useState("all");
  const [sort, setSort]           = useState("newest");
  const [page, setPage]           = useState(1);
  const PAGE_SIZE = 10;

  const handleVote = (id) => {
    setSolutions(prev =>
      prev.map(s => s.id === id
        ? { ...s, userVoted: !s.userVoted, votes: s.userVoted ? s.votes - 1 : s.votes + 1 }
        : s
      )
    );
  };

  const visible = useMemo(() => {
    let list = [...solutions];
    if (filter === "accepted") list = list.filter(s => s.status === "accepted");
    if (filter === "pending")  list = list.filter(s => s.status === "pending");
    if (filter === "ranked")   list = list.filter(s => s.rank > 0);
    if (sort === "votes")      list.sort((a, b) => b.votes - a.votes);
    if (sort === "newest")     list.sort((a, b) => new Date(b.date) - new Date(a.date));
    if (sort === "oldest")     list.sort((a, b) => new Date(a.date) - new Date(b.date));
    return list;
  }, [solutions, filter, sort]);

  const totalPages = Math.max(1, Math.ceil(visible.length / PAGE_SIZE));
  const paginated  = visible.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const stats = useMemo(() => ({
    total:    solutions.length,
    votes:    solutions.reduce((s, x) => s + x.votes, 0),
    accepted: solutions.filter(x => x.status === "accepted").length,
    ranked:   solutions.filter(x => x.rank > 0).length,
  }), [solutions]);

  const FILTERS = [
    { id: "all",      label: "All" },
    { id: "accepted", label: "Accepted" },
    { id: "pending",  label: "Under Review" },
    { id: "ranked",   label: "🏅 Ranked" },
  ];

  return (
    <div className="ms-root">

      {/* ── Header ── */}
      <div className="ms-header">
        <div>
          <div className="ms-eyebrow">Your Contributions</div>
          <h1 className="ms-title">My Solutions</h1>
        </div>

        <div className="ms-stats">
          <StatPill
            iconSvg={<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#5c6bc0" strokeWidth="2.2" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>}
            value={stats.total} label="Solutions"
          />
          <StatPill
            iconSvg={<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#5c6bc0" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 15l7-7 7 7"/></svg>}
            value={stats.votes} label="Total Votes"
          />
          <StatPill
            iconSvg={<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
            value={stats.accepted} label="Accepted" valColor="#16a34a"
          />
          <StatPill
            iconSvg={<svg width="13" height="13" viewBox="0 0 24 24" fill="#d97706" stroke="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>}
            value={stats.ranked} label="Ranked" valColor="#d97706"
          />
        </div>
      </div>

      {/* ── Toolbar ── */}
      <div className="ms-toolbar">
        <div className="ms-filters">
          {FILTERS.map(f => (
            <button
              key={f.id}
              className={`ms-filter${filter === f.id ? " ms-filter--active" : ""}`}
              onClick={() => { setFilter(f.id); setPage(1); }}
            >
              {f.label}
            </button>
          ))}
        </div>
        <select className="ms-sort" value={sort} onChange={e => { setSort(e.target.value); setPage(1); }}>
          <option value="newest">Newest First</option>
          <option value="votes">Most Votes</option>
          <option value="oldest">Oldest First</option>
        </select>
      </div>

      {/* ── List ── */}
      <div className="ms-list">
        {paginated.length === 0 ? (
          <div className="ms-empty">
            <div className="ms-empty__icon">📭</div>
            <div className="ms-empty__title">No solutions found</div>
            <div className="ms-empty__sub">Try a different filter or post your first answer.</div>
          </div>
        ) : (
          paginated.map((sol, i) => (
            <div key={sol.id} className="ms-card-wrap" style={{ animationDelay: `${i * 50}ms` }}>
              <SolutionCard sol={sol} onVote={handleVote} />
            </div>
          ))
        )}
      </div>

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div className="ms-pagination">
          <button className="ms-page-btn" disabled={page === 1} onClick={() => setPage(p => p - 1)}><ChevL /></button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button key={i + 1} className={`ms-page-btn${page === i + 1 ? " ms-page-btn--on" : ""}`} onClick={() => setPage(i + 1)}>{i + 1}</button>
          ))}
          <button className="ms-page-btn" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}><ChevR /></button>
        </div>
      )}
    </div>
  );
}