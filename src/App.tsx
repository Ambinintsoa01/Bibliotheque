import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useAuth } from './hooks/useAuth';
import LoginForm from './components/Auth/LoginForm';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';

// Admin Pages
import AdminDashboard from './pages/Admin/Dashboard';
import BookManagement from './pages/Admin/BookManagement';
import UserManagement from './pages/Admin/UserManagement';
import LoanManagement from './pages/Admin/LoanManagement';
import ReservationValidation from './pages/Admin/ReservationValidation';
import PenaltyManagement from './pages/Admin/PenaltyManagement';
import AdminNotifications from './pages/Admin/Notifications';
import Statistics from './pages/Admin/Statistics';
import Settings from './pages/Admin/Settings';
import InscriptionAdd from './pages/Admin/InscriptionAdd';

// Client Pages
import ClientDashboard from './pages/Client/Dashboard';
import BookSearch from './pages/Client/BookSearch';
import ClientReservations from './pages/Client/Reservations';
import ClientLoans from './pages/Client/Loans';
import ClientNotifications from './pages/Client/Notifications';
import ClientProfile from './pages/Client/Profile';

function App() {
  const { user, isAuthenticated, loading, login, logout } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginForm onLogin={login} />;
  }

  return (
    <Router>
      <div className="flex h-screen bg-gray-100">
        <Sidebar role={user!.role} onLogout={logout} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header user={user!} title="Tableau de Bord" />
          <main className="flex-1 overflow-auto p-6">
            <Routes>
              {user!.role === 'admin' ? (
                <>
                  <Route path="/admin/dashboard" element={<AdminDashboard />} />
                  <Route path="/admin/books" element={<BookManagement />} />
                  <Route path="/admin/users" element={<UserManagement />} />
                  <Route path="/admin/loans" element={<LoanManagement />} />
                  <Route path="/admin/reservations" element={<ReservationValidation />} />
                  <Route path="/admin/penalties" element={<PenaltyManagement />} />
                  <Route path="/admin/notifications" element={<AdminNotifications />} />
                  <Route path="/admin/inscriptions" element={<InscriptionAdd />} />
                  <Route path="/admin/stats" element={<Statistics />} />
                  <Route path="/admin/settings" element={<Settings />} />
                  <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
                </>
              ) : (
                <>
                  <Route path="/client/dashboard" element={<ClientDashboard />} />
                  <Route path="/client/books" element={<BookSearch />} />
                  <Route path="/client/reservations" element={<ClientReservations />} />
                  <Route path="/client/loans" element={<ClientLoans />} />
                  <Route path="/client/notifications" element={<ClientNotifications />} />
                  <Route path="/client/profile" element={<ClientProfile />} />
                  <Route path="/" element={<Navigate to="/client/dashboard" replace />} />
                </>
              )}
            </Routes>
          </main>
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </Router>
  );
}

export default App;