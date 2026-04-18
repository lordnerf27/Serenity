import { Outlet } from 'react-router-dom'
import BottomNav from './BottomNav'

export default function AppShell() {
  return (
    <div className="flex flex-col h-full max-w-md mx-auto relative bg-cream-50 shadow-card">
      <main className="flex-1 scrollable">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  )
}
