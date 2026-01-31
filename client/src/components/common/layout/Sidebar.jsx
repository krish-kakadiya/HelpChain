import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, HelpCircle, Award, Users, Settings, LogOut } from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
  const mainMenu = [
    { name: 'Dashboard Home', path: '/dashboard', icon: LayoutDashboard },
    { name: 'My Problems', path: '/problems', icon: HelpCircle },
    { name: 'Rewards & Budget', path: '/rewards', icon: Award },
    { name: 'My Solutions', path: '/solutions', icon: Users },
    { name: 'Expert Connect', path: '/experts', icon: Users }
  ];

  const bottomMenu = [
    { name: 'Settings', path: '/settings', icon: Settings },
    { name: 'Logout', path: '/logout', icon: LogOut }
  ];

  return (
    <aside className="hc-sidebar">
      <div className="hc-sidebar__main">
        <div className="hc-sidebar__list">
          {mainMenu.map(item => {
            const IconComponent = item.icon;
            return (
              <NavLink 
                key={item.path} 
                to={item.path} 
                className={({isActive}) => 
                  isActive ? 'hc-sidebar__link hc-sidebar__link--active' : 'hc-sidebar__link'
                }
              >
                <IconComponent className="hc-sidebar__icon" size={20} />
                <span className="hc-sidebar__label">{item.name}</span>
              </NavLink>
            );
          })}
        </div>
      </div>

      <div className="hc-sidebar__bottom">
        <div className="hc-sidebar__divider"></div>
        <div className="hc-sidebar__list">
          {bottomMenu.map(item => {
            const IconComponent = item.icon;
            return (
              <NavLink 
                key={item.path} 
                to={item.path} 
                className="hc-sidebar__link hc-sidebar__link--bottom"
              >
                <IconComponent className="hc-sidebar__icon" size={20} />
                <span className="hc-sidebar__label">{item.name}</span>
              </NavLink>
            );
          })}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;