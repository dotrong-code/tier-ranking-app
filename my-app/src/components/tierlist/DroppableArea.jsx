import {
  rectSortingStrategy,
  SortableContext,
} from '@dnd-kit/sortable'
import { useDroppable } from '@dnd-kit/core'

function DroppableArea({
  containerId,
  itemIds = [],
  children,
  className = '',
}) {
  const { isOver, setNodeRef } = useDroppable({ id: containerId })
  const highlightClass = isOver ? 'bg-blue-50 ring-2 ring-blue-300' : ''

  return (
    <SortableContext items={itemIds} strategy={rectSortingStrategy}>
      <div
        ref={setNodeRef}
        className={`${className} ${highlightClass}`.trim()}
      >
        {children}
      </div>
    </SortableContext>
  )
}

export default DroppableArea
