import { FiSearch, FiSun, FiMoon, FiMenu, FiLogOut } from 'react-icons/fi'
import { useAuth } from './AuthContext.tsx'

interface NavbarProps {
  title: string
  onToggleTheme: () => void
  isDarkMode: boolean
  onToggleMenu?: () => void
}

export default function Navbar({ title, onToggleTheme, isDarkMode, onToggleMenu }: NavbarProps) {
  const { user, logout } = useAuth()

  return (
    <header className="flex items-center justify-between gap-4 px-4 py-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur border-b border-slate-200 dark:border-slate-700 shadow-sm sticky top-0 z-30">
      <div className="flex items-center gap-3 min-w-0">
        <button onClick={onToggleMenu} className="lg:hidden p-1 rounded-md text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex-shrink-0">
          <FiMenu className="h-5 w-5" />
        </button>
        <div className="w-10 h-10 rounded-xl bg-sky-600 text-white font-bold flex items-center justify-center flex-shrink-0">I</div>
        <div className="hidden sm:block min-w-0">
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 truncate">{title}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">Influencer analytics dashboard</p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <div className="relative hidden md:block">
          <FiSearch className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            placeholder="Search influencers, campaigns..."
            className="pl-8 pr-3 py-2 w-48 lg:w-64 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-700 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-400"
          />
        </div>

        <button
          onClick={onToggleTheme}
          className="px-2 sm:px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-600 flex items-center gap-1 sm:gap-2"
        >
          {isDarkMode ? <FiSun className="h-4 w-4" /> : <FiMoon className="h-4 w-4" />}
          <span className="hidden sm:inline text-sm">{isDarkMode ? 'Light' : 'Dark'}</span>
        </button>

        <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gradient-to-br from-sky-500 to-indigo-500 text-white flex items-center justify-center text-xs sm:text-sm font-semibold flex-shrink-0">
          {user ? user.name.slice(0, 2).toUpperCase() : 'MJ'}
        </div>

        <button
          onClick={logout}
          title="Logout"
          className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-600 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950 dark:hover:text-rose-400"
        >
          <FiLogOut className="h-4 w-4" />
        </button>
      </div>
    </header>
  )
}
