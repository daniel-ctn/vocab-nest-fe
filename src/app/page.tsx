import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/session'
import LandingPageClient from './landing-page-client'

export default async function HomePage() {
  const user = await getCurrentUser()
  if (user) {
    redirect('/dashboard')
  }
  return <LandingPageClient />
}
