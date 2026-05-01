import { useState } from "react";
import LoginPage from "./pages/LoginPage";
import MenuPage from "./pages/MenuPage";
import OrdersPage from "./pages/OrdersPage";
import AdminOrdersPage from "./pages/AdminOrdersPage";
import ReportsPage from "./pages/ReportsPage";

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      {user ? (
        <>
          <div className="flex justify-between items-center mb-6">
            <p className="text-lg">Bienvenido, {user.name}</p>
              <button
                onClick={logout}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg"
              >
                Cerrar sesión
              </button>
          </div>

          <MenuPage user={user} />
          <OrdersPage />
          {user.role === "ADMIN" && <AdminOrdersPage />}
          {user.role === "ADMIN" && <ReportsPage />}
        </>
      ) : (
        <LoginPage onLogin={setUser} />
      )}
    </div>
  );

}

export default App;