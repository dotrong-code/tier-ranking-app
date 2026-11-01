import { Link } from 'react-router-dom'

function NotAvailablePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 text-gray-900">
      <h1 className="text-2xl font-bold">Page not found</h1>
      <Link className="mt-4 font-medium text-blue-700" to="/">
        Go home
      </Link>
    </main>
  )
}

export default NotAvailablePage
