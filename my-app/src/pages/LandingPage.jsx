function LandingPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 text-center">
      <div>
        <h1 className="mb-6 text-4xl font-bold tracking-tight text-gray-900">
          Tier Ranking App
        </h1>
        <button
          className="rounded-md bg-blue-600 px-6 py-3 font-semibold text-white"
          type="button"
        >
          Sign in with Google
        </button>
      </div>
    </main>
  )
}

export default LandingPage
