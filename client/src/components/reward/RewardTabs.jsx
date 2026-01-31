import React from 'react';
import { Award, DollarSign } from 'lucide-react';
import './RewardTabs.css';

const RewardTabs = ({ activeTab, onTabChange }) => {
  const tabs = [
    { 
      id: 'achievements', 
      label: 'My Achievements', 
      icon: Award,
      count: 8 
    },
    { 
      id: 'budget', 
      label: 'Budget Tracker', 
      icon: DollarSign,
      count: null 
    }
  ];

  return (
    <div className="reward-tabs">
      <div className="reward-tabs__container">
        {tabs.map(tab => {
          const IconComponent = tab.icon;
          return (
            <button
              key={tab.id}
              className={`reward-tabs__tab ${activeTab === tab.id ? 'reward-tabs__tab--active' : ''}`}
              onClick={() => onTabChange(tab.id)}
            >
              <IconComponent className="reward-tabs__icon" size={20} />
              <span className="reward-tabs__label">{tab.label}</span>
              {tab.count !== null && (
                <span className="reward-tabs__count">{tab.count}</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default RewardTabs;