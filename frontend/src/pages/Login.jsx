import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

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

export default function Login() {
  const navigate = useNavigate()
  const [role, setRole] = useState('Patient')
  const [email, setEmail] = useState('sarah.mitchell@email.com')

  function handleSignIn() {
    if (role === 'Patient')    navigate('/home')
    else if (role === 'Clinician') navigate('/scribe')
    else navigate('/admin')
  }

  const roles = ['Patient', 'Clinician', 'Admin']

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
                <div key={r} onClick={() => setRole(r)}
                  style={{ textAlign: 'center', fontSize: 13, fontWeight: role === r ? 700 : 600, color: role === r ? '#06352a' : '#667085', padding: '9px 0', borderRadius: 9, background: role === r ? '#2DD4A0' : 'transparent', boxShadow: role === r ? '0 4px 12px -3px rgba(45,212,160,0.5)' : 'none', cursor: 'pointer', transition: 'all .15s' }}
                >{r}</div>
              ))}
            </div>

            {/* Email */}
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475467', marginBottom: 7 }}>Email</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, height: 46, padding: '0 14px', borderRadius: 12, background: '#F9FAFB', border: '1px solid rgba(16,24,40,0.1)', marginBottom: 16 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#98A2B3" strokeWidth="2"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>
              <span style={{ fontSize: 14, color: '#98A2B3', fontWeight: 500 }}>{email}</span>
            </div>

            {/* Password */}
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475467', marginBottom: 7 }}>Password</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, height: 46, padding: '0 14px', borderRadius: 12, background: '#F9FAFB', border: '1px solid rgba(16,24,40,0.1)', marginBottom: 10 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#98A2B3" strokeWidth="2"><rect x="4" y="11" width="16" height="9" rx="2"/><path d="M8 11V7a4 4 0 018 0v4"/></svg>
              <span style={{ flex: 1, fontSize: 14, color: '#475467', fontWeight: 600, letterSpacing: 2 }}>••••••••••</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#98A2B3" strokeWidth="2"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></svg>
            </div>
            <div style={{ textAlign: 'right', marginBottom: 18 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#0A8a63', cursor: 'pointer' }}>Forgot password?</span>
            </div>

            {/* Sign in */}
            <button onClick={handleSignIn}
              style={{ width: '100%', height: 48, border: 'none', borderRadius: 13, background: '#2DD4A0', color: '#06352a', fontSize: 14.5, fontWeight: 800, fontFamily: 'inherit', cursor: 'pointer', boxShadow: '0 10px 24px -8px rgba(45,212,160,0.6)', transition: 'box-shadow .25s ease' }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = '0 14px 30px -8px rgba(45,212,160,0.75)'}
              onMouseLeave={e => e.currentTarget.style.boxShadow = '0 10px 24px -8px rgba(45,212,160,0.6)'}
            >Sign in</button>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0' }}>
              <div style={{ flex: 1, height: 1, background: 'rgba(16,24,40,0.08)' }} />
              <span style={{ fontSize: 11.5, color: '#98A2B3', fontWeight: 600 }}>or continue with</span>
              <div style={{ flex: 1, height: 1, background: 'rgba(16,24,40,0.08)' }} />
            </div>

            {/* SSO buttons */}
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              {/* Google */}
              <div style={{ width: 56, height: 48, borderRadius: 12, background: '#fff', border: '1px solid rgba(16,24,40,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 1px 2px rgba(16,24,40,0.04)' }}>
                <svg width="19" height="19" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8a12 12 0 110-24c3 0 5.8 1.2 7.9 3l5.7-5.7A20 20 0 1024 44c11 0 20-9 20-20 0-1.3-.1-2.3-.4-3.5z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8A12 12 0 0124 12c3 0 5.8 1.2 7.9 3l5.7-5.7A20 20 0 006.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2A12 12 0 0124 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3a12 12 0 01-4.1 5.6l6.2 5.2C39.9 36 44 30.6 44 24c0-1.3-.1-2.3-.4-3.5z"/></svg>
              </div>
              {/* GitHub */}
              <div style={{ width: 56, height: 48, borderRadius: 12, background: '#fff', border: '1px solid rgba(16,24,40,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 1px 2px rgba(16,24,40,0.04)' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#0A1628"><path d="M12 .5A11.5 11.5 0 00.5 12a11.5 11.5 0 007.86 10.92c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.71.08-.71 1.16.08 1.77 1.2 1.77 1.2 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 015.79 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.43-2.7 5.4-5.26 5.69.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0023.5 12 11.5 11.5 0 0012 .5z"/></svg>
              </div>
              {/* Facebook */}
              <div style={{ width: 56, height: 48, borderRadius: 12, background: '#fff', border: '1px solid rgba(16,24,40,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 1px 2px rgba(16,24,40,0.04)' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12a12 12 0 10-13.9 11.9v-8.4H7.1V12h3V9.4c0-3 1.8-4.6 4.5-4.6 1.3 0 2.6.23 2.6.23v2.9h-1.5c-1.4 0-1.9.9-1.9 1.8V12h3.3l-.53 3.5h-2.8v8.4A12 12 0 0024 12z"/></svg>
              </div>
            </div>

            <div style={{ textAlign: 'center', marginTop: 20, fontSize: 12.5, color: '#667085', fontWeight: 500 }}>
              Don't have an account yet?{' '}
              <span style={{ color: '#0A8a63', fontWeight: 700, cursor: 'pointer' }}>Register for free</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
