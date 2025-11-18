import { useEffect, useMemo, useState } from 'react'

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function StudySession({ topic }) {
  const [cards, setCards] = useState([])
  const [index, setIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState({ total: 0, correct: 0, accuracy: 0 })

  const current = cards[index] || null

  const load = async () => {
    if (!topic) return
    setLoading(true)
    const [cardsRes, progRes] = await Promise.all([
      fetch(`${API_BASE}/api/cards?topic_id=${topic._id}`),
      fetch(`${API_BASE}/api/progress?topic_id=${topic._id}`)
    ])
    const cardsData = await cardsRes.json()
    const progData = await progRes.json()
    setCards(cardsData)
    setStats(progData)
    setIndex(0)
    setShowAnswer(false)
    setLoading(false)
  }

  useEffect(() => { load() }, [topic])

  const answer = async (correct) => {
    if (!current) return
    await fetch(`${API_BASE}/api/answer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ card_id: current._id, topic_id: topic._id, correct })
    })
    await load()
    setIndex((i) => (i + 1) % Math.max(1, cards.length))
    setShowAnswer(false)
  }

  if (!topic) return <div className="text-blue-200/80">Select a topic to start studying.</div>

  if (loading) return <div className="text-blue-200">Loading...</div>

  if (cards.length === 0) return (
    <div className="text-blue-200/80">
      No cards yet for this topic. Add some cards first.
    </div>
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">Study</h2>
          <p className="text-sm text-blue-200/80">Cards in rotation: {cards.length}</p>
        </div>
        <div className="text-right">
          <div className="text-blue-200/80 text-sm">Total answers: {stats.total}</div>
          <div className="text-blue-200/80 text-sm">Correct: {stats.correct}</div>
          <div className="text-blue-200/80 text-sm">Accuracy: {(stats.accuracy*100).toFixed(0)}%</div>
        </div>
      </div>

      <div className="p-6 rounded-xl border border-blue-500/20 bg-slate-800/40">
        <div className="text-white text-xl font-medium">{current.question}</div>
        {showAnswer && <div className="text-blue-200 mt-4">{current.answer}</div>}
        <div className="mt-6 flex gap-3">
          <button onClick={()=>setShowAnswer(s=>!s)} className="bg-slate-700 hover:bg-slate-600 text-white rounded px-4 py-2 transition">
            {showAnswer ? 'Hide Answer' : 'Show Answer'}
          </button>
          <button onClick={()=>answer(false)} className="bg-red-600 hover:bg-red-500 text-white rounded px-4 py-2 transition">I was wrong</button>
          <button onClick={()=>answer(true)} className="bg-green-600 hover:bg-green-500 text-white rounded px-4 py-2 transition">I was right</button>
        </div>
      </div>
    </div>
  )
}
