import { Loading } from '@/components/ui/loading'

export default function RootLoading() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-cream px-6">
      <Loading label="Opening the workshop" />
    </div>
  )
}
