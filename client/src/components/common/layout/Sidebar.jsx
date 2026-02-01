import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, HelpCircle, Award, Users, Settings, LogOut, ChevronLeft, ChevronRight } from 'lucide-react';
import { useSidebar } from '../../../context/SidebarContext';
import './Sidebar.css';

const Sidebar = () => {
  const { isOpen, setIsOpen } = useSidebar();

  const mainMenu = [
    { name: 'Dashboard Home', path: '/dashboard', icon: LayoutDashboard },
    { name: 'My Problems', path: '/problems', icon: HelpCircle },
    { name: 'Rewards & Badges', path: '/rewards', icon: Award },
    { name: 'My Solutions', path: '/solutions', icon: Users },
    { name: 'Expert Connect', path: '/experts', icon: Users }
  ];

  const bottomMenu = [
    { name: 'Settings', path: '/settings', icon: Settings },
    { name: 'Logout', path: '/logout', icon: LogOut }
  ];

  return (
    <>
      <aside className={`hc-sidebar ${isOpen ? 'hc-sidebar--open' : 'hc-sidebar--closed'}`}>
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
                  title={!isOpen ? item.name : ''}
                >
                  <IconComponent className="hc-sidebar__icon" size={20} />
                  {isOpen && <span className="hc-sidebar__label">{item.name}</span>}
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
                  title={!isOpen ? item.name : ''}
                >
                  <IconComponent className="hc-sidebar__icon" size={20} />
                  {isOpen && <span className="hc-sidebar__label">{item.name}</span>}
                </NavLink>
              );
            })}
          </div>
        </div>

        <button 
          className="hc-sidebar__toggle" 
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? 'Close sidebar' : 'Open sidebar'}
        >
          {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </aside>
    </>
  );
};

export default Sidebar;