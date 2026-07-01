import { Navigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

const DEFAULT_ROUTE_BY_ROLE = {
  patient: '/home',
  clinician: '/clinician/patients',
  admin: '/admin',
}

export default function RoleRoute({ allowedRoles, children }) {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to={DEFAULT_ROUTE_BY_ROLE[user.role] || '/login'} replace />
  }

  return children
}
