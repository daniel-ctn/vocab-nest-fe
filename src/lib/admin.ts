import { requireUser } from '@/lib/session'

export async function isAdmin(): Promise<boolean> {
  const adminEmail = process.env.ADMIN_EMAIL
  if (!adminEmail) return false

  try {
    const user = await requireUser()
    return user.email === adminEmail
  } catch {
    return false
  }
}
