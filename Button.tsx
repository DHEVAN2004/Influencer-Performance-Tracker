import type { ButtonHTMLAttributes } from 'react'
import { cx } from './utils.ts'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
}

export default function Button({
  variant = 'primary',
  className = '',
  ...props
}: ButtonProps) {
  const base = 'rounded-lg font-medium tracking-wide transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2'
  const variants: Record<'primary' | 'secondary' | 'danger' | 'ghost', string> = {
    primary: 'bg-sky-500 text-white hover:bg-sky-600 focus:ring-sky-300',
    secondary: 'bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600 focus:ring-slate-500',
    danger: 'bg-rose-500 text-white hover:bg-rose-600 focus:ring-rose-300',
    ghost: 'bg-transparent text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 focus:ring-slate-400',
  }
  return <button {...props} className={cx(base, variants[variant ?? 'primary'], className)} />
}
