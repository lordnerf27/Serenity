import { NavLink } from 'react-router-dom'
import { Home, Wind, Moon, BarChart2, Sparkles } from 'lucide-react'

const tabs = [
  { to: '/',         icon: Home,     label: 'Home'     },
  { to: '/meditate', icon: Sparkles, label: 'Meditate' },
  { to: '/breathe',  icon: Wind,     label: 'Breathe'  },
  { to: '/sleep',    icon: Moon,     label: 'Sleep'    },
  { to: '/progress', icon: BarChart2,label: 'Progress' },
]

export default function BottomNav() {
  return (
    <nav className="glass border-t border-cream-200 safe-bottom flex-shrink-0">
      <div className="flex items-center justify-around h-16">
        {tabs.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-3 py-2 rounded-2xl transition-all duration-200 ${
                isActive
                  ? 'text-sage-500'
                  : 'text-stone-400'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span className={`transition-transform duration-200 ${isActive ? 'scale-110' : ''}`}>
                  <Icon size={22} strokeWidth={isActive ? 2 : 1.5} />
                </span>
                <span className={`text-[10px] font-medium tracking-wide ${isActive ? 'opacity-100' : 'opacity-60'}`}>
                  {label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
