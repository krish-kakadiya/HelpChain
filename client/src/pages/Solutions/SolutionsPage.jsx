import { useState, useMemo } from "react";
import "./SolutionsPage.css";

/* ─────────────────────────────────────────────
   MOCK DATA  (replace with API fetch)
   Shape mirrors backend response exactly
───────────────────────────────────────────── */
const MOCK_SOLUTIONS = [
  {
    id: "sol_001",
    rank: 1,
    votes: 87,
    userVoted: true,
    status: "accepted",
    date: "2025-01-14",
    problem: { id: "p_101", title: "How to implement JWT refresh token rotation in a stateless Node.js API?" },
    body: "Use a short-lived access token (15 min) paired with a rotating refresh token stored as an httpOnly cookie. On each refresh, invalidate the old token, issue a new pair, and maintain a server-side denylist for revoked tokens.",
    tags: ["Node.js", "JWT", "Auth", "Security"],
  },
  {
    id: "sol_002",
    rank: 2,
    votes: 64,
    userVoted: false,
    status: "accepted",
    date: "2025-01-09",
    problem: { id: "p_102", title: "Optimizing SQL query performance for a 50M+ row table with complex JOINs" },
    body: "Partition the table by date range and add composite indexes on frequently joined columns. Use query planner hints to avoid sequential scans and consider materialized views for repeated aggregation patterns.",
    tags: ["SQL", "Performance", "Indexing"],
  },
  {
    id: "sol_003",
    rank: 3,
    votes: 51,
    userVoted: true,
    status: "accepted",
    date: "2024-12-28",
    problem: { id: "p_103", title: "Best pattern for managing global state without Redux in React 18?" },
    body: "Combine useContext with useReducer for structured state slices, and use Zustand for performance-critical shared state. Avoid prop drilling with strategic context boundaries.",
    tags: ["React", "State", "Zustand"],
  },
  {
    id: "sol_004",
    rank: 0,
    votes: 29,
    userVoted: false,
    status: "accepted",
    date: "2024-12-20",
    problem: { id: "p_104", title: "How to handle race conditions in concurrent API requests using async/await?" },
    body: "Use AbortController paired with a debounce timer. Cancel the previous controller on each new keystroke, then create a fresh controller for the next fetch call.",
    tags: ["JavaScript", "Async", "Concurrency"],
  },
  {
    id: "sol_005",
    rank: 0,
    votes: 11,
    userVoted: false,
    status: "pending",
    date: "2025-01-18",
    problem: { id: "p_105", title: "Efficient way to debounce search input and cancel previous fetch requests?" },
    body: "AbortController with a debounce timer prevents stale responses. Cancel on each keystroke and create a fresh controller before dispatching the next fetch.",
    tags: ["JavaScript", "Fetch API", "UX"],
  },
  {
    id: "sol_006",
    rank: 0,
    votes: 18,
    userVoted: false,
    status: "accepted",
    date: "2025-01-02",
    problem: { id: "p_106", title: "How to structure a monorepo with shared TypeScript configs?" },
    body: "Use a root tsconfig.base.json with path aliases, then extend it in each package. Turborepo handles task orchestration while keeping configs DRY across workspaces.",
    tags: ["TypeScript", "Monorepo", "Turborepo"],
  },
];

/* ─────────────────────────────────────────────
   RANK CONFIG
───────────────────────────────────────────── */
const RANK_CONFIG = {
  1: {
    medal: "🥇",
    ribbon: "1st",
    bgColor: "#fffbeb",
    borderColor: "#fcd34d",
    stripeColor: "linear-gradient(180deg,#fbbf24,#d97706)",
    numColor: "#d97706",
  },
  2: {
    medal: "🥈",
    ribbon: "2nd",
    bgColor: "#f8fafc",
    borderColor: "#cbd5e1",
    stripeColor: "linear-gradient(180deg,#b0bec5,#94a3b8)",
    numColor: "#64748b",
  },
  3: {
    medal: "🥉",
    ribbon: "3rd",
    bgColor: "#fdf6f0",
    borderColor: "#e5a96a",
    stripeColor: "linear-gradient(180deg,#d4956a,#b45309)",
    numColor: "#b45309",
  },
};

