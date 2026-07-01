import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import AdminDashboard from './pages/AdminDashboard'
import Login from './pages/Login'
import UserHome from './pages/UserHome'
import VoiceSurvey from './pages/VoiceSurvey'
import MedicalScribe from './pages/MedicalScribe'
import AdminQuestions from './pages/AdminQuestions'
import PatientList from './pages/PatientList'

const DEV_LINKS = [
  { to: '/login',           label: 'Login' },
  { to: '/home',            label: 'Patient Home' },
  { to: '/survey/1/voice',  label: 'Voice' },
  { to: '/scribe',          label: 'Scribe' },
  { to: '/patients',        label: 'Patients' },
  { to: '/admin',           label: 'Dashboard' },
  { to: '/admin/questions', label: 'Builder' },
]

function DevNav() {
  return (
    <nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 9999, background: 'rgba(10,22,40,0.95)', backdropFilter: 'blur(10px)', display: 'flex', gap: 4, justifyContent: 'center', padding: '8px 12px', borderTop: '1px solid rgba(45,212,160,0.15)' }}>
      {DEV_LINKS.map(({ to, label }) => (
        <Link key={to} to={to} style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.5)', textDecoration: 'none', padding: '4px 10px', borderRadius: 6, transition: 'color .15s, background .15s' }}
          onMouseEnter={e => { e.currentTarget.style.color = '#2DD4A0'; e.currentTarget.style.background = 'rgba(45,212,160,0.1)' }}
          onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; e.currentTarget.style.background = 'transparent' }}
        >{label}</Link>
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
          <Route path="/"                element={<Navigate to="/admin" replace />} />
          <Route path="/login"           element={<Login />} />
          <Route path="/home"            element={<UserHome />} />
          <Route path="/survey/:id/voice" element={<VoiceSurvey />} />
          <Route path="/scribe"          element={<MedicalScribe />} />
          <Route path="/admin/scribe"    element={<MedicalScribe />} />
          <Route path="/patients"        element={<PatientList />} />
          <Route path="/admin"           element={<AdminDashboard />} />
          <Route path="/admin/questions" element={<AdminQuestions />} />
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
