import { AppShell } from '@/components/app-shell'
import { isAdmin } from '@/lib/admin'

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const admin = await isAdmin()
  return <AppShell isAdmin={admin}>{children}</AppShell>
}
