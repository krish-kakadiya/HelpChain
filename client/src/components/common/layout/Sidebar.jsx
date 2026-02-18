import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, HelpCircle, Award, Users, LogOut, ChevronLeft, ChevronRight } from 'lucide-react';
import { useSidebar } from '../../../context/SidebarContext';
import './Sidebar.css';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();          // clear token + user
    navigate("/");     // redirect to login page
  };

  const { isOpen, setIsOpen } = useSidebar();

  const mainMenu = [
    { name: 'Dashboard Home', path: '/dashboard', icon: LayoutDashboard },
    { name: 'My Problems', path: '/problems', icon: HelpCircle },
    { name: 'Rewards & Badges', path: '/rewards', icon: Award },
    { name: 'My Solutions', path: '/solutions', icon: Users },
    { name: 'Expert Connect', path: '/experts', icon: Users }
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
                  className={({ isActive }) => {
                    const isDashboard = item.path === '/dashboard';
                    const isRoot = window.location.pathname === '/';

                    return (isActive || (isDashboard && isRoot))
                      ? 'hc-sidebar__link hc-sidebar__link--active'
                      : 'hc-sidebar__link';
                  }}

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
            <NavLink 
              to="/logout"
              onClick={handleLogout}
              className="hc-sidebar__link hc-sidebar__link--bottom"
              title={!isOpen ? 'Logout' : ''}
            >
              <LogOut className="hc-sidebar__icon" size={20} />
              {isOpen && <span className="hc-sidebar__label">Logout</span>}
            </NavLink>
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