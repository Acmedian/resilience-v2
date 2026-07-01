import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { GoogleLogin } from '@react-oauth/google'
import { useAuth } from '../contexts/AuthContext'
import { api } from '../lib/api'
import { useToast } from '../components/ui/ToastContext'

const PAGE_BG = {
  position: 'relative',
  overflow: 'hidden',
  width: '100%',
  height: 720,
  borderRadius: 26,
  background: 'radial-gradient(760px 520px at 100% -6%,rgba(45,212,160,0.08),transparent 55%),#0A1628',
  border: '1px solid rgba(255,255,255,0.06)',
  boxShadow: '0 1px 2px rgba(0,0,0,0.2),0 30px 60px -18px rgba(0,0,0,0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const showToast = useToast()
  const [role, setRole] = useState('Patient')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const roles = ['Patient', 'Clinician', 'Admin']

  function goToRoleHome(userRole) {
    const path = { patient: '/home', clinician: '/clinician/patients', admin: '/admin' }[userRole] || '/login'
    navigate(path, { replace: true })
  }

  function selectRole(r) {
    setRole(r)
    setError('')
  }

  async function handleGoogleSuccess(credentialResponse) {
    setError('')
    setSubmitting(true)
    try {
      const data = await api.post('/api/auth/google', { id_token: credentialResponse.credential })
      if (!data || !data.access_token) {
        const message = data?.detail || 'Google sign-in failed. Please try again.'
        setError(message)
        showToast(message, 'error')
        return
      }
      login(data.access_token, data.user)
      showToast(`Welcome back, ${data.user.name.split(' ')[0]}!`, 'success')
      goToRoleHome(data.user.role)
    } catch {
      setError('Google sign-in failed. Please try again.')
      showToast('Google sign-in failed. Please try again.', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleSignIn() {
    if (role === 'Patient') {
      setError('Use "Sign in with Google" below to continue as a patient.')
      return
    }

    if (!email || !password) {
      setError('Please enter your email and password.')
      return
    }

    setError('')
    setSubmitting(true)
    try {
      const data = await api.post('/api/auth/login', { email, password })
      if (!data || !data.access_token) {
        const message = data?.detail || 'Invalid credentials.'
        setError(message)
        showToast(message, 'error')
        return
      }
      login(data.access_token, data.user)
      showToast(`Welcome back, ${data.user.name.split(' ')[0]}!`, 'success')
      goToRoleHome(data.user.role)
    } catch {
      setError('Unable to reach the server. Please try again.')
      showToast('Unable to reach the server. Please try again.', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleSignIn()
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(900px 520px at 100% -8%,rgba(45,212,160,0.07),transparent 60%),#0A1628', padding: '40px 24px' }}>
      <div style={PAGE_BG}>
        {/* dot grid */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: 'radial-gradient(rgba(255,255,255,0.04) 1px,transparent 1px)', backgroundSize: '24px 24px', maskImage: 'radial-gradient(120% 100% at 50% 30%,#000,transparent 88%)', WebkitMaskImage: 'radial-gradient(120% 100% at 50% 30%,#000,transparent 88%)' }} />

        {/* auth card */}
        <div style={{ position: 'relative', display: 'flex', width: 940, height: 576, borderRadius: 24, overflow: 'hidden', background: '#0F1715', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 1px 2px rgba(0,0,0,0.3),0 34px 64px -20px rgba(0,0,0,0.6)' }}>

          {/* LEFT — dark decorative panel */}
          <div style={{ position: 'relative', overflow: 'hidden', width: 420, flexShrink: 0, padding: '40px 38px', color: '#fff', display: 'flex', flexDirection: 'column', background: 'repeating-radial-gradient(circle at 0% 100%,rgba(45,212,160,0.05) 0 1.5px,transparent 1.5px 26px),radial-gradient(80% 70% at 8% 8%,rgba(45,212,160,0.28),transparent 55%),radial-gradient(70% 80% at 100% 100%,rgba(45,212,160,0.14),transparent 55%),#0A1628' }}>
            {/* blobs */}
            <div style={{ position: 'absolute', width: 260, height: 260, right: -90, top: 60, borderRadius: '44% 56% 62% 38%/47% 42% 58% 53%', background: 'radial-gradient(circle at 35% 30%,rgba(45,212,160,0.30),transparent 70%)', filter: 'blur(6px)', animation: 'blobdrift 11s ease-in-out infinite' }} />
            <div style={{ position: 'absolute', width: 200, height: 200, left: -70, bottom: -40, borderRadius: '52% 48% 40% 60%/55% 46% 54% 45%', background: 'radial-gradient(circle at 50% 50%,rgba(45,212,160,0.18),transparent 70%)', filter: 'blur(4px)', animation: 'blobdrift 13s ease-in-out infinite 1.5s' }} />

            {/* logo */}
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 11 }}>
              <div style={{ width: 36, height: 36, borderRadius: 11, background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(45,212,160,0.3)', boxShadow: '0 0 22px rgba(45,212,160,0.35)' }}>
                <div style={{ width: 13, height: 13, background: '#2DD4A0', transform: 'rotate(45deg)', borderRadius: 2 }} />
              </div>
              <span style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-0.02em' }}>Resilience</span>
            </div>

            {/* tagline */}
            <div style={{ position: 'relative', marginTop: 'auto' }}>
              <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.18 }}>
                Mental resilience,<br />measured and<br /><span style={{ color: '#2DD4A0' }}>supported.</span>
              </div>
              <p style={{ margin: '16px 0 0', fontSize: 13.5, lineHeight: 1.6, color: 'rgba(255,255,255,0.6)', fontWeight: 500, maxWidth: 280 }}>
                Track wellbeing, run smart screenings, and give every patient a clinician-grade view of their progress.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 26, fontSize: 11.5, color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#2DD4A0" strokeWidth="2.2"><rect x="4" y="11" width="16" height="9" rx="2"/><path d="M8 11V7a4 4 0 018 0v4"/></svg>
                HIPAA-ready · end-to-end encrypted
              </div>
            </div>
          </div>

          {/* RIGHT — form */}
          <div style={{ flex: 1, padding: '40px 44px', display: 'flex', flexDirection: 'column', justifyContent: 'center', background: '#0F1715' }}>
            <div className="text-white font-black" style={{ fontSize: 23, letterSpacing: '-0.025em' }}>Login</div>
            <div className="text-white/40" style={{ fontSize: 13, fontWeight: 500, marginTop: 4, marginBottom: 22 }}>Choose your role to continue</div>

            {/* Role tabs */}
            <div className="bg-white/5 rounded-xl p-1 flex gap-1" style={{ marginBottom: 22 }}>
              {roles.map(r => (
                <button
                  key={r}
                  type="button"
                  onClick={() => selectRole(r)}
                  className={
                    role === r
                      ? 'flex-1 text-center text-sm py-2 px-4 rounded-lg bg-mint text-ink font-bold cursor-pointer transition-all duration-200'
                      : 'flex-1 text-center text-sm py-2 px-4 rounded-lg text-white/50 hover:text-white/80 cursor-pointer transition-all duration-200'
                  }
                >{r}</button>
              ))}
            </div>

            {role === 'Patient' ? (
              <>
                <div className="text-white/50" style={{ fontSize: 13.5, fontWeight: 500, lineHeight: 1.6, marginBottom: 22 }}>
                  Patients sign in securely with their Google account — no password required.
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
                  <div className="rounded-xl overflow-hidden shadow-lg">
                    <GoogleLogin
                      onSuccess={handleGoogleSuccess}
                      onError={() => setError('Google sign-in failed. Please try again.')}
                      theme="filled_black"
                      shape="pill"
                      size="large"
                      text="signin_with"
                      width="260"
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Email */}
                <label className="text-white/60" style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 7 }}>Email</label>
                <div className="relative" style={{ marginBottom: 16 }}>
                  <svg className="absolute" style={{ left: 14, top: '50%', transform: 'translateY(-50%)' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#98A2B3" strokeWidth="2"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={role === 'Clinician' ? 'clinician@demo.com' : 'admin@demo.com'}
                    className="w-full bg-white/5 border border-white/10 text-white placeholder:text-white/25 rounded-xl text-sm outline-none transition-all duration-200 focus:border-mint focus:ring-1 focus:ring-mint"
                    style={{ padding: '12px 14px 12px 40px', fontFamily: 'inherit' }}
                  />
                </div>

                {/* Password */}
                <label className="text-white/60" style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 7 }}>Password</label>
                <div className="relative" style={{ marginBottom: 10 }}>
                  <svg className="absolute" style={{ left: 14, top: '50%', transform: 'translateY(-50%)' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#98A2B3" strokeWidth="2"><rect x="4" y="11" width="16" height="9" rx="2"/><path d="M8 11V7a4 4 0 018 0v4"/></svg>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="••••••••••"
                    className="w-full bg-white/5 border border-white/10 text-white placeholder:text-white/25 rounded-xl text-sm outline-none transition-all duration-200 focus:border-mint focus:ring-1 focus:ring-mint"
                    style={{ padding: '12px 40px 12px 40px', letterSpacing: showPassword ? 'normal' : 2, fontFamily: 'inherit' }}
                  />
                  <svg onClick={() => setShowPassword(s => !s)} className="absolute" style={{ right: 14, top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#98A2B3" strokeWidth="2"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></svg>
                </div>
                <div style={{ textAlign: 'right', marginBottom: 18 }}>
                  <span className="text-mint" style={{ fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Forgot password?</span>
                </div>

                {/* Sign in */}
                <button
                  onClick={handleSignIn}
                  disabled={submitting}
                  className="btn-mint w-full"
                  style={{ height: 48, fontSize: 14.5, opacity: submitting ? 0.7 : 1, cursor: submitting ? 'default' : 'pointer' }}
                >{submitting ? 'Signing in…' : 'Sign in'}</button>
              </>
            )}

            {error && (
              <div className="text-red-400" style={{ marginTop: 16, fontSize: 12.5, fontWeight: 600, textAlign: 'center' }}>
                {error}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
