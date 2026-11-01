import ItemChip from './ItemChip.jsx'

function TierRow({ name, color, items = [], readOnly = false }) {
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
      <div className="flex min-h-20 flex-1 flex-wrap items-center gap-2 bg-white p-3">
        {items.map((item) => (
          <ItemChip key={item.id} name={item.name} readOnly={readOnly} />
        ))}
      </div>
    </div>
  )
}

export default TierRow
