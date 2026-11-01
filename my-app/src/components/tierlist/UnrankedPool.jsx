import DroppableArea from './DroppableArea.jsx'
import SortableItem from './SortableItem.jsx'
import { POOL_ID } from '../../utils/constants.js'

function UnrankedPool({ items = [] }) {
  return (
    <section className="rounded border border-gray-300 bg-white p-4">
      <h2 className="mb-3 text-lg font-semibold text-gray-800">Unranked pool</h2>
      <div className="mb-4 flex items-center gap-2">
        <input
          className="min-w-0 flex-1 rounded border border-gray-300 px-3 py-2 text-sm"
          type="text"
          placeholder="Add an item"
        />
        <button
          className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white"
          type="button"
        >
          Add
        </button>
      </div>
      <DroppableArea
        containerId={POOL_ID}
        itemIds={items.map((item) => item.id)}
        className="flex min-h-20 flex-wrap items-center gap-2"
      >
        {items.length > 0 ? (
          items.map((item) => <SortableItem key={item.id} item={item} />)
        ) : (
          <p className="text-sm text-gray-500">
            No items yet. Add an item to get started.
          </p>
        )}
      </DroppableArea>
    </section>
  )
}

export default UnrankedPool
