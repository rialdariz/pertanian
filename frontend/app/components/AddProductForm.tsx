'use client'
import { useState, useEffect } from 'react'

export default function AddProductForm() {
  const [form, setForm] = useState({
    name: '',
    pricePerKg: '',
    stockKg: '',
    type: 'Lokal',
    brand: '',
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [brands, setBrands] = useState([])
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchBrands = async () => {
      const res = await fetch('http://localhost:5000/api/brands')
      const data = await res.json()
      setBrands(data.data || [])
    }
    fetchBrands()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const formData = new FormData()
      for (const key in form) {
        formData.append(key, (form as any)[key])
      }
      if (imageFile) formData.append('image', imageFile)

      const res = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.message || 'Gagal menyimpan produk')
      }

      setSuccess('✅ Produk berhasil ditambahkan!')
      setForm({ name: '', pricePerKg: '', stockKg: '', type: 'Lokal', brand: '' })
      setImageFile(null)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-6 mb-6 space-y-4">
      <h2 className="text-lg font-bold text-gray-800">➕ Tambah Produk</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nama Produk</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="mt-1 w-full rounded border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Harga per Kg</label>
          <input
            type="number"
            name="pricePerKg"
            value={form.pricePerKg}
            onChange={handleChange}
            className="mt-1 w-full rounded border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Stok (Kg)</label>
          <input
            type="number"
            name="stockKg"
            value={form.stockKg}
            onChange={handleChange}
            className="mt-1 w-full rounded border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Tipe</label>
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className="mt-1 w-full rounded border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          >
            <option value="Lokal">Lokal</option>
            <option value="Hibrida">Hibrida</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Brand</label>
          <select
            name="brand"
            value={form.brand}
            onChange={handleChange}
            className="mt-1 w-full rounded border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            required
          >
            <option value="">-- Pilih Brand --</option>
            {brands.map((b: any) => (
              <option key={b._id} value={b._id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Gambar Produk</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="mt-1 block w-full text-sm text-gray-600"
          />
          {imageFile && (
            <img
              src={URL.createObjectURL(imageFile)}
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
        {loading ? 'Menyimpan...' : 'Simpan Produk'}
      </button>
    </form>

    
  )
}
