import React, { useState } from 'react';
import { Award, Calendar, Star, Filter } from 'lucide-react';
import './MyAchievements.css';

// Import badge images
// import bugSpecialist from '../../assets/badges/bug-specialist.png';
// import cyberSecurity from '../../assets/badges/cyberSecurity.png';
// import debug from '../../assets/badges/Debug.png';
import fifty from '../../assets/badges/fifty.png';
// import logicArchitect from '../../assets/badges/logicArchitect.png';
import mentor from '../../assets/badges/mentor.png';
// import problemSolver from '../../assets/badges/problem-solver.png';
// import topContributor from '../../assets/badges/topContributor.png';

const MyAchievements = () => {
  const [filter, setFilter] = useState('all');

  const achievements = [
    {
      id: 1,
      name: 'Problem Solver',
      description: 'Solved 10 problems',
      image: problemSolver,
      points: 100,
      earnedDate: '2026-01-15',
      category: 'Solving'
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

  const categories = ['all', 'Solving', 'Debugging', 'Contribution', 'Advanced', 'Security', 'Community', 'Achievement'];

  const filteredAchievements = filter === 'all' 
    ? achievements 
    : achievements.filter(a => a.category === filter);

  return (
    <div className="my-achievements">
      {/* Filter Bar */}
      <div className="achievements-filter">
        <div className="achievements-filter__icon">
          <Filter size={18} />
        </div>
        <div className="achievements-filter__buttons">
          {categories.map(category => (
            <button
              key={category}
              className={`filter-btn ${filter === category ? 'filter-btn--active' : ''}`}
              onClick={() => setFilter(category)}
            >
              {category === 'all' ? 'All' : category}
            </button>
          ))}
        </div>
      </div>

      {/* Achievements Grid */}
      <div className="achievements-grid">
        {filteredAchievements.map(achievement => (
          <div key={achievement.id} className="achievement-card">
            <div className="achievement-card__image">
              <img src={achievement.image} alt={achievement.name} />
              <div className="achievement-card__points">
                <Star size={14} />
                {achievement.points}
              </div>
            </div>

            <div className="achievement-card__content">
              <div className="achievement-card__category">{achievement.category}</div>
              <h4 className="achievement-card__name">{achievement.name}</h4>
              <p className="achievement-card__description">{achievement.description}</p>
              
              <div className="achievement-card__footer">
                <Calendar size={14} />
                <span>
                  {new Date(achievement.earnedDate).toLocaleDateString('en-US', {
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

      {filteredAchievements.length === 0 && (
        <div className="no-achievements">
          <Award size={48} />
          <p>No achievements found in this category</p>
        </div>
      )}
    </div>
  );
};

export default MyAchievements;