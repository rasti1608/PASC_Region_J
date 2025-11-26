import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';

function AdminLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(prev => {
      const newState = !prev;
      // Prevent body scroll when menu is open
      if (newState) {
        document.body.classList.add('mobile-menu-open');
      } else {
        document.body.classList.remove('mobile-menu-open');
      }
      return newState;
    });
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    document.body.classList.remove('mobile-menu-open');
  };

  return (
    <div className="admin-wrapper">
      {/* Sidebar Navigation */}
      <AdminSidebar isMobileOpen={isMobileMenuOpen} />

      {/* Mobile Overlay (for closing sidebar when clicking outside) */}
      <div
        className={`mobile-overlay ${isMobileMenuOpen ? 'active' : ''}`}
        onClick={closeMobileMenu}
      ></div>

      {/* Main Content Area */}
      <main className="admin-content">
        {/* Fixed Header Bar */}
        <AdminHeader onToggleMobileMenu={toggleMobileMenu} />

        {/* Router outlet for admin pages */}
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
