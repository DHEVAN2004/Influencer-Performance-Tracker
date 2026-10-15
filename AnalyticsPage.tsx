import { useMemo } from 'react'
import BarChart from './BarChart.tsx'
import LineChart from './LineChart.tsx'
import Card from './Card.tsx'
import { useInfluencers } from './useInfluencers.ts'
import { useCampaigns } from './useCampaigns.ts'
import { FiTrendingUp, FiUsers, FiDollarSign, FiTarget, FiBarChart } from 'react-icons/fi'

export default function AnalyticsPage() {
  const { data: influencers } = useInfluencers()
  const { data: campaigns } = useCampaigns()

  // Platform distribution
  const platformData = useMemo(() => {
    const platforms = ['Instagram', 'YouTube', 'TikTok', 'Twitter', 'LinkedIn']
    const counts = platforms.map(platform =>
      influencers.filter(inf => inf.platform === platform).length
    )
    return { labels: platforms, values: counts }
  }, [influencers])

  // Followers by platform
  const followersData = useMemo(() => {
    const platforms = ['Instagram', 'YouTube', 'TikTok', 'Twitter', 'LinkedIn']
    const followers = platforms.map(platform =>
      influencers
        .filter(inf => inf.platform === platform)
        .reduce((sum, inf) => sum + inf.followers, 0)
    )
    return { labels: platforms, values: followers }
  }, [influencers])

  // Engagement rates
  const engagementData = useMemo(() => {
    const sortedInfluencers = [...influencers].sort((a, b) => b.engagementRate - a.engagementRate)
    const topInfluencers = sortedInfluencers.slice(0, 10)
    return {
      labels: topInfluencers.map(inf => inf.name.length > 15 ? inf.name.substring(0, 15) + '...' : inf.name),
      values: topInfluencers.map(inf => inf.engagementRate)
    }
  }, [influencers])

  // Campaign performance
  const campaignData = useMemo(() => {
    const campaignNames = campaigns.map(camp => camp.name.length > 20 ? camp.name.substring(0, 20) + '...' : camp.name)
    const roiValues = campaigns.map(camp => camp.roi)
    return { labels: campaignNames, values: roiValues }
  }, [campaigns])

  // Growth trend (using sample data from influencers)
  const growthData = useMemo(() => {
    const months = ['Oct 2025', 'Nov 2025', 'Dec 2025']
    const totalGrowth = months.map((_, index) =>
      influencers.reduce((sum, inf) => sum + (inf.growthData[index]?.followers || 0), 0)
    )
    return { labels: months, values: totalGrowth }
  }, [influencers])

  // Budget vs ROI scatter data (simplified as bar chart)
  const budgetRoiData = useMemo(() => {
    const sortedCampaigns = [...campaigns].sort((a, b) => b.budget - a.budget)
    return {
      labels: sortedCampaigns.map(camp => camp.name.length > 15 ? camp.name.substring(0, 15) + '...' : camp.name),
      values: sortedCampaigns.map(camp => camp.roi)
    }
  }, [campaigns])

  // Summary metrics
  const summaryMetrics = useMemo(() => {
    const totalInfluencers = influencers.length
    const totalFollowers = influencers.reduce((sum, inf) => sum + inf.followers, 0)
    const avgEngagement = influencers.length > 0
      ? influencers.reduce((sum, inf) => sum + inf.engagementRate, 0) / influencers.length
      : 0
    const totalBudget = campaigns.reduce((sum, camp) => sum + camp.budget, 0)
    const avgROI = campaigns.length > 0
      ? campaigns.reduce((sum, camp) => sum + camp.roi, 0) / campaigns.length
      : 0

    return {
      totalInfluencers,
      totalFollowers,
      avgEngagement: Math.round(avgEngagement * 100) / 100,
      totalBudget,
      avgROI: Math.round(avgROI * 100) / 100
    }
  }, [influencers, campaigns])

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <FiBarChart className="w-6 h-6 text-sky-600" />
        <h2 className="text-2xl font-semibold">Analytics Dashboard</h2>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <FiUsers className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Total Influencers</p>
              <p className="text-xl font-semibold text-slate-800 dark:text-slate-100">{summaryMetrics.totalInfluencers}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <FiTrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Total Followers</p>
              <p className="text-xl font-semibold text-slate-800 dark:text-slate-100">{summaryMetrics.totalFollowers.toLocaleString()}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <FiTarget className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Avg Engagement</p>
              <p className="text-xl font-semibold text-slate-800 dark:text-slate-100">{summaryMetrics.avgEngagement}%</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
              <FiDollarSign className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Total Budget</p>
              <p className="text-xl font-semibold text-slate-800 dark:text-slate-100">${summaryMetrics.totalBudget.toLocaleString()}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 dark:bg-emerald-900 rounded-lg">
              <FiTrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Avg ROI</p>
              <p className="text-xl font-semibold text-slate-800 dark:text-slate-100">{summaryMetrics.avgROI}x</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        <BarChart
          labels={platformData.labels}
          values={platformData.values}
          title="Influencers by Platform"
        />

        <BarChart
          labels={followersData.labels}
          values={followersData.values}
          title="Total Followers by Platform"
        />

        <BarChart
          labels={engagementData.labels}
          values={engagementData.values}
          title="Top 10 Influencer Engagement Rates"
        />

        <LineChart
          labels={growthData.labels}
          values={growthData.values}
          title="Follower Growth Trend"
        />

        {campaigns.length > 0 && (
          <>
            <BarChart
              labels={campaignData.labels}
              values={campaignData.values}
              title="Campaign ROI Performance"
            />

            <BarChart
              labels={budgetRoiData.labels}
              values={budgetRoiData.values}
              title="Budget vs ROI Analysis"
            />
          </>
        )}
      </div>

      {campaigns.length === 0 && (
        <div className="text-center py-8 text-slate-500 dark:text-slate-400">
          <FiBarChart className="w-12 h-12 mx-auto mb-4 text-slate-400" />
          <p className="text-lg font-medium mb-2">No campaign data available</p>
          <p className="text-sm">Add campaigns to see performance analytics and ROI charts.</p>
        </div>
      )}
    </div>
  )
}
