import { useEffect, useState } from 'react'

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function CardEditor({ topic }) {
  const [cards, setCards] = useState([])
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [difficulty, setDifficulty] = useState('medium')
  const [error, setError] = useState('')

  const loadCards = async () => {
    if (!topic) return
    try {
      const res = await fetch(`${API_BASE}/api/cards?topic_id=${topic._id}`)
      const data = await res.json()
      setCards(data)
    } catch (e) {
      setError(e.message)
    }
  }

  useEffect(() => { loadCards() }, [topic])

  const addCard = async (e) => {
    e.preventDefault()
    if (!question.trim() || !answer.trim()) return
    try {
      const res = await fetch(`${API_BASE}/api/cards`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic_id: topic._id, question, answer, difficulty })
      })
      if (!res.ok) throw new Error('Failed to create card')
      setQuestion('')
      setAnswer('')
      setDifficulty('medium')
      await loadCards()
    } catch (e) {
      setError(e.message)
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-white">Cards for: <span className="text-blue-300">{topic?.name || '—'}</span></h2>
        <p className="text-sm text-blue-200/80">Create question/answer cards</p>
      </div>

      {topic ? (
        <form onSubmit={addCard} className="space-y-3">
          <input value={question} onChange={(e)=>setQuestion(e.target.value)} placeholder="Question" className="w-full bg-slate-800/60 border border-blue-500/20 rounded px-3 py-2 text-white placeholder:text-blue-200/60" />
          <textarea value={answer} onChange={(e)=>setAnswer(e.target.value)} placeholder="Answer" className="w-full min-h-[100px] bg-slate-800/60 border border-blue-500/20 rounded px-3 py-2 text-white placeholder:text-blue-200/60" />

          <div className="flex items-center gap-3">
            <label className="text-blue-200/80 text-sm">Difficulty</label>
            <select value={difficulty} onChange={(e)=>setDifficulty(e.target.value)} className="bg-slate-800/60 border border-blue-500/20 rounded px-3 py-2 text-white">
              <option value="easy">easy</option>
              <option value="medium">medium</option>
              <option value="hard">hard</option>
            </select>
            <button className="ml-auto bg-blue-600 hover:bg-blue-500 text-white rounded px-4 py-2 transition">Add Card</button>
          </div>
        </form>
      ) : (
        <p className="text-blue-200/80">Select a topic to add cards.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {cards.map(c => (
          <div key={c._id} className="p-4 rounded border border-blue-500/20 bg-slate-800/40">
            <div className="text-blue-200/80 text-xs uppercase tracking-wide">{c.difficulty}</div>
            <div className="text-white font-medium mt-1">Q: {c.question}</div>
            <div className="text-blue-200 mt-1">A: {c.answer}</div>
          </div>
        ))}
      </div>

      {error && <p className="text-red-300 text-sm">{error}</p>}
    </div>
  )
}
