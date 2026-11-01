import { Link } from 'react-router-dom'
import Header from '../components/layout/Header.jsx'
import TierList from '../components/tierlist/TierList.jsx'
import useTierList from '../hooks/useTierList.js'

function ListEditorPage() {
  const { tiers, itemsById, containers, setContainers } = useTierList()

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
        <TierList
          tiers={tiers}
          itemsById={itemsById}
          containers={containers}
          setContainers={setContainers}
        />
      </main>
    </div>
  )
}

export default ListEditorPage
