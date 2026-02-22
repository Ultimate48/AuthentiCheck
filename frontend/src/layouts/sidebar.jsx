import { useEffect, useState } from 'react'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const NAV_ITEMS = [
  {
    to: '/home',
    label: 'Home',
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" />
        <path d="M9 21V12h6v9" />
      </svg>
    ),
    color: '#00ff88',
    desc: 'Overview',
  },
  {
    to: '/dashboard',
    label: 'Dashboard',
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
    color: '#00ccff',
    desc: 'Add Batches',
  },
  {
    to: '/verify',
    label: 'Verify',
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M9 12l2 2 4-4" />
        <path d="M12 2a10 10 0 100 20A10 10 0 0012 2z" />
      </svg>
    ),
    color: '#a855f7',
    desc: 'Scan & Confirm',
  },
  {
    to: '/admin',
    label: 'Admin',
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
        <path d="M18 14l1.5 1.5L22 13" />
      </svg>
    ),
    color: '#f59e0b',
    desc: 'Manage Members',
  },
]

function NavItem({ item, index }) {
  const location = useLocation()
  const isActive = location.pathname === item.to

  return (
    <NavLink
      to={item.to}
      style={{ animationDelay: `${index * 60}ms` }}
      className="group relative flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 animate-fade-up"
    >
      {isActive && (
        <div
          className="absolute inset-0 rounded-xl"
          style={{
            background: `linear-gradient(135deg, ${item.color}18, ${item.color}08)`,
            border: `1px solid ${item.color}30`,
          }}
        />
      )}
      {!isActive && (
        <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }} />
      )}

      <div
        className="relative z-10 w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-all duration-200"
        style={{
          background: isActive ? `${item.color}20` : 'rgba(255,255,255,0.04)',
          color: isActive ? item.color : '#666688',
          boxShadow: isActive ? `0 0 12px ${item.color}30` : 'none',
          border: isActive ? `1px solid ${item.color}30` : '1px solid rgba(255,255,255,0.06)',
        }}
      >
        {item.icon}
      </div>

      <div className="relative z-10 min-w-0">
        <p
          className="font-display font-600 text-sm leading-tight transition-colors duration-200"
          style={{ color: isActive ? item.color : '#c8c8e0' }}
        >
          {item.label}
        </p>
        <p className="font-mono text-xs leading-tight mt-0.5" style={{ color: '#55556a' }}>
          {item.desc}
        </p>
      </div>

      {isActive && (
        <div
          className="absolute right-0 top-1/2 -translate-y-1/2 w-0.5 h-6 rounded-full"
          style={{ background: item.color, boxShadow: `0 0 8px ${item.color}` }}
        />
      )}
    </NavLink>
  )
}

