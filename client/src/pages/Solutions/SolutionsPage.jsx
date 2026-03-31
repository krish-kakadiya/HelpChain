import { useState, useEffect } from "react";
import "./SolutionsPage.css";
import api from "../../api/axios"; // ← your existing axios instance (port 3000, token handled)

/* ─────────────────────────────────────────────
   ICONS
───────────────────────────────────────────── */
const CheckIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const ClockIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
  </svg>
);

const UpIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 15l-6-6-6 6" />
  </svg>
);

const CalIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const MsgIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const fmt = (d) =>
  new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

/* ─────────────────────────────────────────────
   SOLUTION CARD
───────────────────────────────────────────── */
function SolutionCard({ sol }) {
  const isAccepted = sol.isAccepted;
  const question   = sol.question || {};
  const tags       = question.tags || [];
  const solCount   = question.solutionsCount ?? question.answers?.length ?? 0;

  return (
    <div className={`sp-card${isAccepted ? " sp-card--accepted" : ""}`}>
      {isAccepted && <div className="sp-card__bar" />}

      <div className="sp-card__inner">
        {/* ── Main content ── */}
        <div className="sp-card__body">
          <span className="sp-problem__label">Problem</span>
          <p className="sp-problem__title">{question.title || "Untitled Problem"}</p>

          <div className="sp-problem__meta">
            {tags.map((t) => (
              <span key={t} className="sp-tag">{t}</span>
            ))}
            {solCount > 0 && (
              <>
                <span className="sp-meta-dot">·</span>
                <span className="sp-meta-item"><MsgIcon />{solCount} solutions</span>
              </>
            )}
            {question.createdAt && (
              <>
                <span className="sp-meta-dot">·</span>
                <span className="sp-meta-item"><CalIcon />{fmt(question.createdAt)}</span>
              </>
            )}
          </div>

          <div className="sp-divider">
            <div className="sp-divider__line" />
            <span className="sp-divider__text">Your Answer</span>
            <div className="sp-divider__line" />
          </div>

          <p className="sp-answer">{sol.body}</p>

          <div className="sp-footer">
            {isAccepted ? (
              <span className="sp-status sp-status--accepted"><CheckIcon />Accepted</span>
            ) : (
              <span className="sp-status sp-status--review"><ClockIcon />Under Review</span>
            )}
            {sol.createdAt && (
              <span className="sp-date"><CalIcon />{fmt(sol.createdAt)}</span>
            )}
          </div>
        </div>


      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   SKELETON
───────────────────────────────────────────── */
function SkeletonCard() {
  return (
    <div className="sp-skeleton">
      <div className="sp-skeleton__line sp-skeleton__line--sm" />
      <div className="sp-skeleton__line sp-skeleton__line--lg" />
      <div className="sp-skeleton__line sp-skeleton__line--md" />
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────── */
export default function SolutionsPage() {
  const [solutions, setSolutions] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState(null);
  const [filter,    setFilter]    = useState("all");

  /* ── Fetch ── */
  useEffect(() => {
    const fetchSolutions = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data } = await api.get("/answer/my");
        const raw = data.data ?? data;
        setSolutions(Array.isArray(raw) ? raw : []);
      } catch (err) {
        setError(err.response?.data?.message || err.message || "Failed to load solutions");
      } finally {
        setLoading(false);
      }
    };
    fetchSolutions();
  }, []);

  /* ── Vote ── */
  const handleVote = async (answerId) => {
    const sol   = solutions.find((s) => s._id === answerId);
    const value = sol?.userVoted ? -1 : 1;

    setSolutions((prev) =>
      prev.map((s) =>
        s._id === answerId
          ? { ...s, userVoted: !s.userVoted, votes: s.votes + value }
          : s
      )
    );

    try {
      await api.post(`/answer/${answerId}/vote`, { value });
    } catch {
      setSolutions((prev) =>
        prev.map((s) =>
          s._id === answerId
            ? { ...s, userVoted: !s.userVoted, votes: s.votes - value }
            : s
        )
      );
    }
  };

  /* ── Filter ── */
  const visible =
    filter === "accepted" ? solutions.filter((s) =>  s.isAccepted) :
    filter === "review"   ? solutions.filter((s) => !s.isAccepted) :
    solutions;

  const totalVotes    = solutions.reduce((acc, s) => acc + (s.votes ?? 0), 0);
  const acceptedCount = solutions.filter((s) => s.isAccepted).length;

  return (
    <div className="sp-root">

      {/* Header */}
      <div className="sp-header">
        <div>
          <p className="sp-eyebrow">Your Contributions</p>
          <h1 className="sp-title">My Solutions</h1>
        </div>

        {!loading && !error && (
          <div className="sp-stats">
            <div className="sp-stat">
              <span className="sp-stat__val">{solutions.length}</span>
              <span className="sp-stat__lbl">Total</span>
            </div>
            <div className="sp-stat__sep" />
            <div className="sp-stat">
              <span className="sp-stat__val sp-stat__val--green">{acceptedCount}</span>
              <span className="sp-stat__lbl">Accepted</span>
            </div>
            <div className="sp-stat__sep" />
            <div className="sp-stat">
              <span className="sp-stat__val">{totalVotes}</span>
              <span className="sp-stat__lbl">Votes</span>
            </div>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="sp-tabs">
        {[
          { id: "all",      label: "All" },
          { id: "accepted", label: "Accepted" },
          { id: "review",   label: "Under Review" },
        ].map((f) => (
          <button
            key={f.id}
            className={`sp-tab${filter === f.id ? " sp-tab--active" : ""}`}
            onClick={() => setFilter(f.id)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="sp-list">
        {loading ? (
          [1, 2, 3].map((i) => <SkeletonCard key={i} />)
        ) : error ? (
          <div className="sp-empty">
            <div className="sp-empty__icon">⚠️</div>
            <p className="sp-empty__title">Something went wrong</p>
            <p className="sp-empty__sub">{error}</p>
          </div>
        ) : visible.length === 0 ? (
          <div className="sp-empty">
            <div className="sp-empty__icon">📭</div>
            <p className="sp-empty__title">No solutions found</p>
            <p className="sp-empty__sub">
              {filter === "all"
                ? "You haven't posted any answers yet."
                : `No ${filter === "accepted" ? "accepted" : "pending"} solutions.`}
            </p>
          </div>
        ) : (
          visible.map((sol, i) => (
            <div key={sol._id} className="sp-card-wrap" style={{ animationDelay: `${i * 40}ms` }}>
              <SolutionCard sol={sol} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}