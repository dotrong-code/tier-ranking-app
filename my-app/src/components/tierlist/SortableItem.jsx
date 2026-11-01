import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import ItemChip from './ItemChip.jsx'

function SortableItem({ item }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id })

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={isDragging ? 'opacity-40' : ''}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
    >
      <ItemChip name={item.name} />
    </div>
  )
}

export default SortableItem
