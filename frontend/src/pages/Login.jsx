import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, Mail, Lock, ArrowRight, Shield } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const ROLES = [
  { id: 'patient', label: 'Patient' },
  { id: 'clinician', label: 'Clinician' },
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
  const [role, setRole] = useState('patient')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  function handleSignIn(e) {
    e.preventDefault()
    if (role === 'admin') {
      navigate('/admin/questions')
    } else if (role === 'clinician') {
      navigate('/scribe')
    } else {
      navigate('/home')
    }
  }

  function handleGoogle() {
    navigate('/home')
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: '#0B0F0E' }}
    >
      {/* Background glow */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(45,212,160,0.08) 0%, transparent 70%)',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-[400px] relative"
      >
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4"
            style={{ background: '#0F1715', border: '1px solid rgba(45,212,160,0.2)' }}
          >
            <Zap className="w-7 h-7 text-mint" fill="#2DD4A0" strokeWidth={0} />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Resilience</h1>
          <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.35)' }}>
            Mental health screening and care platform
          </p>
        </div>

        {/* Card */}
        <div
          className="p-6 rounded-2xl"
          style={{ background: '#0F1715', border: '1px solid rgba(45,212,160,0.12)' }}
        >
          {/* Role Switcher */}
          <div
            className="relative flex rounded-xl p-1 mb-6"
            style={{ background: 'rgba(255,255,255,0.04)' }}
          >
            {ROLES.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setRole(id)}
                className="relative flex-1 py-1.5 text-sm font-medium rounded-lg z-10 transition-colors"
                style={{ color: role === id ? '#fff' : 'rgba(255,255,255,0.35)' }}
              >
                {role === id && (
                  <motion.div
                    layoutId="role-pill"
                    className="absolute inset-0 rounded-lg"
                    style={{ background: 'rgba(45,212,160,0.15)', border: '1px solid rgba(45,212,160,0.25)' }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{label}</span>
              </button>
            ))}
          </div>

          {/* Auth Area */}
          <AnimatePresence mode="wait">
            {role === 'patient' ? (
              <motion.div
                key="patient"
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 12 }}
                transition={{ duration: 0.22 }}
                className="space-y-3"
              >
                {/* Google SSO — kept white/light for brand recognition contrast */}
                <button
                  onClick={handleGoogle}
                  className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 rounded-xl py-3 px-4 text-sm font-semibold text-gray-800 hover:bg-gray-50 transition-colors shadow-sm"
                >
                  <GoogleIcon />
                  Continue with Google
                </button>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
                  <span className="text-[10px] font-semibold" style={{ color: 'rgba(255,255,255,0.2)' }}>or</span>
                  <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
                </div>
                <button
                  onClick={handleGoogle}
                  className="w-full py-2.5 rounded-xl text-sm font-semibold transition-all"
                  style={{ background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.08)' }}
                >
                  Sign in with email link
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
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: 'rgba(255,255,255,0.25)' }} />
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
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: 'rgba(255,255,255,0.25)' }} />
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="input pl-9"
                    required
                  />
                </div>
                <button type="submit" className="btn-mint w-full mt-1">
                  Sign in
                  <ArrowRight className="w-4 h-4" />
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-center gap-1.5 mt-6">
          <Shield size={11} style={{ color: 'rgba(255,255,255,0.2)' }} />
          <p className="text-center text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>
            Protected by end-to-end encryption
          </p>
        </div>
      </motion.div>
    </div>
  )
}
