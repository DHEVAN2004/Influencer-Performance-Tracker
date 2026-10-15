import type { InputHTMLAttributes } from 'react'
import { cx } from './utils.ts'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  variant?: 'default' | 'filled' | 'outline'
}

export default function Input({
  variant = 'default',
  className = '',
  ...props
}: InputProps) {
  const base = 'rounded-lg border px-3 py-2 transition focus:outline-none focus:ring-2 focus:ring-sky-500 w-full'
  const variants: Record<'default' | 'filled' | 'outline', string> = {
    default: 'border-slate-300 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100',
    filled: 'border-transparent bg-slate-100 dark:bg-slate-700',
    outline: 'border-slate-400 dark:border-slate-600 bg-white dark:bg-slate-900',
  }
  return <input {...props} className={cx(base, variants[variant ?? 'default'], className)} />
}
