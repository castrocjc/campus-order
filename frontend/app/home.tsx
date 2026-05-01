import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { getToken, logout } from "../src/services/authService";
import { getMenu } from "../src/services/productService";
import { createOrder } from "../src/services/orderService";

export default function HomeScreen() {
  const router = useRouter();

  const [checkingSession, setCheckingSession] = useState(true);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔥 carrito persistente
  const [cart, setCart] = useState<any[]>(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // 🔥 guardar carrito automáticamente
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const token = getToken();

      if (!token) {
        router.replace("/");
        return;
      }

      setCheckingSession(false);
      loadProducts();
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  const loadProducts = async () => {
    try {
      const data = await getMenu();
      setProducts(data);
    } catch (error) {
      console.error("Error cargando menú", error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product: any) => {
    setCart((currentCart) => {
      const existing = currentCart.find((item) => item.id === product.id);

      if (existing) {
        return currentCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...currentCart, { ...product, quantity: 1 }];
    });
  };

  const handleCreateOrder = async () => {
    if (cart.length === 0) {
      alert("El carrito está vacío");
      return;
    }

    try {
      await createOrder(cart);

      alert("Pedido creado correctamente");

      setCart([]);
      localStorage.removeItem("cart");

    } catch (error: any) {
      alert(error.message || "Error creando pedido");
    }
  };
  
  const handleLogout = () => {
    logout();
    router.replace("/");
  };

  if (checkingSession || loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Cargando menú...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Menú COFIGO</Text>

      <FlatList
        data={products}
        keyExtractor={(item, index) => `${item.category}-${index}`}
        renderItem={({ item }) => (
          <View style={styles.categorySection}>
            <Text style={styles.categoryTitle}>{item.category}</Text>

            {item.products.map((product: any) => (
              <View key={product.id} style={styles.card}>
                <Text style={styles.productName}>{product.name}</Text>

                <Text style={styles.productDescription}>
                  {product.description}
                </Text>

                <View style={styles.productFooter}>
                  <Text style={styles.productPrice}>
                    S/ {product.price}
                  </Text>

                  <Text style={styles.productStock}>
                    Stock: {product.stock}
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.addButton}
                  onPress={() => addToCart(product)}
                >
                  <Text style={styles.addButtonText}>
                    Agregar al carrito
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      />

      {/* 🔥 resumen carrito */}
      <View style={styles.cartBox}>
        <Text style={styles.cartTitle}>Carrito</Text>

        <Text style={styles.cartText}>
          Productos:{" "}
          {cart.reduce((t, item) => t + item.quantity, 0)}
        </Text>

        <Text style={styles.cartText}>
          Total: S/{" "}
          {cart
            .reduce(
              (t, item) => t + item.price * item.quantity,
              0
            )
            .toFixed(2)}
        </Text>

        <TouchableOpacity
          style={styles.clearButton}
          onPress={() => setCart([])}
        >
          <Text style={styles.clearButtonText}>
            Vaciar carrito
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.orderButton}
        onPress={handleCreateOrder}
      >
        <Text style={styles.orderButtonText}>Realizar pedido</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={styles.orderButton}
        onPress={() => router.push("/my-orders")}
      >
        <Text style={styles.orderButtonText}>Ver mis pedidos</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>Cerrar sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff8f1",
    padding: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: "900",
    color: "#3b1f12",
    marginBottom: 20,
  },

  categorySection: {
    marginBottom: 20,
  },

  categoryTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: "#3b1f12",
    marginBottom: 12,
  },

  card: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },

  productName: {
    fontSize: 18,
    fontWeight: "800",
    color: "#3b1f12",
  },

  productDescription: {
    fontSize: 14,
    color: "#7a6a61",
    marginTop: 4,
  },

  productFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },

  productPrice: {
    fontSize: 16,
    fontWeight: "700",
    color: "#f57c00",
  },

  productStock: {
    fontSize: 14,
    color: "#7a6a61",
    fontWeight: "700",
  },

  addButton: {
    marginTop: 14,
    backgroundColor: "#f57c00",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
  },

  addButtonText: {
    color: "#ffffff",
    fontWeight: "800",
  },

  cartBox: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 16,
    marginTop: 12,
  },

  cartTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#3b1f12",
    marginBottom: 6,
  },

  cartText: {
    fontSize: 15,
    color: "#7a6a61",
    fontWeight: "700",
  },

  clearButton: {
    marginTop: 10,
    backgroundColor: "#ddd",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
  },

  clearButtonText: {
    fontWeight: "700",
    color: "#333",
  },

  button: {
    marginTop: 20,
    backgroundColor: "#3b1f12",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "800",
  },

  orderButton: {
    marginTop: 10,
    backgroundColor: "#3b1f12",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },

  orderButtonText: {
    color: "#fff",
    fontWeight: "800",
  },  
});