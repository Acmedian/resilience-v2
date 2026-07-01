import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { GoogleLogin } from '@react-oauth/google'
import { useAuth } from '../contexts/AuthContext'
import { api } from '../lib/api'

const PAGE_BG = {
  position: 'relative',
  overflow: 'hidden',
  width: '100%',
  height: 720,
  borderRadius: 26,
  background: 'radial-gradient(760px 520px at 100% -6%,rgba(45,212,160,0.08),transparent 55%),#F4F7F9',
  border: '1px solid rgba(16,24,40,0.05)',
  boxShadow: '0 1px 2px rgba(16,24,40,0.04),0 30px 60px -18px rgba(16,24,40,0.18)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}

const inputWrapStyle = { display: 'flex', alignItems: 'center', gap: 10, height: 46, padding: '0 14px', borderRadius: 12, background: '#F9FAFB', border: '1px solid rgba(16,24,40,0.1)', marginBottom: 16 }
const inputStyle = { flex: 1, border: 'none', background: 'transparent', outline: 'none', fontSize: 14, color: '#0A1628', fontWeight: 500, fontFamily: 'inherit' }

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
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
        setError(data?.detail || 'Google sign-in failed. Please try again.')
        return
      }
      login(data.access_token, data.user)
      goToRoleHome(data.user.role)
    } catch {
      setError('Google sign-in failed. Please try again.')
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
        setError(data?.detail || 'Invalid credentials.')
        return
      }
      login(data.access_token, data.user)
      goToRoleHome(data.user.role)
    } catch {
      setError('Unable to reach the server. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleSignIn()
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(900px 520px at 100% -8%,rgba(45,212,160,0.07),transparent 60%),#F4F7F9', padding: '40px 24px' }}>
      <div style={PAGE_BG}>
        {/* dot grid */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: 'radial-gradient(rgba(16,24,40,0.045) 1px,transparent 1px)', backgroundSize: '24px 24px', maskImage: 'radial-gradient(120% 100% at 50% 30%,#000,transparent 88%)', WebkitMaskImage: 'radial-gradient(120% 100% at 50% 30%,#000,transparent 88%)' }} />

        {/* auth card */}
        <div style={{ position: 'relative', display: 'flex', width: 940, height: 576, borderRadius: 24, overflow: 'hidden', background: '#fff', border: '1px solid rgba(16,24,40,0.06)', boxShadow: '0 1px 2px rgba(16,24,40,0.04),0 34px 64px -20px rgba(16,24,40,0.28)' }}>

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
          <div style={{ flex: 1, padding: '40px 44px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ fontSize: 23, fontWeight: 800, letterSpacing: '-0.025em', color: '#0A1628' }}>Login</div>
            <div style={{ fontSize: 13, color: '#667085', fontWeight: 500, marginTop: 4, marginBottom: 22 }}>Choose your role to continue</div>

            {/* Role tabs */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 4, padding: 4, borderRadius: 12, background: 'rgba(16,24,40,0.05)', marginBottom: 22 }}>
              {roles.map(r => (
                <div key={r} onClick={() => selectRole(r)}
                  style={{ textAlign: 'center', fontSize: 13, fontWeight: role === r ? 700 : 600, color: role === r ? '#06352a' : '#667085', padding: '9px 0', borderRadius: 9, background: role === r ? '#2DD4A0' : 'transparent', boxShadow: role === r ? '0 4px 12px -3px rgba(45,212,160,0.5)' : 'none', cursor: 'pointer', transition: 'all .15s' }}
                >{r}</div>
              ))}
            </div>

            {role === 'Patient' ? (
              <>
                <div style={{ fontSize: 13.5, color: '#475467', fontWeight: 500, lineHeight: 1.6, marginBottom: 22 }}>
                  Patients sign in securely with their Google account — no password required.
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
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
              </>
            ) : (
              <>
                {/* Email */}
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475467', marginBottom: 7 }}>Email</label>
                <div style={inputWrapStyle}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#98A2B3" strokeWidth="2"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={role === 'Clinician' ? 'clinician@demo.com' : 'admin@demo.com'}
                    style={inputStyle}
                  />
                </div>

                {/* Password */}
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475467', marginBottom: 7 }}>Password</label>
                <div style={{ ...inputWrapStyle, marginBottom: 10 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#98A2B3" strokeWidth="2"><rect x="4" y="11" width="16" height="9" rx="2"/><path d="M8 11V7a4 4 0 018 0v4"/></svg>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="••••••••••"
                    style={{ ...inputStyle, letterSpacing: showPassword ? 'normal' : 2 }}
                  />
                  <svg onClick={() => setShowPassword(s => !s)} style={{ cursor: 'pointer' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#98A2B3" strokeWidth="2"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></svg>
                </div>
                <div style={{ textAlign: 'right', marginBottom: 18 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#0A8a63', cursor: 'pointer' }}>Forgot password?</span>
                </div>

                {/* Sign in */}
                <button onClick={handleSignIn} disabled={submitting}
                  style={{ width: '100%', height: 48, border: 'none', borderRadius: 13, background: '#2DD4A0', color: '#06352a', fontSize: 14.5, fontWeight: 800, fontFamily: 'inherit', cursor: submitting ? 'default' : 'pointer', opacity: submitting ? 0.7 : 1, boxShadow: '0 10px 24px -8px rgba(45,212,160,0.6)', transition: 'box-shadow .25s ease' }}
                  onMouseEnter={e => e.currentTarget.style.boxShadow = '0 14px 30px -8px rgba(45,212,160,0.75)'}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = '0 10px 24px -8px rgba(45,212,160,0.6)'}
                >{submitting ? 'Signing in…' : 'Sign in'}</button>
              </>
            )}

            {error && (
              <div style={{ marginTop: 16, fontSize: 12.5, fontWeight: 600, color: '#D92D20', textAlign: 'center' }}>
                {error}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
