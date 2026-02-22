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
  const [rawMaterials, setRawMaterials] = useState([])
  const [manualBatchId, setManualBatchId] = useState('')

  // UI state
  const [showScanner, setShowScanner] = useState(false)
  const [signature, setSignature] = useState('')
  const [signed, setSigned] = useState(false)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) navigate('/login')
      else setUser(data.user)
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

    console.log(user.id)

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
    <div className="min-h-screen bg-gradient-to-br from-black via-emerald-950 to-black text-emerald-100">

      {/* HEADER */}
      <header className="border-b border-emerald-500/20 bg-black/40 backdrop-blur-xl sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 bg-emerald-400 rotate-45 shadow-[0_0_12px_#34d399]" />
            <span className="font-bold tracking-widest uppercase text-emerald-300">
              AuthentiCheck
            </span>
          </div>

          <div className="flex items-center gap-6 text-sm">
            <span className="text-emerald-400/80 font-mono truncate max-w-40">
              {user?.email}
            </span>
            <button
              onClick={handleLogout}
              className="uppercase tracking-widest text-emerald-500 hover:text-emerald-300 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-emerald-300 mb-2 drop-shadow-[0_0_12px_rgba(16,185,129,0.6)]">
          Add New Batch
        </h1>
        <p className="text-emerald-400/70 mb-10">
          Create a signed batch and generate its supply chain QR code
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">

          {/* FORM */}
          <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-8">

            {/* PRODUCT INFO */}
            <div className="bg-black/40 border border-emerald-500/20 rounded-2xl p-6 backdrop-blur-xl shadow-[0_0_40px_rgba(16,185,129,0.15)] space-y-5">
              <h2 className="uppercase tracking-widest text-emerald-400 text-sm">
                Product Info
              </h2>

              <input
                value={productName}
                onChange={(e) => { setProductName(e.target.value); setSigned(false) }}
                required
                placeholder="Product Name"
                className="w-full bg-black/60 border border-emerald-500/30 rounded-lg px-4 py-3 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30 transition"
              />

              <input
                value={quantity}
                onChange={(e) => { setQuantity(e.target.value); setSigned(false) }}
                required
                placeholder="Quantity"
                className="w-full bg-black/60 border border-emerald-500/30 rounded-lg px-4 py-3 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30 transition"
              />

              <input
                value={shippedTo}
                onChange={(e) => { setShippedTo(e.target.value); setSigned(false) }}
                placeholder="Ship To (optional)"
                className="w-full bg-black/60 border border-emerald-500/30 rounded-lg px-4 py-3 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30 transition"
              />
            </div>

            {/* RAW MATERIALS */}
            <div className="bg-black/40 border border-emerald-500/20 rounded-2xl p-6 backdrop-blur-xl space-y-4">
              <h2 className="uppercase tracking-widest text-emerald-400 text-sm">
                Raw Materials
              </h2>

              <div className="flex gap-3">
                <input
                  value={manualBatchId}
                  onChange={(e) => setManualBatchId(e.target.value)}
                  placeholder="Enter Batch ID"
                  className="flex-1 bg-black/60 border border-emerald-500/30 rounded-lg px-4 py-2 focus:border-emerald-400 transition"
                />
                <button
                  type="button"
                  onClick={() => addRawMaterial(manualBatchId)}
                  className="px-4 py-2 bg-emerald-600/20 border border-emerald-500 rounded-lg hover:bg-emerald-600/40 transition"
                >
                  Add
                </button>
              </div>

              {rawMaterials.map((id) => (
                <div
                  key={id}
                  className="flex justify-between items-center bg-black/60 border border-emerald-500/20 rounded-lg px-3 py-2"
                >
                  <span className="font-mono text-xs text-emerald-300 truncate">
                    {id}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeRawMaterial(id)}
                    className="text-emerald-500 hover:text-red-400 transition"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            {/* SIGN */}
            <div className="bg-black/40 border border-emerald-500/20 rounded-2xl p-6 backdrop-blur-xl space-y-4">
              <h2 className="uppercase tracking-widest text-emerald-400 text-sm">
                Sign Batch
              </h2>

              <textarea
                value={privateKey}
                onChange={(e) => { setPrivateKey(e.target.value); setSigned(false) }}
                placeholder="Paste Private Key"
                rows={3}
                className="w-full bg-black/60 border border-emerald-500/30 rounded-lg px-4 py-3 font-mono text-xs focus:border-emerald-400 transition"
              />

              <button
                type="button"
                onClick={handleSign}
                disabled={signed}
                className={`w-full py-3 rounded-lg uppercase tracking-widest transition-all ${
                  signed
                    ? 'bg-emerald-500/20 border border-emerald-400 text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.5)]'
                    : 'border border-emerald-400 text-emerald-400 hover:bg-emerald-500/10'
                }`}
              >
                {signed ? '✓ Batch Signed' : 'Sign Batch'}
              </button>
            </div>

            {error && (
              <div className="bg-red-900/40 border border-red-700 rounded-lg px-4 py-3 text-red-400 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !signed}
              className="w-full bg-gradient-to-r from-emerald-500 to-green-400 text-black font-bold py-4 rounded-xl shadow-[0_0_30px_rgba(16,185,129,0.6)] hover:scale-[1.02] transition disabled:opacity-40"
            >
              {loading ? 'Creating Batch...' : 'Create & Register Batch'}
            </button>
          </form>

          {/* RESULT PANEL */}
          <div className="lg:col-span-2">
            {result ? (
              <div className="bg-black/40 border border-emerald-400/30 rounded-2xl p-6 backdrop-blur-xl sticky top-24 shadow-[0_0_40px_rgba(16,185,129,0.2)]">
                <h3 className="text-emerald-400 uppercase tracking-widest text-sm mb-4">
                  Batch Created
                </h3>

                <div className="bg-white p-3 rounded-xl mb-4 flex justify-center">
                  <img src={result.qr} alt="Batch QR" className="w-full max-w-48" />
                </div>

                <p className="text-xs text-emerald-300 font-mono break-all">
                  {result.batch?.id}
                </p>
              </div>
            ) : (
              <div className="border border-dashed border-emerald-500/20 rounded-2xl p-10 text-center text-emerald-500/50 sticky top-24">
                QR will appear here
              </div>
            )}
          </div>

        </div>
      </div>

      {showScanner && (
        <QRScanner
          onScan={(data) => {
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