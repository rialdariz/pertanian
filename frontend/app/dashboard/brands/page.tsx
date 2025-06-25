'use client'
import AddBrandForm from "@/app/components/AddBrandForm"
import { useState, useEffect } from "react"

export default function BrandPage() {
  const [brands, setBrands] = useState([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    country: ''
  })

  const fetchBrands = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/brands')
      const data = await res.json()
      setBrands(data?.data || [])
    } catch (err) {
      console.error("Gagal mengambil data brands:", err)
      setBrands([])
    }
  }

  useEffect(() => {
    fetchBrands()
  }, [])

  const handleDelete = async (id: string) => {
    const confirm = window.confirm("Yakin ingin menghapus brand ini?")
    if (!confirm) return

    try {
      const res = await fetch(`http://localhost:5000/api/brands/${id}`, {
        method: 'DELETE'
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message)
      alert("🗑️ Brand berhasil dihapus.")
      fetchBrands()
    } catch (err: any) {
      alert("Gagal menghapus: " + err.message)
    }
  }

  const handleEditClick = (brand: any) => {
    setEditingId(brand._id)
    setEditForm({
      name: brand.name,
      description: brand.description || '',
      country: brand.country || ''
    })
  }

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setEditForm(prev => ({ ...prev, [name]: value }))
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch(`http://localhost:5000/api/brands/${editingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editForm)
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message)
      alert("✏️ Brand berhasil diupdate.")
      setEditingId(null)
      fetchBrands()
    } catch (err: any) {
      alert("Gagal update: " + err.message)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">🏷️ Daftar Brand</h2>

      <AddBrandForm />

      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="min-w-full text-sm text-left text-gray-700">
          <thead className="bg-gray-100 text-xs uppercase text-gray-600">
            <tr>
              <th className="px-4 py-3">Logo</th>
              <th className="px-4 py-3">Nama</th>
              <th className="px-4 py-3">Negara</th>
              <th className="px-4 py-3">Deskripsi</th>
              <th className="px-4 py-3">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {brands.length > 0 ? (
              brands.map((brand: any) => (
                <tr key={brand._id} className="border-t hover:bg-green-50 transition-colors">
                  <td className="px-4 py-3">
                    {brand.logoUrl ? (
                      <img
                        src={`http://localhost:5000${brand.logoUrl}`}
                        alt={brand.name}
                        className="h-10 w-10 object-contain rounded border"
                      />
                    ) : (
                      <span className="text-gray-400 italic">N/A</span>
                    )}
                  </td>

                  <td className="px-4 py-3 font-semibold">
                    {editingId === brand._id ? (
                      <input
                        name="name"
                        value={editForm.name}
                        onChange={handleEditChange}
                        className="border rounded px-2 py-1 text-sm"
                      />
                    ) : (
                      brand.name
                    )}
                  </td>

                  <td className="px-4 py-3">
                    {editingId === brand._id ? (
                      <input
                        name="country"
                        value={editForm.country}
                        onChange={handleEditChange}
                        className="border rounded px-2 py-1 text-sm"
                      />
                    ) : (
                      brand.country || "-"
                    )}
                  </td>

                  <td className="px-4 py-3 max-w-xs truncate" title={brand.description}>
                    {editingId === brand._id ? (
                      <textarea
                        name="description"
                        value={editForm.description}
                        onChange={handleEditChange}
                        className="border rounded px-2 py-1 text-sm w-full"
                      />
                    ) : (
                      brand.description || "-"
                    )}
                  </td>

                  <td className="px-4 py-3 space-x-2">
                    {editingId === brand._id ? (
                      <>
                        <button
                          onClick={handleEditSubmit}
                          className="bg-blue-500 text-white px-2 py-1 rounded text-xs"
                        >
                          Simpan
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="bg-gray-300 text-gray-800 px-2 py-1 rounded text-xs"
                        >
                          Batal
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEditClick(brand)}
                          className="bg-yellow-400 text-white px-2 py-1 rounded text-xs"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(brand._id)}
                          className="bg-red-500 text-white px-2 py-1 rounded text-xs"
                        >
                          Hapus
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center px-4 py-6 text-gray-500">
                  Tidak ada data brand.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
