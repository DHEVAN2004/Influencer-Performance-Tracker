interface ErrorBannerProps {
  message: string
  onRetry?: () => void
}

export default function ErrorBanner({ message, onRetry }: ErrorBannerProps) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg bg-rose-50 dark:bg-rose-950/50 px-4 py-3 text-sm text-rose-700 dark:text-rose-300">
      <span>{message}</span>
      {onRetry && (
        <button
          onClick={onRetry}
          className="rounded-lg bg-rose-100 dark:bg-rose-900 px-3 py-1 text-xs font-semibold hover:bg-rose-200 dark:hover:bg-rose-800"
        >
          Retry
        </button>
      )}
    </div>
  )
}