/* ─────────────────────────────────────────────
   ICONS
───────────────────────────────────────────── */
const ChevronUp = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 15l-6-6-6 6" />
  </svg>
);

const CalIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const ShieldIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
    stroke="#5c6bc0" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const ArrowUpIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
    stroke="#5c6bc0" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 15l7-7 7 7" />
  </svg>
);

const StarIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="#d97706" stroke="none">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

const ChevronLeft = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 18l-6-6 6-6" />
  </svg>
);

const ChevronRight = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 18l6-6-6-6" />
  </svg>
);

/* ─────────────────────────────────────────────
   SUB-COMPONENTS
───────────────────────────────────────────── */
function StatPill({ icon, value, label, valueStyle }) {
  return (
    <div className="sp-stat">
      <div className="sp-stat__icon">{icon}</div>
      <span className="sp-stat__val" style={valueStyle}>{value}</span>
      <span className="sp-stat__lbl">{label}</span>
    </div>
  );
}

function RankRibbon({ rank }) {
  const cfg = RANK_CONFIG[rank];
  return (
    <div className="sp-ribbon">
      <div className="sp-ribbon__inner" style={{ background: cfg.stripeColor }}>
        {cfg.medal} {cfg.ribbon}
      </div>
    </div>
  );
}

function VoteBlock({ votes, userVoted, rank, medal, onVote }) {
  const cfg = RANK_CONFIG[rank];
  const numColor = cfg ? cfg.numColor : "var(--c-primary)";

  return (
    <div className="sp-card__vote">
      <button
        className={`sp-vote-btn${userVoted ? " voted" : ""}`}
        onClick={(e) => { e.stopPropagation(); onVote(); }}
        aria-label="Upvote"
      >
        <ChevronUp size={17} />
      </button>
      <span className="sp-vote-num" style={{ color: numColor }}>{votes}</span>
      <span className="sp-vote-lbl">votes</span>
      {medal && <span className="sp-medal">{medal}</span>}
    </div>
  );
}

