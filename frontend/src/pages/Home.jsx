import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

const FloatingOrb = ({ className }) => (
  <div
    className={`absolute rounded-full blur-3xl pointer-events-none animate-pulse ${className}`}
  />
)

const TrustCard = ({ icon, title, desc, accent }) => (
  <div className={`relative bg-chain-surface border rounded-2xl p-6 group hover:scale-[1.02] transition-all duration-300 overflow-hidden`}
    style={{ borderColor: `${accent}22` }}>
    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
      style={{ background: `radial-gradient(circle at 50% 0%, ${accent}11 0%, transparent 70%)` }} />
    <div className="text-3xl mb-4">{icon}</div>
    <h3 className="font-display font-700 text-chain-text text-lg mb-2">{title}</h3>
    <p className="font-body text-chain-subtext text-sm leading-relaxed">{desc}</p>
    <div className="absolute bottom-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }} />
  </div>
)

const Step = ({ number, title, desc, color, icon }) => (
  <div className="flex flex-col items-center text-center relative">
    <div className="relative mb-5">
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-display font-800 border-2 relative z-10"
        style={{ borderColor: color, color, boxShadow: `0 0 24px ${color}33`, backgroundColor: `${color}11` }}>
        {icon}
      </div>
      <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-700 text-chain-bg"
        style={{ backgroundColor: color }}>
        {number}
      </div>
    </div>
    <h3 className="font-display font-700 text-chain-text text-lg mb-2">{title}</h3>
    <p className="font-body text-chain-subtext text-sm leading-relaxed max-w-52">{desc}</p>
  </div>
)

