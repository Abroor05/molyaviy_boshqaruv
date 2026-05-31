import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AdminSidebar from '../../components/AdminSidebar/AdminSidebar';
import AdminNavbar from '../../components/AdminNavbar/AdminNavbar';
import './AdminLayout.css';

const pageTitles = {
  '/admin':          'Admin Dashboard',
  '/admin/users':    'Foydalanuvchilar',
  '/admin/finance':  'Moliyaviy Hisobot',
  '/admin/settings': 'Sozlamalar',
};

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const title = pageTitles[location.pathname] || 'Admin Panel';

  return (
    <div className="admin-layout">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="admin-layout__main">
        <AdminNavbar
          onMenuToggle={() => setSidebarOpen(true)}
          pageTitle={title}
        />
        <main className="admin-layout__content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
