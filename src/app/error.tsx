'use client' // Error components must be Client Components

import { useEffect } from 'react'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error)
    }, [error])

    return (
        <main className="flex flex-col min-h-screen items-center py-20 px-6 w-full mx-auto space-y-2 bg-gray-950">

            <div className='flex space-x-4'>
                <p className='text-2xl font-serif border-r-2 border-white p-4 text-white'>OOPS</p>
                <p className='text-2xl font-serif py-4 text-white'>Something went wrong!</p>
            </div>
            <p className='text-8xl font-serif py-4 text-white -rotate-90'>):</p>
            <button
                className='text-blue-700 underline text-lg'
                onClick={
                    // Attempt to recover by trying to re-render the segment
                    () => reset()
                }
            >
                Try again
            </button>
        </main>
    )
}
