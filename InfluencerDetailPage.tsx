import { useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import LineChart from './LineChart.tsx'
import ErrorBanner from './ErrorBanner.tsx'
import { FiUser, FiGlobe } from 'react-icons/fi'
import { influencers as defaultInfluencers, type Influencer } from './influencers.ts'

function getInfluencers(): Influencer[] {
  try {
    const stored = localStorage.getItem('influencerList')
    return stored ? JSON.parse(stored) : defaultInfluencers
  } catch {
    return defaultInfluencers
  }
}

export default function InfluencerDetailPage() {
  const { id } = useParams<{ id: string }>()
  const influencer = useMemo(() => getInfluencers().find((item) => String(item.id) === id), [id])

  if (!influencer) {
    return (
      <div className="space-y-4">
        <ErrorBanner message="Influencer not found." />
        <Link to="/influencers" className="text-sky-600 hover:underline text-sm">← Back to list</Link>
      </div>
    )
  }

  const dates = influencer.growthData.map((d) => d.date)
  const followers = influencer.growthData.map((d) => d.followers)

  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between gap-3 flex-wrap">
        <h2 className="text-2xl font-semibold">{influencer.name}</h2>
        <Link to="/influencers" className="text-sky-600 hover:underline text-sm">← Back to influencers</Link>
      </header>

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-4 flex-wrap">
            <img src={influencer.profileImage} alt={`${influencer.name} profile`} className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-2 border-sky-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="font-medium text-slate-800 dark:text-slate-100 flex items-center gap-2"><FiUser className="w-4 h-4 flex-shrink-0" /> {influencer.platform}</p>
              <p className="text-sm text-slate-600 dark:text-slate-300 flex items-center gap-2"><FiGlobe className="w-4 h-4 flex-shrink-0" /> {influencer.bio}</p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
            <div className="rounded-lg bg-slate-50 dark:bg-slate-800 p-3">
              <p className="text-xs text-slate-500">Followers</p>
              <p className="text-xl font-bold">{influencer.followers.toLocaleString()}</p>
            </div>
            <div className="rounded-lg bg-slate-50 dark:bg-slate-800 p-3">
              <p className="text-xs text-slate-500">Engagement</p>
              <p className="text-xl font-bold">{influencer.engagementRate}%</p>
            </div>
            <div className="rounded-lg bg-slate-50 dark:bg-slate-800 p-3">
              <p className="text-xs text-slate-500">Avg Posts/Week</p>
              <p className="text-xl font-bold">{influencer.avgPostsPerWeek}</p>
            </div>
          </div>

          <div className="mt-4 space-y-2 text-sm">
            <p className="text-slate-600 dark:text-slate-300">Country: {influencer.country}</p>
            <p className="text-slate-600 dark:text-slate-300">Category: {influencer.category}</p>
            <p className="text-slate-600 dark:text-slate-300">
              Contact: <a className="text-sky-600 dark:text-sky-300" href={`mailto:${influencer.contactEmail}`}>{influencer.contactEmail}</a>
            </p>
          </div>
        </div>

        <LineChart labels={dates} values={followers} title="Follower Growth" />
      </section>
    </div>
  )
}
