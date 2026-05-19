'use client';

import { useEffect, useState } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    console.error('Global Error:', error);
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, [error]);

  return (
    <html lang="en">
      <body className="bg-(--color-brand-muted) text-gray-900">
        <div className="min-h-screen flex items-center justify-center px-4">
          
          <div
            className={`w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition-all duration-500 ${
              visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            {/* Badge */}
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-600">
              <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
              error
            </div>

            {/* Title */}
            <h1 className="text-2xl font-semibold text-gray-900 leading-tight">
              Something went wrong
            </h1>

            {/* Description */}
            <p className="mt-2 text-sm text-gray-500">
              An unexpected error occurred. Try again or go back to the homepage.
            </p>

            {/* Error message */}
            {error?.message && (
              <div className="mt-4 rounded-md border border-red-100 bg-red-50 p-3 text-xs text-red-600 wrap-break-word">
                {error.message}
              </div>
            )}

            {/* Actions */}
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => reset()}
                className="flex-1 rounded-lg bg-(--color-brand-primary) px-4 py-2 text-sm font-medium text-white hover:bg-(--color-brand-secondary) transition"
              >
                Try again
              </button>

              <button
                onClick={() => (window.location.href = '/')}
                className="flex-1 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
              >
                Go home
              </button>
            </div>

            {/* Digest */}
            {error?.digest && (
              <p className="mt-4 text-[10px] text-gray-400 text-center">
                {error.digest}
              </p>
            )}
          </div>
        </div>
      </body>
    </html>
  );
}