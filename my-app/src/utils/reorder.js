import { arrayMove } from '@dnd-kit/sortable'

export function findContainer(containers, id) {
  if (Object.hasOwn(containers, id)) {
    return id
  }

  return Object.keys(containers).find((containerId) =>
    containers[containerId].includes(id),
  )
}

export function moveBetweenContainers(
  containers,
  activeId,
  fromId,
  toId,
  overId,
  isBelowOver,
) {
  const nextContainers = Object.fromEntries(
    Object.entries(containers).map(([id, items]) => [id, [...items]]),
  )

  if (fromId === toId) {
    return nextContainers
  }

  const fromItems = nextContainers[fromId]
  const toItems = nextContainers[toId]

  if (!fromItems || !toItems) {
    return nextContainers
  }

  const activeIndex = fromItems.indexOf(activeId)

  if (activeIndex === -1) {
    return nextContainers
  }

  fromItems.splice(activeIndex, 1)

  if (overId === toId) {
    toItems.push(activeId)
    return nextContainers
  }

  const overIndex = toItems.indexOf(overId)
  const insertIndex =
    overIndex === -1 ? toItems.length : overIndex + (isBelowOver ? 1 : 0)
  toItems.splice(insertIndex, 0, activeId)

  return nextContainers
}

export function reorderWithin(containers, containerId, activeId, overId) {
  const items = containers[containerId]

  if (!items) {
    return { ...containers }
  }

  const activeIndex = items.indexOf(activeId)
  const overIndex = items.indexOf(overId)

  if (activeIndex === -1 || overIndex === -1) {
    return { ...containers }
  }

  return {
    ...containers,
    [containerId]: arrayMove(items, activeIndex, overIndex),
  }
}