export default function Home() {
  const navigate = useNavigate()
  const [batchId, setBatchId] = useState('')
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="min-h-screen bg-chain-bg overflow-x-hidden">

      {/* ── HERO ───────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden">
        {/* Grid background */}
        <div className="absolute inset-0 grid-bg opacity-60" />

        {/* Floating orbs */}
        <FloatingOrb className="w-96 h-96 bg-chain-accent top-10 -left-32 opacity-10" />
        <FloatingOrb className="w-80 h-80 bg-blue-500 top-1/4 right-0 opacity-8" />
        <FloatingOrb className="w-64 h-64 bg-purple-500 bottom-20 left-1/3 opacity-6" />

        {/* Diagonal accent line */}
        <div className="absolute top-0 right-0 w-px h-full opacity-10"
          style={{ background: 'linear-gradient(180deg, transparent, #00ff88, transparent)' }} />

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 border border-chain-accent/30 bg-chain-accent/5 rounded-full px-4 py-1.5 mb-8">
            <div className="w-1.5 h-1.5 rounded-full bg-chain-accent animate-pulse" />
            <span className="font-mono text-xs text-chain-accent uppercase tracking-widest">
              Cryptographic Supply Chain Verification
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-display font-800 leading-none mb-6">
            <span className="block text-5xl sm:text-7xl text-chain-text mb-2">
              Trust Every
            </span>
            <span className="block text-6xl sm:text-8xl"
              style={{
                background: 'linear-gradient(135deg, #00ff88, #00ccff, #a855f7)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
              Step.
            </span>
            <span className="block text-4xl sm:text-6xl text-chain-text mt-2">
              Verify Every Chain.
            </span>
          </h1>

          {/* Subtext */}
          <p className="font-body text-chain-subtext text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed mb-10">
            AuthentiCheck uses <span className="text-chain-accent font-500">RSA cryptographic signing</span> to 
            create an unforgeable record of every step in your product's journey — 
            from farm to factory to your hands.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
            <button
              onClick={() => navigate('/dashboard')}
              className="group relative px-8 py-4 rounded-xl font-display font-700 text-sm uppercase tracking-widest text-chain-bg overflow-hidden transition-all duration-300 hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #00ff88, #00ccaa)' }}>
              <span className="relative z-10">Manufacturer Portal →</span>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: 'linear-gradient(135deg, #00ccaa, #00ff88)' }} />
            </button>
            <button
              onClick={() => navigate('/verify')}
              className="px-8 py-4 rounded-xl font-display font-700 text-sm uppercase tracking-widest text-chain-accent border border-chain-accent/40 hover:bg-chain-accent/10 transition-all duration-300 hover:scale-105">
              Verify a Product ↓
            </button>
          </div>

          {/* Inline verify input */}
          <div className="max-w-xl mx-auto">
            <p className="font-mono text-xs text-chain-muted uppercase tracking-widest mb-3">
              Quick Verify — paste a batch ID
            </p>
            <div className="flex gap-2">
              <input
                value={batchId}
                onChange={(e) => setBatchId(e.target.value)}
                placeholder="e.g. 4595a76b-e8ff-4c2b-..."
                className="flex-1 bg-chain-surface border border-chain-border rounded-xl px-5 py-3.5 text-chain-text text-sm font-mono focus:outline-none focus:border-chain-accent transition-colors placeholder:text-chain-muted"
              />
              <button
                onClick={() => batchId && navigate(`/verify/${batchId}`)}
                className="px-6 rounded-xl font-mono text-xs uppercase tracking-widest text-chain-bg transition-all hover:scale-105"
                style={{ background: 'linear-gradient(135deg, #00ff88, #00ccaa)' }}>
                Go
              </button>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
          <span className="font-mono text-xs text-chain-muted uppercase tracking-widest">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-chain-accent to-transparent" />
        </div>
      </section>

      {/* ── HOW IT WORKS ───────────────────────────────────────── */}
      <section className="relative py-28 px-6 overflow-hidden">
        <FloatingOrb className="w-72 h-72 bg-blue-500 -right-20 top-10 opacity-8" />

        <div className="max-w-5xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-16">
            <p className="font-mono text-xs text-chain-accent uppercase tracking-[0.3em] mb-3">
              The Process
            </p>
            <h2 className="font-display font-800 text-4xl sm:text-5xl text-chain-text mb-4">
              How It{' '}
              <span style={{
                background: 'linear-gradient(135deg, #00ccff, #a855f7)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>Works</span>
            </h2>
            <p className="font-body text-chain-subtext max-w-lg mx-auto">
              Three simple steps to an unbreakable chain of trust
            </p>
          </div>

          {/* Steps */}
          <div className="relative grid grid-cols-1 sm:grid-cols-3 gap-12">
            {/* Connector lines */}
            <div className="hidden sm:block absolute top-8 left-1/3 right-1/3 h-px"
              style={{ background: 'linear-gradient(90deg, #00ff88, #00ccff, #a855f7)' }} />

            <Step
              number="1" icon="✦"
              color="#00ff88"
              title="Create & Sign"
              desc="Manufacturer creates a batch with product data and signs it cryptographically with their private RSA key."
            />
            <Step
              number="2" icon="◈"
              color="#00ccff"
              title="Register & Link"
              desc="The signed batch is registered on-chain, linked to its raw material batches, and a unique QR code is generated."
            />
            <Step
              number="3" icon="◎"
              color="#a855f7"
              title="Scan & Verify"
              desc="Anyone can scan the QR to instantly trace the full supply journey and verify every signature is authentic."
            />
          </div>
        </div>
      </section>

      {/* ── TRUST POINTS ───────────────────────────────────────── */}
      <section className="relative py-28 px-6 overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-30" />
        <FloatingOrb className="w-96 h-96 bg-purple-600 -left-32 bottom-0 opacity-8" />

        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <p className="font-mono text-xs text-chain-accent uppercase tracking-[0.3em] mb-3">
              Why AuthentiCheck
            </p>
            <h2 className="font-display font-800 text-4xl sm:text-5xl text-chain-text mb-4">
              Built for{' '}
              <span style={{
                background: 'linear-gradient(135deg, #00ff88, #f59e0b)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>Trust</span>
            </h2>
            <p className="font-body text-chain-subtext max-w-lg mx-auto">
              Every feature is designed around one goal — making counterfeit impossible
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <TrustCard
              icon="🔐"
              accent="#00ff88"
              title="RSA Cryptographic Signing"
              desc="Every batch is signed with a 2048-bit RSA private key. Impossible to forge without the original key."
            />
            <TrustCard
              icon="🔗"
              accent="#00ccff"
              title="Immutable Chain of Custody"
              desc="Each batch is linked to its raw material batches, forming an unbreakable, traceable lineage."
            />
            <TrustCard
              icon="⚡"
              accent="#a855f7"
              title="Instant Verification"
              desc="Consumers verify an entire supply chain in seconds — just scan a QR code, no app needed."
            />
            <TrustCard
              icon="🌿"
              accent="#f59e0b"
              title="Origin Transparency"
              desc="Trace products all the way back to their origin batch, with producer details at every step."
            />
            <TrustCard
              icon="🛡️"
              accent="#f43f5e"
              title="Tamper Detection"
              desc="Any modification to batch data invalidates the signature — tampering is immediately visible."
            />
            <TrustCard
              icon="🌐"
              accent="#10b981"
              title="Multi-Member Chains"
              desc="Supports complex multi-party supply chains — farms, processors, manufacturers, distributors."
            />
          </div>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────── */}
      <footer className="relative border-t border-chain-border bg-chain-surface px-6 py-16 overflow-hidden">
        <FloatingOrb className="w-64 h-64 bg-chain-accent right-0 bottom-0 opacity-5" />

        <div className="max-w-5xl mx-auto relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 mb-12">

            {/* Brand */}
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-7 h-7 border-2 border-chain-accent rotate-45 shrink-0"
                  style={{ boxShadow: '0 0 12px rgba(0,255,136,0.3)' }} />
                <span className="font-display font-800 text-chain-accent tracking-widest text-sm uppercase"
                  style={{ textShadow: '0 0 16px rgba(0,255,136,0.35)' }}>
                  AuthentiCheck
                </span>
              </div>
              <p className="font-body text-chain-subtext text-sm leading-relaxed">
                Cryptographic supply chain authentication for a world that demands transparency.
              </p>
            </div>

            {/* Navigation */}
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-chain-muted mb-4">
                Navigate
              </p>
              <div className="space-y-2">
                {[
                  { label: 'Home', path: '/home' },
                  { label: 'Dashboard', path: '/dashboard' },
                  { label: 'Verify a Product', path: '/verify' },
                  { label: 'Admin Panel', path: '/admin' },
                ].map(({ label, path }) => (
                  <a key={path} href={path}
                    className="block font-body text-sm text-chain-subtext hover:text-chain-accent transition-colors">
                    {label}
                  </a>
                ))}
              </div>
            </div>

            {/* Contact */}
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-chain-muted mb-4">
                Contact Us
              </p>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="text-chain-accent mt-0.5 shrink-0">✉</span>
                  <div>
                    <p className="font-mono text-xs text-chain-muted uppercase tracking-wider mb-0.5">Email</p>
                    <a href="mailto:admin@authenticheck.com"
                      className="font-body text-sm text-chain-subtext hover:text-chain-accent transition-colors">
                      admin@authenticheck.com
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-chain-accent mt-0.5 shrink-0">✆</span>
                  <div>
                    <p className="font-mono text-xs text-chain-muted uppercase tracking-wider mb-0.5">Phone</p>
                    <a href="tel:+911234567890"
                      className="font-body text-sm text-chain-subtext hover:text-chain-accent transition-colors">
                      +91 12345 67890
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-chain-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="font-mono text-xs text-chain-muted">
              © {new Date().getFullYear()} AuthentiCheck. All rights reserved.
            </p>
            <p className="font-mono text-xs text-chain-muted flex items-center gap-1.5">
              Secured with
              <span className="text-chain-accent">RSA-2048</span>
              cryptography
              <span className="text-chain-accent">✦</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}