import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import ProtectedRoute from './components/auth/ProtectedRoute'
import RoleRoute from './components/auth/RoleRoute'
import AdminDashboard from './pages/AdminDashboard'
import Login from './pages/Login'
import UserHome from './pages/UserHome'
import VoiceScreening from './pages/VoiceScreening'
import ScreeningComplete from './pages/ScreeningComplete'
import MedicalScribe from './pages/MedicalScribe'
import ScreeningBuilder from './pages/ScreeningBuilder'
import AdminUsers from './pages/AdminUsers'
import PatientList from './pages/PatientList'
import PatientDetail from './pages/PatientDetail'
import NotFound from './pages/NotFound'

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
          <Route path="/screening/:id" element={<RoleRoute allowedRoles={['patient']}><VoiceScreening /></RoleRoute>} />
          <Route path="/screening/:id/complete" element={<RoleRoute allowedRoles={['patient']}><ScreeningComplete /></RoleRoute>} />

          <Route path="/clinician/patients" element={<RoleRoute allowedRoles={['clinician']}><PatientList /></RoleRoute>} />
          <Route path="/clinician/patients/:id" element={<RoleRoute allowedRoles={['clinician']}><PatientDetail /></RoleRoute>} />
          <Route path="/clinician/scribe/:sessionId" element={<RoleRoute allowedRoles={['clinician']}><MedicalScribe /></RoleRoute>} />

          <Route path="/admin" element={<RoleRoute allowedRoles={['admin']}><AdminDashboard /></RoleRoute>} />
          <Route path="/admin/screenings" element={<RoleRoute allowedRoles={['admin']}><ScreeningBuilder /></RoleRoute>} />
          <Route path="/admin/users" element={<RoleRoute allowedRoles={['admin']}><AdminUsers /></RoleRoute>} />
        </Route>

        <Route path="*" element={<NotFound />} />
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
