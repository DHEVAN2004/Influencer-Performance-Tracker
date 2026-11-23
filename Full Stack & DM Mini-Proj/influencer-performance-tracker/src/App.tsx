import { useEffect, useMemo, useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Navbar from './components/Navbar'
import DashboardPage from './pages/DashboardPage'
import InfluencersPage from './pages/InfluencersPage'
import InfluencerDetailPage from './pages/InfluencerDetailPage'
import CampaignsPage from './pages/CampaignsPage'
import SettingsPage from './pages/SettingsPage'
import LoginPage from './pages/LoginPage'
import AnalyticsPage from './pages/AnalyticsPage'
import MessagesPage from './pages/MessagesPage'
import NotificationsPage from './pages/NotificationsPage'
import ReportsPage from './pages/ReportsPage'
import BrandsPage from './pages/BrandsPage'
import { AuthProvider, useAuth } from './AuthContext'

function ProtectedLayout({ darkMode, toggleDarkMode }: { darkMode: boolean; toggleDarkMode: () => void }) {
  const { user } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  if (!user) return <Navigate to="/login" replace />

  return (
    <div className="flex min-h-screen">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar
          title="Influencer Performance Tracker"
          onToggleTheme={toggleDarkMode}
          isDarkMode={darkMode}
          onToggleMenu={() => setSidebarOpen(true)}
        />
        <main className="p-4 sm:p-6 lg:p-8">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/influencers" element={<InfluencersPage />} />
            <Route path="/influencers/:id" element={<InfluencerDetailPage />} />
            <Route path="/campaigns" element={<CampaignsPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/messages" element={<MessagesPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/brands" element={<BrandsPage />} />
            <Route path="/settings" element={<SettingsPage isDarkMode={darkMode} onToggleTheme={toggleDarkMode} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default function App() {
  const [darkMode, setDarkMode] = useState(() => {
    localStorage.setItem('darkMode', 'false')
    return false
  })

  useEffect(() => {
    const root = document.documentElement
    darkMode ? root.classList.add('dark') : root.classList.remove('dark')
    localStorage.setItem('darkMode', darkMode.toString())
  }, [darkMode])

  const toggleDarkMode = () => setDarkMode((prev) => !prev)

  const appContainerClasses = useMemo(
    () => 'min-h-screen text-slate-900 dark:text-slate-100 bg-slate-100 dark:bg-slate-950',
    [],
  )

  return (
    <AuthProvider>
      <BrowserRouter>
        <div className={appContainerClasses}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/*" element={<ProtectedLayout darkMode={darkMode} toggleDarkMode={toggleDarkMode} />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}
