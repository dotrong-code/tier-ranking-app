import { Link } from 'react-router-dom'

function Header({ children }) {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4">
        <Link className="shrink-0 text-lg font-bold text-gray-900" to="/lists">
          Tier Ranking App
        </Link>
        <div className="flex min-w-0 items-center justify-end gap-5">
          {children}
          <div className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className="h-8 w-8 rounded-full bg-gray-300"
            />
            <span className="text-sm font-medium text-gray-700">Demo User</span>
          </div>
          <button
            className="shrink-0 text-sm font-medium text-gray-600"
            type="button"
          >
            Sign out
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header
