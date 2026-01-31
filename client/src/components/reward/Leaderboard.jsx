import React from 'react';
import { Crown, TrendingUp, Award } from 'lucide-react';
import './Leaderboard.css';

const Leaderboard = () => {
  const leaderboardData = [
    {
      rank: 1,
      name: 'Alex Johnson',
      username: '@alexj',
      points: 3850,
      avatar: 'AJ',
      trend: 'up',
      badges: 15
    },
    {
      rank: 2,
      name: 'Sarah Williams',
      username: '@sarah_w',
      points: 3420,
      avatar: 'SW',
      trend: 'up',
      badges: 12
    },
    {
      rank: 3,
      name: 'Mike Chen',
      username: '@mikechen',
      points: 3180,
      avatar: 'MC',
      trend: 'down',
      badges: 11
    },
    {
      rank: 4,
      name: 'Emily Davis',
      username: '@emily_d',
      points: 2950,
      avatar: 'ED',
      trend: 'up',
      badges: 10
    },
    {
      rank: 5,
      name: 'David Martinez',
      username: '@dmartinez',
      points: 2740,
      avatar: 'DM',
      trend: 'same',
      badges: 9
    },
    {
      rank: 6,
      name: 'Lisa Anderson',
      username: '@lisa_a',
      points: 2580,
      avatar: 'LA',
      trend: 'up',
      badges: 8
    },
    {
      rank: 7,
      name: 'James Taylor',
      username: '@jtaylor',
      points: 2410,
      avatar: 'JT',
      trend: 'down',
      badges: 8
    },
    {
      rank: 8,
      name: 'Anna White',
      username: '@anna_w',
      points: 2250,
      avatar: 'AW',
      trend: 'up',
      badges: 7
    },
    {
      rank: 9,
      name: 'Chris Brown',
      username: '@chrisbrown',
      points: 2090,
      avatar: 'CB',
      trend: 'up',
      badges: 7
    },
    {
      rank: 10,
      name: 'Rachel Green',
      username: '@rachel_g',
      points: 1950,
      avatar: 'RG',
      trend: 'same',
      badges: 6
    }
  ];

  const getRankIcon = (rank) => {
    if (rank === 1) return <Crown size={20} className="rank-icon rank-icon--gold" />;
    if (rank === 2) return <Crown size={20} className="rank-icon rank-icon--silver" />;
    if (rank === 3) return <Crown size={20} className="rank-icon rank-icon--bronze" />;
    return null;
  };

  const getTrendIcon = (trend) => {
    if (trend === 'up') return <TrendingUp size={16} className="trend-icon trend-icon--up" />;
    if (trend === 'down') return <TrendingUp size={16} className="trend-icon trend-icon--down" />;
    return null;
  };

  return (
    <div className="leaderboard">
      <div className="leaderboard__list">
        {leaderboardData.map((user, index) => (
          <div 
            key={user.rank} 
            className={`leaderboard-item ${user.rank <= 3 ? 'leaderboard-item--top' : ''}`}
          >
            <div className="leaderboard-item__rank">
              {getRankIcon(user.rank) || (
                <span className="rank-number">{user.rank}</span>
              )}
            </div>

            <div className="leaderboard-item__avatar">
              {user.avatar}
            </div>

            <div className="leaderboard-item__info">
              <div className="leaderboard-item__name">{user.name}</div>
              <div className="leaderboard-item__username">{user.username}</div>
            </div>

            <div className="leaderboard-item__stats">
              <div className="stat-badge">
                <Award size={14} />
                <span>{user.badges}</span>
              </div>
              {getTrendIcon(user.trend)}
            </div>

            <div className="leaderboard-item__points">
              {user.points.toLocaleString()}
              <span className="points-label">pts</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;