import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../../components/Sidebar/Sidebar';
import Navbar from '../../components/Navbar/Navbar';
import './DashboardLayout.css';

const pageTitles = {
  '/dashboard':    'Dashboard',
  '/income':       'Daromadlar',
  '/expense':      'Xarajatlar',
  '/transactions': 'Tranzaksiyalar',
  '/statistics':   'Statistika',
  '/profile':      'Profil',
  '/settings':     'Sozlamalar',
};

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const title = pageTitles[location.pathname] || 'Dashboard';

  return (
    <div className="dashboard-layout">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="dashboard-layout__main">
        <Navbar
          onMenuToggle={() => setSidebarOpen(true)}
          pageTitle={title}
        />
        <main className="dashboard-layout__content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
