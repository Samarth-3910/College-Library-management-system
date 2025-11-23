// App.js - Main Application Component with Register Route
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Import all Page Components and Layouts
import LoginPage from './components/LoginPage';
import DashboardPage from './components/DashboardPage';
import BookManagementPage from './components/BookManagementPage';
import StudentManagementPage from './components/StudentManagementPage';
import ReservationManagementPage from './components/ReservationManagementPage';
import AnalyticsPage from './components/AnalyticsPage';
import StudentDashboardPage from './components/StudentDashboardPage';
import BookCatalogPage from './components/BookCatalogPage';
import { QRCodeUtilityPage } from './components/QRCodeGeneratorPage';
import MainLayout from './layouts/MainLayout';
import StudentLayout from './layouts/StudentLayout';

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<Navigate to="/login" />} />

      {/* --- LIBRARIAN ROUTES --- */}
      <Route element={<MainLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/books" element={<BookManagementPage />} />
        <Route path="/students" element={<StudentManagementPage />} />
        <Route path="/reservations" element={<ReservationManagementPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/qr-utility" element={<QRCodeUtilityPage />} />
      </Route>

      {/* --- STUDENT ROUTES --- */}
      <Route element={<StudentLayout />}>
        <Route path="/student-dashboard" element={<StudentDashboardPage />} />
        <Route path="/catalog" element={<BookCatalogPage />} />
      </Route>
    </Routes>
  );
}

export default App;