import { Bar } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

interface BarChartProps {
  labels: string[]
  values: number[]
  title?: string
}

export default function BarChart({ labels, values, title = 'Bar Chart' }: BarChartProps) {
  const data = {
    labels,
    datasets: [
      {
        label: 'Reach',
        data: values,
        backgroundColor: 'rgba(14, 165, 233, 0.7)',
        borderRadius: 6,
      },
    ],
  }

  return (
    <div className="p-4 rounded-xl bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700">
      <h3 className="mb-3 text-base font-semibold text-slate-800 dark:text-slate-100">{title}</h3>
      <Bar data={data} options={{ responsive: true, plugins: { legend: { display: false } } }} />
    </div>
  )
}
