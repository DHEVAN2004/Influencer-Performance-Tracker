import { NavLink } from 'react-router-dom'
import {
  FiHome, FiUsers, FiFlag, FiSettings,
  FiFacebook, FiInstagram, FiCast, FiX,
  FiBarChart2, FiMessageSquare, FiBell, FiFileText, FiBriefcase,
} from 'react-icons/fi'
import { FaLinkedin, FaYoutube } from 'react-icons/fa'

const menu = [
  { label: 'Dashboard', path: '/', icon: FiHome },
  { label: 'Influencers', path: '/influencers', icon: FiUsers },
  { label: 'Campaigns', path: '/campaigns', icon: FiFlag },
  { label: 'Analytics', path: '/analytics', icon: FiBarChart2 },
  { label: 'Messages', path: '/messages', icon: FiMessageSquare },
  { label: 'Notifications', path: '/notifications', icon: FiBell },
  { label: 'Reports', path: '/reports', icon: FiFileText },
  { label: 'Brands', path: '/brands', icon: FiBriefcase },
  { label: 'Settings', path: '/settings', icon: FiSettings },
]

const platformMenu = [
  { label: 'Facebook', icon: FiFacebook },
  { label: 'Instagram', icon: FiInstagram },
  { label: 'TikTok', icon: FiCast },
  { label: 'X (Twitter)', icon: FiX },
  { label: 'LinkedIn', icon: FaLinkedin },
  { label: 'YouTube', icon: FaYoutube },
]

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Mobile overlay backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-gradient-to-b from-slate-100 to-white dark:from-slate-950 dark:to-slate-900 border-r border-slate-200 dark:border-slate-700 p-4 flex flex-col overflow-y-auto transform transition-transform duration-300 lg:static lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-sky-700 dark:text-sky-300">buzzd</h2>
            <p className="mt-1 text-xs uppercase font-semibold text-slate-500 dark:text-slate-400">Influencer performance</p>
          </div>
          <button onClick={onClose} className="lg:hidden p-1 rounded-md text-slate-500 hover:text-slate-700 dark:hover:text-slate-200">
            <FiX className="h-5 w-5" />
          </button>
        </div>

        <nav className="space-y-1 mb-6">
          {menu.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold ${
                    isActive
                      ? 'bg-sky-500 text-white shadow-lg'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`
                }
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            )
          })}
        </nav>

        <div className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-2">Platforms</div>
        <div className="space-y-2">
          {platformMenu.map((item) => {
            const Icon = item.icon
            return (
              <div
                key={item.label}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700"
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </div>
            )
          })}
        </div>

        <div className="mt-auto pt-4 border-t border-slate-200 dark:border-slate-700 text-xs text-slate-500 dark:text-slate-400">
          Use panel for campaign insights and content performance
        </div>
      </aside>
    </>
  )
}
