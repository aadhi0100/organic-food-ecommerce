export default function CustomerDashboardLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 animate-pulse">
        <div className="mb-8 h-10 w-48 rounded-lg bg-gray-200" />
        <div className="mb-8 grid gap-6 lg:grid-cols-3">
          <div className="col-span-2 h-48 rounded-xl bg-gray-200" />
          <div className="h-48 rounded-xl bg-gray-200" />
        </div>
        <div className="mb-8 grid grid-cols-2 gap-6 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 rounded-xl bg-gray-200" />
          ))}
        </div>
        <div className="h-64 rounded-xl bg-gray-200" />
      </div>
    </div>
  )
}
