import ItemChip from './ItemChip.jsx'
import DroppableArea from './DroppableArea.jsx'
import SortableItem from './SortableItem.jsx'

function TierRow({
  containerId,
  name,
  color,
  items = [],
  readOnly = false,
}) {
  const itemAreaClassName =
    'flex min-h-20 flex-1 flex-wrap items-center gap-2 bg-white p-3'

  return (
    <div className="flex border border-gray-300">
      <div
        className={`flex w-20 shrink-0 items-center justify-center font-bold text-gray-900 ${
          readOnly ? '' : 'cursor-pointer'
        }`}
        style={{ backgroundColor: color }}
      >
        {name}
      </div>
      {readOnly ? (
        <div className={itemAreaClassName}>
          {items.map((item) => (
            <ItemChip key={item.id} name={item.name} readOnly />
          ))}
        </div>
      ) : (
        <DroppableArea
          containerId={containerId}
          itemIds={items.map((item) => item.id)}
          className={itemAreaClassName}
        >
          {items.map((item) => (
            <SortableItem key={item.id} item={item} />
          ))}
        </DroppableArea>
      )}
    </div>
  )
}

export default TierRow
