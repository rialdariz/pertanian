'use client'
import AddProductForm from "@/app/components/AddProductForm"
import { useState, useEffect } from "react"

export default function ProductPage() {
  const [products, setProducts] = useState([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({
    name: '',
    pricePerKg: '',
    stockKg: '',
    type: 'Lokal',
    brand: '',
  })

  const fetchProducts = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/products')
      const data = await res.json()
      setProducts(data.data || [])
    } catch (error) {
      console.error("Gagal mengambil data produk:", error)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus produk ini?")) return
    try {
      const res = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: 'DELETE'
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message)
      alert("🗑️ Produk berhasil dihapus")
      fetchProducts()
    } catch (err: any) {
      alert("Gagal menghapus: " + err.message)
    }
  }

  const handleEditClick = (product: any) => {
    setEditingId(product._id)
    setEditForm({
      name: product.name,
      pricePerKg: product.pricePerKg,
      stockKg: product.stockKg,
      type: product.type,
      brand: product.brand?._id || ''
    })
  }

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setEditForm(prev => ({ ...prev, [name]: value }))
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch(`http://localhost:5000/api/products/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm)
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message)
      alert("✏️ Produk berhasil diupdate")
      setEditingId(null)
      fetchProducts()
    } catch (err: any) {
      alert("Gagal update: " + err.message)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">📦 Daftar Produk</h2>
      </div>

      <AddProductForm />

      <div className="overflow-x-auto rounded-lg border border-gray-200 mt-6">
        <table className="min-w-full text-sm text-left text-gray-700">
          <thead className="bg-gray-100 text-xs text-gray-600 uppercase">
            <tr>
              <th className="px-4 py-3">Gambar</th>
              <th className="px-4 py-3">Nama</th>
              <th className="px-4 py-3">Brand</th>
              <th className="px-4 py-3">Harga/kg</th>
              <th className="px-4 py-3">Stok</th>
              <th className="px-4 py-3">Tipe</th>
              <th className="px-4 py-3">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products.map((product: any) => (
                <tr key={product._id} className="border-t hover:bg-green-50 transition-colors">
                  <td className="px-4 py-3">
                    {product.image ? (
                      <img
                        src={`http://localhost:5000${product.image}`}
                        alt={product.name}
                        className="h-12 w-12 object-contain rounded border"
                      />
                    ) : (
                      <span className="text-gray-400 italic">N/A</span>
                    )}
                  </td>

                  <td className="px-4 py-3 font-medium">
                    {editingId === product._id ? (
                      <input
                        name="name"
                        value={editForm.name}
                        onChange={handleEditChange}
                        className="border rounded px-2 py-1 text-sm"
                      />
                    ) : (
                      product.name
                    )}
                  </td>

                  <td className="px-4 py-3">
                    {editingId === product._id ? (
                      <input
                        name="brand"
                        value={editForm.brand}
                        onChange={handleEditChange}
                        className="border rounded px-2 py-1 text-sm"
                      />
                    ) : (
                      product.brand?.name || '-'
                    )}
                  </td>

                  <td className="px-4 py-3 text-green-700 font-semibold">
                    {editingId === product._id ? (
                      <input
                        name="pricePerKg"
                        value={editForm.pricePerKg}
                        onChange={handleEditChange}
                        className="border rounded px-2 py-1 text-sm"
                        type="number"
                      />
                    ) : (
                      'Rp' + product.pricePerKg.toLocaleString()
                    )}
                  </td>

                  <td className="px-4 py-3">
                    {editingId === product._id ? (
                      <input
                        name="stockKg"
                        value={editForm.stockKg}
                        onChange={handleEditChange}
                        className="border rounded px-2 py-1 text-sm"
                        type="number"
                      />
                    ) : (
                      product.stockKg + ' kg'
                    )}
                  </td>

                  <td className="px-4 py-3">
                    {editingId === product._id ? (
                      <select
                        name="type"
                        value={editForm.type}
                        onChange={handleEditChange}
                        className="border rounded px-2 py-1 text-sm"
                      >
                        <option value="Lokal">Lokal</option>
                        <option value="Hibrida">Hibrida</option>
                      </select>
                    ) : (
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          product.type === 'Hibrida'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {product.type}
                      </span>
                    )}
                  </td>

                  <td className="px-4 py-3 space-x-2">
                    {editingId === product._id ? (
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
                          onClick={() => handleEditClick(product)}
                          className="bg-yellow-400 text-white px-2 py-1 rounded text-xs"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(product._id)}
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
                <td colSpan={7} className="text-center py-4 text-gray-500">
                  Tidak ada produk ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
