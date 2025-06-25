'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import Cookies from 'js-cookie' // pastikan sudah install: npm i js-cookie

const SidebarLink = ({ href, label }: { href: string; label: string }) => {
  const pathname = usePathname()
  const isActive = pathname === href

  return (
    <Link href={href}>
      <div
        className={`px-4 py-2 rounded-md cursor-pointer transition font-medium ${
          isActive ? 'bg-green-600 text-white' : 'text-gray-700 hover:bg-green-100'
        }`}
      >
        {label}
      </div>
    </Link>
  )
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setSidebarOpen] = useState(true)
  const router = useRouter()

  const handleLogout = () => {
    // Hapus token dari cookie
    Cookies.remove('token') // sesuaikan nama cookie jika beda
    router.push('/login')
  }

  return (
    <div className="min-h-screen flex bg-gray-100">
      <aside
        className={`${
          isSidebarOpen ? 'w-64' : 'w-16'
        } bg-white shadow-md transition-all duration-300 h-screen px-2 py-4 flex flex-col justify-between`}
      >
        <nav className="space-y-2">
          <SidebarLink href="/dashboard/products" label="Produk" />
          <SidebarLink href="/dashboard/brands" label="Brand" />
            <button
            onClick={handleLogout}
            className="mt-4 px-4 py-2 text-left w-full text-sm font-semibold text-red-600 hover:bg-red-50 rounded-md transition"
            >
            Keluar
            </button>
        </nav>

      </aside>

      <main className="flex-1 p-6 overflow-y-auto">{children}</main>
    </div>
  )
}
