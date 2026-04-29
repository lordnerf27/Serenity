import { useState, useEffect } from 'react'
import { X, Download } from 'lucide-react'

/**
 * PWAInstallBanner
 * Listens for the browser's beforeinstallprompt event and shows a subtle
 * banner prompting the user to add the app to their home screen.
 * Dismissed state is persisted in localStorage so it only shows once.
 */
export default function PWAInstallBanner() {
  const [prompt, setPrompt]       = useState(null)
  const [visible, setVisible]     = useState(false)
  const [installed, setInstalled] = useState(false)

  useEffect(() => {
    if (localStorage.getItem('serenity_pwa_dismissed')) return
    if (window.matchMedia('(display-mode: standalone)').matches) return // already installed

    const handler = (e) => {
      e.preventDefault()
      setPrompt(e)
      setVisible(true)
    }

    window.addEventListener('beforeinstallprompt', handler)
    window.addEventListener('appinstalled', () => setInstalled(true))
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const install = async () => {
    if (!prompt) return
    prompt.prompt()
    const { outcome } = await prompt.userChoice
    if (outcome === 'accepted') setInstalled(true)
    dismiss()
  }

  const dismiss = () => {
    localStorage.setItem('serenity_pwa_dismissed', '1')
    setVisible(false)
  }

  if (!visible || installed) return null

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 bg-white rounded-3xl shadow-card p-4 flex items-center gap-3 border border-stone-100">
      <div className="w-10 h-10 rounded-2xl bg-sage-300/20 flex items-center justify-center flex-shrink-0">
        <span className="text-xl">🌿</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-stone-800">Add to home screen</p>
        <p className="text-xs text-stone-400 mt-0.5">Use Serenity like a native app</p>
      </div>
      <button
        onClick={install}
        className="flex-shrink-0 bg-sage-400 text-white text-xs font-semibold rounded-xl px-3 py-2 flex items-center gap-1 active:scale-95 transition-transform"
      >
        <Download size={12} />
        Install
      </button>
      <button onClick={dismiss} className="flex-shrink-0 text-stone-300 active:opacity-60">
        <X size={16} />
      </button>
    </div>
  )
}
