import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();

  return (
    <aside>
      <a className="logo" href="/">Spyshark.io</a>
      <nav>
        <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
          <i className="fa-solid fa-grip-vertical"></i>
          <a>Dashboard</a>
        </Link>
        <Link to="/sales-tracker" className={location.pathname === '/sales-tracker' || location.pathname === '/sales-tracker/store' ? 'active' : ''}>
          <i className="fa-solid fa-chart-column"></i>
          <a>Sales Tracker</a>
        </Link>
        <Link to="/products" className={location.pathname === '/products' ? 'active' : ''}>
          <i className="fa-solid fa-basket-shopping"></i>
          <a>Products</a>
        </Link>
        <Link to="/suppliers" className={location.pathname === '/suppliers' ? 'active' : ''}>
          <i className="fa-solid fa-truck-field"></i>
          <a>Suppliers</a>
        </Link>
        <Link to="/tiktok-virals" className={location.pathname === '/tiktok-virals' ? 'active' : ''}>
          <i className="fa-brands fa-tiktok"></i>
          <a>Tiktok Virals</a>
        </Link>
      </nav>
    </aside>
  );
};

export default Sidebar;
