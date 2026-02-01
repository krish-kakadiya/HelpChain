import React, { useState } from 'react';
import { Trophy, Upload, Target, ChevronDown, ChevronUp } from 'lucide-react';
import BadgeSlider from '../../components/reward/BadgeSlider';
import StatsCard from '../../components/reward/StatsCard';
import Leaderboard from '../../components/reward/Leaderboard';
import MyAchievements from '../../components/reward/MyAchievements';
import hundredBadge from '../../assets/badges/hundred.png';
import './Rewards.css';

const Rewards = () => {
  const [leaderboardExpanded, setLeaderboardExpanded] = useState(false);
  const [achievementsExpanded, setAchievementsExpanded] = useState(false);

  // Stats data
  const statsData = {
    totalPoints: 1250,
    uploadedPoints: 850,
    nearestBadge: {
      name: '100 Solutions',
      current: 78,
      target: 100,
      image: hundredBadge
    }
  };

  return (
    <div className="rewards-page">
      {/* Top Stats Cards */}
      <div className="rewards-page__stats">
        <StatsCard
          icon={Trophy}
          label="Total Points"
          value={statsData.totalPoints}
          color="purple"
        />
        
        <StatsCard
          icon={Upload}
          label="Uploaded Points"
          value={statsData.uploadedPoints}
          color="blue"
          clickable={true}
        />
        
        <StatsCard
          icon={Target}
          label="Nearest Badge"
          value={`${statsData.nearestBadge.current}/${statsData.nearestBadge.target}`}
          subtitle={statsData.nearestBadge.name}
          badge={statsData.nearestBadge}
          color="green"
        />
      </div>

      {/* Badge Slider */}
      <div className="rewards-page__slider">
        <BadgeSlider />
      </div>

      {/* Leaderboard Section */}
      <div className="rewards-page__section">
        <div 
          className="section-header"
          onClick={() => setLeaderboardExpanded(!leaderboardExpanded)}
        >
          <h2 className="section-header__title">
            <Trophy size={24} />
            Overall Leaderboard
          </h2>
          <button className="section-header__toggle">
            {leaderboardExpanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
          </button>
        </div>
        
        {leaderboardExpanded && (
          <div className="section-content">
            <Leaderboard />
          </div>
        )}
      </div>

      {/* My Achievements Section */}
      <div className="rewards-page__section">
        <div 
          className="section-header"
          onClick={() => setAchievementsExpanded(!achievementsExpanded)}
        >
          <h2 className="section-header__title">
            <Target size={24} />
            My Achievements
          </h2>
          <button className="section-header__toggle">
            {achievementsExpanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
          </button>
        </div>
        
        {achievementsExpanded && (
          <div className="section-content">
            <MyAchievements />
          </div>
        )}
      </div>
    </div>
  );
};

export default Rewards;