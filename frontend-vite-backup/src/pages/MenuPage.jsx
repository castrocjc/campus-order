import { useEffect, useState } from "react";
import api from "../services/api";

function MenuPage({ user }) {
  const [menu, setMenu] = useState([]);
  const [success, setSuccess] = useState(false);
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    api.get("/products/menu")
      .then(res => setMenu(res.data.data))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    setSuccess(false);

    setCart(prevCart => {
      const existingProduct = prevCart.find(item => item.productId === product.id);

      if (existingProduct) {
        return prevCart.map(item =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [
        ...prevCart,
        {
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: 1
        }
      ];
    });
  };

  const increaseQuantity = (productId) => {
    setSuccess(false);

    setCart(prevCart =>
      prevCart.map(item =>
        item.productId === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const decreaseQuantity = (productId) => {
    setSuccess(false);

    setCart(prevCart =>
      prevCart
        .map(item =>
          item.productId === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter(item => item.quantity > 0)
    );
  };

  const removeFromCart = (productId) => {
    setSuccess(false);

    setCart(prevCart =>
      prevCart.filter(item => item.productId !== productId)
    );
  };

  const getCartTotal = () => {
    return cart.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const createOrder = () => {
    const payload = {
      pickupTime: "2026-04-30T14:30:00",
      items: cart.map(item => ({
        productId: item.productId,
        quantity: item.quantity
      }))
    };

    api.post("/orders", payload)
      .then(res => {
        setSuccess(true);
        setCart([]);
        localStorage.removeItem("cart");
        console.log(res.data);
      })
      .catch(err => {
        alert(err.response?.data?.message || "Error al crear pedido");
        console.error(err);
      });
  };

  return (
    <div>
      {success && (
        <div className="bg-green-600 text-white p-3 rounded-lg mb-6">
          Pedido creado correctamente
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2">
          <h1 className="text-4xl font-bold mb-6">Menú</h1>

          {menu.map((category, index) => (
            <div key={index} className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">{category.category}</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {category.products.map(product => (
                  <div
                    key={product.id}
                    className="bg-slate-900 border border-slate-700 rounded-xl p-5 shadow"
                  >
                    <h3 className="text-xl font-semibold">{product.name}</h3>
                    <p className="text-slate-400 mt-1">{product.description}</p>

                    <div className="flex justify-between items-center mt-4">
                      <span className="text-lg font-bold">
                        ${Number(product.price).toFixed(2)}
                      </span>

                      <button
                        onClick={() => addToCart(product)}
                        className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm"
                      >
                        Agregar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>

        <aside className="bg-slate-900 border border-slate-700 rounded-xl p-5 h-fit sticky top-6">
          <h2 className="text-2xl font-bold mb-4">Carrito</h2>

          {cart.length === 0 ? (
            <p className="text-slate-400">El carrito está vacío</p>
          ) : (
            <>
              <div className="space-y-4">
                {cart.map(item => (
                  <div
                    key={item.productId}
                    className="border-b border-slate-700 pb-3"
                  >
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-slate-400 text-sm">
                      ${Number(item.price).toFixed(2)} x {item.quantity} = $
                      {(item.price * item.quantity).toFixed(2)}
                    </p>

                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => decreaseQuantity(item.productId)}
                        className="bg-slate-700 px-3 py-1 rounded"
                      >
                        -
                      </button>

                      <button
                        onClick={() => increaseQuantity(item.productId)}
                        className="bg-slate-700 px-3 py-1 rounded"
                      >
                        +
                      </button>

                      <button
                        onClick={() => removeFromCart(item.productId)}
                        className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 border-t border-slate-700 pt-4">
                <h3 className="text-xl font-bold">
                  Total: ${getCartTotal().toFixed(2)}
                </h3>

                <button
                  onClick={createOrder}
                  className="w-full bg-green-600 hover:bg-green-700 mt-4 py-3 rounded-lg font-semibold"
                >
                  Confirmar pedido
                </button>
              </div>
            </>
          )}
        </aside>
      </div>
    </div>
  );
}

export default MenuPage;