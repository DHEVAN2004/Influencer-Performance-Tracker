import { useState } from 'react'
import Card from './Card.tsx'
import Modal from './Modal.tsx'
import Spinner from './Spinner.tsx'
import ErrorBanner from './ErrorBanner.tsx'
import { FiTrendingUp, FiDollarSign, FiUsers, FiEye, FiPlus, FiDownload } from 'react-icons/fi'
import { useCampaigns } from './useCampaigns.ts'
import { useInfluencers } from './useInfluencers.ts'
import CampaignModal from './CampaignModal.tsx'
import type { Campaign } from './campaigns.ts'

export default function CampaignsPage() {
  const { data: campaigns, isLoading: campaignsLoading, error: campaignsError, load: loadCampaigns, addCampaign, updateCampaign } = useCampaigns()
  const { data: influencers, isLoading: influencersLoading } = useInfluencers()
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isReportModalOpen, setIsReportModalOpen] = useState(false)
  const [reportCampaign, setReportCampaign] = useState<Campaign | null>(null)

  const globalLoading = campaignsLoading || influencersLoading

  const handleAddCampaign = () => {
    setSelectedCampaign(null)
    setIsModalOpen(true)
  }

  const handleEditCampaign = (campaign: Campaign) => {
    setSelectedCampaign(campaign)
    setIsModalOpen(true)
  }

  const handleViewReport = (campaign: Campaign) => {
    setReportCampaign(campaign)
    setIsReportModalOpen(true)
  }

  const handleSaveCampaign = async (campaign: Campaign) => {
    try {
      if (selectedCampaign) {
        await updateCampaign(selectedCampaign.id, campaign)
      } else {
        await addCampaign(campaign)
      }
    } catch (error) {
      console.error('Failed to save campaign:', error)
    }
  }

  const handleExportCSV = (campaign: Campaign) => {
    const csvData = [
      ['Campaign Report', campaign.name],
      ['Status', campaign.status],
      ['Objective', campaign.objective],
      ['Period', `${campaign.startDate} - ${campaign.endDate}`],
      ['Budget', `$${campaign.budget.toLocaleString()}`],
      ['Daily Budget', `$${campaign.dailyBudget}`],
      ['Impressions', campaign.impressions.toLocaleString()],
      ['Clicks', campaign.clicks.toLocaleString()],
      ['CTR', `${campaign.ctr}%`],
      ['Conversions', campaign.conversions.toLocaleString()],
      ['Conversion Rate', `${campaign.conversionRate}%`],
      ['ROI', `${campaign.roi}x`],
      ['Total Reach', campaign.totalReach.toLocaleString()],
      ['Influencers', campaign.influencers.join(', ')],
      [],
      ['Generated on', new Date().toLocaleString()],
    ]

    const csvContent = csvData.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `${campaign.name.replace(/\s+/g, '_')}_report.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    // Save report to localStorage for Reports page
    const reports = JSON.parse(localStorage.getItem('campaign_reports') || '[]')
    const report = {
      id: `report_${Date.now()}`,
      campaignName: campaign.name,
      campaignId: campaign.id,
      exportedAt: new Date().toISOString(),
      data: csvData,
    }
    reports.push(report)
    localStorage.setItem('campaign_reports', JSON.stringify(reports))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Campaigns</h2>
        <button
          onClick={handleAddCampaign}
          className="flex items-center gap-2 px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 text-sm font-medium"
        >
          <FiPlus className="w-4 h-4" />
          Add Campaign
        </button>
      </div>

      {globalLoading && <Spinner />}
      {campaignsError && <ErrorBanner message={campaignsError} onRetry={() => void loadCampaigns()} />}

      {!globalLoading && !campaignsError && campaigns.length === 0 && (
        <div className="p-4 text-center text-slate-500 bg-slate-50 dark:bg-slate-900 rounded-lg">
          No campaigns available.
        </div>
      )}

      {!globalLoading && !campaignsError && campaigns.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {campaigns.map((campaign) => {
            const progress = Math.min(100, Math.round((campaign.budget / (campaign.dailyBudget * 30 || 1)) * 100))
            const validInfluencers = campaign.influencers.filter((name) =>
              influencers.some((inf) => inf.name === name)
            )
            
            return (
              <Card key={campaign.id} title={campaign.name}>
                <div className="mb-2 flex items-center justify-between">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    campaign.status === 'running'
                      ? 'bg-emerald-100 text-emerald-700'
                      : campaign.status === 'paused'
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                  }`}>
                    {campaign.status.toUpperCase()}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">{campaign.objective}</span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300 flex items-center gap-2">
                  <FiUsers className="w-4 h-4" />
                  Influencers: {validInfluencers.length > 0 ? validInfluencers.join(', ') : 'None available'}
                </p>
                <p className="mt-2 text-sm text-slate-700 dark:text-slate-200 flex items-center gap-2">
                  <FiDollarSign className="w-4 h-4" />
                  Budget: ${campaign.budget.toLocaleString()} (Daily ${campaign.dailyBudget})
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-300 flex items-center gap-2">
                  <FiEye className="w-4 h-4" />
                  Impressions: {campaign.impressions.toLocaleString()}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-300 flex items-center gap-2">
                  <FiTrendingUp className="w-4 h-4" />
                  CTR: {campaign.ctr}% ▪ ROI: {campaign.roi}x
                </p>
                <div className="mt-3">
                  <p className="text-xs text-slate-500">Campaign period</p>
                  <p className="text-sm text-slate-700 dark:text-slate-200">{campaign.startDate} - {campaign.endDate}</p>
                </div>
                <div className="mt-3">
                  <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-sky-500" style={{ width: `${progress}%` }} />
                  </div>
                  <p className="mt-1 text-xs text-slate-500">Budget Burn: {progress}%</p>
                </div>
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => handleViewReport(campaign)}
                    className="flex-1 py-1 text-xs font-semibold rounded-lg bg-sky-500 text-white hover:bg-sky-600"
                  >
                    View Report
                  </button>
                  <button
                    onClick={() => handleExportCSV(campaign)}
                    className="flex-1 py-1 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center gap-1"
                  >
                    <FiDownload className="w-3 h-3" />
                    Export CSV
                  </button>
                </div>
                <div className="mt-2 flex gap-2">
                  <button
                    onClick={() => handleEditCampaign(campaign)}
                    className="flex-1 py-1 text-xs font-semibold rounded-lg bg-emerald-500 text-white hover:bg-emerald-600"
                  >
                    Edit
                  </button>
                </div>
              </Card>
            )
          })}
        </div>
      )}

      <CampaignModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        campaign={selectedCampaign}
        influencers={influencers}
        onSave={handleSaveCampaign}
      />

      <Modal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        title={`Campaign Report: ${reportCampaign?.name || ''}`}
      >
        {reportCampaign && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-slate-700 dark:text-slate-300">Status:</span>
                <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                  reportCampaign.status === 'running'
                    ? 'bg-emerald-100 text-emerald-700'
                    : reportCampaign.status === 'paused'
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}>
                  {reportCampaign.status.toUpperCase()}
                </span>
              </div>
              <div>
                <span className="font-medium text-slate-700 dark:text-slate-300">Objective:</span>
                <span className="ml-2">{reportCampaign.objective}</span>
              </div>
              <div>
                <span className="font-medium text-slate-700 dark:text-slate-300">Period:</span>
                <span className="ml-2">{reportCampaign.startDate} - {reportCampaign.endDate}</span>
              </div>
              <div>
                <span className="font-medium text-slate-700 dark:text-slate-300">Budget:</span>
                <span className="ml-2">${reportCampaign.budget.toLocaleString()}</span>
              </div>
            </div>

            <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
              <h4 className="font-medium text-slate-800 dark:text-slate-100 mb-3">Performance Metrics</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="text-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <div className="text-lg font-semibold text-slate-800 dark:text-slate-100">{reportCampaign.impressions.toLocaleString()}</div>
                  <div className="text-xs text-slate-500">Impressions</div>
                </div>
                <div className="text-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <div className="text-lg font-semibold text-slate-800 dark:text-slate-100">{reportCampaign.clicks.toLocaleString()}</div>
                  <div className="text-xs text-slate-500">Clicks</div>
                </div>
                <div className="text-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <div className="text-lg font-semibold text-slate-800 dark:text-slate-100">{reportCampaign.ctr}%</div>
                  <div className="text-xs text-slate-500">CTR</div>
                </div>
                <div className="text-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <div className="text-lg font-semibold text-slate-800 dark:text-slate-100">{reportCampaign.roi}x</div>
                  <div className="text-xs text-slate-500">ROI</div>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
              <h4 className="font-medium text-slate-800 dark:text-slate-100 mb-2">Assigned Influencers</h4>
              <div className="flex flex-wrap gap-2">
                {reportCampaign.influencers.length > 0 ? (
                  reportCampaign.influencers.map((influencer, index) => (
                    <span key={index} className="px-3 py-1 bg-sky-100 dark:bg-sky-900 text-sky-700 dark:text-sky-300 rounded-full text-sm">
                      {influencer}
                    </span>
                  ))
                ) : (
                  <span className="text-slate-500 dark:text-slate-400">No influencers assigned</span>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
              <button
                onClick={() => handleExportCSV(reportCampaign)}
                className="flex items-center gap-2 px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 text-sm font-medium"
              >
                <FiDownload className="w-4 h-4" />
                Export CSV
              </button>
              <button
                onClick={() => handleEditCampaign(reportCampaign)}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-sm font-medium"
              >
                Edit Campaign
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
