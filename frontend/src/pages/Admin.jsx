import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { createSupplyMember, getSupplyMembers, updateSupplyMemberStatus } from '../lib/api'

const STATUS_CONFIG = {
  active:    { color: '#00ff88', bg: 'rgba(0,255,136,0.08)',    border: 'rgba(0,255,136,0.2)',   label: 'Active'    },
  suspended: { color: '#f59e0b', bg: 'rgba(245,158,11,0.08)',  border: 'rgba(245,158,11,0.2)',  label: 'Suspended' },
  revoked:   { color: '#f43f5e', bg: 'rgba(244,63,94,0.08)',   border: 'rgba(244,63,94,0.2)',   label: 'Revoked'   },
}

function StatCard({ label, value, color, icon }) {
  return (
    <div className="relative rounded-2xl p-5 overflow-hidden group transition-all duration-300 hover:scale-[1.02]"
      style={{ background: 'rgba(4,14,8,0.8)', border: `1px solid ${color}18`, boxShadow: `0 0 20px ${color}05` }}>
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
        style={{ background: `radial-gradient(circle at 50% 0%, ${color}08 0%, transparent 60%)` }} />
      <div className="absolute -top-px left-1/3 right-1/3 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${color}50, transparent)` }} />
      <div className="relative z-10 flex items-start justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest mb-2" style={{ color: `${color}66` }}>{label}</p>
          <p className="font-display font-800 text-3xl" style={{ color }}>{value}</p>
        </div>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: `${color}12`, border: `1px solid ${color}20` }}>
          {icon}
        </div>
      </div>
    </div>
  )
}

