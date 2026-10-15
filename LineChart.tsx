import { Line } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

interface LineChartProps {
  labels: string[]
  values: number[]
  title?: string
}

export default function LineChart({ labels, values, title = 'Line Chart' }: LineChartProps) {
  const data = {
    labels,
    datasets: [
      {
        label: 'Growth',
        data: values,
        fill: true,
        borderColor: 'rgba(34, 197, 94, 0.9)',
        backgroundColor: 'rgba(34, 197, 94, 0.2)',
      },
    ],
  }

  return (
    <div className="p-4 rounded-xl bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700">
      <h3 className="mb-3 text-base font-semibold text-slate-800 dark:text-slate-100">{title}</h3>
      <Line data={data} options={{ responsive: true, plugins: { legend: { display: false } } }} />
    </div>
  )
}
