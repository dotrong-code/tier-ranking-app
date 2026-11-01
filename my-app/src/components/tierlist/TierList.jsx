import { useRef, useState } from 'react'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  pointerWithin,
  rectIntersection,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import ItemChip from './ItemChip.jsx'
import TierRow from './TierRow.jsx'
import UnrankedPool from './UnrankedPool.jsx'
import {
  findContainer,
  moveBetweenContainers,
  reorderWithin,
} from '../../utils/reorder.js'
import { POOL_ID } from '../../utils/constants.js'

function collisionDetection(args) {
  const pointerCollisions = pointerWithin(args)
  return pointerCollisions.length > 0
    ? pointerCollisions
    : rectIntersection(args)
}

function TierList({ tiers, itemsById, containers, setContainers }) {
  const [activeId, setActiveId] = useState(null)
  const containersSnapshot = useRef(null)
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
  )

  function handleDragStart({ active }) {
    setActiveId(active.id)
    containersSnapshot.current = containers
  }

  function handleDragOver({ active, over }) {
    if (!over) {
      return
    }

    const activeTranslatedRect = active.rect.current.translated
    const isBelowOver =
      over.id !== findContainer(containers, over.id) &&
      activeTranslatedRect &&
      activeTranslatedRect.top > over.rect.top + over.rect.height / 2

    setContainers((current) => {
      const fromId = findContainer(current, active.id)
      const toId = findContainer(current, over.id)

      if (!fromId || !toId || fromId === toId) {
        return current
      }

      return moveBetweenContainers(
        current,
        active.id,
        fromId,
        toId,
        over.id,
        Boolean(isBelowOver),
      )
    })
  }

  function handleDragEnd({ active, over }) {
    const snapshot = containersSnapshot.current

    if (!over && snapshot) {
      setContainers(snapshot)
    } else if (over && snapshot) {
      const originalContainer = findContainer(snapshot, active.id)

      setContainers((current) => {
        const activeContainer = findContainer(current, active.id)
        const overContainer = findContainer(current, over.id)
        const isOverItem = over.id !== overContainer

        if (
          isOverItem &&
          originalContainer === overContainer &&
          activeContainer === overContainer &&
          active.id !== over.id
        ) {
          return reorderWithin(current, overContainer, active.id, over.id)
        }

        return current
      })
    }

    containersSnapshot.current = null
    setActiveId(null)
  }

  function handleDragCancel() {
    if (containersSnapshot.current) {
      setContainers(containersSnapshot.current)
    }

    containersSnapshot.current = null
    setActiveId(null)
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={collisionDetection}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="mb-6">
        <UnrankedPool items={containers[POOL_ID].map((id) => itemsById[id])} />
      </div>
      <div className="flex flex-col">
        {tiers.map((tier) => (
          <TierRow
            key={tier.id}
            containerId={tier.id}
            name={tier.name}
            color={tier.color}
            items={containers[tier.id].map((id) => itemsById[id])}
          />
        ))}
      </div>
      <DragOverlay>
        {activeId ? <ItemChip name={itemsById[activeId].name} /> : null}
      </DragOverlay>
    </DndContext>
  )
}

export default TierList
