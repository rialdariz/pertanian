'use client'
import { useEffect, useState } from "react"

export default function OrderPage() {
  const [orders, setOrders] = useState([])

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/orders')
        const data = await res.json()
        setOrders(data?.data || [])
      } catch (err) {
        console.error("Gagal mengambil data orders:", err)
        setOrders([])
      }
    }

    fetchOrders()
  }, [])

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">📋 Daftar Pesanan</h2>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full text-sm text-left text-gray-700">
          <thead className="bg-gray-100 text-xs text-gray-600 uppercase">
            <tr>
              <th className="px-4 py-3">Pelanggan</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((order: any) => (
                <tr key={order._id} className="border-t hover:bg-green-50 transition-colors">
                  <td className="px-4 py-3 font-medium">{order.customer?.name || '-'}</td>
                  <td className="px-4 py-3 text-green-700 font-semibold">
                    Rp{order.totalPrice.toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        order.status === 'completed'
                          ? 'bg-green-100 text-green-700'
                          : order.status === 'processing'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="text-center px-4 py-6 text-gray-500">
                  Tidak ada pesanan yang tersedia.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
