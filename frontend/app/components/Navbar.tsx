'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="bg-green-800 text-white px-4 py-3 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          🌾 TokoPadi
        </Link>

        <button
          className="md:hidden block text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          ☰
        </button>

        <div className={`md:flex gap-6 ${isOpen ? 'block' : 'hidden'}`}>
          <Link href="/" className="hover:underline">
            Beranda
          </Link>
          <Link href="#produk" className="hover:underline">
            Produk
          </Link>
          <Link href="/login" className="hover:underline">
            Login
          </Link>
        </div>
      </div>
    </nav>
  )
}
