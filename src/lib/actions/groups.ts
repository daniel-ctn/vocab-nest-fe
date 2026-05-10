'use server'

import { and, eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'
import { groups, vocabularyEntries, vocabularyGroups } from '@/lib/db/schema'
import { getCurrentUser } from '@/lib/session'
import {
  CreateGroupRequestSchema,
  UpdateGroupRequestSchema,
} from '@/lib/contracts'

export async function createGroup(input: unknown) {
  const user = await getCurrentUser()
  const data = CreateGroupRequestSchema.parse(input)

  const id = crypto.randomUUID()
  const now = new Date()

  await db.insert(groups).values({
    id,
    userId: user.id,
    name: data.name,
    description: data.description ?? null,
    createdAt: now,
    updatedAt: now,
  })

  revalidatePath('/groups')
  revalidatePath('/dashboard')
  return { id }
}

export async function updateGroup(id: string, input: unknown) {
  const user = await getCurrentUser()
  const data = UpdateGroupRequestSchema.parse(input)

  const owned = await db
    .select({ id: groups.id })
    .from(groups)
    .where(and(eq(groups.id, id), eq(groups.userId, user.id)))
    .limit(1)

  if (owned.length === 0) {
    throw new Error('Group not found.')
  }

  const updateData: Record<string, unknown> = { updatedAt: new Date() }
  if (data.name !== undefined) updateData.name = data.name
  if (data.description !== undefined) updateData.description = data.description

  await db.update(groups).set(updateData).where(eq(groups.id, id))

  revalidatePath('/groups')
  revalidatePath(`/groups/${id}`)
}

export async function deleteGroup(id: string) {
  const user = await getCurrentUser()

  const owned = await db
    .select({ id: groups.id })
    .from(groups)
    .where(and(eq(groups.id, id), eq(groups.userId, user.id)))
    .limit(1)

  if (owned.length === 0) {
    throw new Error('Group not found.')
  }

  await db.delete(groups).where(eq(groups.id, id))

  revalidatePath('/groups')
  revalidatePath('/dashboard')
}

export async function addVocabularyToGroup(
  vocabularyId: string,
  groupId: string
) {
  const user = await getCurrentUser()

  const vocab = await db
    .select({ id: vocabularyEntries.id })
    .from(vocabularyEntries)
    .where(
      and(
        eq(vocabularyEntries.id, vocabularyId),
        eq(vocabularyEntries.userId, user.id)
      )
    )
    .limit(1)

  const group = await db
    .select({ id: groups.id })
    .from(groups)
    .where(and(eq(groups.id, groupId), eq(groups.userId, user.id)))
    .limit(1)

  if (vocab.length === 0 || group.length === 0) {
    throw new Error('Not found.')
  }

  await db
    .insert(vocabularyGroups)
    .values({ vocabularyId, groupId })
    .onConflictDoNothing()

  revalidatePath('/vocabulary')
  revalidatePath(`/vocabulary/${vocabularyId}`)
  revalidatePath('/groups')
  revalidatePath(`/groups/${groupId}`)
}

export async function removeVocabularyFromGroup(
  vocabularyId: string,
  groupId: string
) {
  const user = await getCurrentUser()

  const vocab = await db
    .select({ id: vocabularyEntries.id })
    .from(vocabularyEntries)
    .where(
      and(
        eq(vocabularyEntries.id, vocabularyId),
        eq(vocabularyEntries.userId, user.id)
      )
    )
    .limit(1)

  const group = await db
    .select({ id: groups.id })
    .from(groups)
    .where(and(eq(groups.id, groupId), eq(groups.userId, user.id)))
    .limit(1)

  if (vocab.length === 0 || group.length === 0) {
    throw new Error('Not found.')
  }

  await db
    .delete(vocabularyGroups)
    .where(
      and(
        eq(vocabularyGroups.vocabularyId, vocabularyId),
        eq(vocabularyGroups.groupId, groupId)
      )
    )

  revalidatePath('/vocabulary')
  revalidatePath(`/vocabulary/${vocabularyId}`)
  revalidatePath('/groups')
  revalidatePath(`/groups/${groupId}`)
}
