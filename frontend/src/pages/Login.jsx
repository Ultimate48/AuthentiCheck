import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const Particle = ({ style }) => (
  <div className="absolute rounded-full pointer-events-none" style={style} />
)

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [focused, setFocused] = useState(null)
  const [showPass, setShowPass] = useState(false)
  const [mounted, setMounted] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    setTimeout(() => setMounted(true), 50)
  }, [])

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      navigate('/dashboard')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center overflow-hidden relative"
      style={{ background: '#05050a' }}>

      {/* ── BACKGROUND LAYERS ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Main green orb - bottom left */}
        <div className="absolute -bottom-32 -left-32 w-[600px] h-[600px] rounded-full blur-[120px]"
          style={{ background: 'radial-gradient(circle, rgba(0,255,136,0.15) 0%, rgba(0,204,100,0.06) 50%, transparent 70%)' }} />
        {/* Teal orb - top right */}
        <div className="absolute -top-40 -right-20 w-[500px] h-[500px] rounded-full blur-[100px]"
          style={{ background: 'radial-gradient(circle, rgba(0,204,255,0.08) 0%, rgba(0,180,220,0.04) 50%, transparent 70%)' }} />
        {/* Center glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[100px]"
          style={{ background: 'radial-gradient(circle, rgba(0,255,136,0.06) 0%, transparent 70%)' }} />
        {/* Purple deep accent */}
        <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full blur-[100px]"
          style={{ background: 'radial-gradient(circle, rgba(0,255,136,0.05) 0%, transparent 70%)' }} />
      </div>

      {/* Noise texture */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundSize: '200px 200px',
        }}
      />

      {/* Grid */}
      <div className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(0,255,136,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,136,0.03) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      {/* Floating particles */}
      {[...Array(14)].map((_, i) => (
        <Particle key={i} style={{
          width: `${2 + (i % 3)}px`,
          height: `${2 + (i % 3)}px`,
          left: `${6 + i * 7}%`,
          top: `${8 + ((i * 41) % 84)}%`,
          background: i % 3 === 0
            ? 'rgba(0,255,136,0.6)'
            : i % 3 === 1
            ? 'rgba(0,204,255,0.4)'
            : 'rgba(0,255,136,0.3)',
          boxShadow: i % 2 === 0
            ? '0 0 6px rgba(0,255,136,0.8)'
            : '0 0 6px rgba(0,204,255,0.6)',
          animation: `float ${4 + (i % 4)}s ease-in-out ${i * 0.35}s infinite alternate`,
        }} />
      ))}

      {/* Back to home — top left */}
      <button
        onClick={() => navigate('/home')}
        className="absolute top-6 left-6 flex items-center gap-2 font-mono text-xs uppercase tracking-wider transition-all duration-200 z-20 group"
        style={{ color: '#1a6640' }}
        onMouseEnter={e => e.currentTarget.style.color = '#00ff88'}
        onMouseLeave={e => e.currentTarget.style.color = '#1a6640'}
      >
        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M19 12H5M12 5l-7 7 7 7" />
        </svg>
        Home
      </button>

      {/* ── LOGIN CARD ── */}
      <div className={`relative z-10 w-full max-w-sm px-6 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>

        {/* Brand above card */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="relative w-9 h-9 flex items-center justify-center">
            <div className="w-7 h-7 border-2 rotate-45"
              style={{ borderColor: '#00ff88', boxShadow: '0 0 20px rgba(0,255,136,0.5), inset 0 0 8px rgba(0,255,136,0.1)' }} />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ background: '#00ff88', boxShadow: '0 0 8px #00ff88' }} />
            </div>
          </div>
          <div>
            <p className="font-display font-800 text-base uppercase tracking-[0.18em] leading-none"
              style={{
                background: 'linear-gradient(135deg, #00ff88, #00ddcc)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                filter: 'drop-shadow(0 0 8px rgba(0,255,136,0.4))',
              }}>
              AuthentiCheck
            </p>
            <p className="font-mono text-xs mt-0.5" style={{ color: '#1a4a30' }}>Supply Chain Auth</p>
          </div>
        </div>

        {/* Card */}
        <div className="relative rounded-2xl p-8 overflow-hidden"
          style={{
            background: 'linear-gradient(145deg, rgba(4,14,8,0.97) 0%, rgba(2,10,5,0.99) 100%)',
            border: '1px solid rgba(0,255,136,0.12)',
            boxShadow: '0 0 0 1px rgba(0,255,136,0.04), 0 32px 64px rgba(0,0,0,0.6), inset 0 1px 0 rgba(0,255,136,0.07)',
          }}
        >
          {/* Card top glow */}
          <div className="absolute top-0 left-0 right-0 h-32 pointer-events-none rounded-t-2xl"
            style={{ background: 'linear-gradient(180deg, rgba(0,255,136,0.05) 0%, transparent 100%)' }} />
          {/* Top edge highlight */}
          <div className="absolute -top-px left-1/4 right-1/4 h-px"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(0,255,136,0.6), transparent)' }} />

          {/* Header */}
          <div className="relative z-10 mb-8">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ background: '#00ff88', boxShadow: '0 0 6px #00ff88' }} />
              <span className="font-mono text-xs uppercase tracking-[0.25em]" style={{ color: '#1a6640' }}>
                Manufacturer Portal
              </span>
            </div>
            <h2 className="font-display font-800 text-3xl" style={{ color: '#e8f5ee' }}>
              Welcome back
            </h2>
            <p className="font-body text-sm mt-1" style={{ color: '#2a5040' }}>
              Sign in to your manufacturer account
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="relative z-10 space-y-4">

            {/* Email */}
            <div>
              <label className="block font-mono text-xs uppercase tracking-widest mb-2"
                style={{ color: focused === 'email' ? '#00ff88' : '#1a4a30' }}>
                Email Address
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-200"
                  style={{ color: focused === 'email' ? '#00ff88' : '#1a3a28' }}>
                  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="M2 8l10 6 10-6" />
                  </svg>
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onFocus={() => setFocused('email')}
                  onBlur={() => setFocused(null)}
                  required
                  placeholder="you@company.com"
                  className="w-full pl-10 pr-4 py-3.5 rounded-xl font-body text-sm outline-none transition-all duration-200"
                  style={{
                    background: focused === 'email' ? 'rgba(0,255,136,0.05)' : 'rgba(0,255,136,0.02)',
                    border: focused === 'email' ? '1px solid rgba(0,255,136,0.35)' : '1px solid rgba(0,255,136,0.08)',
                    color: '#c8eed8',
                    boxShadow: focused === 'email' ? '0 0 16px rgba(0,255,136,0.08), inset 0 0 12px rgba(0,255,136,0.03)' : 'none',
                  }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block font-mono text-xs uppercase tracking-widest mb-2"
                style={{ color: focused === 'password' ? '#00ff88' : '#1a4a30' }}>
                Password
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-200"
                  style={{ color: focused === 'password' ? '#00ff88' : '#1a3a28' }}>
                  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <rect x="5" y="11" width="14" height="10" rx="2" />
                    <path d="M8 11V7a4 4 0 018 0v4" />
                  </svg>
                </div>
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onFocus={() => setFocused('password')}
                  onBlur={() => setFocused(null)}
                  required
                  placeholder="••••••••••"
                  className="w-full pl-10 pr-12 py-3.5 rounded-xl font-body text-sm outline-none transition-all duration-200"
                  style={{
                    background: focused === 'password' ? 'rgba(0,255,136,0.05)' : 'rgba(0,255,136,0.02)',
                    border: focused === 'password' ? '1px solid rgba(0,255,136,0.35)' : '1px solid rgba(0,255,136,0.08)',
                    color: '#c8eed8',
                    boxShadow: focused === 'password' ? '0 0 16px rgba(0,255,136,0.08), inset 0 0 12px rgba(0,255,136,0.03)' : 'none',
                  }}
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors duration-200"
                  style={{ color: showPass ? '#00ff88' : '#1a3a28' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#00ff88'}
                  onMouseLeave={e => e.currentTarget.style.color = showPass ? '#00ff88' : '#1a3a28'}
                >
                  {showPass ? (
                    <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
                      <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl"
                style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
                <svg width="14" height="14" fill="none" stroke="#ef4444" strokeWidth="2" viewBox="0 0 24 24" className="shrink-0 mt-0.5">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <p className="font-body text-sm" style={{ color: '#f87171' }}>{error}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="relative w-full py-4 rounded-xl font-display font-700 text-sm uppercase tracking-[0.15em] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              style={{
                background: loading
                  ? 'rgba(0,255,136,0.15)'
                  : 'linear-gradient(135deg, #00ff88 0%, #00cc6a 50%, #00ff88 100%)',
                color: '#021a0e',
                boxShadow: loading ? 'none' : '0 0 28px rgba(0,255,136,0.35), 0 4px 16px rgba(0,255,136,0.2)',
              }}
              onMouseEnter={e => {
                if (!loading) e.currentTarget.style.boxShadow = '0 0 40px rgba(0,255,136,0.55), 0 4px 24px rgba(0,255,136,0.3)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.boxShadow = '0 0 28px rgba(0,255,136,0.35), 0 4px 16px rgba(0,255,136,0.2)'
              }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                  </svg>
                  Authenticating...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Enter Dashboard
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </span>
              )}
            </button>
          </form>

          {/* Back to home inside card */}
          <div className="relative z-10 mt-6 text-center">
            <button
              onClick={() => navigate('/home')}
              className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest transition-colors duration-200"
              style={{ color: '#1a3a28' }}
              onMouseEnter={e => e.currentTarget.style.color = '#00ff88'}
              onMouseLeave={e => e.currentTarget.style.color = '#1a3a28'}
            >
              <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M19 12H5M12 5l-7 7 7 7" />
              </svg>
              Back to Home
            </button>
          </div>
        </div>

        {/* Verify link below card */}
        <p className="text-center font-mono text-xs mt-5" style={{ color: '#0f2a1a' }}>
          Not a manufacturer?{' '}
          <button
            onClick={() => navigate('/verify')}
            className="transition-colors duration-200 underline underline-offset-2"
            style={{ color: '#1a5530' }}
            onMouseEnter={e => e.currentTarget.style.color = '#00ff88'}
            onMouseLeave={e => e.currentTarget.style.color = '#1a5530'}
          >
            Verify a product →
          </button>
        </p>
      </div>

      <style>{`
        @keyframes float {
          from { transform: translateY(0px) scale(1); opacity: 0.4; }
          to   { transform: translateY(-16px) scale(1.2); opacity: 0.8; }
        }
      `}</style>
    </div>
  )
}