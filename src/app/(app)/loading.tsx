import { Loading } from '@/components/ui/loading'

export default function AppLoading() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center">
      <Loading label="Gathering your words" />
    </div>
  )
}
