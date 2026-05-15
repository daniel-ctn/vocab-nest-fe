import { Feather } from 'lucide-react'
import { cn } from '@/lib/cn'
import { Caps } from '@/components/ui/caps'

const RULE_COUNT = 3

/**
 * The Ruling — Vocab Nest's loading mark. The feather over hairline rules that
 * draw on in sequence, like a fresh page being ruled in a commonplace book.
 */
export function Loading({
  label = 'Gathering…',
  size = 'md',
  className,
}: {
  label?: string
  size?: 'sm' | 'md'
  className?: string
}) {
  const md = size === 'md'

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'flex flex-col items-center justify-center text-center',
        md ? 'gap-6' : 'gap-4',
        className
      )}
    >
      <span
        aria-hidden
        className={cn(
          'inline-flex items-center justify-center border border-ink/80 text-ink',
          md ? 'h-9 w-9' : 'h-7 w-7'
        )}
      >
        <Feather size={md ? 18 : 14} strokeWidth={2} />
      </span>

      <div
        aria-hidden
        className={cn('flex flex-col', md ? 'w-44 gap-1.5' : 'w-28 gap-1')}
      >
        {Array.from({ length: RULE_COUNT }).map((_, i) => (
          <span
            key={i}
            className="h-px w-full bg-rule animate-rule-loop"
            style={{ animationDelay: `${i * 200}ms` }}
          />
        ))}
      </div>

      <Caps className={cn(!md && 'text-[10px]')}>{label}</Caps>
    </div>
  )
}