function SolutionCard({ sol, onVote }) {
  const cfg   = RANK_CONFIG[sol.rank];
  const isTop = sol.rank > 0;

  const fmt = (d) =>
    new Date(d).toLocaleDateString("en-US", {
      month: "short", day: "numeric", year: "numeric",
    });

  return (
    <div
      className={`sp-card${isTop ? " sp-card--rank" : ""}`}
      style={isTop ? { backgroundColor: cfg.bgColor, borderColor: cfg.borderColor } : {}}
    >
      {/* Left color stripe */}
      {isTop && (
        <div className="sp-card__stripe" style={{ background: cfg.stripeColor }} />
      )}

      {/* Corner ribbon */}
      {isTop && <RankRibbon rank={sol.rank} />}

      <div className="sp-card__body">
        {/* Left content */}
        <div className="sp-card__left">
          <div>
            <div className="sp-card__problem-label">Problem</div>
            <div className="sp-card__problem-title">{sol.problem.title}</div>
          </div>

          <p className="sp-card__solution">{sol.body}</p>

          <div className="sp-card__tags">
            {sol.tags.map((t) => (
              <span key={t} className="sp-card__tag">{t}</span>
            ))}
          </div>

          <div className="sp-card__footer">
            <span className={`sp-status sp-status--${sol.status}`}>
              <span className="sp-status__dot" />
              {sol.status === "accepted" ? "Accepted" : "Under Review"}
            </span>
            <span className="sp-date">
              <CalIcon />
              {fmt(sol.date)}
            </span>
          </div>
        </div>

        {/* Right vote block */}
        <VoteBlock
          votes={sol.votes}
          userVoted={sol.userVoted}
          rank={sol.rank}
          medal={cfg?.medal}
          onVote={() => onVote(sol.id)}
        />
      </div>
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

  /* Vote toggle
     Production → POST /api/solutions/:id/vote */
  const handleVote = (id) => {
    setSolutions((prev) =>
      prev.map((s) =>
        s.id === id
          ? { ...s, userVoted: !s.userVoted, votes: s.userVoted ? s.votes - 1 : s.votes + 1 }
          : s
      )
    );
  };

  /* Filter + Sort
     Production → GET /api/solutions?filter=&sort=&page= */
  const visible = useMemo(() => {
    let list = [...solutions];
    if (filter === "accepted")    list = list.filter((s) => s.status === "accepted");
    else if (filter === "rank-1") list = list.filter((s) => s.rank === 1);
    else if (filter === "rank-2") list = list.filter((s) => s.rank === 2);
    else if (filter === "rank-3") list = list.filter((s) => s.rank === 3);

    if (sort === "votes")  list.sort((a, b) => b.votes - a.votes);
    if (sort === "newest") list.sort((a, b) => new Date(b.date) - new Date(a.date));
    if (sort === "oldest") list.sort((a, b) => new Date(a.date) - new Date(b.date));
    return list;
  }, [solutions, filter, sort]);

  const totalPages = Math.max(1, Math.ceil(visible.length / PAGE_SIZE));
  const paginated  = visible.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  /* Stats → Production: GET /api/solutions/stats */
  const stats = useMemo(() => ({
    total:  solutions.length,
    votes:  solutions.reduce((s, x) => s + x.votes, 0),
    ranked: solutions.filter((x) => x.rank > 0).length,
  }), [solutions]);

  const FILTERS = [
    { id: "all",      label: "All" },
    { id: "accepted", label: "Accepted" },
    { id: "rank-1",   label: "1st", dot: "#d97706" },
    { id: "rank-2",   label: "2nd", dot: "#94a3b8" },
    { id: "rank-3",   label: "3rd", dot: "#c2763b" },
  ];

  return (
    <div className="sp-root">

      {/* ── Header ── */}
      <div className="sp-header">
        <div className="sp-title-block">
          <div className="sp-eyebrow">Your Contributions</div>
          <h1 className="sp-title">My Solutions</h1>
        </div>

        <div className="sp-stats">
          <StatPill icon={<ShieldIcon />} value={stats.total} label="Solutions" />
          <StatPill icon={<ArrowUpIcon />} value={stats.votes} label="Total Votes" />
          <StatPill
            icon={<StarIcon />}
            value={stats.ranked}
            label="Best Ranked"
            valueStyle={{ color: "#d97706" }}
          />
        </div>
      </div>

      {/* ── Toolbar ── */}
      <div className="sp-toolbar">
        {FILTERS.map((f, i) => (
          <span key={f.id} className="sp-filter-wrap">
            {i === 2 && <span className="sp-divider" />}
            <button
              className={`sp-filter${filter === f.id ? " active" : ""}`}
              onClick={() => { setFilter(f.id); setPage(1); }}
            >
              {f.dot && <span className="rank-dot" style={{ background: f.dot }} />}
              {f.label}
            </button>
          </span>
        ))}

        <select
          className="sp-sort"
          value={sort}
          onChange={(e) => { setSort(e.target.value); setPage(1); }}
        >
          <option value="newest">Newest First</option>
          <option value="votes">Most Votes</option>
          <option value="oldest">Oldest First</option>
        </select>
      </div>

      {/* ── Solution Cards ── */}
      <div className="sp-list">
        {paginated.length === 0 ? (
          <div className="sp-empty">
            <div className="sp-empty__icon">📭</div>
            <div className="sp-empty__title">No solutions found</div>
            <div className="sp-empty__sub">Try a different filter or contribute your first solution.</div>
          </div>
        ) : (
          paginated.map((sol, i) => (
            <div key={sol.id} className="sp-card-wrap" style={{ animationDelay: `${i * 45}ms` }}>
              <SolutionCard sol={sol} onVote={handleVote} />
            </div>
          ))
        )}
      </div>

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div className="sp-pagination">
          <button
            className="sp-page-btn"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            <ChevronLeft />
          </button>

          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              className={`sp-page-btn${page === i + 1 ? " active" : ""}`}
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}

          <button
            className="sp-page-btn"
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            <ChevronRight />
          </button>
        </div>
      )}

    </div>
  );
}