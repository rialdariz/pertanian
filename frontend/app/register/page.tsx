'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    address: '',
    phone: '',
  })
  const [error, setError] = useState('')
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.message || 'Pendaftaran gagal')
        return
      }

      document.cookie = `token=${data.token}; path=/; max-age=2592000` // simpan token
      router.push('/dashboard')
    } catch (err) {
      setError('Terjadi kesalahan saat mendaftar')
    }
  }

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow w-full max-w-md">
        <h2 className="text-2xl font-bold text-green-700 mb-6 text-center">Daftar</h2>
        <form onSubmit={handleRegister} className="space-y-4">
          <input type="text" name="name" placeholder="Nama Lengkap" className="w-full px-4 py-2 border rounded" onChange={handleChange} required />
          <input type="email" name="email" placeholder="Email" className="w-full px-4 py-2 border rounded" onChange={handleChange} required />
          <input type="password" name="password" placeholder="Password" className="w-full px-4 py-2 border rounded" onChange={handleChange} required />
          <input type="text" name="address" placeholder="Alamat" className="w-full px-4 py-2 border rounded" onChange={handleChange} />
          <input type="text" name="phone" placeholder="No. HP" className="w-full px-4 py-2 border rounded" onChange={handleChange} />
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">Daftar</button>
        </form>
        <p className="text-sm text-center mt-4">
          Sudah punya akun? <a href="/login" className="text-green-700 font-semibold">Masuk</a>
        </p>
      </div>
    </section>
  )
}
