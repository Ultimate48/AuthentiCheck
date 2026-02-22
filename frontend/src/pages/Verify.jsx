import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { verifyBatch } from '../lib/api'
import QRScanner from '../components/QRScanner'

// ── Animated scan line for the hero input ──
function ScanPulse() {
  return (
    <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
      <div className="absolute left-0 right-0 h-px opacity-60"
        style={{
          background: 'linear-gradient(90deg, transparent, #00ff88, transparent)',
          animation: 'scanY 2.5s ease-in-out infinite',
        }} />
    </div>
  )
}

// ── Single chain node card ──
function ChainNode({ node, depth = 0, index = 0 }) {
  const [expanded, setExpanded] = useState(depth === 0)
  const hasParents = node.raw_materials?.length > 0
  const valid = node.signature_valid

  const depthColors = ['#00ff88', '#00ccff', '#a855f7', '#f59e0b', '#f43f5e']
  const color = depthColors[depth % depthColors.length]

  return (
    <div className="relative" style={{ marginLeft: depth > 0 ? '24px' : '0' }}>
      {/* Connector line from parent */}
      {depth > 0 && (
        <>
          <div className="absolute -left-6 top-0 bottom-0 w-px"
            style={{ background: `linear-gradient(180deg, ${color}40, transparent)` }} />
          <div className="absolute -left-6 top-6 w-6 h-px"
            style={{ background: `${color}40` }} />
        </>
      )}

      {/* Node card */}
      <div
        className="relative rounded-2xl overflow-hidden mb-3 transition-all duration-300"
        style={{
          background: 'linear-gradient(145deg, rgba(4,14,8,0.95), rgba(2,10,5,0.98))',
          border: `1px solid ${valid ? color + '25' : 'rgba(239,68,68,0.25)'}`,
          boxShadow: valid
            ? `0 0 20px ${color}0a, inset 0 1px 0 ${color}10`
            : '0 0 20px rgba(239,68,68,0.05)',
          animationDelay: `${index * 80}ms`,
        }}
      >
        {/* Top color bar */}
        <div className="h-0.5 w-full"
          style={{ background: valid ? `linear-gradient(90deg, transparent, ${color}, transparent)` : 'linear-gradient(90deg, transparent, #ef4444, transparent)' }} />

        {/* Depth label */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          {valid ? (
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full"
              style={{ background: `${color}15`, border: `1px solid ${color}30` }}>
              <svg width="9" height="9" fill={color} viewBox="0 0 24 24">
                <path d="M20 6L9 17l-5-5" stroke={color} strokeWidth="3" fill="none" strokeLinecap="round" />
              </svg>
              <span className="font-mono text-xs" style={{ color }}>Verified</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full"
              style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}>
              <span className="font-mono text-xs text-red-400">✗ Invalid</span>
            </div>
          )}
        </div>

        <div className="p-4 pt-3">
          {/* Header row */}
          <div className="flex items-start gap-3 mb-3">
            {/* Icon */}
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
              style={{ background: `${color}12`, border: `1px solid ${color}20` }}>
              <svg width="18" height="18" fill="none" stroke={color} strokeWidth="1.6" viewBox="0 0 24 24">
                <rect x="2" y="7" width="20" height="14" rx="2" />
                <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
                <line x1="12" y1="12" x2="12" y2="16" />
                <line x1="10" y1="14" x2="14" y2="14" />
              </svg>
            </div>

            <div className="min-w-0 flex-1">
              <p className="font-display font-700 text-base leading-tight" style={{ color: '#e8f5ee' }}>
                {node.data?.product_name || 'Unknown Product'}
              </p>
              <div className="flex items-center gap-1.5 mt-1">
                <div className="w-1 h-1 rounded-full" style={{ background: color }} />
                <p className="font-mono text-xs" style={{ color: `${color}99` }}>
                  {node.producer}
                </p>
              </div>
            </div>
          </div>

          {/* Data grid */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="rounded-lg px-3 py-2" style={{ background: 'rgba(0,255,136,0.03)', border: '1px solid rgba(0,255,136,0.07)' }}>
              <p className="font-mono text-xs uppercase tracking-wider mb-0.5" style={{ color: '#1a4a30' }}>Quantity</p>
              <p className="font-body text-sm" style={{ color: '#8abf9a' }}>{node.data?.quantity || '—'}</p>
            </div>
            <div className="rounded-lg px-3 py-2" style={{ background: 'rgba(0,255,136,0.03)', border: '1px solid rgba(0,255,136,0.07)' }}>
              <p className="font-mono text-xs uppercase tracking-wider mb-0.5" style={{ color: '#1a4a30' }}>Date</p>
              <p className="font-body text-sm" style={{ color: '#8abf9a' }}>{node.data?.date || '—'}</p>
            </div>
            {node.shipped_to && (
              <div className="col-span-2 rounded-lg px-3 py-2" style={{ background: 'rgba(0,255,136,0.03)', border: '1px solid rgba(0,255,136,0.07)' }}>
                <p className="font-mono text-xs uppercase tracking-wider mb-0.5" style={{ color: '#1a4a30' }}>Shipped To</p>
                <p className="font-body text-sm" style={{ color: '#8abf9a' }}>{node.shipped_to}</p>
              </div>
            )}
            <div className="col-span-2 rounded-lg px-3 py-2" style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.04)' }}>
              <p className="font-mono text-xs uppercase tracking-wider mb-0.5" style={{ color: '#1a3a28' }}>Batch ID</p>
              <p className="font-mono text-xs break-all" style={{ color: '#2a5a40' }}>{node.id}</p>
            </div>
          </div>

          {/* Expand button */}
          {hasParents && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-2 transition-all duration-200 group"
              style={{ color: expanded ? color : '#1a4a30' }}
              onMouseEnter={e => e.currentTarget.style.color = color}
              onMouseLeave={e => e.currentTarget.style.color = expanded ? color : '#1a4a30'}
            >
              <div className="w-4 h-4 rounded flex items-center justify-center transition-all duration-200"
                style={{ background: expanded ? `${color}20` : 'rgba(255,255,255,0.04)', border: `1px solid ${expanded ? color + '40' : 'rgba(255,255,255,0.08)'}` }}>
                <svg width="8" height="8" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"
                  style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </div>
              <span className="font-mono text-xs uppercase tracking-wider">
                {expanded ? 'Hide' : 'Show'} {node.raw_materials.length} raw material{node.raw_materials.length > 1 ? 's' : ''}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Children */}
      {expanded && hasParents && (
        <div className="relative ml-3">
          {node.raw_materials.map((child, i) => (
            <ChainNode key={child.id} node={child} depth={depth + 1} index={i} />
          ))}
        </div>
      )}
    </div>
  )
}

