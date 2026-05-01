import { useEffect, useState } from "react";
import api from "../services/api";

function OrdersPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api.get("/orders/my-orders")
      .then(res => setOrders(res.data.data))
      .catch(err => console.error(err));
  }, []);

  const getStatusStyle = (status) => {
    const styles = {
      RECEIVED: "bg-blue-600",
      IN_PREPARATION: "bg-yellow-600",
      READY_FOR_PICKUP: "bg-purple-600",
      DELIVERED: "bg-green-600",
      CANCELLED: "bg-red-600"
    };

    return styles[status] || "bg-slate-600";
  };

  return (
    <section className="mt-10">
      <h1 className="text-3xl font-bold mb-6">Mis pedidos</h1>

      {orders.length === 0 ? (
        <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
          <p className="text-slate-400">No tienes pedidos registrados.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {orders.map(order => (
            <div
              key={order.id}
              className="bg-slate-900 border border-slate-700 rounded-xl p-5 shadow"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Pedido #{order.id}</h3>

                <span
                  className={`${getStatusStyle(order.status)} text-white text-xs px-3 py-1 rounded-full`}
                >
                  {order.status}
                </span>
              </div>

              <div className="space-y-2 text-sm text-slate-300">
                <p>
                  <strong>Total:</strong> ${Number(order.totalAmount).toFixed(2)}
                </p>
                <p>
                  <strong>Recojo:</strong> {new Date(order.pickupTime).toLocaleString()}
                </p>
                <p>
                  <strong>Creado:</strong> {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>

              <div className="mt-4 border-t border-slate-700 pt-4">
                <h4 className="font-semibold mb-2">Productos</h4>

                <div className="space-y-2">
                  {order.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between text-sm text-slate-300"
                    >
                      <span>
                        {item.productName} x {item.quantity}
                      </span>
                      <span>${Number(item.subtotal).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default OrdersPage;