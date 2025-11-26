import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { AudioProvider } from './contexts/AudioContext';
import './App.css';

// Guards
import AuthGuard from './guards/AuthGuard';
import AdminRoleGuard from './guards/AdminRoleGuard';

// Global Components
import ScrollToTop from './components/shared/ScrollToTop';
import FloatingAnthemButton from './components/shared/FloatingAnthemButton';

// Public Pages
import PreIntro from './pages/PreIntro';
import Intro from './pages/Intro';
import Home from './pages/Home';
import About from './pages/About';
import Register from './pages/Register';
import Workshops from './pages/Workshops';
import Schedule from './pages/Schedule';
import Gallery from './pages/Gallery';
import Resources from './pages/Resources';
import Contact from './pages/Contact';

// Admin Layout
import AdminLayout from './components/admin/AdminLayout';

// Admin Auth Pages
import Login from './pages/admin/Login';
import ForgotPassword from './pages/admin/ForgotPassword';
import ResetPassword from './pages/admin/ResetPassword';
import Activate from './pages/admin/Activate';
import ChangePassword from './pages/admin/ChangePassword';

// Admin Feature Pages
import Dashboard from './pages/admin/Dashboard';
import AnnouncementList from './pages/admin/AnnouncementList';
import AnnouncementForm from './pages/admin/AnnouncementForm';
import AnnouncementDelete from './pages/admin/AnnouncementDelete';
import FormList from './pages/admin/FormList';
import FormForm from './pages/admin/FormForm';
import FormDelete from './pages/admin/FormDelete';
import GalleryList from './pages/admin/GalleryList';
import GalleryUpload from './pages/admin/GalleryUpload';
import GalleryEdit from './pages/admin/GalleryEdit';
import GalleryDelete from './pages/admin/GalleryDelete';
import DocumentList from './pages/admin/DocumentList';
import DocumentUpload from './pages/admin/DocumentUpload';
import DocumentEdit from './pages/admin/DocumentEdit';
import DocumentDelete from './pages/admin/DocumentDelete';
import ScheduleManagement from './pages/admin/ScheduleManagement';
import ContactList from './pages/admin/ContactList';
import EmailSettings from './pages/admin/EmailSettings';
import UserList from './pages/admin/UserList';
import UserForm from './pages/admin/UserForm';
import UserDelete from './pages/admin/UserDelete';
import Profile from './pages/admin/Profile';

function App() {
  return (
    <AuthProvider>
      <AudioProvider>
        <Router>
          {/* Scroll to top on route change */}
          <ScrollToTop />
          {/* Floating Anthem Button (Global - controlled by window.SHOW_ANTHEM_BUTTON) */}
          <FloatingAnthemButton />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Navigate to="/pre-intro" replace />} />
            <Route path="/pre-intro" element={<PreIntro />} />
            <Route path="/intro" element={<Intro />} />
            <Route path="/home" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/register" element={<Register />} />
            <Route path="/workshops" element={<Workshops />} />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/contact" element={<Contact />} />

            {/* Admin Auth Routes (no layout) */}
            <Route path="/admin/login" element={<Login />} />
            <Route path="/admin/forgot-password" element={<ForgotPassword />} />
            <Route path="/admin/reset-password" element={<ResetPassword />} />
            <Route path="/admin/activate" element={<Activate />} />

            {/* Standalone change password (required after first login - no admin layout) */}
            <Route
              path="/admin/change-password"
              element={
                <AuthGuard>
                  <ChangePassword />
                </AuthGuard>
              }
            />

            {/* Protected Admin Routes with Layout */}
            <Route
              path="/admin"
              element={
                <AuthGuard>
                  <AdminLayout />
                </AuthGuard>
              }
            >
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />

              {/* Announcements */}
              <Route path="announcements" element={<AnnouncementList />} />
              <Route path="announcements/add" element={<AnnouncementForm />} />
              <Route path="announcements/edit/:id" element={<AnnouncementForm />} />
              <Route path="announcements/delete/:id" element={<AnnouncementDelete />} />

              {/* Forms */}
              <Route path="forms" element={<FormList />} />
              <Route path="forms/add" element={<FormForm />} />
              <Route path="forms/edit/:id" element={<FormForm />} />
              <Route path="forms/delete/:id" element={<FormDelete />} />

              {/* Gallery */}
              <Route path="gallery" element={<GalleryList />} />
              <Route path="gallery/upload" element={<GalleryUpload />} />
              <Route path="gallery/edit/:id" element={<GalleryEdit />} />
              <Route path="gallery/delete/:id" element={<GalleryDelete />} />

              {/* Documents */}
              <Route path="documents" element={<DocumentList />} />
              <Route path="documents/upload" element={<DocumentUpload />} />
              <Route path="documents/edit/:id" element={<DocumentEdit />} />
              <Route path="documents/delete/:id" element={<DocumentDelete />} />

              {/* Schedule */}
              <Route path="schedule" element={<ScheduleManagement />} />

              {/* Contacts */}
              <Route path="contacts" element={<ContactList />} />
              <Route path="contacts/email-settings" element={<EmailSettings />} />

              {/* Users (Admin only - role_id = 1) */}
              <Route
                path="users"
                element={
                  <AdminRoleGuard>
                    <UserList />
                  </AdminRoleGuard>
                }
              />
              <Route
                path="users/add"
                element={
                  <AdminRoleGuard>
                    <UserForm />
                  </AdminRoleGuard>
                }
              />
              <Route
                path="users/edit/:id"
                element={
                  <AdminRoleGuard>
                    <UserForm />
                  </AdminRoleGuard>
                }
              />
              <Route
                path="users/delete/:id"
                element={
                  <AdminRoleGuard>
                    <UserDelete />
                  </AdminRoleGuard>
                }
              />

              {/* Profile */}
              <Route path="profile" element={<Profile />} />
            </Route>

            {/* 404 redirect to pre-intro */}
            <Route path="*" element={<Navigate to="/pre-intro" replace />} />
          </Routes>
        </Router>
      </AudioProvider>
    </AuthProvider>
  );
}

export default App;
