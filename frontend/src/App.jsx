import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Topbar from './components/layout/Topbar'
import AdminDashboard from './pages/AdminDashboard'
import Login from './pages/Login'

function Placeholder({ label }) {
  return (
    <motion.div
      key={label}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="flex items-center justify-center h-[calc(100vh-56px)] text-slate-400 text-sm bg-surface"
    >
      {label} — coming soon
    </motion.div>
  )
}

function AdminRoutes() {
  const [activeNav, setActiveNav] = useState('Overview')
  const location = useLocation()

  return (
    <div className="min-h-screen bg-surface">
      <Topbar activeNav={activeNav} onNavChange={setActiveNav} />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/home" element={<Placeholder label="Home" />} />
        </Routes>
      </AnimatePresence>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/admin" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/*" element={<AdminRoutes />} />
      </Routes>
    </BrowserRouter>
  )
}
