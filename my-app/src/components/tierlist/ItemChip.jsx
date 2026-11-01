function ItemChip({ name, readOnly = false }) {
  return (
    <span
      className={`inline-flex w-fit items-center rounded border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-800 ${
        readOnly ? '' : 'cursor-grab'
      }`}
    >
      {name}
    </span>
  )
}

export default ItemChip
