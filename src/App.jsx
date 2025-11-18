import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom'
import { supabase } from './lib/supabaseClient'
import { Sun, Moon, Search, Upload, User, LogIn } from 'lucide-react'

function useTheme() {
  const [theme, setTheme] = useState(() => localStorage.getItem('tm-theme') || 'light')
  useEffect(() => {
    localStorage.setItem('tm-theme', theme)
    const root = document.documentElement
    if (theme === 'dark') root.classList.add('dark')
    else root.classList.remove('dark')
  }, [theme])
  return { theme, setTheme }
}

function Shell({ children }) {
  const { theme, setTheme } = useTheme()
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen((v) => !v)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#0E0E0E] dark:bg-[#0E0E10] dark:text-[#E4E4E7] transition-colors">
      <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-[#18181B]/60 border-b border-[#E0E0E0] dark:border-[#27272A]">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-gradient-to-tr from-[#5B4B8A] to-[#9F8EE2]" />
            <span className="font-semibold">TutorMind</span>
          </Link>
          <div className="ml-auto flex items-center gap-2">
            <button onClick={() => setOpen(true)} className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-md bg-[#FFFFFF] dark:bg-[#18181B] border border-[#E0E0E0] dark:border-[#27272A] text-sm">
              <Search size={16} />
              <span className="text-[#5E5E5E] dark:text-[#A1A1AA]">Search (Ctrl/⌘ K)</span>
            </button>
            <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} className="p-2 rounded-md border border-[#E0E0E0] dark:border-[#27272A] bg-[#FFFFFF] dark:bg-[#18181B]">
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>
            <Link to="/auth" className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-[#5B4B8A] text-white">
              <LogIn size={16} /> Sign in
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {children}
      </main>

      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40" onClick={() => setOpen(false)}>
          <div className="w-full max-w-xl" onClick={(e) => e.stopPropagation()}>
            <div className="rounded-xl border border-[#E0E0E0] dark:border-[#27272A] bg-white dark:bg-[#18181B]">
              <div className="flex items-center gap-2 px-3 py-2 border-b border-[#E0E0E0] dark:border-[#27272A]">
                <Search size={16} />
                <input value={query} onChange={(e)=>setQuery(e.target.value)} autoFocus placeholder="Search courses, notes, users..." className="w-full bg-transparent outline-none py-2" />
              </div>
              <div className="p-3 text-sm text-[#5E5E5E] dark:text-[#A1A1AA]">Start typing to search. Press Enter to open the first result.</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function Home() {
  return (
    <div className="space-y-8">
      <section className="rounded-2xl p-6 border border-[#E0E0E0] dark:border-[#27272A] bg-white dark:bg-[#18181B]">
        <h2 className="text-2xl font-bold">Welcome to TutorMind</h2>
        <p className="text-[#5E5E5E] dark:text-[#A1A1AA] mt-2">Upload study notes, get AI-powered summaries and quizzes, and connect with peers at FUTA.</p>
        <div className="mt-4 flex gap-3">
          <Link to="/upload" className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-[#5B4B8A] text-white"><Upload size={16}/> Upload notes</Link>
          <Link to="/notes" className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-[#E0E0E0] dark:border-[#27272A]">Discover notes</Link>
        </div>
      </section>

      <section className="grid sm:grid-cols-2 gap-4">
        <div className="rounded-xl p-5 border border-[#E0E0E0] dark:border-[#27272A] bg-white dark:bg-[#18181B]">
          <h3 className="font-semibold">Note of the week</h3>
          <p className="text-sm text-[#5E5E5E] dark:text-[#A1A1AA]">Featured by reputation and ratings.</p>
        </div>
        <div className="rounded-xl p-5 border border-[#E0E0E0] dark:border-[#27272A] bg-white dark:bg-[#18181B]">
          <h3 className="font-semibold">Continue studying</h3>
          <p className="text-sm text-[#5E5E5E] dark:text-[#A1A1AA]">Pick up where you left off.</p>
        </div>
      </section>
    </div>
  )
}

function Auth() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const signInWithMagicLink = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    const { error } = await supabase.auth.signInWithOtp({ email })
    setLoading(false)
    setMessage(error ? error.message : 'Check your email for the magic link')
  }

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' })
    if (error) alert(error.message)
  }

  return (
    <div className="max-w-md mx-auto rounded-2xl p-6 border border-[#E0E0E0] dark:border-[#27272A] bg-white dark:bg-[#18181B]">
      <h2 className="text-xl font-semibold mb-4">Sign in</h2>
      <button onClick={signInWithGoogle} className="w-full mb-3 px-4 py-2 rounded-md bg-[#0F9D58] text-white">Continue with Google</button>
      <div className="text-center text-xs text-[#5E5E5E] dark:text-[#A1A1AA] mb-3">or</div>
      <form onSubmit={signInWithMagicLink} className="space-y-3">
        <input value={email} onChange={(e)=>setEmail(e.target.value)} type="email" placeholder="name@futa.edu.ng" className="w-full px-3 py-2 rounded-md border border-[#E0E0E0] dark:border-[#27272A] bg-transparent" required />
        <button type="submit" disabled={loading} className="w-full px-4 py-2 rounded-md bg-[#5B4B8A] text-white">{loading ? 'Sending...' : 'Send magic link'}</button>
      </form>
      {message && <p className="mt-3 text-sm">{message}</p>}
    </div>
  )
}

function Upload() {
  return (
    <div className="rounded-2xl p-6 border border-[#E0E0E0] dark:border-[#27272A] bg-white dark:bg-[#18181B]">
      <h2 className="text-xl font-semibold mb-4">Upload notes</h2>
      <p className="text-sm text-[#5E5E5E] dark:text-[#A1A1AA]">Supabase integration coming next. We’ll do client-side SHA-256 dedupe and send to Storage.</p>
    </div>
  )
}

function Notes() {
  return (
    <div className="rounded-2xl p-6 border border-[#E0E0E0] dark:border-[#27272A] bg-white dark:bg-[#18181B]">
      <h2 className="text-xl font-semibold mb-4">Discover notes</h2>
      <p className="text-sm text-[#5E5E5E] dark:text-[#A1A1AA]">Search and filters will appear here.
      </p>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Shell>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/notes" element={<Notes />} />
        </Routes>
      </Shell>
    </BrowserRouter>
  )
}
