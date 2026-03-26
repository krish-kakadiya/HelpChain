import React, { useState, useEffect } from 'react';
import { Crown, TrendingUp, Award, TrendingDown, Minus } from 'lucide-react';
import './Leaderboard.css';
import api from '../../api/axios';

// ─── Sub-components ───────────────────────────────────────────────────────────
const MedalIcon = ({ rank }) => {
  const colors = { 1: '#f5a623', 2: '#a0aec0', 3: '#c47d2c' };
  if (rank > 3) return <span className="lb-rank-num">{rank}</span>;
  return (
    <Crown
      size={16}
      className="lb-crown"
      style={{ color: colors[rank], filter: `drop-shadow(0 0 6px ${colors[rank]}88)` }}
    />
  );
};

const TrendBadge = ({ trend }) => {
  if (trend === 'up')   return <span className="lb-trend lb-trend--up"><TrendingUp size={11} /></span>;
  if (trend === 'down') return <span className="lb-trend lb-trend--down"><TrendingDown size={11} /></span>;
  return <span className="lb-trend lb-trend--flat"><Minus size={11} /></span>;
};

// ─── Main Component ───────────────────────────────────────────────────────────
const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await api.get('/leaderboard');
        if (res.data && res.data.success) {
          setLeaderboardData(res.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch leaderboard", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  if (loading) return <div className="lb" style={{ padding: 20 }}>Loading leaderboard...</div>;
  if (!leaderboardData || leaderboardData.length === 0) return <div className="lb" style={{ padding: 20 }}>No leaderboard data available completely yet. Be the first!</div>;

  const maxPoints = leaderboardData[0]?.points || 1;

  return (
    <div className="lb">

      {/* Column headers */}
      <div className="lb-header">
        <span className="lb-col lb-col--rank">#</span>
        <span className="lb-col lb-col--user">User</span>
        <span className="lb-col lb-col--badges">Badges</span>
        <span className="lb-col lb-col--bar">Progress</span>
        <span className="lb-col lb-col--pts">Points</span>
      </div>

      <div className="lb-body">
        {leaderboardData.map((user, idx) => {
          const isPodium = user.rank <= 3;
          const barWidth = Math.round((user.points / maxPoints) * 100);

          return (
            <div
              key={user.rank}
              className={`lb-row${isPodium ? ' lb-row--podium' : ''}`}
              style={{ animationDelay: `${idx * 40}ms` }}
            >
              {/* Rank */}
              <div className="lb-col lb-col--rank">
                <MedalIcon rank={user.rank} />
              </div>

              {/* Avatar + name */}
              <div className="lb-col lb-col--user">
                <div className={`lb-avatar lb-avatar--${user.rank <= 3 ? `p${user.rank}` : 'default'}`}>
                  {user.avatar}
                </div>
                <div className="lb-userinfo">
                  <span className="lb-name">{user.name}</span>
                  <span className="lb-handle">{user.username}</span>
                </div>
                <TrendBadge trend={user.trend} />
              </div>

              {/* Badge count */}
              <div className="lb-col lb-col--badges">
                <span className="lb-badge-pill">
                  <Award size={11} />
                  {user.badges}
                </span>
              </div>

              {/* Progress bar */}
              <div className="lb-col lb-col--bar">
                <div className="lb-bar-track">
                  <div
                    className={`lb-bar-fill lb-bar-fill--${isPodium ? `p${user.rank}` : 'default'}`}
                    style={{ '--w': `${barWidth}%`, animationDelay: `${idx * 60 + 200}ms` }}
                  />
                </div>
              </div>

              {/* Points */}
              <div className="lb-col lb-col--pts">
                <span className={`lb-pts${isPodium ? ' lb-pts--podium' : ''}`}>
                  {user.points.toLocaleString()}
                </span>
                <span className="lb-pts-label">pts</span>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};

export default Leaderboard;