function MemberCard({ member, onStatusChange, index }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [changing, setChanging] = useState(false)
  const cfg = STATUS_CONFIG[member.status] || STATUS_CONFIG.active

  const handleChange = async (status) => {
    setChanging(true)
    setMenuOpen(false)
    await onStatusChange(member.id, status)
    setChanging(false)
  }

  return (
    <div
      className="relative rounded-2xl overflow-hidden transition-all duration-300 hover:translate-y-[-2px]"
      style={{
        background: 'linear-gradient(145deg, rgba(4,14,8,0.95), rgba(2,10,5,0.98))',
        border: `1px solid ${cfg.color}15`,
        boxShadow: `0 4px 24px rgba(0,0,0,0.3), 0 0 0 1px ${cfg.color}08`,
        animationDelay: `${index * 60}ms`,
        animation: 'fadeUp 0.4s ease forwards',
        opacity: 0,
      }}
    >
      {/* Top color accent */}
      <div className="h-0.5"
        style={{ background: `linear-gradient(90deg, transparent, ${cfg.color}60, transparent)` }} />

      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-4">
          {/* Avatar + info */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center font-display font-800 text-lg shrink-0"
              style={{
                background: `linear-gradient(135deg, ${cfg.color}20, ${cfg.color}08)`,
                border: `1px solid ${cfg.color}25`,
                color: cfg.color,
              }}>
              {member.entity_name?.[0]?.toUpperCase() || '?'}
            </div>
            <div className="min-w-0">
              <p className="font-display font-700 text-base truncate" style={{ color: '#e8f5ee' }}>
                {member.entity_name}
              </p>
              <p className="font-mono text-xs truncate mt-0.5" style={{ color: '#1a4a30' }}>
                {member.id?.slice(0, 12)}...{member.id?.slice(-6)}
              </p>
            </div>
          </div>

          {/* Status badge + menu */}
          <div className="relative shrink-0">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              disabled={changing}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all duration-200"
              style={{ background: cfg.bg, border: `1px solid ${cfg.border}`, color: cfg.color }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >
              {changing ? (
                <svg className="animate-spin" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4" />
                </svg>
              ) : (
                <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: cfg.color }} />
              )}
              <span className="font-mono text-xs uppercase tracking-wider">{cfg.label}</span>
              <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"
                style={{ transform: menuOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }}>
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>

            {/* Dropdown */}
            {menuOpen && (
              <div className="absolute right-0 top-full mt-2 w-36 rounded-xl overflow-hidden z-20"
                style={{ background: 'rgba(4,14,8,0.98)', border: '1px solid rgba(0,255,136,0.12)', boxShadow: '0 16px 40px rgba(0,0,0,0.5)' }}>
                {Object.entries(STATUS_CONFIG).filter(([s]) => s !== member.status).map(([s, c]) => (
                  <button key={s} onClick={() => handleChange(s)}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-left transition-colors duration-150"
                    style={{ color: c.color }}
                    onMouseEnter={e => e.currentTarget.style.background = `${c.color}10`}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: c.color }} />
                    <span className="font-mono text-xs uppercase tracking-wider">{c.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Public key preview */}
        <div className="rounded-lg px-3 py-2"
          style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(0,255,136,0.06)' }}>
          <p className="font-mono text-xs mb-0.5" style={{ color: '#0a3020' }}>PUBLIC KEY</p>
          <p className="font-mono text-xs truncate" style={{ color: '#1a4a30' }}>
            {member.public_key?.slice(0, 40)}...
          </p>
        </div>
      </div>
    </div>
  )
}

export default function Admin() {
  const navigate = useNavigate()
  const [members, setMembers] = useState([])
  const [loadingMembers, setLoadingMembers] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [entityName, setEntityName] = useState('')
  const [creating, setCreating] = useState(false)
  const [createResult, setCreateResult] = useState(null)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [copied, setCopied] = useState(false)
  const [focused, setFocused] = useState(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) navigate('/login')
    })
    fetchMembers()
    setTimeout(() => setMounted(true), 50)
  }, [])

  const fetchMembers = async () => {
    setLoadingMembers(true)
    try {
      const { data } = await getSupplyMembers()
      setMembers(Array.isArray(data) ? data : data.members || data.data || [])
    } catch (e) {
      console.error(e)
      setMembers([])
    } finally {
      setLoadingMembers(false)
    }
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    setCreating(true)
    setError('')
    setCreateResult(null)
    try {
      const { data } = await createSupplyMember({ email, password, entity_name: entityName })
      setCreateResult(data)
      setEmail(''); setPassword(''); setEntityName('')
      fetchMembers()
    } catch (e) {
      setError(e.response?.data?.error || e.message)
    } finally {
      setCreating(false)
    }
  }

  const handleStatusChange = async (id, status) => {
    try {
      await updateSupplyMemberStatus(id, status)
      setMembers(prev => prev.map(m => m.id === id ? { ...m, status } : m))
    } catch (e) {
      alert('Failed: ' + e.message)
    }
  }

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const filtered = members.filter(m => {
    const matchSearch = !search || m.entity_name?.toLowerCase().includes(search.toLowerCase()) || m.id?.includes(search)
    const matchStatus = filterStatus === 'all' || m.status === filterStatus
    return matchSearch && matchStatus
  })

  const counts = {
    total: members.length,
    active: members.filter(m => m.status === 'active').length,
    suspended: members.filter(m => m.status === 'suspended').length,
    revoked: members.filter(m => m.status === 'revoked').length,
  }

  const inputStyle = (name) => ({
    background: focused === name ? 'rgba(0,255,136,0.05)' : 'rgba(0,255,136,0.02)',
    border: focused === name ? '1px solid rgba(0,255,136,0.35)' : '1px solid rgba(0,255,136,0.08)',
    color: '#c8eed8',
    boxShadow: focused === name ? '0 0 16px rgba(0,255,136,0.08)' : 'none',
  })

  return (
    <div className="min-h-screen pb-20" style={{ background: '#05050a' }}>

      {/* Fixed background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 right-0 w-[500px] h-[500px] rounded-full blur-[120px]"
          style={{ background: 'radial-gradient(circle, rgba(0,255,136,0.06) 0%, transparent 70%)' }} />
        <div className="absolute bottom-0 -left-20 w-[400px] h-[400px] rounded-full blur-[100px]"
          style={{ background: 'radial-gradient(circle, rgba(0,204,255,0.04) 0%, transparent 70%)' }} />
        <div className="absolute inset-0"
          style={{
            backgroundImage: 'linear-gradient(rgba(0,255,136,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,136,0.02) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }} />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6">

        {/* ── HEADER ── */}
        <div className={`pt-10 pb-8 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-1.5 h-1.5 rounded-full bg-chain-accent animate-pulse" />
                <span className="font-mono text-xs uppercase tracking-[0.25em]" style={{ color: '#1a6640' }}>
                  Control Center
                </span>
              </div>
              <h1 className="font-display font-800 leading-none">
                <span className="block text-4xl sm:text-5xl" style={{ color: '#e8f5ee' }}>Supply Chain</span>
                <span className="block text-4xl sm:text-5xl mt-1"
                  style={{
                    background: 'linear-gradient(135deg, #00ff88, #00ddaa, #00ccff)',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                    filter: 'drop-shadow(0 0 20px rgba(0,255,136,0.3))',
                  }}>
                  Admin Panel
                </span>
              </h1>
            </div>

            <button
              onClick={() => { setShowForm(!showForm); setCreateResult(null); setError('') }}
              className="flex items-center gap-2 px-5 py-3 rounded-xl font-display font-700 text-sm uppercase tracking-wider transition-all duration-200 shrink-0 mt-2"
              style={{
                background: showForm ? 'rgba(244,63,94,0.1)' : 'linear-gradient(135deg, #00ff88, #00cc6a)',
                border: showForm ? '1px solid rgba(244,63,94,0.3)' : 'none',
                color: showForm ? '#f43f5e' : '#021a0e',
                boxShadow: showForm ? 'none' : '0 0 24px rgba(0,255,136,0.3)',
              }}
            >
              {showForm ? (
                <>
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                  Cancel
                </>
              ) : (
                <>
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  Add Member
                </>
              )}
            </button>
          </div>
        </div>

        {/* ── STATS ── */}
        <div className={`grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 transition-all duration-700 delay-100 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <StatCard label="Total Members" value={counts.total} color="#00ff88"
            icon={<svg width="18" height="18" fill="none" stroke="#00ff88" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>}
          />
          <StatCard label="Active" value={counts.active} color="#00ff88"
            icon={<svg width="18" height="18" fill="none" stroke="#00ff88" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>}
          />
          <StatCard label="Suspended" value={counts.suspended} color="#f59e0b"
            icon={<svg width="18" height="18" fill="none" stroke="#f59e0b" strokeWidth="1.8" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="10" y1="15" x2="10" y2="9"/><line x1="14" y1="15" x2="14" y2="9"/></svg>}
          />
          <StatCard label="Revoked" value={counts.revoked} color="#f43f5e"
            icon={<svg width="18" height="18" fill="none" stroke="#f43f5e" strokeWidth="1.8" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>}
          />
        </div>

        {/* ── ADD MEMBER FORM ── */}
        {showForm && (
          <div className="relative rounded-2xl overflow-hidden mb-8"
            style={{
              background: 'linear-gradient(145deg, rgba(4,14,8,0.97), rgba(2,10,5,0.99))',
              border: '1px solid rgba(0,255,136,0.14)',
              boxShadow: '0 0 40px rgba(0,255,136,0.05)',
              animation: 'fadeUp 0.3s ease forwards',
            }}>
            <div className="h-0.5"
              style={{ background: 'linear-gradient(90deg, transparent, #00ff88, #00ccff, transparent)' }} />
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: 'rgba(0,255,136,0.1)', border: '1px solid rgba(0,255,136,0.2)' }}>
                  <svg width="14" height="14" fill="none" stroke="#00ff88" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
                    <line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/>
                  </svg>
                </div>
                <div>
                  <h2 className="font-display font-700 text-base" style={{ color: '#e8f5ee' }}>New Supply Chain Member</h2>
                  <p className="font-mono text-xs" style={{ color: '#1a4a30' }}>A key pair will be auto-generated</p>
                </div>
              </div>

              <form onSubmit={handleCreate}>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                  {[
                    { name: 'entity', label: 'Entity Name', value: entityName, set: setEntityName, placeholder: 'e.g. Sunrise Farm', type: 'text' },
                    { name: 'email', label: 'Email Address', value: email, set: setEmail, placeholder: 'member@company.com', type: 'email' },
                    { name: 'pass', label: 'Initial Password', value: password, set: setPassword, placeholder: '••••••••', type: 'password' },
                  ].map(f => (
                    <div key={f.name}>
                      <label className="block font-mono text-xs uppercase tracking-widest mb-2"
                        style={{ color: focused === f.name ? '#00ff88' : '#1a4a30' }}>
                        {f.label}
                      </label>
                      <input
                        type={f.type}
                        value={f.value}
                        onChange={e => f.set(e.target.value)}
                        onFocus={() => setFocused(f.name)}
                        onBlur={() => setFocused(null)}
                        required
                        placeholder={f.placeholder}
                        className="w-full px-4 py-3 rounded-xl font-body text-sm outline-none transition-all duration-200"
                        style={inputStyle(f.name)}
                      />
                    </div>
                  ))}
                </div>

                {error && (
                  <div className="flex items-center gap-2 px-4 py-3 rounded-xl mb-4"
                    style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
                    <svg width="14" height="14" fill="none" stroke="#ef4444" strokeWidth="2" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    <p className="font-body text-sm text-red-400">{error}</p>
                  </div>
                )}

                <button type="submit" disabled={creating}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl font-display font-700 text-sm uppercase tracking-wider transition-all duration-200 disabled:opacity-50"
                  style={{
                    background: 'linear-gradient(135deg, #00ff88, #00cc6a)',
                    color: '#021a0e',
                    boxShadow: '0 0 20px rgba(0,255,136,0.25)',
                  }}>
                  {creating ? (
                    <svg className="animate-spin" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4" />
                    </svg>
                  ) : (
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                    </svg>
                  )}
                  {creating ? 'Creating...' : 'Create Member'}
                </button>
              </form>

              {/* Private key reveal */}
              {createResult && (
                <div className="mt-6 relative rounded-2xl overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, rgba(0,255,136,0.06), rgba(0,204,255,0.03))',
                    border: '1px solid rgba(0,255,136,0.2)',
                    animation: 'fadeUp 0.4s ease forwards',
                  }}>
                  <div className="h-0.5"
                    style={{ background: 'linear-gradient(90deg, transparent, #00ff88, transparent)' }} />
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-chain-accent animate-pulse" />
                        <p className="font-display font-700 text-sm" style={{ color: '#00ff88' }}>
                          Member Created — Save Private Key
                        </p>
                      </div>
                      <div className="px-2 py-0.5 rounded-full font-mono text-xs"
                        style={{ background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.3)', color: '#f43f5e' }}>
                        Shown once only
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                      <div className="rounded-xl px-4 py-3"
                        style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(0,255,136,0.08)' }}>
                        <p className="font-mono text-xs mb-1" style={{ color: '#0a3020' }}>ENTITY</p>
                        <p className="font-display font-700 text-sm" style={{ color: '#e8f5ee' }}>
                          {createResult.supplyMember?.entity_name}
                        </p>
                      </div>
                      <div className="rounded-xl px-4 py-3"
                        style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(0,255,136,0.08)' }}>
                        <p className="font-mono text-xs mb-1" style={{ color: '#0a3020' }}>MEMBER ID</p>
                        <p className="font-mono text-xs break-all" style={{ color: '#1a4a30' }}>
                          {createResult.supplyMember?.id}
                        </p>
                      </div>
                    </div>

                    <div className="rounded-xl p-4 mb-3"
                      style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(0,255,136,0.1)' }}>
                      <p className="font-mono text-xs mb-2" style={{ color: '#0a3020' }}>PRIVATE KEY — COPY THIS NOW</p>
                      <p className="font-mono text-xs break-all leading-relaxed" style={{ color: '#2a6040' }}>
                        {createResult.privateKey}
                      </p>
                    </div>

                    <button onClick={() => handleCopy(createResult.privateKey)}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider transition-all duration-200"
                      style={{
                        background: copied ? 'rgba(0,255,136,0.15)' : 'rgba(0,255,136,0.08)',
                        border: `1px solid rgba(0,255,136,${copied ? '0.4' : '0.2'})`,
                        color: '#00ff88',
                      }}>
                      {copied ? (
                        <>
                          <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <polyline points="20 6 9 17 4 12"/>
                          </svg>
                          Copied!
                        </>
                      ) : (
                        <>
                          <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
                          </svg>
                          Copy Private Key
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── MEMBERS LIST ── */}
        <div className={`transition-all duration-700 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>

          {/* List header with search + filter */}
          <div className="flex flex-col sm:flex-row gap-3 mb-5">
            {/* Search */}
            <div className="relative flex-1">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: '#1a4a30' }}>
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
                </svg>
              </div>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by name or ID..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl font-body text-sm outline-none transition-all duration-200"
                style={{
                  background: 'rgba(0,255,136,0.02)',
                  border: '1px solid rgba(0,255,136,0.08)',
                  color: '#c8eed8',
                }}
                onFocus={e => {
                  e.target.style.border = '1px solid rgba(0,255,136,0.25)'
                  e.target.style.background = 'rgba(0,255,136,0.04)'
                }}
                onBlur={e => {
                  e.target.style.border = '1px solid rgba(0,255,136,0.08)'
                  e.target.style.background = 'rgba(0,255,136,0.02)'
                }}
              />
            </div>

            {/* Status filter */}
            <div className="flex gap-2">
              {['all', 'active', 'suspended', 'revoked'].map(s => {
                const c = s === 'all' ? '#00ff88' : STATUS_CONFIG[s]?.color
                const active = filterStatus === s
                return (
                  <button key={s} onClick={() => setFilterStatus(s)}
                    className="px-3 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider transition-all duration-200"
                    style={{
                      background: active ? `${c}15` : 'rgba(0,255,136,0.02)',
                      border: active ? `1px solid ${c}35` : '1px solid rgba(0,255,136,0.08)',
                      color: active ? c : '#1a4a30',
                    }}>
                    {s}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Section label */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-5 rounded-full"
              style={{ background: 'linear-gradient(180deg, #00ff88, #00ccff)' }} />
            <h2 className="font-display font-700 text-lg" style={{ color: '#e8f5ee' }}>
              Members
            </h2>
            <div className="flex-1 h-px"
              style={{ background: 'linear-gradient(90deg, rgba(0,255,136,0.15), transparent)' }} />
            <span className="font-mono text-xs" style={{ color: '#1a4a30' }}>
              {filtered.length} of {members.length}
            </span>
          </div>

          {/* Grid of member cards */}
          {loadingMembers ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="relative w-12 h-12">
                <div className="absolute inset-0 rounded-full border-2 border-chain-accent/10" />
                <div className="absolute inset-0 rounded-full border-t-2 border-chain-accent animate-spin" />
              </div>
              <p className="font-mono text-xs uppercase tracking-widest animate-pulse" style={{ color: '#1a4a30' }}>
                Loading members...
              </p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3"
              style={{ border: '1px dashed rgba(0,255,136,0.08)', borderRadius: '16px' }}>
              <svg width="32" height="32" fill="none" stroke="#1a4a30" strokeWidth="1.5" viewBox="0 0 24 24">
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
                <line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/>
              </svg>
              <p className="font-mono text-xs uppercase tracking-widest" style={{ color: '#1a4a30' }}>
                {search || filterStatus !== 'all' ? 'No matching members' : 'No members yet'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map((member, i) => (
                <MemberCard key={member.id} member={member} onStatusChange={handleStatusChange} index={i} />
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}