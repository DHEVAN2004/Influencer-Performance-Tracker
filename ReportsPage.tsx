import { useState, useEffect } from 'react'
import Card from './Card.tsx'
import { FiDownload, FiCalendar, FiTrendingUp } from 'react-icons/fi'

interface CampaignReport {
  id: string
  campaignName: string
  campaignId: string
  exportedAt: string
  data: string[][]
}    

export default function ReportsPage() {
  const [reports, setReports] = useState<CampaignReport[]>([])

  useEffect(() => {
    const storedReports = localStorage.getItem('campaign_reports')
    if (storedReports) {
      setReports(JSON.parse(storedReports))
    }
  }, [])

  const downloadReport = (report: CampaignReport) => {
    const csvContent = report.data.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `${report.campaignName.replace(/\s+/g, '_')}_report_${new Date(report.exportedAt).toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const clearReports = () => {
    localStorage.removeItem('campaign_reports')
    setReports([])
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Reports</h2>
        {reports.length > 0 && (
          <button
            onClick={clearReports}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium"
          >
            Clear All Reports
          </button>
        )}
      </div>

      {reports.length === 0 ? (
        <div className="p-8 text-center text-slate-500 bg-slate-50 dark:bg-slate-900 rounded-lg">
          <FiTrendingUp className="w-12 h-12 mx-auto mb-4 text-slate-400" />
          <p className="text-lg font-medium mb-2">No reports available</p>
          <p className="text-sm">Export campaign reports from the Campaigns page to see them here.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {reports.map((report) => (
            <Card key={report.id} title={report.campaignName}>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                  <FiCalendar className="w-4 h-4" />
                  Exported: {new Date(report.exportedAt).toLocaleDateString()} at {new Date(report.exportedAt).toLocaleTimeString()}
                </div>

                <div className="text-sm text-slate-700 dark:text-slate-200">
                  <div className="font-medium mb-1">Report Summary:</div>
                  <div className="space-y-1 text-xs">
                    <div>Status: {report.data[1][1]}</div>
                    <div>Objective: {report.data[2][1]}</div>
                    <div>Budget: {report.data[4][1]}</div>
                    <div>Impressions: {report.data[6][1]}</div>
                    <div>ROI: {report.data[11][1]}</div>
                  </div>
                </div>

                <button
                  onClick={() => downloadReport(report)}
                  className="w-full flex items-center justify-center gap-2 py-2 text-sm font-semibold rounded-lg bg-sky-500 text-white hover:bg-sky-600"
                >
                  <FiDownload className="w-4 h-4" />
                  Download CSV
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
