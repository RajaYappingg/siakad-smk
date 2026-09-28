import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { AppLayout } from './components/layout/AppLayout';

// Auth Pages
import { LoginPage } from './pages/auth/LoginPage';
import { LandingPage } from './pages/landing/LandingPage';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { JurusanPage } from './pages/admin/JurusanPage';
import { KelasPage } from './pages/admin/KelasPage';
import { KelasDetailPage } from './pages/admin/KelasDetailPage';
import { SiswaPage } from './pages/admin/SiswaPage';
import { SiswaDetailPage } from './pages/admin/SiswaDetailPage';
import { GuruPage } from './pages/admin/GuruPage';
import { GuruDetailPage } from './pages/admin/GuruDetailPage';
import { MapelPage } from './pages/admin/MapelPage';
import { MapelDetailPage } from './pages/admin/MapelDetailPage';
import { JadwalPage } from './pages/admin/JadwalPage';
import { TahunAjaranPage } from './pages/admin/TahunAjaranPage';
import { NilaiPage } from './pages/admin/NilaiPage';
import { UsersPage } from './pages/admin/UsersPage';

// Guru Pages
import { GuruDashboard } from './pages/guru/GuruDashboard';
import { GuruJadwalPage } from './pages/guru/GuruJadwalPage';
import { GuruKelasPage } from './pages/guru/GuruKelasPage';
import { GuruNilaiPage } from './pages/guru/GuruNilaiPage';

// Siswa Pages
import { SiswaDashboard } from './pages/siswa/SiswaDashboard';
import { SiswaJadwalPage } from './pages/siswa/SiswaJadwalPage';
import { SiswaNilaiPage } from './pages/siswa/SiswaNilaiPage';

// Common Pages
import { ProfilePage } from './pages/common/ProfilePage';
import { SettingsPage } from './pages/common/SettingsPage';
import { LoadingState } from './components/ui/LoadingState';

// Root Index Redirector based on user role
const RootRedirect: React.FC = () => {
  const { user, token, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <LoadingState message="Memuat aplikasi..." />
      </div>
    );
  }

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role === 'ADMIN') return <Navigate to="/admin/dashboard" replace />;
  if (user.role === 'GURU') return <Navigate to="/guru/dashboard" replace />;
  return <Navigate to="/siswa/dashboard" replace />;
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <ToastProvider>
          <AuthProvider>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/landing" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/app" element={<RootRedirect />} />
              <Route path="/dashboard" element={<RootRedirect />} />

              {/* Protected Authenticated Routes inside AppLayout */}
              <Route
                element={
                  <ProtectedRoute>
                    <AppLayout />
                  </ProtectedRoute>
                }
              >
                {/* Admin Master Data & Academic */}
                <Route
                  path="/admin/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['ADMIN']}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/jurusan"
                  element={
                    <ProtectedRoute allowedRoles={['ADMIN']}>
                      <JurusanPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/kelas"
                  element={
                    <ProtectedRoute allowedRoles={['ADMIN']}>
                      <KelasPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/kelas/:id"
                  element={
                    <ProtectedRoute allowedRoles={['ADMIN']}>
                      <KelasDetailPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/siswa"
                  element={
                    <ProtectedRoute allowedRoles={['ADMIN']}>
                      <SiswaPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/siswa/:nis"
                  element={
                    <ProtectedRoute allowedRoles={['ADMIN']}>
                      <SiswaDetailPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/guru"
                  element={
                    <ProtectedRoute allowedRoles={['ADMIN']}>
                      <GuruPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/guru/:id"
                  element={
                    <ProtectedRoute allowedRoles={['ADMIN']}>
                      <GuruDetailPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/mapel"
                  element={
                    <ProtectedRoute allowedRoles={['ADMIN']}>
                      <MapelPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/mapel/:id"
                  element={
                    <ProtectedRoute allowedRoles={['ADMIN']}>
                      <MapelDetailPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/jadwal"
                  element={
                    <ProtectedRoute allowedRoles={['ADMIN']}>
                      <JadwalPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/tahun-ajaran"
                  element={
                    <ProtectedRoute allowedRoles={['ADMIN']}>
                      <TahunAjaranPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/nilai"
                  element={
                    <ProtectedRoute allowedRoles={['ADMIN']}>
                      <NilaiPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/users"
                  element={
                    <ProtectedRoute allowedRoles={['ADMIN']}>
                      <UsersPage />
                    </ProtectedRoute>
                  }
                />

                {/* Guru Specific Routes */}
                <Route
                  path="/guru/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['GURU', 'ADMIN']}>
                      <GuruDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/guru/jadwal"
                  element={
                    <ProtectedRoute allowedRoles={['GURU', 'ADMIN']}>
                      <GuruJadwalPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/guru/kelas"
                  element={
                    <ProtectedRoute allowedRoles={['GURU', 'ADMIN']}>
                      <GuruKelasPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/guru/nilai"
                  element={
                    <ProtectedRoute allowedRoles={['GURU', 'ADMIN']}>
                      <GuruNilaiPage />
                    </ProtectedRoute>
                  }
                />

                {/* Siswa Specific Routes */}
                <Route
                  path="/siswa/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['SISWA', 'ADMIN']}>
                      <SiswaDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/siswa/jadwal"
                  element={
                    <ProtectedRoute allowedRoles={['SISWA', 'ADMIN']}>
                      <SiswaJadwalPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/siswa/nilai"
                  element={
                    <ProtectedRoute allowedRoles={['SISWA', 'ADMIN']}>
                      <SiswaNilaiPage />
                    </ProtectedRoute>
                  }
                />

                {/* Common Pages */}
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/settings" element={<SettingsPage />} />
              </Route>

              {/* Catch-all fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;
