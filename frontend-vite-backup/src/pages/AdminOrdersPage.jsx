import { useEffect, useState } from "react";
import api from "../services/api";

function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);

  const loadOrders = () => {
    api.get("/orders")
      .then(res => setOrders(res.data.data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const updateStatus = (orderId, status) => {
    api.put(`/orders/${orderId}/status?status=${status}`)
      .then(() => loadOrders())
      .catch(err => console.error(err));
  };

  return (
    <section className="mt-10">
      <h1 className="text-3xl font-bold mb-6">Panel de pedidos</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {orders.map(order => (
          <div
            key={order.id}
            className="bg-slate-900 border border-slate-700 rounded-xl p-5"
          >
            <h3 className="text-xl font-semibold mb-2">
              Pedido #{order.id}
            </h3>

            <p className="text-slate-300">
              <strong>Usuario:</strong> {order.userId}
            </p>

            <p className="text-slate-300">
              <strong>Estado:</strong> {order.status}
            </p>

            <p className="text-slate-300">
              <strong>Total:</strong> ${Number(order.totalAmount).toFixed(2)}
            </p>

            <div className="mt-4">
              <label className="block text-sm text-slate-400 mb-1">
                Cambiar estado
              </label>

              <select
                value={order.status}
                onChange={(e) => updateStatus(order.id, e.target.value)}
                className="w-full bg-slate-800 border border-slate-600 rounded-lg p-2"
              >
                <option value="RECEIVED">RECEIVED</option>
                <option value="IN_PREPARATION">IN_PREPARATION</option>
                <option value="READY_FOR_PICKUP">READY_FOR_PICKUP</option>
                <option value="DELIVERED">DELIVERED</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default AdminOrdersPage;