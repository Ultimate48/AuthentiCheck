import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { verifyBatch } from '../lib/api'
import QRScanner from '../components/QRScanner'

function ChainNode({ node, depth = 0 }) {
  const [expanded, setExpanded] = useState(depth === 0)
  const hasParents = node.raw_materials && node.raw_materials.length > 0

  return (
    <div className={`relative ${depth > 0 ? 'ml-6 mt-3' : ''}`}>
      {depth > 0 && (
        <div className="absolute -left-3 top-5 w-3 h-px bg-chain-border" />
      )}
      {depth > 0 && (
        <div className="absolute -left-3 top-0 bottom-0 w-px bg-chain-border" />
      )}

      <div
        className={`bg-chain-surface border rounded-xl p-4 transition-all ${
          node.signature_valid
            ? 'border-chain-accent/30'
            : 'border-red-700/50'
        }`}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <div
              className={`w-2 h-2 rounded-full shrink-0 ${
                node.signature_valid ? 'bg-chain-accent' : 'bg-red-500'
              }`}
            />
            <div className="min-w-0">
              <p className="font-display font-700 text-chain-text text-sm truncate">
                {node.data?.product_name || 'Unnamed Product'}
              </p>
              <p className="text-chain-subtext font-mono text-xs">
                {node.producer}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span
              className={`text-xs font-mono px-2 py-0.5 rounded uppercase tracking-wider ${
                node.signature_valid
                  ? 'bg-chain-accent/10 text-chain-accent'
                  : 'bg-red-900/30 text-red-400'
              }`}
            >
              {node.signature_valid ? '✓ Verified' : '✗ Invalid'}
            </span>
            {hasParents && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="text-chain-muted hover:text-chain-text transition-colors font-mono text-xs"
              >
                {expanded ? '▲' : '▼'}
              </button>
            )}
          </div>
        </div>

        {/* Details */}
        <div className="mt-3 grid grid-cols-2 gap-2">
          <div className="bg-chain-bg rounded-lg px-3 py-2">
            <p className="text-xs uppercase tracking-widest text-chain-muted font-mono">Quantity</p>
            <p className="text-chain-text text-xs font-body mt-0.5">{node.data?.quantity}</p>
          </div>
          <div className="bg-chain-bg rounded-lg px-3 py-2">
            <p className="text-xs uppercase tracking-widest text-chain-muted font-mono">Date</p>
            <p className="text-chain-text text-xs font-body mt-0.5">{node.data?.date || '—'}</p>
          </div>
          {node.shipped_to && (
            <div className="bg-chain-bg rounded-lg px-3 py-2 col-span-2">
              <p className="text-xs uppercase tracking-widest text-chain-muted font-mono">Shipped To</p>
              <p className="text-chain-text text-xs font-body mt-0.5">{node.shipped_to}</p>
            </div>
          )}
          <div className="bg-chain-bg rounded-lg px-3 py-2 col-span-2">
            <p className="text-xs uppercase tracking-widest text-chain-muted font-mono">Batch ID</p>
            <p className="text-chain-text text-xs font-mono mt-0.5 break-all">{node.id}</p>
          </div>
        </div>
      </div>

      {/* Children */}
      {expanded && hasParents && (
        <div className="relative mt-1">
          {node.raw_materials.map((child) => (
            <ChainNode key={child.id} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  )
}

export default function Verify() {
  const { batchId: paramBatchId } = useParams()
  const [batchId, setBatchId] = useState(paramBatchId || '')
  const [showScanner, setShowScanner] = useState(false)
  const [chain, setChain] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (paramBatchId) handleVerify(paramBatchId)
  }, [paramBatchId])

  const handleVerify = async (id) => {
    const target = id || batchId
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

  const allVerified = chain && checkAllValid(chain)

  function checkAllValid(node) {
    if (!node.signature_valid) return false
    return (node.raw_materials || []).every(checkAllValid)
  }

  return (
    <div className="min-h-screen grid-bg pb-16">
      {/* Header */}
      <header className="border-b border-chain-border bg-chain-surface/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 border-2 border-chain-accent rotate-45" />
            <span className="font-display font-bold text-chain-accent tracking-widest text-sm uppercase">
              AuthentiCheck
            </span>
          </div>
          <a
            href="/login"
            className="text-xs uppercase tracking-widest font-mono text-chain-muted hover:text-chain-text transition-colors"
          >
            Manufacturer Login →
          </a>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-6 pt-10">
        {/* Hero */}
        <div className="text-center mb-10 animate-fade-up">
          <h1 className="font-display text-4xl font-800 text-chain-text mb-2">
            Verify a Product
          </h1>
          <p className="text-chain-subtext font-body">
            Scan or enter a batch QR code to trace its complete supply chain journey
          </p>
        </div>

        {/* Input */}
        <div className="bg-chain-surface border border-chain-border rounded-2xl p-6 mb-8 animate-fade-up">
          <div className="flex gap-2">
            <input
              value={batchId}
              onChange={(e) => setBatchId(e.target.value)}
              placeholder="Enter Batch ID..."
              className="flex-1 bg-chain-bg border border-chain-border rounded-lg px-4 py-3 text-chain-text text-sm font-mono focus:outline-none focus:border-chain-accent transition-colors placeholder:text-chain-muted"
              onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
            />
            <button
              onClick={() => setShowScanner(true)}
              className="px-4 border border-chain-accent/50 rounded-lg text-chain-accent font-mono text-xs uppercase tracking-wider hover:bg-chain-accent/10 transition-colors"
            >
              Scan
            </button>
            <button
              onClick={() => handleVerify()}
              disabled={loading}
              className="px-6 bg-chain-accent text-chain-bg font-mono text-xs uppercase tracking-widest rounded-lg hover:bg-chain-accentDim transition-colors disabled:opacity-50"
            >
              {loading ? '...' : 'Verify'}
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-950/40 border border-red-800/50 rounded-xl px-4 py-3 text-red-400 text-sm font-body mb-6">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="text-center py-16 text-chain-subtext font-mono text-sm animate-pulse">
            Tracing supply chain...
          </div>
        )}

        {/* Result */}
        {chain && !loading && (
          <div className="animate-fade-up">
            {/* Summary banner */}
            <div
              className={`rounded-2xl p-5 mb-6 flex items-center gap-4 ${
                allVerified
                  ? 'bg-chain-accent/10 border border-chain-accent/30'
                  : 'bg-red-950/30 border border-red-700/30'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-xl shrink-0 ${
                  allVerified ? 'bg-chain-accent/20' : 'bg-red-900/30'
                }`}
              >
                {allVerified ? '✓' : '✗'}
              </div>
              <div>
                <p
                  className={`font-display font-700 text-base ${
                    allVerified ? 'text-chain-accent' : 'text-red-400'
                  }`}
                >
                  {allVerified
                    ? 'Fully Authenticated Supply Chain'
                    : 'Warning: Signature Mismatch Detected'}
                </p>
                <p className="text-chain-subtext text-sm font-body mt-0.5">
                  {allVerified
                    ? 'Every step in this product journey has been cryptographically verified.'
                    : 'One or more batches in this chain have invalid signatures. The product may have been tampered with.'}
                </p>
              </div>
            </div>

            {/* Chain tree */}
            <h2 className="font-display font-700 text-chain-text text-sm uppercase tracking-widest mb-4">
              Supply Chain Journey
            </h2>
            <ChainNode node={chain} depth={0} />
          </div>
        )}
      </div>

      {showScanner && (
        <QRScanner
          onScan={(data) => {
            const id = typeof data === 'object' ? (data.id || data.batchId || data) : data
            setBatchId(id)
            setShowScanner(false)
            handleVerify(id)
          }}
          onClose={() => setShowScanner(false)}
        />
      )}
    </div>
  )
}
