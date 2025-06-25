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
  image?: string; // dari backend
};

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

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
          {products.map((product) => (
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

                <a
                    href={`https://wa.me/6285173342484?text=${encodeURIComponent(
                        `Halo, saya tertarik dengan produk *${product.name}* seharga *Rp${product.pricePerKg.toLocaleString(
                        'id-ID'
                        )}/kg*. Apakah masih tersedia?`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full block px-5 bg-green-600 text-white py-2 rounded-xl font-semibold hover:bg-green-700 transition"
                    >
                    Beli Sekarang
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
