'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('')
  const [showMessage, setShowMessage] = useState(false)

  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')
    setMessageType('')
    setShowMessage(false)

    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setMessage(data.message || 'Login gagal')
        setMessageType('error')
        setShowMessage(true)
        return
      }

      // Simpan token ke cookie
      document.cookie = `token=${data.token}; path=/; max-age=2592000`

      setMessage('Login berhasil! Mengarahkan...')
      setMessageType('success')
      setShowMessage(true)

      // Redirect setelah delay kecil
      setTimeout(() => {
        router.push('/dashboard/products')
      }, 1500)
    } catch (err) {
      setMessage('Terjadi kesalahan saat login')
      setMessageType('error')
      setShowMessage(true)
    }
  }

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow w-full max-w-md relative">
        <h2 className="text-2xl font-bold text-green-700 mb-6 text-center">Masuk</h2>

        {/* Notifikasi */}
        {showMessage && (
          <div
            className={`mb-4 px-4 py-3 rounded ${
              messageType === 'success'
                ? 'bg-green-100 text-green-800 border border-green-300'
                : 'bg-red-100 text-red-800 border border-red-300'
            } relative`}
          >
            {message}
            <button
              className="absolute top-2 right-3 text-xl leading-none"
              onClick={() => setShowMessage(false)}
            >
              ×
            </button>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 border rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 border rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
            Masuk
          </button>
        </form>

        <p className="text-sm text-center mt-4">
          Belum punya akun?{' '}
          <a href="/register" className="text-green-700 font-semibold">
            Daftar
          </a>
        </p>
      </div>
    </section>
  )
}
