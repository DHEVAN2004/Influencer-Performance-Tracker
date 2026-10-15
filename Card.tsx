import type { ReactNode } from 'react'

interface CardProps {
  title?: string
  children: ReactNode
}

export default function Card({ title, children }: CardProps) {
  return (
    <article className="bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl shadow-slate-200/40 dark:shadow-black/30 p-5 space-y-3">
      {title && <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">{title}</h3>}
      {children}
    </article>
  )
}
