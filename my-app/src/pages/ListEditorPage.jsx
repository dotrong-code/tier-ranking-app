import { Link } from 'react-router-dom'
import Header from '../components/layout/Header.jsx'
import TierRow from '../components/tierlist/TierRow.jsx'
import UnrankedPool from '../components/tierlist/UnrankedPool.jsx'
import { DEFAULT_TIERS } from '../utils/constants.js'
import { MOCK_POOL_ITEMS, MOCK_TIER_ITEMS } from '../utils/mockData.js'

function ListEditorPage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Header>
        <button
          className="rounded border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700"
          type="button"
        >
          Share
        </button>
      </Header>
      <main className="mx-auto max-w-5xl px-4 py-8">
        <Link
          className="mb-4 inline-block text-sm font-medium text-blue-700"
          to="/lists"
        >
          &larr; Back to lists
        </Link>
        <h1 className="mb-6 text-2xl font-bold">Favorite Games</h1>
        <div className="mb-6">
          <UnrankedPool items={MOCK_POOL_ITEMS} />
        </div>
        <div className="flex flex-col">
          {DEFAULT_TIERS.map((tier) => (
            <TierRow
              key={tier.id}
              name={tier.name}
              color={tier.color}
              items={MOCK_TIER_ITEMS[tier.name]}
            />
          ))}
        </div>
      </main>
    </div>
  )
}

export default ListEditorPage
