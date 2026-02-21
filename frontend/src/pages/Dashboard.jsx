import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { createBatch } from '../lib/api'
import QRScanner from '../components/QRScanner'

export default function Dashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)

  // Form state
  const [productName, setProductName] = useState('')
  const [quantity, setQuantity] = useState('')
  const [shippedTo, setShippedTo] = useState('')
  const [privateKey, setPrivateKey] = useState('')
  const [rawMaterials, setRawMaterials] = useState([]) // array of batch IDs
  const [manualBatchId, setManualBatchId] = useState('')

  // UI state
  const [showScanner, setShowScanner] = useState(false)
  const [signature, setSignature] = useState('')
  const [signed, setSigned] = useState(false)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null) // { batch, qr }
  const [error, setError] = useState('')

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        navigate('/login')
      } else {
        setUser(data.user)
      }
    })
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }

  const addRawMaterial = (id) => {
    const clean = typeof id === 'string' ? id.trim() : id
    if (clean && !rawMaterials.includes(clean)) {
      setRawMaterials([...rawMaterials, clean])
      setSigned(false)
    }
    setManualBatchId('')
  }

  const removeRawMaterial = (id) => {
    setRawMaterials(rawMaterials.filter((b) => b !== id))
    setSigned(false)
  }

  const handleSign = async () => {
    if (!privateKey) return setError('Paste your private key to sign.')
    if (!productName || !quantity) return setError('Fill in product name and quantity.')
    setError('')

    try {
      // Call sign endpoint or sign client-side
      // Here we POST to a /sign endpoint — or you can import the crypto logic
      // For now we construct the payload and sign server-side via /batch endpoint
      // We'll do it as part of submit. Mark signed = true just as a UX step.
      setSigned(true)
    } catch (e) {
      setError('Signing failed: ' + e.message)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!signed) return setError('Please sign the batch first.')
    setLoading(true)
    setError('')
    setResult(null)

    try {
      const batchData = {
        product_name: productName,
        quantity,
        date: new Date().toISOString().split('T')[0],
      }

      const { data } = await createBatch({
        batchData,
        producerId: user.id,
        shippedTo: shippedTo || null,
        privateKey,
        raw_material_batchIds: rawMaterials,
      })

      setResult(data)
      // Reset form
      setProductName('')
      setQuantity('')
      setShippedTo('')
      setPrivateKey('')
      setRawMaterials([])
      setSigned(false)
    } catch (e) {
      setError(e.response?.data?.error || e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen grid-bg">
      {/* Header */}
      <header className="border-b border-chain-border bg-chain-surface/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 border-2 border-chain-accent rotate-45" />
            <span className="font-display font-bold text-chain-accent tracking-widest text-sm uppercase">
              AuthentiCheck
            </span>
          </div>
          <div className="flex items-center gap-6">
            <span className="text-chain-subtext font-mono text-xs truncate max-w-48">
              {user?.email}
            </span>
            <span className="text-chain-muted font-mono text-xs hidden sm:block">
              ID: {user?.id?.slice(0, 8)}...
            </span>
            <button
              onClick={handleLogout}
              className="text-xs uppercase tracking-widest font-mono text-chain-muted hover:text-chain-warn transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="mb-8 animate-fade-up">
          <h1 className="font-display text-3xl font-800 text-chain-text mb-1">
            Add New Batch
          </h1>
          <p className="text-chain-subtext font-body text-sm">
            Create a signed batch and generate its supply chain QR code
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Form */}
          <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-6 animate-fade-up">

            {/* Product Info */}
            <div className="bg-chain-surface border border-chain-border rounded-2xl p-6 space-y-4">
              <h2 className="font-display font-700 text-chain-text text-sm uppercase tracking-widest mb-4">
                Product Info
              </h2>

              <div>
                <label className="block text-xs uppercase tracking-widest text-chain-subtext mb-2 font-mono">
                  Product Name
                </label>
                <input
                  value={productName}
                  onChange={(e) => { setProductName(e.target.value); setSigned(false) }}
                  required
                  placeholder="e.g. Cotton Fabric"
                  className="w-full bg-chain-bg border border-chain-border rounded-lg px-4 py-3 text-chain-text text-sm font-body focus:outline-none focus:border-chain-accent transition-colors placeholder:text-chain-muted"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-chain-subtext mb-2 font-mono">
                  Quantity
                </label>
                <input
                  value={quantity}
                  onChange={(e) => { setQuantity(e.target.value); setSigned(false) }}
                  required
                  placeholder="e.g. 500 kg"
                  className="w-full bg-chain-bg border border-chain-border rounded-lg px-4 py-3 text-chain-text text-sm font-body focus:outline-none focus:border-chain-accent transition-colors placeholder:text-chain-muted"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-chain-subtext mb-2 font-mono">
                  Ship To (Supply Member ID) <span className="text-chain-muted normal-case">— optional</span>
                </label>
                <input
                  value={shippedTo}
                  onChange={(e) => { setShippedTo(e.target.value); setSigned(false) }}
                  placeholder="UUID of recipient supply member"
                  className="w-full bg-chain-bg border border-chain-border rounded-lg px-4 py-3 text-chain-text text-sm font-body focus:outline-none focus:border-chain-accent transition-colors placeholder:text-chain-muted"
                />
              </div>
            </div>

            {/* Raw Materials */}
            <div className="bg-chain-surface border border-chain-border rounded-2xl p-6">
              <h2 className="font-display font-700 text-chain-text text-sm uppercase tracking-widest mb-4">
                Raw Material Batches
              </h2>

              <div className="flex gap-2 mb-3">
                <input
                  value={manualBatchId}
                  onChange={(e) => setManualBatchId(e.target.value)}
                  placeholder="Enter Batch ID manually"
                  className="flex-1 bg-chain-bg border border-chain-border rounded-lg px-4 py-2.5 text-chain-text text-sm font-mono focus:outline-none focus:border-chain-accent transition-colors placeholder:text-chain-muted"
                />
                <button
                  type="button"
                  onClick={() => addRawMaterial(manualBatchId)}
                  className="px-4 py-2.5 bg-chain-border rounded-lg text-chain-text text-sm font-mono hover:bg-chain-muted/30 transition-colors"
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => setShowScanner(true)}
                  className="px-4 py-2.5 border border-chain-accent/50 rounded-lg text-chain-accent text-sm font-mono hover:bg-chain-accent/10 transition-colors"
                >
                  Scan QR
                </button>
              </div>

              {rawMaterials.length === 0 ? (
                <p className="text-chain-muted text-xs font-mono py-3 text-center border border-dashed border-chain-border rounded-lg">
                  No raw materials — this is an origin batch
                </p>
              ) : (
                <div className="space-y-2">
                  {rawMaterials.map((id) => (
                    <div
                      key={id}
                      className="flex items-center justify-between bg-chain-bg rounded-lg px-3 py-2 border border-chain-border"
                    >
                      <span className="font-mono text-xs text-chain-subtext truncate max-w-xs">
                        {id}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeRawMaterial(id)}
                        className="text-chain-muted hover:text-chain-warn text-sm ml-2 shrink-0"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Private Key & Sign */}
            <div className="bg-chain-surface border border-chain-border rounded-2xl p-6 space-y-4">
              <h2 className="font-display font-700 text-chain-text text-sm uppercase tracking-widest">
                Sign Batch
              </h2>

              <div>
                <label className="block text-xs uppercase tracking-widest text-chain-subtext mb-2 font-mono">
                  Your Private Key
                </label>
                <textarea
                  value={privateKey}
                  onChange={(e) => { setPrivateKey(e.target.value); setSigned(false) }}
                  placeholder="Paste your base64 private key here..."
                  rows={3}
                  className="w-full bg-chain-bg border border-chain-border rounded-lg px-4 py-3 text-chain-text text-xs font-mono focus:outline-none focus:border-chain-accent transition-colors placeholder:text-chain-muted resize-none"
                />
                <p className="text-chain-muted text-xs mt-1 font-body">
                  Never stored. Used only to generate the batch signature.
                </p>
              </div>

              <button
                type="button"
                onClick={handleSign}
                disabled={signed}
                className={`w-full py-3 rounded-lg text-sm font-mono uppercase tracking-widest transition-all ${
                  signed
                    ? 'bg-chain-accent/20 border border-chain-accent text-chain-accent cursor-default'
                    : 'border border-chain-accent text-chain-accent hover:bg-chain-accent/10'
                }`}
              >
                {signed ? '✓ Batch Signed' : 'Sign Batch'}
              </button>
            </div>

            {error && (
              <div className="bg-red-950/40 border border-red-800/50 rounded-lg px-4 py-3 text-red-400 text-sm font-body">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !signed}
              className="w-full bg-chain-accent text-chain-bg font-display font-700 text-sm tracking-widest uppercase py-4 rounded-xl hover:bg-chain-accentDim transition-colors disabled:opacity-40 disabled:cursor-not-allowed animate-pulse-glow"
            >
              {loading ? 'Creating Batch...' : 'Create & Register Batch'}
            </button>
          </form>

          {/* Result Panel */}
          <div className="lg:col-span-2">
            {result ? (
              <div className="bg-chain-surface border border-chain-accent/30 rounded-2xl p-6 animate-fade-up sticky top-24">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 rounded-full bg-chain-accent animate-pulse" />
                  <h3 className="font-display font-700 text-chain-accent text-sm uppercase tracking-widest">
                    Batch Created
                  </h3>
                </div>

                {/* QR Code */}
                <div className="bg-white p-3 rounded-xl mb-4 flex items-center justify-center">
                  <img src={result.qr} alt="Batch QR" className="w-full max-w-48" />
                </div>

                <div className="space-y-2">
                  <div className="bg-chain-bg rounded-lg p-3">
                    <p className="text-xs uppercase tracking-widest text-chain-subtext font-mono mb-1">
                      Batch ID
                    </p>
                    <p className="font-mono text-xs text-chain-text break-all">
                      {result.batch?.id}
                    </p>
                  </div>
                  <div className="bg-chain-bg rounded-lg p-3">
                    <p className="text-xs uppercase tracking-widest text-chain-subtext font-mono mb-1">
                      Product
                    </p>
                    <p className="font-mono text-xs text-chain-text">
                      {result.batch?.data?.product_name}
                    </p>
                  </div>
                </div>

                <a
                  href={result.qr}
                  download="batch-qr.png"
                  className="mt-4 block text-center w-full border border-chain-accent/50 text-chain-accent py-2.5 rounded-lg text-xs font-mono uppercase tracking-widest hover:bg-chain-accent/10 transition-colors"
                >
                  Download QR
                </a>
              </div>
            ) : (
              <div className="border border-dashed border-chain-border rounded-2xl p-8 text-center text-chain-muted sticky top-24">
                <div className="w-16 h-16 border border-dashed border-chain-border rounded-xl mx-auto mb-4 flex items-center justify-center">
                  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <rect x="3" y="3" width="7" height="7" />
                    <rect x="14" y="3" width="7" height="7" />
                    <rect x="3" y="14" width="7" height="7" />
                    <path d="M14 14h.01M14 17h.01M17 14h.01M17 17h.01" strokeLinecap="round" />
                  </svg>
                </div>
                <p className="font-mono text-xs uppercase tracking-wider">
                  QR will appear here after batch creation
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {showScanner && (
        <QRScanner
          onScan={(data) => {
            // data could be a batch ID string or an object with id
            const id = typeof data === 'object' ? (data.id || data.batchId) : data
            addRawMaterial(id)
            setShowScanner(false)
          }}
          onClose={() => setShowScanner(false)}
        />
      )}
    </div>
  )
}
