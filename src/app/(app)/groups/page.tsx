import { requireUser } from '@/lib/session'
import { isPro } from '@/lib/data/subscription'
import { listGroups } from '@/lib/data/groups'
import { GroupsList } from './groups-list'

const FREE_GROUP_LIMIT = 3

export default async function GroupsPage() {
  const user = await requireUser()
  const [groups, pro] = await Promise.all([
    listGroups(user.id),
    isPro(user.id),
  ])

  const atLimit = !pro && groups.length >= FREE_GROUP_LIMIT

  return <GroupsList groups={groups} atLimit={atLimit} isPro={pro} />
}
