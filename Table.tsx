import type { ReactNode } from 'react'
import { FiUsers, FiMapPin, FiEye, FiTrendingUp } from 'react-icons/fi'

interface TableProps {
  headers: string[]
  rows: ReactNode[]
}

function headerIcon(label: string) {
  if (/name/i.test(label)) return <FiUsers className="inline-block h-4 w-4 mr-1" />
  if (/platform/i.test(label)) return <FiMapPin className="inline-block h-4 w-4 mr-1" />
  if (/followers/i.test(label)) return <FiEye className="inline-block h-4 w-4 mr-1" />
  if (/engagement/i.test(label)) return <FiTrendingUp className="inline-block h-4 w-4 mr-1" />
  return null
}

export default function Table({ headers, rows }: TableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-slate-50 dark:bg-slate-800">
          <tr>
            {headers.map((header) => (
              <th key={header} className="px-4 py-3 text-slate-600 dark:text-slate-300 font-medium uppercase tracking-wider">
                {headerIcon(header)}
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    </div>
  )
}
