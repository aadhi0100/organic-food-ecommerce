'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
          <div className="mb-8 p-6 bg-red-50 dark:bg-red-900/20 rounded-2xl border border-red-100 dark:border-red-900">
            <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">Site Error</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">{error.message || 'An unexpected error occurred'}</p>
            <button onClick={() => reset()} className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
