import { getCurrentUser } from '@/lib/session'

export async function isAdmin(): Promise<boolean> {
  const adminEmail = process.env.ADMIN_EMAIL
  if (!adminEmail) return false

  try {
    const user = await getCurrentUser()
    return user.email === adminEmail
  } catch {
    return false
  }
}
