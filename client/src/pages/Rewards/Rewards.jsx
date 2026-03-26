// ─── Rewards.jsx ─────────────────────────────────────────────────────────────
// Changes from original:
//   1. MyAchievements removed
//   2. 3rd StatsCard replaced with BadgeCollectionCard
//   3. collectedBadges state + handleBadgeCollect wired up

import React, { useState } from 'react';
import { Trophy, Upload, ChevronDown, ChevronUp } from 'lucide-react';
import BadgeSlider         from '../../components/reward/BadgeSlider';
import StatsCard           from '../../components/reward/StatsCard';
import Leaderboard         from '../../components/reward/Leaderboard';
import './Rewards.css';
import BadgeCollection from '../../components/reward/Badgecollection';
import { useAuth } from '../../context/AuthContext';

const Rewards = () => {
  const { user } = useAuth();
  const [leaderboardExpanded, setLeaderboardExpanded] = useState(false);

  // ── Badge collection state ───────────────────────────────────────────────
  // Pre-populate collectedBadges from your backend on mount:
  const initialBadges = user?.badges?.map(b => typeof b === 'object' ? b.code : b) || [];
  const [collectedBadges, setCollectedBadges] = useState(initialBadges);

  const handleBadgeCollect = (badgeId) => {
    setCollectedBadges(prev => [...prev, badgeId]);
    // ← YOUR API CALL HERE:
    // await api.post('/badges/collect', { badgeId });
  };

  const problemPoints = (user?.problemCount || 0) * 5;
  const answerPoints = (user?.answerCount || 0) * 10;
  const totalUploadedPoints = problemPoints + answerPoints;

  // ── Stats ────────────────────────────────────────────────────────────────
  const statsData = {
    totalPoints:    user?.points || 0,
    uploadedPoints: totalUploadedPoints,
  };

  const userPoints = user?.points || 0;

  return (
    <div className="rewards-page">

      {/* ── Stats row ── */}
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
          details={{ problemPoints, answerPoints }}
          color="blue"
          clickable
        />

        {/* 3rd card — Badge Collection */}
        <BadgeCollection
          userPoints={userPoints}
          collectedIds={collectedBadges}
          onCollect={handleBadgeCollect}
        />
      </div>

      {/* ── Badge Slider ── */}
      <div className="rewards-page__slider">
        <BadgeSlider />
      </div>

      {/* ── Leaderboard ── */}
      <div className="rewards-page__section">
          <h2 className="section-header__title">
            <Trophy size={22} />
            Overall Leaderboard
          </h2>
          <div className="section-content">
            <Leaderboard />
          </div>
      </div>

    </div>
  );
};

export default Rewards;