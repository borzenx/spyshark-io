import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface HeaderProps {
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogout }) => {
  const [isMenuVisible, setMenuVisible] = useState(false);
  const [isChevronUp, setChevronUp] = useState(false);
  const userName = localStorage.getItem('userName');

  const toggleMenu = () => {
    setMenuVisible(!isMenuVisible);
    setChevronUp(!isChevronUp);
  };

  return (
    <header>
      <p className='username'>{userName}</p>
      <i className="user fa-solid fa-user"></i>
      <div className="menu">
        <i className={`menu-icon fa-solid ${isChevronUp ? 'fa-chevron-up' : 'fa-chevron-down'}`}onClick={toggleMenu}></i>
        {isMenuVisible && (
          <ul className="menu-list">
            <li>
              <Link to="/" onClick={onLogout}>Logout</Link>
            </li>
            <li><Link to="/settings">Settings</Link></li>
          </ul>
        )}
      </div>
    </header>
  );
};

export default Header;
