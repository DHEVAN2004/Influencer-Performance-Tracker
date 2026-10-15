import { useMemo, useState } from 'react'
import Card from './Card.tsx'
import BarChart from './BarChart.tsx'
import LineChart from './LineChart.tsx'
import Spinner from './Spinner.tsx'
import ErrorBanner from './ErrorBanner.tsx'
import { FiUsers, FiTrendingUp, FiEye } from 'react-icons/fi'
import { topPosts } from './topPosts.ts'
import { useInfluencers } from './useInfluencers.ts'
import { useCampaigns } from './useCampaigns.ts'

export default function DashboardPage() {
  const [range, setRange] = useState<'7d' | '30d' | '90d'>('7d')
  const [category, setCategory] = useState<string>('All')
  const { data: influencers, isLoading: influencersLoading, error: influencersError } = useInfluencers()
  const { data: campaigns, isLoading: campaignsLoading, error: campaignsError } = useCampaigns()

  // Get unique categories
  const categories = useMemo(() => {
    const cats = ['All', ...new Set(influencers.map((inf) => inf.category))]
    return cats
  }, [influencers])

  // Filter influencers by category
  const filteredInfluencers = useMemo(() => {
    return category === 'All' ? influencers : influencers.filter((inf) => inf.category === category)
  }, [influencers, category])

  const totalInfluencers = filteredInfluencers.length
  const averageEngagement = Number(
    (filteredInfluencers.reduce((sum, item) => sum + item.engagementRate, 0) / Math.max(1, totalInfluencers)).toFixed(1),
  )
  const totalReach = filteredInfluencers.reduce((sum, item) => sum + item.followers, 0)

  // Range-based calculations
  const rangeMultipliers = { '7d': 1, '30d': 1.05, '90d': 1.12 }
  const rangeMultiplier = rangeMultipliers[range]
  const projectedReach = Math.round(totalReach * rangeMultiplier)

  // Filter top posts to only show posts from actual influencers
  const validInfluencerNames = new Set(filteredInfluencers.map((inf) => inf.name))
  const relevantTopPosts = useMemo(() => {
    return topPosts.filter((post) => validInfluencerNames.has(post.influencer))
  }, [validInfluencerNames])

  const bestPost = useMemo(() => {
    return relevantTopPosts.length > 0 ? relevantTopPosts.sort((a, b) => b.engagementRate - a.engagementRate)[0] : topPosts[0]
  }, [relevantTopPosts])

  const platformData = filteredInfluencers.reduce((acc, influencer) => {
    acc[influencer.platform] = (acc[influencer.platform] || 0) + influencer.followers
    return acc
  }, {} as Record<string, number>)

  const chartLabels = Object.keys(platformData).length > 0 ? Object.keys(platformData) : ['No Data']
  const chartValues = Object.values(platformData).length > 0 ? Object.values(platformData) : [0]

  // Dynamic growth trend based on range
  const growthRangelabels = {
    '7d': ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'],
    '30d': ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    '90d': ['Month 1', 'Month 2', 'Month 3'],
  }
  const growthRangeValues = {
    '7d': [120, 135, 150, 165, 180, 210, 260],
    '30d': [500, 850, 1100, 1450],
    '90d': [2500, 4200, 6500],
  }

  const growthTrendLabels = growthRangelabels[range]
  const growthValues = growthRangeValues[range]

  const globalLoading = influencersLoading || campaignsLoading
  const rangeText = { '7d': 'last 7 days', '30d': 'last 30 days', '90d': 'last 90 days' }[range]

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-4 justify-between">
        <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-400">
          <span>Range:</span>
          {(['7d', '30d', '90d'] as const).map((option) => (
            <button
              key={option}
              onClick={() => setRange(option)}
              className={`px-3 py-1 rounded-lg transition-colors ${range === option ? 'bg-sky-500 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-300'}`}
            >
              {option}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-400">
          <span>Category:</span>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-3 py-1 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-400">Projected reach: {projectedReach.toLocaleString()}</div>
      </div>

      {globalLoading && <Spinner />}
      {(influencersError || campaignsError) && (
        <ErrorBanner message={influencersError ?? campaignsError ?? 'Unknown error'} />
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <Card title="Total Influencers">
          <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
            <FiUsers className="h-5 w-5 text-sky-500" />
            <p className="text-4xl font-extrabold">{totalInfluencers}</p>
          </div>
          <span className="inline-flex items-center text-xs text-emerald-600 font-medium"> {range === '7d' ? '6.7%' : range === '30d' ? '8.2%' : '12.5%'} growth in {range}</span>
        </Card>
        <Card title="Average Engagement Rate">
          <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
            <FiTrendingUp className="h-5 w-5 text-amber-500" />
            <p className="text-4xl font-extrabold">{averageEngagement}%</p>
          </div>
          <span className="inline-flex items-center text-xs text-emerald-600 font-medium"> {range === '7d' ? '1.8%' : range === '30d' ? '2.4%' : '3.1%'} trend {rangeText}</span>
        </Card>
        <Card title="Total Reach">
          <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
            <FiEye className="h-5 w-5 text-violet-500" />
            <p className="text-4xl font-extrabold">{totalReach.toLocaleString()}</p>
          </div>
          <span className="inline-flex items-center text-xs text-emerald-600 font-medium"> {range === '7d' ? '5.2%' : range === '30d' ? '8.9%' : '15.3%'} month-over-month</span>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <BarChart labels={chartLabels} values={chartValues} title="Reach by Platform" />
        <LineChart labels={growthTrendLabels} values={growthValues} title={`Network Growth (${range})`} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="Top Post">
          {relevantTopPosts.length > 0 ? (
            <div className="space-y-2">
              <p className="text-sm text-slate-700 dark:text-slate-300 font-semibold">{bestPost.title}</p>
              <p className="text-xs text-slate-500">{bestPost.influencer} • {bestPost.platform} • {bestPost.publishedDate}</p>
              <p className="text-xs text-slate-500">Likes: {bestPost.likes.toLocaleString()}  Comments: {bestPost.comments.toLocaleString()}</p>
              <p className="text-xs text-slate-500">Engagement: {bestPost.engagementRate}%</p>
            </div>
          ) : (
            <p className="text-sm text-slate-500">No posts available for selected filters</p>
          )}
        </Card>

        <Card title="AI Insight">
          <div className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
            <p>Predicted growth {rangeText}: +{((projectedReach - totalReach) / 1000000).toFixed(2)}M reach based on {category !== 'All' ? `${category} category` : 'all categories'} content velocity.</p>
            <p>Top performing platform: {chartLabels[0] || 'N/A'} with {(chartValues[0] || 0).toLocaleString()} followers.</p>
            <p>Recommended action: Focus on influencers with {averageEngagement > 7 ? 'high' : averageEngagement > 4 ? 'medium' : 'lower'} engagement rates for {range} campaigns.</p>
          </div>
        </Card>
      </div>

      <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/30">
        <h3 className="font-semibold text-slate-900 dark:text-slate-100">Campaign Summary</h3>
        <p className="text-sm text-slate-600 dark:text-slate-400">Active campaigns: {campaigns.filter((c) => c.status === 'running').length} | Total campaigns: {campaigns.length}</p>
        <p className="text-sm text-slate-600 dark:text-slate-400">Category filter: {category} | Range: {range}</p>
      </div>
    </div>
  )
}
