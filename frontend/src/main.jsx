import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google'
import ErrorBoundary from './components/ui/ErrorBoundary.jsx'
import { ToastProvider } from './components/ui/ToastContext.jsx'
import './index.css'
import App from './App.jsx'

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <ToastProvider>
          <App />
        </ToastProvider>
      </GoogleOAuthProvider>
    </ErrorBoundary>
  </StrictMode>,
)
