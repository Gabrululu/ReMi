'use client'

import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="min-h-screen grid place-items-center p-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">404 — No encontrado</h1>
        <p className="mb-6 text-gray-600">La ruta que buscas no existe.</p>
        <Link href="/" className="text-blue-600 underline">
          Volver al inicio
        </Link>
      </div>
    </main>
  )
}
