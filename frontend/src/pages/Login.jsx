import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, Mail, Lock, ArrowRight, Info } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const ROLES = [
  { id: 'participant', label: 'Participant' },
  { id: 'doctor', label: 'Doctor' },
  { id: 'admin', label: 'Admin' },
]

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
      <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  )
}

export default function Login() {
  const [role, setRole] = useState('participant')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  function handleSignIn(e) {
    e.preventDefault()
    if (role === 'admin') {
      navigate('/admin/questions')
    } else if (role === 'doctor') {
      navigate('/scribe')
    } else {
      navigate('/home')
    }
  }

  function handleGoogle() {
    navigate('/home')
  }

  return (
    <div className="min-h-screen bg-surface-soft flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-[400px]"
      >
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-ink mb-4 shadow-float">
            <Zap className="w-7 h-7 text-mint" fill="#2DD4A0" strokeWidth={0} />
          </div>
          <h1 className="text-2xl font-bold text-ink tracking-tight">Resilience</h1>
          <p className="text-sm text-slate-muted mt-1">Your mental health companion</p>
        </div>

        {/* Card */}
        <div className="card p-6 shadow-float">
          {/* Role Switcher */}
          <div className="relative flex bg-border rounded-xl p-1 mb-6">
            {ROLES.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setRole(id)}
                className="relative flex-1 py-1.5 text-sm font-medium rounded-lg z-10 transition-colors"
                style={{ color: role === id ? '#0A1628' : '#9CA3AF' }}
              >
                {role === id && (
                  <motion.div
                    layoutId="role-pill"
                    className="absolute inset-0 bg-white rounded-lg shadow-card"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{label}</span>
              </button>
            ))}
          </div>

          {/* Auth Area */}
          <AnimatePresence mode="wait">
            {role === 'participant' ? (
              <motion.div
                key="participant"
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 12 }}
                transition={{ duration: 0.22 }}
              >
                <button
                  onClick={handleGoogle}
                  className="w-full flex items-center justify-center gap-3 bg-white border border-border-strong rounded-xl py-3 px-4 text-sm font-medium text-ink hover:border-mint transition-colors shadow-card hover:shadow-lift"
                >
                  <GoogleIcon />
                  Continue with Google
                </button>
              </motion.div>
            ) : (
              <motion.form
                key="credentials"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.22 }}
                onSubmit={handleSignIn}
                className="space-y-3"
              >
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-muted pointer-events-none" />
                  <input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="input pl-9"
                    required
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-muted pointer-events-none" />
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="input pl-9"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="btn-primary w-full mt-1"
                >
                  Sign in
                  <ArrowRight className="w-4 h-4" />
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          {/* OTP Note - only for participants */}
          <AnimatePresence>
            {role === 'participant' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="mt-4 flex items-start gap-2 bg-mint-light rounded-xl p-3">
                  <Info className="w-3.5 h-3.5 text-mint-mid mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-mint-dark leading-relaxed">
                    You'll receive a one-time code via SMS after Google sign-in for extra security.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <p className="text-center text-xs text-slate-muted mt-6">
          Protected by end-to-end encryption
        </p>
      </motion.div>
    </div>
  )
}
