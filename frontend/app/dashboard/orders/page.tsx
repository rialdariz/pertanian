'use client'

import { useEffect, useState } from 'react'

type Purchase = {
  _id: string;
  product: {
    _id: string;
    name: string;
    pricePerKg: number;
  };
  qty: number;
  totalPrice: number;
  purchasedAt: string;
};

export default function PurchaseHistoryPage() {
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/beli');
        const data = await res.json();
        setPurchases(Array.isArray(data) ? data : data.data || []);
      } catch (err) {
        console.error(err);
        setError('Gagal memuat riwayat pembelian.');
      } finally {
        setLoading(false);
      }
    };

    fetchPurchases()
  }, [])

  return (
    <section className="max-w-4xl mx-auto py-12 px-4">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Riwayat Pembelian</h2>

      {loading ? (
        <p className="text-gray-500">Memuat data...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : purchases.length === 0 ? (
        <p className="text-gray-500">Belum ada riwayat pembelian.</p>
      ) : (
        <div className="space-y-4">
          {purchases.map((purchase) => (
            <div
              key={purchase._id}
              className="border border-gray-200 rounded-xl p-4 shadow-sm bg-white"
            >
              <h3 className="text-lg font-semibold text-gray-800">
                {purchase.product.name}
              </h3>
              <p className="text-sm text-gray-500">
                Jumlah: {purchase.qty} kg &nbsp;|&nbsp; Harga per kg: Rp
                {purchase.product.pricePerKg.toLocaleString('id-ID')}
              </p>
              <p className="text-sm text-gray-700 mt-1">
                Total: <strong>Rp{purchase.totalPrice.toLocaleString('id-ID')}</strong>
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Tanggal: {new Date(purchase.purchasedAt).toLocaleString('id-ID')}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
