import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { createSupplyMember, getSupplyMembers, updateSupplyMemberStatus } from '../lib/api'

const STATUS_COLORS = {
  active: 'text-chain-accent bg-chain-accent/10 border-chain-accent/30',
  suspended: 'text-yellow-400 bg-yellow-900/20 border-yellow-700/30',
  revoked: 'text-red-400 bg-red-900/20 border-red-700/30',
}

export default function Admin() {
  const navigate = useNavigate()
  const [members, setMembers] = useState([])
  const [loadingMembers, setLoadingMembers] = useState(true)
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [entityName, setEntityName] = useState('')
  const [creating, setCreating] = useState(false)
  const [createResult, setCreateResult] = useState(null)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) navigate('/login')
    })
    fetchMembers()
  }, [])

  const fetchMembers = async () => {
    setLoadingMembers(true)
    try {
      const { data } = await getSupplyMembers()
      // Handle both array and wrapped response
      setMembers(Array.isArray(data) ? data : data.members || data.data || [])
    } catch (e) {
      console.error('Failed to fetch members', e)
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
      setEmail('')
      setPassword('')
      setEntityName('')
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
      setMembers(members.map((m) => (m.id === id ? { ...m, status } : m)))
    } catch (e) {
      alert('Failed to update status: ' + e.message)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }

  return (
    <div className="min-h-screen grid-bg pb-16">
      {/* Header */}
      <header className="border-b border-chain-border bg-chain-surface/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 border-2 border-chain-accent rotate-45" />
            <span className="font-display font-bold text-chain-accent tracking-widest text-sm uppercase">
              AuthentiCheck
            </span>
            <span className="font-mono text-xs text-chain-muted border border-chain-border px-2 py-0.5 rounded uppercase tracking-wider">
              Admin
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="text-xs uppercase tracking-widest font-mono text-chain-muted hover:text-chain-warn transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 pt-10">
        <div className="flex items-center justify-between mb-8 animate-fade-up">
          <div>
            <h1 className="font-display text-3xl font-800 text-chain-text mb-1">
              Supply Chain Members
            </h1>
            <p className="text-chain-subtext font-body text-sm">
              Manage who participates in the chain
            </p>
          </div>
          <button
            onClick={() => { setShowForm(!showForm); setCreateResult(null); setError('') }}
            className="flex items-center gap-2 bg-chain-accent text-chain-bg font-mono text-xs uppercase tracking-widest px-5 py-3 rounded-xl hover:bg-chain-accentDim transition-colors"
          >
            {showForm ? '✕ Cancel' : '+ Add Member'}
          </button>
        </div>

        {/* Create Member Form */}
        {showForm && (
          <div className="bg-chain-surface border border-chain-border rounded-2xl p-6 mb-8 animate-fade-up">
            <h2 className="font-display font-700 text-chain-text text-sm uppercase tracking-widest mb-5">
              New Supply Chain Member
            </h2>
            <form onSubmit={handleCreate} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-widest text-chain-subtext mb-2 font-mono">
                  Entity Name
                </label>
                <input
                  value={entityName}
                  onChange={(e) => setEntityName(e.target.value)}
                  required
                  placeholder="e.g. Sunrise Farm"
                  className="w-full bg-chain-bg border border-chain-border rounded-lg px-4 py-3 text-chain-text text-sm font-body focus:outline-none focus:border-chain-accent transition-colors placeholder:text-chain-muted"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-chain-subtext mb-2 font-mono">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="member@company.com"
                  className="w-full bg-chain-bg border border-chain-border rounded-lg px-4 py-3 text-chain-text text-sm font-body focus:outline-none focus:border-chain-accent transition-colors placeholder:text-chain-muted"
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
                  placeholder="Initial password"
                  className="w-full bg-chain-bg border border-chain-border rounded-lg px-4 py-3 text-chain-text text-sm font-body focus:outline-none focus:border-chain-accent transition-colors placeholder:text-chain-muted"
                />
              </div>
              <div className="sm:col-span-3 flex gap-3 items-start">
                <button
                  type="submit"
                  disabled={creating}
                  className="bg-chain-accent text-chain-bg font-mono text-xs uppercase tracking-widest px-6 py-3 rounded-lg hover:bg-chain-accentDim transition-colors disabled:opacity-50"
                >
                  {creating ? 'Creating...' : 'Create Member'}
                </button>
              </div>
            </form>

            {error && (
              <div className="mt-4 bg-red-950/40 border border-red-800/50 rounded-lg px-4 py-3 text-red-400 text-sm font-body">
                {error}
              </div>
            )}

            {/* Show private key after creation — only shown once */}
            {createResult && (
              <div className="mt-4 bg-chain-accent/10 border border-chain-accent/30 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full bg-chain-accent animate-pulse" />
                  <p className="font-display font-700 text-chain-accent text-sm uppercase tracking-widest">
                    Member Created — Save Private Key Now
                  </p>
                </div>
                <p className="text-chain-subtext text-xs font-body mb-3">
                  This private key will <strong className="text-chain-warn">never be shown again</strong>. 
                  Give it to the member securely.
                </p>
                <div className="bg-chain-bg rounded-lg p-3 mb-3">
                  <p className="text-xs uppercase tracking-widest text-chain-subtext font-mono mb-1">
                    Member ID
                  </p>
                  <p className="font-mono text-xs text-chain-text break-all">
                    {createResult.supplyMember?.id}
                  </p>
                </div>
                <div className="bg-chain-bg rounded-lg p-3">
                  <p className="text-xs uppercase tracking-widest text-chain-subtext font-mono mb-1">
                    Private Key
                  </p>
                  <p className="font-mono text-xs text-chain-text break-all leading-relaxed">
                    {createResult.privateKey}
                  </p>
                </div>
                <button
                  onClick={() => navigator.clipboard.writeText(createResult.privateKey)}
                  className="mt-3 text-xs font-mono uppercase tracking-widest text-chain-accent hover:underline"
                >
                  Copy Private Key
                </button>
              </div>
            )}
          </div>
        )}

        {/* Members Table */}
        <div className="bg-chain-surface border border-chain-border rounded-2xl overflow-hidden animate-fade-up">
          <div className="px-6 py-4 border-b border-chain-border flex items-center justify-between">
            <h2 className="font-display font-700 text-chain-text text-sm uppercase tracking-widest">
              All Members
            </h2>
            <span className="font-mono text-xs text-chain-muted">
              {members.length} total
            </span>
          </div>

          {loadingMembers ? (
            <div className="py-16 text-center text-chain-muted font-mono text-sm animate-pulse">
              Loading members...
            </div>
          ) : members.length === 0 ? (
            <div className="py-16 text-center text-chain-muted font-mono text-sm">
              No members yet. Add one above.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-chain-border">
                    {['Entity', 'ID', 'Public Key', 'Status', 'Actions'].map((h) => (
                      <th
                        key={h}
                        className="px-6 py-3 text-left text-xs uppercase tracking-widest text-chain-muted font-mono"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {members.map((member, i) => (
                    <tr
                      key={member.id}
                      className={`border-b border-chain-border/50 hover:bg-chain-bg/50 transition-colors ${
                        i === members.length - 1 ? 'border-none' : ''
                      }`}
                    >
                      <td className="px-6 py-4">
                        <p className="font-display font-600 text-chain-text text-sm">
                          {member.entity_name}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-mono text-xs text-chain-subtext">
                          {member.id?.slice(0, 8)}...
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-mono text-xs text-chain-subtext max-w-32 truncate">
                          {member.public_key?.slice(0, 20)}...
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`text-xs font-mono px-2 py-0.5 rounded border uppercase tracking-wider ${STATUS_COLORS[member.status]}`}
                        >
                          {member.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          {member.status !== 'active' && (
                            <button
                              onClick={() => handleStatusChange(member.id, 'active')}
                              className="text-xs font-mono text-chain-accent hover:underline uppercase tracking-wider"
                            >
                              Activate
                            </button>
                          )}
                          {member.status !== 'suspended' && (
                            <button
                              onClick={() => handleStatusChange(member.id, 'suspended')}
                              className="text-xs font-mono text-yellow-400 hover:underline uppercase tracking-wider"
                            >
                              Suspend
                            </button>
                          )}
                          {member.status !== 'revoked' && (
                            <button
                              onClick={() => handleStatusChange(member.id, 'revoked')}
                              className="text-xs font-mono text-red-400 hover:underline uppercase tracking-wider"
                            >
                              Revoke
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
