import { useMemo, useState } from 'react'
import Table from './Table.tsx'
import ErrorBanner from './ErrorBanner.tsx'
import type { Influencer, NewInfluencer, Platform } from './influencers.ts'
import { useInfluencers } from './useInfluencers.ts'
import { verifyProfile as verifyProfileApi } from './mockApi.ts'

const platforms: Platform[] = ['Instagram', 'YouTube', 'TikTok', 'Twitter', 'LinkedIn']

export default function InfluencersPage() {
  const { data: influencerList, isLoading, error: influencerError, addInfluencer, deleteInfluencer } = useInfluencers()
  const [showAdd, setShowAdd] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    platform: 'Instagram' as Platform,
    followers: 0,
    engagementRate: 0,
    bio: '',
    country: '',
    category: '',
    avgPostsPerWeek: 0,
    contactEmail: '',
    profileUrl: '',
  })

  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationError, setVerificationError] = useState('')
  const [verified, setVerified] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [notification, setNotification] = useState('')
  const [search, setSearch] = useState('')
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | 'All'>('All')
  const [sortBy, setSortBy] = useState<'name' | 'followers' | 'engagement'>('followers')

  const computeActivitySummary = (inf: Influencer) => {
    const posts = Math.max(2, Math.round(inf.avgPostsPerWeek))
    const avgEng = inf.engagementRate
    const quality = avgEng >= 5 ? 'High' : avgEng >= 3 ? 'Medium' : 'Low'
    const lastActive = new Date()
    lastActive.setDate(lastActive.getDate() - Math.floor(Math.random() * 5))
    return {
      postsLastWeek: posts,
      averageEngagement: avgEng,
      quality,
      lastActivity: lastActive.toISOString().split('T')[0],
    }
  }

  const verifyProfile = async () => {
    if (!formData.profileUrl || !formData.profileUrl.trim()) {
      setVerificationError('Profile URL is required')
      return
    }
    if (!/^https?:\/\//i.test(formData.profileUrl)) {
      setVerificationError('Profile URL should start with http:// or https://')
      return
    }

    setIsVerifying(true)
    setVerificationError('')

    try {
      const result = await verifyProfileApi(formData.profileUrl, formData.platform)
      
      if (!result.verified) {
        setVerificationError('Verification failed: invalid profile')
        setVerified(false)
        return
      }

      setVerified(true)
      setNotification('Profile verified successfully. You can now add influencer.')
      setFormData((prev) => ({
        ...prev,
        followers: result.followers || prev.followers || 0,
        engagementRate: result.engagementRate || prev.engagementRate || 0,
        bio: result.bio || prev.bio,
      }))
    } catch (error) {
      setVerificationError('Unable to verify profile, please check URL and try again.')
      setVerified(false)
    } finally {
      setIsVerifying(false)
    }
  }

  const handleAddInfluencer = async () => {
    setSubmitError('')
    if (!verified) {
      setSubmitError('You must verify profile URL before adding influencer')
      return
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.name.trim()) {
      setSubmitError('Name is required')
      return
    }
    if (!formData.contactEmail.trim()) {
      setSubmitError('Contact email is required')
      return
    }
    if (!emailRegex.test(formData.contactEmail)) {
      setSubmitError('Enter a valid contact email')
      return
    }
    if (formData.followers <= 0 || formData.engagementRate <= 0) {
      setSubmitError('Followers and engagement rate must be positive')
      return
    }

    const newInfluencer: NewInfluencer = {
      name: formData.name,
      platform: formData.platform,
      followers: formData.followers,
      engagementRate: formData.engagementRate,
      bio: formData.bio,
      profileImage: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70) + 1}`,
      country: formData.country,
      category: formData.category,
      avgPostsPerWeek: formData.avgPostsPerWeek,
      contactEmail: formData.contactEmail,
      profileUrl: formData.profileUrl,
      growthData: [
        { date: '2026-01', followers: Math.max(0, formData.followers - 3000) },
        { date: '2026-02', followers: Math.max(0, formData.followers - 1000) },
        { date: '2026-03', followers: formData.followers },
      ],
      verified: true,
      isActive: true,
    }

    try {
      await addInfluencer(newInfluencer)
      setNotification(`Influencer ${newInfluencer.name} added successfully`)
      setShowAdd(false)
      setVerified(false)
      setFormData({
        name: '',
        platform: 'Instagram',
        followers: 0,
        engagementRate: 0,
        bio: '',
        country: '',
        category: '',
        avgPostsPerWeek: 0,
        contactEmail: '',
        profileUrl: '',
      })
    } catch (err) {
      setSubmitError((err as Error).message)
    }
  }

  const handleDeleteInfluencer = async (id: string) => {
    try {
      await deleteInfluencer(id)
      setNotification('Influencer deleted successfully')
    } catch (err) {
      setSubmitError((err as Error).message)
    }
  }

  const filteredSortedInfluencers = useMemo(() => {
    const sniff = search.toLowerCase()
    const filtered = influencerList.filter((influencer) => {
      const matchesName = influencer.name.toLowerCase().includes(sniff)
      const matchesPlatform = selectedPlatform === 'All' || influencer.platform === selectedPlatform
      return matchesName && matchesPlatform
    })
    return filtered.sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name)
      if (sortBy === 'followers') return b.followers - a.followers
      return b.engagementRate - a.engagementRate
    })
  }, [influencerList, search, selectedPlatform, sortBy])

  const rows = filteredSortedInfluencers.map((inf) => {
    const activity = computeActivitySummary(inf)
    return (
      <tr key={inf.id} className="border-t border-slate-200 hover:bg-slate-50">
        <td className="px-4 py-2">{inf.name}</td>
        <td className="px-4 py-2">{inf.platform}</td>
        <td className="px-4 py-2">{inf.followers.toLocaleString()}</td>
        <td className="px-4 py-2">{inf.engagementRate}%</td>
        <td className="px-4 py-2">
          <a className="text-sky-600 hover:underline" href={`mailto:${inf.contactEmail}`}>
            {inf.contactEmail}
          </a>
        </td>
        <td className="px-4 py-2">{activity.postsLastWeek}</td>
        <td className="px-4 py-2">{activity.quality}</td>
        <td className="px-4 py-2">{activity.lastActivity}</td>
        <td className="px-4 py-2">{inf.verified ? 'Verified' : 'Unverified'}</td>
        <td className="px-4 py-2">
          <button
            className="px-2 py-1 text-sm text-white bg-red-600 rounded hover:bg-red-700"
            onClick={() => handleDeleteInfluencer(String(inf.id))}
          >
            Delete
          </button>
        </td>
      </tr>
    )
  })

  return (
    <div className="p-4">
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Influencers Dashboard</h1>
        <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={() => setShowAdd(true)}>
          Add Influencer
        </button>
      </header>

      <div className="flex gap-2 mb-4 items-center">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name"
          className="border border-slate-300 rounded p-2"
        />
        <select className="select-dropdown border border-slate-300 rounded p-2" value={selectedPlatform} onChange={(e) => setSelectedPlatform(e.target.value as Platform | 'All')}>
          <option value="All">All Platforms</option>
          {platforms.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
        <select className="select-dropdown border border-slate-300 rounded p-2" value={sortBy} onChange={(e) => setSortBy(e.target.value as 'name' | 'followers' | 'engagement')}>
          <option value="name">Name</option>
          <option value="followers">Followers</option>
          <option value="engagement">Engagement</option>
        </select>
      </div>

      {isLoading && <div className="mb-2 p-2 bg-slate-100 text-slate-700 rounded">Loading influencers...</div>}
      {influencerError && <ErrorBanner message={influencerError} />}
      {notification && <div className="mb-2 p-2 bg-green-100 text-green-800 rounded">{notification}</div>}
      {submitError && <ErrorBanner message={submitError} />}

      <Table
        headers={['Name', 'Platform', 'Followers', 'Engagement%', 'Email', 'Posts/Wk', 'Quality', 'Last Active', 'Verified', 'Actions']}
        rows={rows}
      />

      {showAdd && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-xl shadow-lg">
            <h2 className="text-xl font-semibold mb-3">Add new influencer</h2>

            <div className="grid grid-cols-1 gap-4 mb-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                <input className="w-full border border-slate-300 rounded p-2" placeholder="Enter name" value={formData.name} onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Platform</label>
                <select className="w-full select-dropdown border border-slate-300 rounded p-2" value={formData.platform} onChange={(e) => setFormData((prev) => ({ ...prev, platform: e.target.value as Platform }))}>
                  <option value="" disabled selected>Select a platform</option>
                  {platforms.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Profile URL</label>
                <input className="w-full border border-slate-300 rounded p-2" placeholder="https://..." value={formData.profileUrl} onChange={(e) => setFormData((prev) => ({ ...prev, profileUrl: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Bio</label>
                <input className="w-full border border-slate-300 rounded p-2" placeholder="Enter bio" value={formData.bio} onChange={(e) => setFormData((prev) => ({ ...prev, bio: e.target.value }))} />
              </div>
              <button className="border border-slate-300 rounded p-2 bg-blue-600 text-white" onClick={verifyProfile} disabled={isVerifying}>
                {isVerifying ? 'Verifying...' : 'Verify Profile URL'}
              </button>
              {verificationError && <div className="text-red-700">{verificationError}</div>}
            </div>

            <div className="grid grid-cols-2 gap-4 mb-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Country</label>
                <input className="w-full border border-slate-300 rounded p-2" placeholder="Enter country" value={formData.country} onChange={(e) => setFormData((prev) => ({ ...prev, country: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                <input className="w-full border border-slate-300 rounded p-2" placeholder="Enter category" value={formData.category} onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Followers</label>
                <input className="w-full border border-slate-300 rounded p-2" placeholder="0" type="number" value={formData.followers} onChange={(e) => setFormData((prev) => ({ ...prev, followers: Number(e.target.value) }))} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Engagement Rate (%)</label>
                <input className="w-full border border-slate-300 rounded p-2" placeholder="0" type="number" value={formData.engagementRate} onChange={(e) => setFormData((prev) => ({ ...prev, engagementRate: Number(e.target.value) }))} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Avg Posts Per Week</label>
                <input className="w-full border border-slate-300 rounded p-2" placeholder="0" type="number" value={formData.avgPostsPerWeek} onChange={(e) => setFormData((prev) => ({ ...prev, avgPostsPerWeek: Number(e.target.value) }))} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Contact Email</label>
                <input className="w-full border border-slate-300 rounded p-2" placeholder="email@example.com" type="email" value={formData.contactEmail} onChange={(e) => setFormData((prev) => ({ ...prev, contactEmail: e.target.value }))} />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button className="rounded px-3 py-1 border" onClick={() => setShowAdd(false)}>Cancel</button>
              <button className="rounded px-3 py-1 bg-green-600 text-white" onClick={handleAddInfluencer}>
                Add Influencer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
