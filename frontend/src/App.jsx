import { BrowserRouter, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import AdminDashboard from './pages/AdminDashboard'
import Login from './pages/Login'
import UserHome from './pages/UserHome'
import VoiceSurvey from './pages/VoiceSurvey'
import MedicalScribe from './pages/MedicalScribe'
import AdminQuestions from './pages/AdminQuestions'

const DEV_LINKS = [
  { to: '/admin', label: 'Admin' },
  { to: '/login', label: 'Login' },
  { to: '/home', label: 'Home' },
  { to: '/survey/1/voice', label: 'Voice Survey' },
  { to: '/admin/questions', label: 'Questions' },
  { to: '/admin/scribe', label: 'Scribe' },
]

function DevNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-ink text-white flex gap-4 justify-center py-2">
      {DEV_LINKS.map(({ to, label }) => (
        <Link
          key={to}
          to={to}
          className="text-xs font-medium hover:text-mint transition"
        >
          {label}
        </Link>
      ))}
    </nav>
  )
}

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Navigate to="/admin" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<UserHome />} />
          <Route path="/survey/:id/voice" element={<VoiceSurvey />} />
          <Route path="/scribe" element={<MedicalScribe />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/questions" element={<AdminQuestions />} />
          <Route path="/admin/scribe" element={<MedicalScribe />} />
        </Routes>
      </AnimatePresence>
      <DevNav />
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  )
}
