import { Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import Layout from './components/Layout'
import DashboardPage from './pages/DashboardPage'
import TorneosPage from './pages/TorneosPage'
import TorneoDetailPage from './pages/TorneoDetailPage'
import CreateTorneoPage from './pages/CreateTorneoPage'
import ProfilePage from './pages/ProfilePage'
import { initializeSampleData } from './services/storageService'

function App() {
  useEffect(() => {
    // Initialize sample data on app start
    initializeSampleData();
  }, []);

  return (
    <Routes>
      {/* All routes are public now */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="torneos" element={<TorneosPage />} />
        <Route path="torneos/create" element={<CreateTorneoPage />} />
        <Route path="torneos/:id" element={<TorneoDetailPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>

      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

export default App 