export default function Sidebar() {
  const [user, setUser] = useState(null)
  const [member, setMember] = useState(null)
  const [time, setTime] = useState(new Date())
  const navigate = useNavigate()

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUser(data.user)
        supabase
          .from('SupplyMembers')
          .select('entity_name, id, status')
          .eq('id', data.user.id)
          .single()
          .then(({ data: m }) => { if (m) setMember(m) })
      }
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null)
      if (!session?.user) setMember(null)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setMember(null)
    navigate('/login')
  }

  const hours = time.getHours().toString().padStart(2, '0')
  const mins = time.getMinutes().toString().padStart(2, '0')
  const secs = time.getSeconds().toString().padStart(2, '0')

  const statusColor =
    member?.status === 'active' ? '#00ff88' :
    member?.status === 'suspended' ? '#f59e0b' : '#f43f5e'

  return (
    <aside
      className="fixed left-0 top-0 h-screen w-64 flex flex-col z-20 select-none"
      style={{
        background: 'linear-gradient(180deg, #0d0d16 0%, #0a0a12 100%)',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        boxShadow: '4px 0 32px rgba(0,0,0,0.4)',
      }}
    >
      {/* Grid texture */}
      <div className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: 'linear-gradient(rgba(0,255,136,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,136,0.03) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Top glow */}
      <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-48 h-32 rounded-full blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(0,255,136,0.12) 0%, transparent 70%)' }} />

      {/* ── BRAND ── */}
      <div className="relative px-5 pt-6 pb-5"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>

        <div className="flex items-center gap-3 mb-3">
          <div className="relative w-9 h-9 flex items-center justify-center shrink-0">
            <div
              className="w-7 h-7 border-2 rotate-45"
              style={{
                borderColor: '#00ff88',
                boxShadow: '0 0 16px rgba(0,255,136,0.4), inset 0 0 8px rgba(0,255,136,0.1)',
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-chain-accent animate-pulse" />
            </div>
          </div>

          <div>
            <p
              className="font-display font-800 text-sm uppercase tracking-[0.15em] leading-tight"
              style={{
                background: 'linear-gradient(135deg, #00ff88, #00ddcc)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              AuthentiCheck
            </p>
            <p className="font-mono text-xs leading-tight" style={{ color: '#44445a' }}>
              Supply Chain Auth
            </p>
          </div>
        </div>

        {/* Live clock */}
        <div
          className="flex items-center justify-between px-3 py-1.5 rounded-lg"
          style={{ background: 'rgba(0,255,136,0.04)', border: '1px solid rgba(0,255,136,0.1)' }}
        >
          <div className="flex items-center gap-1.5">
            <div className="w-1 h-1 rounded-full bg-chain-accent animate-pulse" />
            <span className="font-mono text-xs" style={{ color: '#33aa66' }}>LIVE</span>
          </div>
          <span className="font-mono text-xs font-500 tracking-widest" style={{ color: '#00ff88' }}>
            {hours}:{mins}
            <span className="opacity-60">:{secs}</span>
          </span>
        </div>
      </div>

      {/* ── NAV ── */}
      <nav className="relative flex-1 px-3 py-5 space-y-0.5 overflow-y-auto">
        <p className="font-mono text-xs uppercase tracking-[0.2em] px-3 mb-3" style={{ color: '#33334a' }}>
          Menu
        </p>
        {NAV_ITEMS.map((item, i) => (
          <NavItem key={item.to} item={item} index={i} />
        ))}
      </nav>

      {/* ── USER / AUTH ── */}
      <div
        className="relative px-3 pb-5 pt-3"
        style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
      >
        {user ? (
          <div className="space-y-2">
            {/* User card */}
            <div
              className="relative rounded-xl p-3 overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(0,255,136,0.06), rgba(0,204,255,0.03))',
                border: '1px solid rgba(0,255,136,0.12)',
              }}
            >
              <div className="absolute top-0 right-0 w-12 h-12 pointer-events-none"
                style={{ background: 'radial-gradient(circle at top right, rgba(0,255,136,0.12), transparent 70%)' }} />

              <div className="flex items-start gap-3">
                {/* Avatar initial */}
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center font-display font-800 text-sm shrink-0"
                  style={{
                    background: 'linear-gradient(135deg, #00ff8830, #00ccff20)',
                    border: '1px solid rgba(0,255,136,0.25)',
                    color: '#00ff88',
                  }}
                >
                  {(member?.entity_name || user.email || 'U')[0].toUpperCase()}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="font-display font-700 text-sm truncate" style={{ color: '#e8e8f0' }}>
                    {member?.entity_name || 'Member'}
                  </p>
                  <p className="font-mono text-xs truncate mt-0.5" style={{ color: '#55556a' }}>
                    {user.email}
                  </p>
                  {member?.status && (
                    <div className="flex items-center gap-1 mt-1.5">
                      <div className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: statusColor, boxShadow: `0 0 4px ${statusColor}` }} />
                      <span className="font-mono text-xs uppercase tracking-wider"
                        style={{ color: statusColor }}>
                        {member.status}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-2 px-2 py-1 rounded-md" style={{ background: 'rgba(0,0,0,0.3)' }}>
                <p className="font-mono text-xs" style={{ color: '#33334a' }}>
                  ID: <span style={{ color: '#44445a' }}>
                    {user.id?.slice(0, 8)}...{user.id?.slice(-4)}
                  </span>
                </p>
              </div>
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200"
              style={{ border: '1px solid rgba(244,63,94,0.15)', background: 'rgba(244,63,94,0.04)' }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(244,63,94,0.1)'
                e.currentTarget.style.borderColor = 'rgba(244,63,94,0.3)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(244,63,94,0.04)'
                e.currentTarget.style.borderColor = 'rgba(244,63,94,0.15)'
              }}
            >
              <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: 'rgba(244,63,94,0.1)', color: '#f43f5e' }}>
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M17 16l4-4m0 0l-4-4m4 4H7" />
                  <path d="M9 20H5a2 2 0 01-2-2V6a2 2 0 012-2h4" />
                </svg>
              </div>
              <span className="font-display font-600 text-sm" style={{ color: '#f43f5e' }}>Log Out</span>
            </button>
          </div>
        ) : (
          <NavLink
            to="/login"
            className="flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200"
            style={{
              background: 'linear-gradient(135deg, rgba(0,255,136,0.1), rgba(0,204,255,0.05))',
              border: '1px solid rgba(0,255,136,0.2)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'linear-gradient(135deg, rgba(0,255,136,0.18), rgba(0,204,255,0.08))'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'linear-gradient(135deg, rgba(0,255,136,0.1), rgba(0,204,255,0.05))'
            }}
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: 'rgba(0,255,136,0.15)', color: '#00ff88' }}>
              <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4" />
                <polyline points="10 17 15 12 10 7" />
                <line x1="15" y1="12" x2="3" y2="12" />
              </svg>
            </div>
            <div>
              <p className="font-display font-700 text-sm" style={{ color: '#00ff88' }}>Sign In</p>
              <p className="font-mono text-xs" style={{ color: '#336655' }}>Access dashboard</p>
            </div>
            <svg className="ml-auto" width="14" height="14" fill="none" stroke="#00ff8866" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </NavLink>
        )}
      </div>
    </aside>
  )
}