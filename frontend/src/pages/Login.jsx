import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

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
    <div className="min-h-screen grid-bg flex items-center justify-center px-4">
      {/* Background glow orb */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-chain-accent opacity-5 blur-3xl pointer-events-none" />

      <div className="w-full max-w-md animate-fade-up">
        {/* Logo / Brand */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-8 h-8 border-2 border-chain-accent rotate-45 glow-accent" />
            <span className="font-display text-2xl font-bold tracking-widest text-chain-accent glow-text">
              AuthentiCheck
            </span>
          </div>
          <p className="text-chain-subtext font-body text-sm tracking-wider uppercase">
            Manufacturer Portal
          </p>
        </div>

        {/* Card */}
        <div className="bg-chain-surface border border-chain-border rounded-2xl p-8">
          <h1 className="font-display text-2xl font-700 text-chain-text mb-1">
            Sign In
          </h1>
          <p className="text-chain-subtext text-sm mb-8 font-body">
            Access your supply chain dashboard
          </p>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs uppercase tracking-widest text-chain-subtext mb-2 font-mono">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@company.com"
                className="w-full bg-chain-bg border border-chain-border rounded-lg px-4 py-3 text-chain-text font-body text-sm focus:outline-none focus:border-chain-accent transition-colors placeholder:text-chain-muted"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest text-chain-subtext mb-2 font-mono">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full bg-chain-bg border border-chain-border rounded-lg px-4 py-3 text-chain-text font-body text-sm focus:outline-none focus:border-chain-accent transition-colors placeholder:text-chain-muted"
              />
            </div>

            {error && (
              <div className="bg-red-950/40 border border-red-800/50 rounded-lg px-4 py-3 text-red-400 text-sm font-body">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-chain-accent text-chain-bg font-display font-700 text-sm tracking-widest uppercase py-3.5 rounded-lg hover:bg-chain-accentDim transition-colors disabled:opacity-50 disabled:cursor-not-allowed animate-pulse-glow"
            >
              {loading ? 'Authenticating...' : 'Enter Dashboard'}
            </button>
          </form>
        </div>

        <p className="text-center text-chain-muted text-xs mt-6 font-mono">
          Consumer verification?{' '}
          <a href="/verify" className="text-chain-accent hover:underline">
            Scan a batch →
          </a>
        </p>
      </div>
    </div>
  )
}
