import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import ProtectedRoute from './components/auth/ProtectedRoute'
import RoleRoute from './components/auth/RoleRoute'
import AdminDashboard from './pages/AdminDashboard'
import Login from './pages/Login'
import UserHome from './pages/UserHome'
import VoiceSurvey from './pages/VoiceSurvey'
import MedicalScribe from './pages/MedicalScribe'
import AdminQuestions from './pages/AdminQuestions'
import PatientList from './pages/PatientList'

const ROLE_HOME = {
  patient: '/home',
  clinician: '/clinician/patients',
  admin: '/admin',
}

function RoleHomeRedirect() {
  const { user } = useAuth()
  return <Navigate to={ROLE_HOME[user?.role] || '/login'} replace />
}

function PublicRoute({ children }) {
  const { user, token, loading } = useAuth()
  if (loading) return null
  if (token && user) {
    return <Navigate to={ROLE_HOME[user.role] || '/login'} replace />
  }
  return children
}

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<RoleHomeRedirect />} />

          <Route path="/home" element={<RoleRoute allowedRoles={['patient']}><UserHome /></RoleRoute>} />
          <Route path="/screening/:id" element={<RoleRoute allowedRoles={['patient']}><VoiceSurvey /></RoleRoute>} />

          <Route path="/clinician/patients" element={<RoleRoute allowedRoles={['clinician']}><PatientList /></RoleRoute>} />
          <Route path="/clinician/scribe/:sessionId" element={<RoleRoute allowedRoles={['clinician']}><MedicalScribe /></RoleRoute>} />

          <Route path="/admin" element={<RoleRoute allowedRoles={['admin']}><AdminDashboard /></RoleRoute>} />
          <Route path="/admin/screenings" element={<RoleRoute allowedRoles={['admin']}><AdminQuestions /></RoleRoute>} />
        </Route>
      </Routes>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AnimatedRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}
