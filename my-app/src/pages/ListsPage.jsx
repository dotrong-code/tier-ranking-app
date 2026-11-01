import { Link } from 'react-router-dom'
import Header from '../components/layout/Header.jsx'
import { MOCK_LISTS } from '../utils/mockData.js'

function ListsPage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Header />
      <main className="mx-auto max-w-5xl px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">My Lists</h1>
          <button
            className="rounded bg-blue-600 px-4 py-2 text-sm font-semibold text-white"
            type="button"
          >
            Create list
          </button>
        </div>
        <ul className="divide-y divide-gray-200 rounded border border-gray-200 bg-white">
          {MOCK_LISTS.map((list) => (
            <li key={list.id}>
              <Link
                className="block px-4 py-4 font-medium text-gray-800 hover:bg-gray-50"
                to={`/lists/${list.id}`}
              >
                {list.title}
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </div>
  )
}

export default ListsPage
