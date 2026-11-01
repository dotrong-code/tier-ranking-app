import { useState } from 'react'
import { DEFAULT_TIERS, POOL_ID } from '../utils/constants.js'
import { MOCK_POOL_ITEMS, MOCK_TIER_ITEMS } from '../utils/mockData.js'

const allItems = [
  ...MOCK_POOL_ITEMS,
  ...Object.values(MOCK_TIER_ITEMS).flat(),
]

const initialItemsById = Object.fromEntries(
  allItems.map((item) => [item.id, item]),
)

const initialContainers = {
  [POOL_ID]: MOCK_POOL_ITEMS.map((item) => item.id),
  ...Object.fromEntries(
    DEFAULT_TIERS.map((tier) => [
      tier.id,
      MOCK_TIER_ITEMS[tier.name].map((item) => item.id),
    ]),
  ),
}

function useTierList() {
  const [containers, setContainers] = useState(initialContainers)

  return {
    tiers: DEFAULT_TIERS,
    itemsById: initialItemsById,
    containers,
    setContainers,
  }
}

export default useTierList
