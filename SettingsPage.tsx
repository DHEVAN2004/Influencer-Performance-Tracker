import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import {
  FiMoon,
  FiSun,
  FiLogOut,
  FiUser,
  FiShield,
  FiBell,
  FiGlobe,
  FiClock,
  FiDownload,
  FiTrash2,
  FiMail,
  FiPhone,
  FiLink,
  FiAtSign,
  FiHelpCircle,
} from 'react-icons/fi'
import { useAuth } from './AuthContext.tsx'

interface SettingsPageProps {
  isDarkMode: boolean
  onToggleTheme: () => void
}

export default function SettingsPage({ isDarkMode, onToggleTheme }: SettingsPageProps) {
  const { user, logout, updateProfile } = useAuth()
  const [name, setName] = useState(user?.name ?? '')
  const [username, setUsername] = useState(user?.email?.split('@')[0] ?? '')
  const [email, setEmail] = useState(user?.email ?? '')
  const [phone, setPhone] = useState('')
  const [bio, setBio] = useState('')
  const [website, setWebsite] = useState('')
  const [instagram, setInstagram] = useState('')
  const [tiktok, setTiktok] = useState('')
  const [youtube, setYoutube] = useState('')
  const [linkedIn, setLinkedIn] = useState('')
  const [profilePhoto, setProfilePhoto] = useState('')
  const [supportMessage, setSupportMessage] = useState('')
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [smsNotifications, setSmsNotifications] = useState(false)
  const [campaignNotifications, setCampaignNotifications] = useState(true)
  const [messageNotifications, setMessageNotifications] = useState(true)
  const [themePreference, setThemePreference] = useState<'light' | 'dark' | 'system'>(isDarkMode ? 'dark' : 'light')
  const [dashboardView, setDashboardView] = useState<'overview' | 'campaigns' | 'analytics'>('overview')
  const [language, setLanguage] = useState('English')
  const [timeFormat, setTimeFormat] = useState<'12h' | '24h'>('12h')
  const [dateFormat, setDateFormat] = useState('MM/DD/YYYY')
  const [saveMessage, setSaveMessage] = useState('')
  const [passwordMessage, setPasswordMessage] = useState('')
  const [privacyMessage, setPrivacyMessage] = useState('')

  useEffect(() => {
    if (user) {
      setName(user.name)
      setEmail(user.email)
      setUsername(user.email.split('@')[0])
      setProfilePhoto(user.profilePhoto ?? '')
    }
  }, [user])

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handlePhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setSupportMessage('Please choose a valid image file.')
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      const dataUrl = reader.result as string
      setProfilePhoto(dataUrl)
      updateProfile({ profilePhoto: dataUrl })
      setSupportMessage('Profile photo uploaded successfully.')
      window.setTimeout(() => setSupportMessage(''), 3000)
    }
    reader.readAsDataURL(file)
  }

  const handleManageApps = () => {
    setSupportMessage('Connected apps management is not available in this demo.')
    window.setTimeout(() => setSupportMessage(''), 3000)
  }

  const handleViewHelpCenter = () => {
    window.open('https://example.com/help', '_blank')
    setSupportMessage('Help center opened in a new tab.')
    window.setTimeout(() => setSupportMessage(''), 3000)
  }

  const handleSendFeedback = () => {
    window.open('mailto:support@influencerapp.com?subject=Influencer%20Performance%20Tracker%20Feedback', '_blank')
  }

  const handleSaveProfile = () => {
    if (!name.trim() || !email.trim()) {
      setSaveMessage('Name and email cannot be empty.')
      return
    }

    updateProfile({ name: name.trim(), email: email.trim() })
    setSaveMessage('Profile updated successfully.')
    window.setTimeout(() => setSaveMessage(''), 3000)
  }

  const handleChangePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordMessage('Please fill in all password fields.')
      return
    }

    if (newPassword !== confirmPassword) {
      setPasswordMessage('New password and confirmation do not match.')
      return
    }

    setPasswordMessage('Password updated successfully.')
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
    window.setTimeout(() => setPasswordMessage(''), 3000)
  }

  const handleExportData = () => {
    setPrivacyMessage('Your data export was initiated. Check your email for the download link.')
    window.setTimeout(() => setPrivacyMessage(''), 4000)
  }

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      setPrivacyMessage('Account deletion is disabled in this demo.')
      window.setTimeout(() => setPrivacyMessage(''), 4000)
    }
  }

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-semibold">Settings</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-2xl">
          Manage your profile, security, notifications, preferences, privacy, and support details from one place.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.5fr_0.9fr]">
        <div className="space-y-6">
          <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-lg font-semibold">Profile</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Update your personal details and social links.</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative h-12 w-12 overflow-hidden rounded-full bg-gradient-to-br from-sky-500 to-indigo-500 text-white flex items-center justify-center font-semibold text-lg">
                  {profilePhoto ? (
                    <img src={profilePhoto} alt="Profile" className="h-full w-full object-cover" />
                  ) : (
                    user?.name.slice(0, 2).toUpperCase()
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={handleUploadClick}
                  className="rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  Upload photo
                </button>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Display Name
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-2 w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-slate-100"
                />
              </label>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Username
                <div className="mt-2 flex items-center gap-2">
                  <span className="inline-flex items-center rounded-l-lg border border-r-0 border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 px-3 text-slate-500">@</span>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full rounded-r-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-slate-100"
                  />
                </div>
              </label>
            </div>

            <div className="grid gap-4 md:grid-cols-2 mt-4">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Email
                <div className="mt-2 flex items-center gap-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2">
                  <FiMail className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent text-sm text-slate-900 dark:text-slate-100 outline-none"
                  />
                </div>
              </label>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Phone Number
                <div className="mt-2 flex items-center gap-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2">
                  <FiPhone className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-transparent text-sm text-slate-900 dark:text-slate-100 outline-none"
                  />
                </div>
              </label>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Bio
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="mt-2 w-full min-h-[112px] rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 resize-none"
                />
              </label>
            </div>

            <div className="grid gap-4 md:grid-cols-2 mt-4">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Website
                <div className="mt-2 flex items-center gap-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2">
                  <FiLink className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                  <input
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://"
                    className="w-full bg-transparent text-sm text-slate-900 dark:text-slate-100 outline-none"
                  />
                </div>
              </label>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Instagram
                <div className="mt-2 flex items-center gap-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2">
                  <FiAtSign className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                  <input
                    type="text"
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                    placeholder="username"
                    className="w-full bg-transparent text-sm text-slate-900 dark:text-slate-100 outline-none"
                  />
                </div>
              </label>
            </div>

            <div className="grid gap-4 md:grid-cols-2 mt-4">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                TikTok
                <div className="mt-2 flex items-center gap-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2">
                  <FiAtSign className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                  <input
                    type="text"
                    value={tiktok}
                    onChange={(e) => setTiktok(e.target.value)}
                    placeholder="username"
                    className="w-full bg-transparent text-sm text-slate-900 dark:text-slate-100 outline-none"
                  />
                </div>
              </label>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                YouTube
                <div className="mt-2 flex items-center gap-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2">
                  <FiAtSign className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                  <input
                    type="text"
                    value={youtube}
                    onChange={(e) => setYoutube(e.target.value)}
                    placeholder="channel"
                    className="w-full bg-transparent text-sm text-slate-900 dark:text-slate-100 outline-none"
                  />
                </div>
              </label>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                LinkedIn
                <div className="mt-2 flex items-center gap-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2">
                  <FiLink className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                  <input
                    type="text"
                    value={linkedIn}
                    onChange={(e) => setLinkedIn(e.target.value)}
                    placeholder="linkedin.com/in/username"
                    className="w-full bg-transparent text-sm text-slate-900 dark:text-slate-100 outline-none"
                  />
                </div>
              </label>
            </div>

            {saveMessage && <p className="mt-3 text-sm text-sky-700 dark:text-sky-300">{saveMessage}</p>}
            <div className="mt-5 flex justify-end">
              <button
                onClick={handleSaveProfile}
                className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700"
              >
                Save Profile
              </button>
            </div>
          </section>

          <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-lg font-semibold">Security</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Adjust your password and account protection settings.</p>
              </div>
              <FiShield className="h-5 w-5 text-slate-500 dark:text-slate-400" />
            </div>

            <div className="grid gap-4">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Current Password
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="mt-2 w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-slate-100"
                />
              </label>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                New Password
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="mt-2 w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-slate-100"
                />
              </label>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Confirm Password
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="mt-2 w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-slate-100"
                />
              </label>
            </div>

            <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-4">
              <div>
                <p className="font-medium text-slate-800 dark:text-slate-100">Two-factor authentication</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Enable an extra layer of security for your account.</p>
              </div>
              <button
                onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                className={`rounded-full px-4 py-2 text-sm font-medium ${twoFactorEnabled ? 'bg-sky-600 text-white' : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200'}`}
              >
                {twoFactorEnabled ? 'Enabled' : 'Enable'}
              </button>
            </div>

            {passwordMessage && <p className="mt-4 text-sm text-sky-700 dark:text-sky-300">{passwordMessage}</p>}
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleChangePassword}
                className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
              >
                Update Password
              </button>
            </div>
          </section>

          <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-lg font-semibold">Notifications</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Control how you receive updates from the platform.</p>
              </div>
              <FiBell className="h-5 w-5 text-slate-500 dark:text-slate-400" />
            </div>

            <div className="space-y-3">
              <label className="flex items-center justify-between rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-3">
                <span>
                  <span className="block font-medium text-slate-800 dark:text-slate-100">Email notifications</span>
                  <span className="text-sm text-slate-500 dark:text-slate-400">Get email updates for important activity.</span>
                </span>
                <input
                  type="checkbox"
                  checked={emailNotifications}
                  onChange={(e) => setEmailNotifications(e.target.checked)}
                  className="h-4 w-4 text-sky-600"
                />
              </label>

              <label className="flex items-center justify-between rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-3">
                <span>
                  <span className="block font-medium text-slate-800 dark:text-slate-100">SMS notifications</span>
                  <span className="text-sm text-slate-500 dark:text-slate-400">Receive text alerts for time-sensitive messages.</span>
                </span>
                <input
                  type="checkbox"
                  checked={smsNotifications}
                  onChange={(e) => setSmsNotifications(e.target.checked)}
                  className="h-4 w-4 text-sky-600"
                />
              </label>

              <label className="flex items-center justify-between rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-3">
                <span>
                  <span className="block font-medium text-slate-800 dark:text-slate-100">Campaign updates</span>
                  <span className="text-sm text-slate-500 dark:text-slate-400">Receive campaign invitations and status changes.</span>
                </span>
                <input
                  type="checkbox"
                  checked={campaignNotifications}
                  onChange={(e) => setCampaignNotifications(e.target.checked)}
                  className="h-4 w-4 text-sky-600"
                />
              </label>

              <label className="flex items-center justify-between rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-3">
                <span>
                  <span className="block font-medium text-slate-800 dark:text-slate-100">Message alerts</span>
                  <span className="text-sm text-slate-500 dark:text-slate-400">Stay notified when new messages arrive.</span>
                </span>
                <input
                  type="checkbox"
                  checked={messageNotifications}
                  onChange={(e) => setMessageNotifications(e.target.checked)}
                  className="h-4 w-4 text-sky-600"
                />
              </label>
            </div>
          </section>

          <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-lg font-semibold">Preferences</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Customize the app behavior and interface.</p>
              </div>
              <FiGlobe className="h-5 w-5 text-slate-500 dark:text-slate-400" />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Theme
                <select
                  value={themePreference}
                  onChange={(e) => setThemePreference(e.target.value as 'light' | 'dark' | 'system')}
                  className="mt-2 w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-slate-100"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="system">System</option>
                </select>
              </label>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Default dashboard view
                <select
                  value={dashboardView}
                  onChange={(e) => setDashboardView(e.target.value as 'overview' | 'campaigns' | 'analytics')}
                  className="mt-2 w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-slate-100"
                >
                  <option value="overview">Overview</option>
                  <option value="campaigns">Campaigns</option>
                  <option value="analytics">Analytics</option>
                </select>
              </label>
            </div>

            <div className="mt-4 flex gap-3 items-center">
              <button
                type="button"
                onClick={onToggleTheme}
                className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
              >
                {isDarkMode ? <FiSun className="h-4 w-4" /> : <FiMoon className="h-4 w-4" />} Toggle theme
              </button>
              <span className="text-sm text-slate-500 dark:text-slate-400">Current: {themePreference}</span>
            </div>

            <div className="grid gap-4 md:grid-cols-2 mt-4">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Language
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="mt-2 w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-slate-100"
                >
                  <option value="English">English</option>
                  <option value="Spanish">Spanish</option>
                  <option value="French">French</option>
                </select>
              </label>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Time format
                <div className="mt-2 flex items-center gap-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2">
                  <FiClock className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                  <select
                    value={timeFormat}
                    onChange={(e) => setTimeFormat(e.target.value as '12h' | '24h')}
                    className="w-full bg-transparent text-sm text-slate-900 dark:text-slate-100 outline-none"
                  >
                    <option value="12h">12-hour</option>
                    <option value="24h">24-hour</option>
                  </select>
                </div>
              </label>
            </div>

            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mt-4">
              Date format
              <select
                value={dateFormat}
                onChange={(e) => setDateFormat(e.target.value)}
                className="mt-2 w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-slate-100"
              >
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </select>
            </label>
          </section>

          <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-lg font-semibold">Privacy & data</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Manage data sharing, exports, and account removal.</p>
              </div>
              <FiShield className="h-5 w-5 text-slate-500 dark:text-slate-400" />
            </div>

            <div className="space-y-3">
              <label className="flex items-center justify-between rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-3">
                <span>
                  <span className="block font-medium text-slate-800 dark:text-slate-100">Data sharing</span>
                  <span className="text-sm text-slate-500 dark:text-slate-400">Share anonymous usage data to improve the product.</span>
                </span>
                <input type="checkbox" className="h-4 w-4 text-sky-600" defaultChecked />
              </label>

              <label className="flex items-center justify-between rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-3">
                <span>
                  <span className="block font-medium text-slate-800 dark:text-slate-100">Connected apps</span>
                  <span className="text-sm text-slate-500 dark:text-slate-400">Review third-party services linked to your account.</span>
                </span>
                <button
                  type="button"
                  onClick={handleManageApps}
                  className="rounded-full bg-slate-200 px-3 py-1 text-sm text-slate-700 dark:bg-slate-700 dark:text-slate-200"
                >
                  Manage
                </button>
              </label>
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button
                onClick={handleExportData}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700"
              >
                <FiDownload className="h-4 w-4" /> Export data
              </button>
              <button
                onClick={handleDeleteAccount}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-rose-50 px-4 py-2 text-sm font-medium text-rose-600 hover:bg-rose-100 dark:bg-rose-950/50 dark:text-rose-300 dark:hover:bg-rose-900"
              >
                <FiTrash2 className="h-4 w-4" /> Delete account
              </button>
            </div>
            {privacyMessage && <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">{privacyMessage}</p>}
          </section>
        </div>

        <aside className="space-y-6">
          <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Account summary</h3>
              <FiUser className="h-5 w-5 text-slate-500 dark:text-slate-400" />
            </div>
            <div className="space-y-4">
              <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-4">
                <p className="text-sm text-slate-500 dark:text-slate-400">Name</p>
                <p className="font-medium text-slate-900 dark:text-slate-100">{name || 'Not set'}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-4">
                <p className="text-sm text-slate-500 dark:text-slate-400">Email</p>
                <p className="font-medium text-slate-900 dark:text-slate-100">{email || 'Not set'}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-4">
                <p className="text-sm text-slate-500 dark:text-slate-400">Theme</p>
                <p className="font-medium text-slate-900 dark:text-slate-100">{themePreference}</p>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={logout}
                className="inline-flex items-center gap-2 rounded-lg bg-rose-50 px-4 py-2 text-sm font-medium text-rose-600 hover:bg-rose-100 dark:bg-rose-950/50 dark:text-rose-300 dark:hover:bg-rose-900"
              >
                <FiLogOut className="h-4 w-4" /> Sign out
              </button>
            </div>
          </section>

          <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Support</h3>
              <FiHelpCircle className="h-5 w-5 text-slate-500 dark:text-slate-400" />
            </div>
            <div className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
              <p>Help center and FAQs for everything you need.</p>
              <p>Contact support if you need assistance with your account.</p>
              <p>App version: <span className="font-medium text-slate-900 dark:text-slate-100">1.0.0</span></p>
            </div>
            <div className="mt-4 flex flex-col gap-3">
              <button
                type="button"
                onClick={handleViewHelpCenter}
                className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
              >
                View Help Center
              </button>
              <button
                type="button"
                onClick={handleSendFeedback}
                className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
              >
                Send feedback
              </button>
            </div>
            {supportMessage && <p className="mt-4 text-sm text-sky-700 dark:text-sky-300">{supportMessage}</p>}
          </section>
        </aside>
      </div>
    </div>
  )
}