// ── Count nodes in chain ──
function countNodes(node) {
  if (!node) return 0
  return 1 + (node.raw_materials || []).reduce((s, c) => s + countNodes(c), 0)
}

function checkAllValid(node) {
  if (!node.signature_valid) return false
  return (node.raw_materials || []).every(checkAllValid)
}

// ── Main page ──
export default function Verify() {
  const { batchId: paramBatchId } = useParams()
  const navigate = useNavigate()
  const [batchId, setBatchId] = useState(paramBatchId || '')
  const [showScanner, setShowScanner] = useState(false)
  const [chain, setChain] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [mounted, setMounted] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => {
    setTimeout(() => setMounted(true), 50)
    if (paramBatchId) handleVerify(paramBatchId)
  }, [paramBatchId])

  const handleVerify = async (id) => {
    const target = (id || batchId).trim()
    if (!target) return
    setLoading(true)
    setError('')
    setChain(null)
    try {
      const { data } = await verifyBatch(target)
      setChain(data.chain)
    } catch (e) {
      setError(e.response?.data?.error || 'Batch not found or could not be verified.')
    } finally {
      setLoading(false)
    }
  }

  const allValid = chain && checkAllValid(chain)
  const totalNodes = countNodes(chain)

  return (
    <div className="min-h-screen pb-20" style={{ background: '#05050a' }}>

      {/* Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full blur-[120px]"
          style={{ background: 'radial-gradient(circle, rgba(0,255,136,0.07) 0%, transparent 70%)' }} />
        <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] rounded-full blur-[100px]"
          style={{ background: 'radial-gradient(circle, rgba(0,204,255,0.05) 0%, transparent 70%)' }} />
        <div className="absolute inset-0"
          style={{
            backgroundImage: 'linear-gradient(rgba(0,255,136,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,136,0.02) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }} />
      </div>

      {/* ── HERO SECTION ── */}
      <div className="relative overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, rgba(0,255,136,0.04) 0%, transparent 100%)',
          borderBottom: '1px solid rgba(0,255,136,0.06)',
        }}>

        {/* Hero glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 blur-3xl pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, rgba(0,255,136,0.12) 0%, transparent 70%)' }} />

        <div className={`relative z-10 max-w-3xl mx-auto px-6 pt-14 pb-12 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>

          {/* Badge */}
          <div className="flex justify-center mb-5">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full"
              style={{ background: 'rgba(0,255,136,0.06)', border: '1px solid rgba(0,255,136,0.15)' }}>
              <div className="w-1.5 h-1.5 rounded-full bg-chain-accent animate-pulse" />
              <span className="font-mono text-xs uppercase tracking-[0.25em]" style={{ color: '#00cc6a' }}>
                Supply Chain Verifier
              </span>
            </div>
          </div>

          {/* Headline */}
          <h1 className="text-center font-display font-800 leading-none mb-3">
            <span className="block text-4xl sm:text-5xl" style={{ color: '#e8f5ee' }}>
              Trace the
            </span>
            <span className="block text-5xl sm:text-6xl mt-1"
              style={{
                background: 'linear-gradient(135deg, #00ff88 0%, #00ddaa 40%, #00ccff 100%)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                filter: 'drop-shadow(0 0 24px rgba(0,255,136,0.35))',
              }}>
              Full Journey
            </span>
          </h1>
          <p className="text-center font-body mb-8 text-sm sm:text-base" style={{ color: '#2a6a40' }}>
            Every signature. Every step. Cryptographically proven.
          </p>

          {/* Search input */}
          <div className="relative max-w-xl mx-auto">
            {/* Glow ring when active */}
            <div className="absolute -inset-px rounded-2xl pointer-events-none transition-opacity duration-300"
              style={{
                background: 'linear-gradient(135deg, rgba(0,255,136,0.3), rgba(0,204,255,0.2))',
                filter: 'blur(8px)',
                opacity: batchId ? 0.6 : 0.2,
              }} />

            <div className="relative rounded-2xl overflow-hidden"
              style={{
                background: 'rgba(4,14,8,0.95)',
                border: '1px solid rgba(0,255,136,0.2)',
                boxShadow: 'inset 0 1px 0 rgba(0,255,136,0.06)',
              }}>
              <ScanPulse />

              <div className="flex items-center gap-3 p-2 pl-5">
                {/* Search icon */}
                <svg width="16" height="16" fill="none" stroke="#00ff8866" strokeWidth="2" viewBox="0 0 24 24" className="shrink-0">
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>

                <input
                  ref={inputRef}
                  value={batchId}
                  onChange={e => setBatchId(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleVerify()}
                  placeholder="Enter or paste Batch ID..."
                  className="flex-1 bg-transparent outline-none font-mono text-sm py-3"
                  style={{ color: '#c8eed8', caretColor: '#00ff88' }}
                />

                {/* Scan button */}
                <button
                  onClick={() => setShowScanner(true)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-200 shrink-0"
                  style={{ background: 'rgba(0,255,136,0.08)', border: '1px solid rgba(0,255,136,0.15)', color: '#00cc6a' }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'rgba(0,255,136,0.15)'
                    e.currentTarget.style.borderColor = 'rgba(0,255,136,0.3)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'rgba(0,255,136,0.08)'
                    e.currentTarget.style.borderColor = 'rgba(0,255,136,0.15)'
                  }}
                >
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M3 7V5a2 2 0 012-2h2M17 3h2a2 2 0 012 2v2M21 17v2a2 2 0 01-2 2h-2M7 21H5a2 2 0 01-2-2v-2" />
                    <rect x="9" y="9" width="6" height="6" rx="1" />
                  </svg>
                  <span className="font-mono text-xs uppercase tracking-wider hidden sm:block">Scan</span>
                </button>

                {/* Verify button */}
                <button
                  onClick={() => handleVerify()}
                  disabled={loading || !batchId}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-display font-700 text-sm transition-all duration-200 shrink-0 disabled:opacity-40"
                  style={{
                    background: 'linear-gradient(135deg, #00ff88, #00cc6a)',
                    color: '#021a0e',
                    boxShadow: '0 0 20px rgba(0,255,136,0.3)',
                  }}
                  onMouseEnter={e => { if (!loading) e.currentTarget.style.boxShadow = '0 0 32px rgba(0,255,136,0.5)' }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 0 20px rgba(0,255,136,0.3)' }}
                >
                  {loading ? (
                    <svg className="animate-spin" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4" />
                    </svg>
                  ) : (
                    <>
                      Verify
                      <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── CONTENT AREA ── */}
      <div className="relative z-10 max-w-3xl mx-auto px-6 mt-10">

        {/* Loading state */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 gap-5">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 rounded-full border-2 border-chain-accent/20" />
              <div className="absolute inset-0 rounded-full border-t-2 border-chain-accent animate-spin" />
              <div className="absolute inset-2 rounded-full border-t-2 border-chain-accent/50 animate-spin"
                style={{ animationDirection: 'reverse', animationDuration: '0.7s' }} />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-chain-accent animate-pulse" />
              </div>
            </div>
            <div className="text-center">
              <p className="font-display font-700 text-chain-accent text-sm uppercase tracking-widest">
                Tracing Supply Chain
              </p>
              <p className="font-mono text-xs mt-1" style={{ color: '#1a4a30' }}>
                Verifying cryptographic signatures...
              </p>
            </div>
          </div>
        )}

        {/* Error state */}
        {error && !loading && (
          <div className="flex items-start gap-4 p-5 rounded-2xl mb-6"
            style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)' }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: 'rgba(239,68,68,0.1)' }}>
              <svg width="18" height="18" fill="none" stroke="#ef4444" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <div>
              <p className="font-display font-700 text-red-400 text-sm">Verification Failed</p>
              <p className="font-body text-sm mt-1 text-red-500/70">{error}</p>
            </div>
          </div>
        )}

        {/* Result */}
        {chain && !loading && (
          <div style={{ animation: 'fadeUp 0.5s ease forwards' }}>

            {/* Summary banner */}
            <div className="relative rounded-2xl p-5 mb-8 overflow-hidden"
              style={{
                background: allValid
                  ? 'linear-gradient(135deg, rgba(0,255,136,0.08), rgba(0,204,255,0.04))'
                  : 'linear-gradient(135deg, rgba(239,68,68,0.08), rgba(220,38,38,0.04))',
                border: allValid ? '1px solid rgba(0,255,136,0.2)' : '1px solid rgba(239,68,68,0.2)',
              }}>

              {/* Background shimmer */}
              <div className="absolute inset-0 pointer-events-none"
                style={{
                  background: allValid
                    ? 'radial-gradient(circle at 0% 50%, rgba(0,255,136,0.06) 0%, transparent 60%)'
                    : 'radial-gradient(circle at 0% 50%, rgba(239,68,68,0.06) 0%, transparent 60%)',
                }} />

              <div className="relative z-10 flex items-center gap-4">
                {/* Big status icon */}
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
                  style={{
                    background: allValid ? 'rgba(0,255,136,0.12)' : 'rgba(239,68,68,0.12)',
                    border: allValid ? '1px solid rgba(0,255,136,0.25)' : '1px solid rgba(239,68,68,0.25)',
                    boxShadow: allValid ? '0 0 20px rgba(0,255,136,0.15)' : '0 0 20px rgba(239,68,68,0.15)',
                  }}>
                  {allValid ? (
                    <svg width="24" height="24" fill="none" stroke="#00ff88" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    <svg width="24" height="24" fill="none" stroke="#ef4444" strokeWidth="2.5" viewBox="0 0 24 24">
                      <line x1="18" y1="6" x2="6" y2="18" strokeLinecap="round" />
                      <line x1="6" y1="6" x2="18" y2="18" strokeLinecap="round" />
                    </svg>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-display font-800 text-xl"
                    style={{ color: allValid ? '#00ff88' : '#ef4444' }}>
                    {allValid ? 'Fully Authenticated' : 'Tamper Detected'}
                  </p>
                  <p className="font-body text-sm mt-0.5"
                    style={{ color: allValid ? '#1a6640' : '#7a2020' }}>
                    {allValid
                      ? 'Every step in this supply chain has been cryptographically verified and is authentic.'
                      : 'One or more signatures are invalid. This product may have been tampered with.'}
                  </p>
                </div>

                {/* Stats */}
                <div className="hidden sm:flex flex-col items-center gap-0.5 shrink-0 px-4 py-2 rounded-xl"
                  style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.04)' }}>
                  <p className="font-display font-800 text-2xl" style={{ color: allValid ? '#00ff88' : '#ef4444' }}>
                    {totalNodes}
                  </p>
                  <p className="font-mono text-xs uppercase tracking-wider" style={{ color: '#1a4a30' }}>
                    {totalNodes === 1 ? 'Step' : 'Steps'}
                  </p>
                </div>
              </div>
            </div>

            {/* Chain header */}
            <div className="flex items-center gap-3 mb-5">
              <div className="flex items-center gap-2">
                <div className="w-1 h-5 rounded-full" style={{ background: 'linear-gradient(180deg, #00ff88, #00ccff)' }} />
                <h2 className="font-display font-700 text-lg" style={{ color: '#e8f5ee' }}>
                  Supply Chain Journey
                </h2>
              </div>
              <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, rgba(0,255,136,0.15), transparent)' }} />
              <span className="font-mono text-xs" style={{ color: '#1a4a30' }}>
                {totalNodes} node{totalNodes !== 1 ? 's' : ''}
              </span>
            </div>

            {/* Chain tree */}
            <ChainNode node={chain} depth={0} index={0} />

            {/* Legend */}
            <div className="mt-6 flex flex-wrap gap-4 px-4 py-3 rounded-xl"
              style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.04)' }}>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-chain-accent" />
                <span className="font-mono text-xs" style={{ color: '#1a4a30' }}>Origin batch</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#00ccff' }} />
                <span className="font-mono text-xs" style={{ color: '#1a4a30' }}>Intermediate step</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#a855f7' }} />
                <span className="font-mono text-xs" style={{ color: '#1a4a30' }}>Processed batch</span>
              </div>
              <div className="ml-auto flex items-center gap-2">
                <svg width="10" height="10" fill="none" stroke="#00ff88" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M20 6L9 17l-5-5" strokeLinecap="round" />
                </svg>
                <span className="font-mono text-xs" style={{ color: '#1a4a30' }}>RSA signature verified</span>
              </div>
            </div>
          </div>
        )}

        {/* Empty state */}
        {!chain && !loading && !error && (
          <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
            <div className="relative w-20 h-20 mb-2">
              {/* Animated rings */}
              <div className="absolute inset-0 rounded-full border border-chain-accent/10 animate-ping" style={{ animationDuration: '3s' }} />
              <div className="absolute inset-2 rounded-full border border-chain-accent/15 animate-ping" style={{ animationDuration: '2.5s', animationDelay: '0.5s' }} />
              <div className="absolute inset-4 rounded-full border border-chain-accent/20" />
              <div className="absolute inset-0 flex items-center justify-center">
                <svg width="28" height="28" fill="none" stroke="#00ff8840" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path d="M3 7V5a2 2 0 012-2h2M17 3h2a2 2 0 012 2v2M21 17v2a2 2 0 01-2 2h-2M7 21H5a2 2 0 01-2-2v-2" />
                  <rect x="9" y="9" width="6" height="6" rx="1" />
                </svg>
              </div>
            </div>
            <div>
              <p className="font-display font-700 text-lg" style={{ color: '#1a4a30' }}>
                Scan or Enter a Batch ID
              </p>
              <p className="font-mono text-xs mt-1" style={{ color: '#0a2a18' }}>
                to trace its complete supply chain
              </p>
            </div>
          </div>
        )}
      </div>

      {/* QR Scanner modal */}
      {showScanner && (
        <QRScanner
          onScan={(data) => {
            const id = typeof data === 'object' ? (data.id || data.batchId || JSON.stringify(data)) : data
            setBatchId(id)
            setShowScanner(false)
            handleVerify(id)
          }}
          onClose={() => setShowScanner(false)}
        />
      )}

      <style>{`
        @keyframes scanY {
          0%   { top: 0%;   opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}