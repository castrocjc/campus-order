import { useEffect, useState } from "react";
import { Stack, useRouter } from "expo-router";
import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { getToken, logout } from "../src/services/authService";
import { getMenu } from "../src/services/productService";
import { createOrder } from "../src/services/orderService";

const productPlaceholder = require("../assets/product-placeholder.png");

const getProductImageSource = (product: any) => {
  const imageUrl = product?.imageUrl || product?.image_url;

  if (typeof imageUrl === "string" && imageUrl.trim().length > 0) {
    return { uri: imageUrl.trim() };
  }

  return productPlaceholder;
};

export default function HomeScreen() {
  const router = useRouter();

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [pickupTime, setPickupTime] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"success" | "error">("success");

  const [cart, setCart] = useState<any[]>(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const categories = ["Todos", ...products.map((item) => item.category)];

  const filteredProducts =
    selectedCategory === "Todos"
      ? products
      : products.filter((item) => item.category === selectedCategory);

  const pickupOptions = [
    "11:30",
    "12:00",
    "12:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
  ];

  useEffect(() => {
    const token = getToken();

    if (!token) {
      router.replace("/");
      return;
    }

    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    loadProducts();
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const loadProducts = async () => {
    try {
      const response = await getMenu();

      const menuList = Array.isArray(response)
        ? response
        : response?.data ?? [];

      setProducts(menuList);
    } catch (error) {
      console.error("Error cargando menú", error);
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (
    text: string,
    type: "success" | "error" = "success"
  ) => {
    setMessageType(type);
    setMessage(text);

    setTimeout(() => {
      setMessage(null);
    }, 1200);
  };

  const addToCart = (product: any) => {
    setCart((currentCart) => {
      const existing = currentCart.find((i) => i.id === product.id);

      if (existing && existing.quantity >= product.stock) {
        showMessage("No hay más stock disponible", "error");
        return currentCart;
      }

      if (product.stock <= 0) {
        showMessage("Producto sin stock", "error");
        return currentCart;
      }

      setTimeout(() => {
        showMessage(`${product.name} agregado`, "success");
      }, 20);

      if (existing) {
        return currentCart.map((i) =>
          i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }

      return [...currentCart, { ...product, quantity: 1 }];
    });
  };

  const decreaseQuantity = (productId: number) => {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (productId: number) => {
    setCart((currentCart) => currentCart.filter((item) => item.id !== productId));
  };

  const handleCreateOrder = async () => {
    if (cart.length === 0) {
      showMessage("El carrito está vacío", "error");
      return;
    }

    if (!pickupTime) {
      showMessage("Selecciona una hora de recojo", "error");
      return;
    }

    try {
      await createOrder(cart, pickupTime);
      showMessage("Pedido creado correctamente", "success");
      setCart([]);
      setPickupTime("");
      localStorage.removeItem("cart");
    } catch (error: any) {
      showMessage("Error creando pedido", "error");
    }
  };

  const handleLogout = () => {
    logout();
    localStorage.removeItem("cart");
    router.replace("/");
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Cargando...</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Menú COFIGO</Text>
            <Text style={styles.subtitle}>Pide hoy, recoge sin esperas</Text>
          </View>

          <View style={styles.headerActions}>
            {user?.role === "ADMIN" && (
              <>
                <TouchableOpacity
                  style={styles.backBtn}
                  onPress={() => router.push("/admin-orders")}
                >
                  <Text style={styles.backBtnText}>Pedidos</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.backBtn}
                  onPress={() => router.push("/admin-products")}
                >
                  <Text style={styles.backBtnText}>Productos</Text>
                </TouchableOpacity>
              </>
            )}

            <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
              <Text style={styles.logoutBtnText}>Salir</Text>
            </TouchableOpacity>
          </View>
        </View>

        {message && (
          <View style={styles.toastContainer}>
            <Text
              style={[
                styles.toast,
                messageType === "error" && styles.toastError,
              ]}
            >
              {message}
            </Text>
          </View>
        )}

        <View style={styles.mainLayout}>
          <View style={styles.productsPanel}>
            <View style={styles.categoryFilterBox}>
              <Text style={styles.filterTitle}>Categorías</Text>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoryFilterContent}
              >
                {categories.map((category) => (
                  <TouchableOpacity
                    key={category}
                    style={[
                      styles.categoryFilterButton,
                      selectedCategory === category && styles.categoryFilterButtonActive,
                    ]}
                    onPress={() => setSelectedCategory(category)}
                  >
                    <Text
                      style={[
                        styles.categoryFilterText,
                        selectedCategory === category && styles.categoryFilterTextActive,
                      ]}
                    >
                      {category}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <FlatList
              data={filteredProducts}
              keyExtractor={(item, index) => `${item.category}-${index}`}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.productsListContent}
              renderItem={({ item }) => (
                <View style={styles.categorySection}>
                  <Text style={styles.categoryTitle}>{item.category}</Text>

                  <View style={styles.productsGrid}>
                    {item.products.map((product: any) => (
                      <View key={product.id} style={styles.productCard}>
                        <Image
                          source={getProductImageSource(product)}
                          style={styles.productImage}
                          resizeMode="cover"
                        />

                        <View style={styles.productInfo}>
                          <Text style={styles.productName}>{product.name}</Text>
                          <Text style={styles.productDescription} numberOfLines={2}>
                            {product.description}
                          </Text>

                          <View style={styles.productMetaRow}>
                            <Text style={styles.productPrice}>S/ {product.price}</Text>
                            <Text style={styles.productStock}>Stock: {product.stock}</Text>
                          </View>

                          <TouchableOpacity
                            style={[
                              styles.addButton,
                              product.stock === 0 && styles.disabledButton,
                            ]}
                            onPress={() => addToCart(product)}
                            disabled={product.stock === 0}
                          >
                            <Text style={styles.addButtonText}>
                              {product.stock === 0 ? "Sin stock" : "+ Agregar"}
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    ))}
                  </View>
                </View>
              )}
            />
          </View>

          <View style={styles.sidePanel}>
            <View style={styles.cartBox}>
              <Text style={styles.cartTitle}>Carrito</Text>
              <Text style={styles.cartSubtitle}>Resumen</Text>

              <View style={styles.pickupBox}>
                <Text style={styles.pickupTitle}>Hora de recojo</Text>

                <View style={styles.pickupOptions}>
                  {pickupOptions.map((time) => (
                    <TouchableOpacity
                      key={time}
                      style={[
                        styles.pickupButton,
                        pickupTime === time && styles.pickupButtonActive,
                      ]}
                      onPress={() => setPickupTime(time)}
                    >
                      <Text
                        style={[
                          styles.pickupButtonText,
                          pickupTime === time && styles.pickupButtonTextActive,
                        ]}
                      >
                        {time}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {cart.length === 0 ? (
                <Text style={styles.emptyCart}>Tu carrito está vacío</Text>
              ) : (
                <ScrollView
                  style={styles.cartItemsScroll}
                  showsVerticalScrollIndicator={false}
                >
                  {cart.map((item) => (
                    <View key={item.id} style={styles.cartItem}>
                      <View style={styles.cartItemInfo}>
                        <Text style={styles.cartItemName}>{item.name}</Text>
                        <Text style={styles.cartItemPrice}>
                          S/ {(item.price * item.quantity).toFixed(2)}
                        </Text>
                      </View>

                      <View style={styles.quantityControls}>
                        <TouchableOpacity
                          style={styles.quantityButton}
                          onPress={() => decreaseQuantity(item.id)}
                        >
                          <Text style={styles.quantityButtonText}>-</Text>
                        </TouchableOpacity>

                        <Text style={styles.quantityText}>{item.quantity}</Text>

                        <TouchableOpacity
                          style={styles.quantityButton}
                          onPress={() => addToCart(item)}
                        >
                          <Text style={styles.quantityButtonText}>+</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={styles.removeButton}
                          onPress={() => removeFromCart(item.id)}
                        >
                          <Text style={styles.removeButtonText}>x</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}
                </ScrollView>
              )}

              <View style={styles.totalRow}>
                <Text style={styles.cartTotalLabel}>Total:</Text>
                <Text style={styles.cartTotalAmount}>
                  S/ {cart.reduce((t, i) => t + i.price * i.quantity, 0).toFixed(2)}
                </Text>
              </View>

              <TouchableOpacity style={styles.clearButton} onPress={() => setCart([])}>
                <Text style={styles.clearButtonText}>Vaciar carrito</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.sideActions}>
              <TouchableOpacity style={styles.mainButton} onPress={handleCreateOrder}>
                <Text style={styles.mainButtonText}>Realizar pedido</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.mainButton}
                onPress={() => router.push("/my-orders")}
              >
                <Text style={styles.mainButtonText}>Ver mis pedidos</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff8f1",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    gap: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
    color: "#3b1f12",
  },
  subtitle: {
    marginTop: 2,
    color: "#7a6a61",
    fontWeight: "700",
  },
  headerActions: {
    flexDirection: "row",
    gap: 8,
  },
  backBtn: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ead8c8",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  backBtnText: {
    color: "#3b1f12",
    fontWeight: "900",
    fontSize: 12,
  },
  logoutBtn: {
    backgroundColor: "#b42318",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  logoutBtnText: {
    color: "#fff",
    fontWeight: "900",
    fontSize: 12,
  },
  mainLayout: {
    flex: 1,
    flexDirection: "row",
    gap: 16,
    minHeight: 0,
  },
  productsPanel: {
    flex: 1.6,
    minHeight: 0,
  },
  sidePanel: {
    flex: 1,
    minHeight: 0,
  },
  categoryFilterBox: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#ead8c8",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  filterTitle: {
    color: "#3b1f12",
    fontWeight: "900",
    marginBottom: 10,
  },
  categoryFilterContent: {
    gap: 8,
    paddingRight: 8,
  },
  categoryFilterButton: {
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: 999,
    backgroundColor: "#fff8f1",
    borderWidth: 1,
    borderColor: "#ead8c8",
  },
  categoryFilterButtonActive: {
    backgroundColor: "#f57c00",
    borderColor: "#f57c00",
  },
  categoryFilterText: {
    color: "#3b1f12",
    fontWeight: "900",
    fontSize: 13,
  },
  categoryFilterTextActive: {
    color: "#fff",
  },
  productsListContent: {
    paddingBottom: 16,
  },
  categorySection: {
    marginBottom: 18,
  },
  categoryTitle: {
    fontSize: 22,
    fontWeight: "900",
    marginBottom: 12,
  },
  productsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  productCard: {
    width: "31.8%",
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#ead8c8",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  productImage: {
    width: "100%",
    height: 128,
    backgroundColor: "#f2e2d2",
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    fontSize: 16,
    fontWeight: "900",
    color: "#3b1f12",
  },
  productDescription: {
    fontSize: 13,
    color: "#7a6a61",
    marginTop: 4,
    minHeight: 34,
  },
  productMetaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 10,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: "900",
    color: "#f57c00",
  },
  productStock: {
    fontSize: 12,
    color: "#188038",
    fontWeight: "900",
  },
  addButton: {
    backgroundColor: "#f57c00",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "900",
    fontSize: 13,
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  cartBox: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    maxHeight: 540,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  cartTitle: {
    fontSize: 20,
    fontWeight: "900",
  },
  cartSubtitle: {
    fontWeight: "900",
    marginBottom: 14,
  },
  pickupBox: {
    marginBottom: 12,
  },
  pickupTitle: {
    fontWeight: "900",
    marginBottom: 10,
  },
  pickupOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  pickupButton: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  pickupButtonActive: {
    backgroundColor: "#f57c00",
    borderColor: "#f57c00",
  },
  pickupButtonText: {
    fontWeight: "900",
  },
  pickupButtonTextActive: {
    color: "#fff",
  },
  emptyCart: {
    color: "#7a6a61",
    fontWeight: "700",
    marginTop: 8,
  },
  cartItemsScroll: {
    maxHeight: 250,
    marginTop: 6,
    marginBottom: 10,
  },
  cartItem: {
    backgroundColor: "#ffffff",
    padding: 10,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#ead8c8",
  },
  cartItemInfo: {
    marginBottom: 8,
  },
  cartItemName: {
    color: "#3b1f12",
    fontWeight: "900",
    fontSize: 14,
  },
  cartItemPrice: {
    color: "#f57c00",
    fontWeight: "900",
    marginTop: 2,
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  quantityButton: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: "#f57c00",
    alignItems: "center",
    justifyContent: "center",
  },
  quantityButtonText: {
    color: "#fff",
    fontWeight: "900",
    fontSize: 18,
  },
  quantityText: {
    minWidth: 24,
    textAlign: "center",
    fontWeight: "900",
    color: "#3b1f12",
  },
  removeButton: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: "#b42318",
    alignItems: "center",
    justifyContent: "center",
  },
  removeButtonText: {
    color: "#fff",
    fontWeight: "900",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 6,
  },
  cartTotalLabel: {
    fontSize: 16,
    fontWeight: "900",
    color: "#3b1f12",
  },
  cartTotalAmount: {
    fontSize: 18,
    fontWeight: "900",
    color: "#f57c00",
  },
  clearButton: {
    marginTop: 10,
    backgroundColor: "#ddd",
    padding: 10,
    borderRadius: 10,
  },
  clearButtonText: {
    textAlign: "center",
  },
  sideActions: {
    marginTop: 12,
    gap: 10,
  },
  mainButton: {
    backgroundColor: "#3b1f12",
    padding: 16,
    borderRadius: 12,
  },
  mainButtonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "900",
  },
  toastContainer: {
    position: "absolute",
    top: 70,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 1000,
  },
  toast: {
    alignSelf: "center",
    backgroundColor: "#e7f7ed",
    color: "#1f7a3f",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
    fontWeight: "700",
    fontSize: 13,
    textAlign: "center",
  },
  toastError: {
    backgroundColor: "#fdecea",
    color: "#b71c1c",
  },
});
