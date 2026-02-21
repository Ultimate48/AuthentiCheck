import { useEffect, useRef, useState } from 'react'
import { Html5Qrcode } from 'html5-qrcode'

export default function QRScanner({ onScan, onClose }) {
  const [mode, setMode] = useState('camera') // 'camera' | 'upload'
  const [error, setError] = useState('')
  const scannerRef = useRef(null)
  const fileInputRef = useRef(null)
  const scannerId = 'qr-scanner-container'

  useEffect(() => {
    if (mode !== 'camera') return

    const scanner = new Html5Qrcode(scannerId)
    scannerRef.current = scanner

    scanner.start(
      { facingMode: 'environment' },
      { fps: 10, qrbox: { width: 220, height: 220 } },
      (decodedText) => {
        scanner.stop()
        try {
          const parsed = JSON.parse(decodedText)
          onScan(parsed)
        } catch {
          onScan(decodedText)
        }
      },
      () => {}
    ).catch((err) => {
      setError('Camera not accessible: ' + err)
    })

    return () => {
      scanner.isScanning && scanner.stop().catch(() => {})
    }
  }, [mode])

  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const scanner = new Html5Qrcode('qr-file-scanner')
    try {
      const result = await scanner.scanFile(file, true)
      try {
        onScan(JSON.parse(result))
      } catch {
        onScan(result)
      }
    } catch {
      setError('Could not read QR code from image. Try another image.')
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-chain-surface border border-chain-border rounded-2xl w-full max-w-sm p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-display font-700 text-chain-text text-lg">Scan QR Code</h3>
          <button
            onClick={onClose}
            className="text-chain-muted hover:text-chain-text transition-colors text-xl leading-none"
          >
            ✕
          </button>
        </div>

        {/* Mode Toggle */}
        <div className="flex rounded-lg border border-chain-border overflow-hidden mb-5">
          <button
            onClick={() => setMode('camera')}
            className={`flex-1 py-2 text-xs uppercase tracking-widest font-mono transition-colors ${
              mode === 'camera'
                ? 'bg-chain-accent text-chain-bg'
                : 'text-chain-subtext hover:text-chain-text'
            }`}
          >
            Camera
          </button>
          <button
            onClick={() => setMode('upload')}
            className={`flex-1 py-2 text-xs uppercase tracking-widest font-mono transition-colors ${
              mode === 'upload'
                ? 'bg-chain-accent text-chain-bg'
                : 'text-chain-subtext hover:text-chain-text'
            }`}
          >
            Upload Image
          </button>
        </div>

        {mode === 'camera' && (
          <div className="relative">
            <div id={scannerId} className="rounded-xl overflow-hidden w-full" />
            {/* Scan overlay corners */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-chain-accent" />
              <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-chain-accent" />
              <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-chain-accent" />
              <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-chain-accent" />
            </div>
          </div>
        )}

        {mode === 'upload' && (
          <div>
            {/* Hidden scanner div required by lib */}
            <div id="qr-file-scanner" className="hidden" />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full border-2 border-dashed border-chain-border rounded-xl py-12 text-chain-subtext hover:border-chain-accent hover:text-chain-accent transition-colors flex flex-col items-center gap-3"
            >
              <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path d="M4 16l4-4 4 4 4-6 4 6" />
                <rect x="3" y="3" width="18" height="18" rx="2" />
              </svg>
              <span className="font-mono text-sm uppercase tracking-wider">
                Click to upload QR image
              </span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        )}

        {error && (
          <p className="mt-4 text-red-400 text-sm font-body text-center">{error}</p>
        )}
      </div>
    </div>
  )
}
