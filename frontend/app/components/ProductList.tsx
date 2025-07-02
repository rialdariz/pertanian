'use client'
import { useState, useEffect } from 'react'

type Product = {
  _id: string;
  name: string;
  description?: string;
  brand: {
    _id: string;
    name: string;
  };
  pricePerKg: number;
  stockKg: number;
  type: 'Hibrida' | 'Lokal';
  image?: string;
};

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [buyQty, setBuyQty] = useState<{ [id: string]: number }>({})

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/products')
        const data = await res.json()
        setProducts(data.data || [])
      } catch (err) {
        setError('Gagal memuat produk.')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const handleBuy = async (id: string) => {
    const qty = buyQty[id] || 1
    if (qty <= 0) return alert('Jumlah pembelian harus lebih dari 0.')

    try {
      const res = await fetch(`http://localhost:5000/api/products/${id}/buy`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ qty }),
      })

      if (!res.ok) {
        const err = await res.json()
        return alert(err.message || 'Pembelian gagal')
      }

      const result = await res.json()

      setProducts(prev =>
        prev.map(p => (p._id === id ? { ...p, stockKg: result.product.stockKg } : p))
      )
      alert(`Berhasil membeli ${qty} kg ${result.product.name}`)
    } catch (err) {
      console.error(err)
      alert('Terjadi kesalahan saat pembelian.')
    }
  }

  return (
    <section id="produk" className="py-16 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-3">
          Produk Unggulan
        </h2>
        <p className="text-gray-600">Padi pilihan terbaik dari petani lokal kami</p>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Memuat produk...</p>
      ) : error ? (
        <p className="text-center text-red-600">{error}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {products.map(product => (
            <div
              key={product._id}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all border border-gray-100"
            >
              <img
                src={
                  product.image
                    ? `http://localhost:5000${product.image}`
                    : '/images/default-padi.jpg'
                }
                alt={product.name}
                className="w-full h-48 object-cover rounded-t-2xl"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800">{product.name}</h3>
                <p className="text-sm text-gray-500 mb-2">{product.description}</p>

                <div className="flex flex-wrap text-sm text-gray-600 gap-2 mt-2 mb-4">
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">
                    {product.brand?.name || 'Tanpa Brand'}
                  </span>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                    {product.type}
                  </span>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <p className="text-lg font-bold text-green-700">
                    Rp{product.pricePerKg.toLocaleString('id-ID')}/kg
                  </p>
                  <span className="text-sm text-gray-500">{product.stockKg} kg tersedia</span>
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <input
                    type="number"
                    min={1}
                    max={product.stockKg}
                    value={buyQty[product._id] || 1}
                    onChange={e =>
                      setBuyQty(prev => ({
                        ...prev,
                        [product._id]: parseInt(e.target.value) || 1,
                      }))
                    }
                    className="w-20 px-3 py-1 border border-gray-300 rounded-md text-sm"
                  />
                  <span className="text-sm text-gray-600">kg</span>
                </div>

                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => handleBuy(product._id)}
                    disabled={product.stockKg <= 0}
                    className={`w-full px-4 py-2 rounded-xl font-semibold transition ${
                      product.stockKg > 0
                        ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    Beli Sekarang
                  </button>

                  <a
                    href={`https://wa.me/6285173342484?text=${encodeURIComponent(
                      `Halo, saya tertarik dengan produk *${product.name}* seharga *Rp${product.pricePerKg.toLocaleString(
                        'id-ID'
                      )}/kg*. Apakah masih tersedia?`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full block text-center px-4 py-2 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition"
                  >
                    Hubungi via WhatsApp
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
