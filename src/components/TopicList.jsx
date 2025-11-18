import { useEffect, useState } from 'react'

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function TopicList({ selectedTopicId, onSelect }) {
  const [topics, setTopics] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  const loadTopics = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${API_BASE}/api/topics`)
      const data = await res.json()
      setTopics(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTopics()
  }, [])

  const createTopic = async (e) => {
    e.preventDefault()
    if (!name.trim()) return
    try {
      const res = await fetch(`${API_BASE}/api/topics`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description })
      })
      if (!res.ok) throw new Error('Failed to create topic')
      setName('')
      setDescription('')
      await loadTopics()
    } catch (e) {
      setError(e.message)
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-white">Topics</h2>
        <p className="text-sm text-blue-200/80">Create and pick a topic to study</p>
      </div>

      <form onSubmit={createTopic} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <input value={name} onChange={(e)=>setName(e.target.value)} placeholder="Topic name" className="bg-slate-800/60 border border-blue-500/20 rounded px-3 py-2 text-white placeholder:text-blue-200/60" />
        <input value={description} onChange={(e)=>setDescription(e.target.value)} placeholder="Description (optional)" className="bg-slate-800/60 border border-blue-500/20 rounded px-3 py-2 text-white placeholder:text-blue-200/60 sm:col-span-2" />
        <button className="bg-blue-600 hover:bg-blue-500 text-white rounded px-4 py-2 transition">Add</button>
      </form>

      {error && <p className="text-red-300 text-sm">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {loading ? (
          <div className="text-blue-200">Loading...</div>
        ) : topics.length === 0 ? (
          <p className="text-blue-200/80">No topics yet. Create one above.</p>
        ) : (
          topics.map(t => (
            <button key={t._id} onClick={()=>onSelect && onSelect(t)} className={`text-left p-4 rounded border transition ${selectedTopicId===t._id? 'border-blue-400 bg-blue-500/10' : 'border-blue-500/20 hover:border-blue-400/60 bg-slate-800/40'}`}>
              <div className="text-white font-medium">{t.name}</div>
              {t.description && <div className="text-blue-200/80 text-sm">{t.description}</div>}
            </button>
          ))
        )}
      </div>
    </div>
  )
}
