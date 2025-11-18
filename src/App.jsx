import { useState } from 'react'
import TopicList from './components/TopicList'
import CardEditor from './components/CardEditor'
import StudySession from './components/StudySession'

function App() {
  const [selected, setSelected] = useState(null)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),transparent_50%)]"></div>

      <div className="relative min-h-screen p-6 sm:p-10">
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <img src="/flame-icon.svg" alt="Flames" className="w-10 h-10" />
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Study App</h1>
          </div>
          <a href="/test" className="text-blue-300 hover:text-white transition text-sm">Check Backend</a>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 p-4 rounded-2xl border border-blue-500/20 bg-slate-900/40">
            <TopicList selectedTopicId={selected?._id} onSelect={setSelected} />
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="p-4 rounded-2xl border border-blue-500/20 bg-slate-900/40">
              <CardEditor topic={selected} />
            </div>
            <div className="p-4 rounded-2xl border border-blue-500/20 bg-slate-900/40">
              <StudySession topic={selected} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
