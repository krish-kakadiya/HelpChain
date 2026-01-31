import React from 'react';
import { Trophy, Lock, Star } from 'lucide-react';
import './BadgeSection.css';

// Import your badge images
import bugSpecialist from '../../assets/badges/bug-specialist.jpg';
import cyberSecurity from '../../assets/badges/cyberSecurity.jpg';
import debug from '../../assets/badges/Debug.jpg';
import fifty from '../../assets/badges/fifty.jpg';
import hundred from '../../assets/badges/hundred.jpg';
import logicArchitect from '../../assets/badges/logicArchitect.jpg';
import mentor from '../../assets/badges/mentor.jpg';
import performanceOptimizer from '../../assets/badges/performanceOptimizer.jpg';
import problemSolver from '../../assets/badges/problem-solver.jpg';
import topContributor from '../../assets/badges/topContributor.jpg';

const BadgeSection = () => {
  const earnedBadges = [
    {
      id: 1,
      name: 'Problem Solver',
      description: 'Solved 10 problems',
      image: problemSolver,
      points: 100,
      earnedDate: '2026-01-15',
      category: 'Problem Solving'
    },
    {
      id: 2,
      name: 'Bug Specialist',
      description: 'Fixed 20 critical bugs',
      image: bugSpecialist,
      points: 200,
      earnedDate: '2026-01-20',
      category: 'Debugging'
    },
    {
      id: 3,
      name: '50 Solutions',
      description: 'Provided 50 solutions',
      image: fifty,
      points: 250,
      earnedDate: '2026-01-25',
      category: 'Contribution'
    },
    {
      id: 4,
      name: 'Logic Architect',
      description: 'Master of algorithmic thinking',
      image: logicArchitect,
      points: 300,
      earnedDate: '2026-01-28',
      category: 'Advanced'
    },
    {
      id: 5,
      name: 'Cyber Security',
      description: 'Security expert badge',
      image: cyberSecurity,
      points: 350,
      earnedDate: '2026-01-29',
      category: 'Security'
    },
    {
      id: 6,
      name: 'Debug Master',
      description: 'Debugging excellence',
      image: debug,
      points: 150,
      earnedDate: '2026-01-30',
      category: 'Debugging'
    },
    {
      id: 7,
      name: 'Mentor',
      description: 'Helped 25+ developers',
      image: mentor,
      points: 400,
      earnedDate: '2026-01-31',
      category: 'Community'
    },
    {
      id: 8,
      name: 'Top Contributor',
      description: 'Most active contributor',
      image: topContributor,
      points: 500,
      earnedDate: '2026-01-31',
      category: 'Achievement'
    }
  ];

  const lockedBadges = [
    {
      id: 9,
      name: '100 Solutions',
      description: 'Provide 100 solutions',
      image: hundred,
      points: 500,
      progress: 78,
      requirement: 'Solve 22 more problems'
    },
    {
      id: 10,
      name: 'Performance Optimizer',
      description: 'Optimize 15 solutions',
      image: performanceOptimizer,
      points: 450,
      progress: 40,
      requirement: 'Optimize 9 more solutions'
    }
  ];

  const totalPoints = earnedBadges.reduce((sum, badge) => sum + badge.points, 0);

  return (
    <div className="badge-section">
      {/* Stats Overview */}
      <div className="badge-section__stats">
        <div className="stat-card stat-card--primary">
          <div className="stat-card__icon">
            <Trophy size={28} />
          </div>
          <div className="stat-card__info">
            <div className="stat-card__value">{earnedBadges.length}</div>
            <div className="stat-card__label">Badges Earned</div>
          </div>
        </div>
        
        <div className="stat-card stat-card--secondary">
          <div className="stat-card__icon">
            <Star size={28} />
          </div>
          <div className="stat-card__info">
            <div className="stat-card__value">{totalPoints.toLocaleString()}</div>
            <div className="stat-card__label">Total Points</div>
          </div>
        </div>
        
        <div className="stat-card stat-card--tertiary">
          <div className="stat-card__icon">
            <Lock size={28} />
          </div>
          <div className="stat-card__info">
            <div className="stat-card__value">{lockedBadges.length}</div>
            <div className="stat-card__label">Locked Badges</div>
          </div>
        </div>
      </div>

      {/* Earned Badges */}
      <div className="badge-section__earned">
        <h2 className="section-title">
          <Trophy size={24} />
          My Achievements
        </h2>
        <div className="badge-grid">
          {earnedBadges.map(badge => (
            <div key={badge.id} className="badge-card-detailed">
              <div className="badge-card-detailed__image">
                <img src={badge.image} alt={badge.name} />
                <div className="badge-card-detailed__overlay"></div>
                <div className="badge-card-detailed__points">
                  +{badge.points}
                </div>
              </div>
              <div className="badge-card-detailed__content">
                <span className="badge-card-detailed__category">{badge.category}</span>
                <h3 className="badge-card-detailed__name">{badge.name}</h3>
                <p className="badge-card-detailed__description">{badge.description}</p>
                <div className="badge-card-detailed__footer">
                  <span className="badge-card-detailed__date">
                    Earned {new Date(badge.earnedDate).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Locked Badges */}
      <div className="badge-section__locked">
        <h2 className="section-title">
          <Lock size={24} />
          Locked Achievements
        </h2>
        <div className="badge-grid">
          {lockedBadges.map(badge => (
            <div key={badge.id} className="badge-card-detailed badge-card-detailed--locked">
              <div className="badge-card-detailed__image">
                <img src={badge.image} alt={badge.name} />
                <div className="badge-card-detailed__lock-overlay">
                  <Lock size={40} />
                </div>
                <div className="badge-card-detailed__points">
                  +{badge.points}
                </div>
              </div>
              <div className="badge-card-detailed__content">
                <h3 className="badge-card-detailed__name">{badge.name}</h3>
                <p className="badge-card-detailed__description">{badge.description}</p>
                <div className="badge-card-detailed__progress">
                  <div className="progress-bar">
                    <div 
                      className="progress-bar__fill" 
                      style={{ width: `${badge.progress}%` }}
                    ></div>
                  </div>
                  <span className="progress-text">{badge.progress}% Complete</span>
                </div>
                <p className="badge-card-detailed__requirement">{badge.requirement}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BadgeSection;