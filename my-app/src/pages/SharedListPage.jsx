import TierRow from '../components/tierlist/TierRow.jsx'
import { DEFAULT_TIERS } from '../utils/constants.js'
import { MOCK_TIER_ITEMS } from '../utils/mockData.js'

function SharedListPage() {
  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 text-gray-900">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-1 text-2xl font-bold">Favorite Games</h1>
        <p className="mb-6 text-sm text-gray-600">by Demo User</p>
        <div className="flex flex-col">
          {DEFAULT_TIERS.map((tier) => (
            <TierRow
              key={tier.id}
              name={tier.name}
              color={tier.color}
              items={MOCK_TIER_ITEMS[tier.name]}
              readOnly
            />
          ))}
        </div>
      </div>
    </main>
  )
}

export default SharedListPage
