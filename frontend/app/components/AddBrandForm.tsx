'use client'
import { useState } from 'react'

export default function AddBrandForm() {
  const [form, setForm] = useState({
    name: '',
    description: '',
    country: '',
  })
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLogoFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const formData = new FormData()
      formData.append('name', form.name)
      formData.append('description', form.description)
      formData.append('country', form.country)
      if (logoFile) {
        formData.append('logo', logoFile) // field name harus sesuai dengan backend (e.g., 'logo')
      }

      const res = await fetch('http://localhost:5000/api/brands', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || 'Gagal menambahkan brand')
      }

      setSuccess('✅ Brand berhasil ditambahkan!')
      setForm({ name: '', description: '', country: '' })
      setLogoFile(null)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-2xl p-6 space-y-4 mb-6">
      <h2 className="text-xl font-bold text-gray-800">Tambah Brand</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nama Brand</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Negara Asal</label>
          <input
            type="text"
            name="country"
            value={form.country}
            onChange={handleChange}
            className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Deskripsi</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Logo Brand</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="mt-1 block w-full text-sm text-gray-600"
          />
          {logoFile && (
            <img
              src={URL.createObjectURL(logoFile)}
              alt="Preview"
              className="mt-2 h-24 rounded border"
            />
          )}
        </div>
      </div>

      {success && <p className="text-green-600 font-medium">{success}</p>}
      {error && <p className="text-red-600 font-medium">{error}</p>}

      <button
        type="submit"
        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
        disabled={loading}
      >
        {loading ? 'Menyimpan...' : 'Simpan Brand'}
      </button>
    </form>
  )
}
