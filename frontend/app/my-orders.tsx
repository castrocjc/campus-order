import { useEffect, useState } from "react";
import { Stack, useRouter } from "expo-router";
import {
  FlatList,
  useWindowDimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import SideMenu from "../components/ui/SideMenu";
import { cancelOrder, getMyOrders } from "../src/services/orderService";


export default function MyOrdersScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"success" | "error">(
    "success",
  );
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        setUser(null);
      }
    }

    loadOrders();

    const interval = setInterval(() => {
      loadOrders();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const loadOrders = async () => {
    try {
      const data = await getMyOrders();

      data.sort(
        (a: any, b: any) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );

      const readyOrder = data.find(
        (order: any) => order.status === "READY_FOR_PICKUP",
      );

      if (readyOrder) {
        setMessageType("success");
        setMessage(`Tu pedido #${readyOrder.id} está listo para recoger.`);
      }

      setOrders(data);
    } catch (error) {
      console.error("Error cargando pedidos", error);
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (text: string, type: "success" | "error" = "success") => {
    setMessageType(type);
    setMessage(text);

    setTimeout(() => {
      setMessage(null);
    }, 1200);
  };

  const handleCancelOrder = async (orderId: number) => {
    try {
      await cancelOrder(orderId);
      showMessage("Pedido cancelado correctamente", "success");
      loadOrders();
    } catch {
      showMessage("No se pudo cancelar el pedido", "error");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("cart");
    router.replace("/");
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "RECEIVED":
        return { backgroundColor: "#F59E0B" };
      case "IN_PREPARATION":
        return { backgroundColor: "#2563EB" };
      case "READY_FOR_PICKUP":
        return { backgroundColor: "#16A34A" };
      case "DELIVERED":
        return { backgroundColor: "#64748B" };
      case "NOT_ATTENDED":
        return { backgroundColor: "#7C3AED" };
      case "CANCELLED":
        return { backgroundColor: "#DC2626" };
      default:
        return { backgroundColor: "#6B7280" };
    }
  };

  const formatStatus = (status: string) => {
    switch (status) {
      case "RECEIVED":
        return "Recibido";
      case "IN_PREPARATION":
        return "En preparación";
      case "READY_FOR_PICKUP":
        return "Listo para recoger";
      case "DELIVERED":
        return "Entregado";
      case "NOT_ATTENDED":
        return "No atendido";
      case "CANCELLED":
        return "Cancelado";
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Cargando pedidos...</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={[styles.container, isMobile && styles.containerMobile]}>
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

        <View style={[styles.header, isMobile && styles.headerMobile]}>
          <View>
            <Text style={styles.title}>Menú COFIGO</Text>

            <Text style={styles.welcomeText}>
              Bienvenido {user?.name || "Usuario"}
            </Text>

            <Text style={styles.roleText}>Rol: {user?.role || "USER"}</Text>

            <Text style={styles.subtitle}>Seguimiento de tus pedidos</Text>
          </View>
        </View>

        <View style={[styles.shellLayout, isMobile && styles.shellLayoutMobile]}>
          <SideMenu role="USER" onLogout={handleLogout} />

          <View style={styles.content}>
            <View style={styles.listCard}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Pedidos registrados</Text>
                <Text style={styles.cardSubtitle}>
                  {orders.length} pedidos en vista
                </Text>
              </View>

              <FlatList
                style={styles.ordersList}
                contentContainerStyle={[
                  styles.ordersListContent,
                  isMobile && styles.ordersListContentMobile,
                ]}
                data={orders}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <View style={styles.card}>
                    <Text style={styles.orderId}>Pedido #{item.id}</Text>

                    <View
                      style={[styles.statusBadge, getStatusStyle(item.status)]}
                    >
                      <Text style={styles.statusText}>
                        {formatStatus(item.status)}
                      </Text>
                    </View>

                    <Text style={styles.text}>
                      Recojo: {new Date(item.pickupTime).toLocaleTimeString()}
                    </Text>

                    <Text style={styles.text}>
                      Total: S/ {item.totalAmount}
                    </Text>

                    <View style={styles.itemsBox}>
                      {item.items.map((prod: any) => (
                        <View
                          key={`${prod.productId}-${prod.customizationNotes || ""}`}
                        >
                          <Text style={styles.itemText}>
                            {prod.productName} x{prod.quantity}
                          </Text>

                          {prod.customizationNotes ? (
                            <Text style={styles.customizationText}>
                              Personalización: {prod.customizationNotes}
                            </Text>
                          ) : null}

                          <Text style={styles.itemSub}>S/ {prod.subtotal}</Text>
                        </View>
                      ))}
                    </View>

                    {item.status === "NOT_ATTENDED" ? (
                      <Text style={styles.notAttendedText}>
                        El pedido no fue recogido antes del cierre operativo de
                        la cafetería.
                      </Text>
                    ) : null}

                    {item.status === "RECEIVED" ? (
                      <TouchableOpacity
                        style={styles.cancelButton}
                        onPress={() => handleCancelOrder(item.id)}
                      >
                        <Text style={styles.cancelButtonText}>
                          Cancelar pedido
                        </Text>
                      </TouchableOpacity>
                    ) : null}
                  </View>
                )}
              />
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
  containerMobile: {
    padding: 14,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    gap: 12,
  },
  headerMobile: {
    flexDirection: "column",
    alignItems: "flex-start",
    marginBottom: 14,
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
    color: "#3b1f12",
    marginBottom: 0,
  },
  welcomeText: {
    marginTop: 4,
    fontSize: 14,
    fontWeight: "900",
    color: "#3b1f12",
  },
  roleText: {
    marginTop: 2,
    fontSize: 12,
    fontWeight: "800",
    color: "#7a6a61",
  },
  subtitle: {
    marginTop: 2,
    color: "#7a6a61",
    fontWeight: "700",
  },
  shellLayout: {
    flex: 1,
    flexDirection: "row",
    gap: 16,
    minHeight: 0,
  },
  shellLayoutMobile: {
    flexDirection: "column",
  },
  content: {
    flex: 1,
    minHeight: 0,
  },
  listCard: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderRadius: 22,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "#f0dfd1",
    minHeight: 0,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  cardHeader: {
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#3b2416",
    marginBottom: 2,
  },
  cardSubtitle: {
    fontSize: 12,
    color: "#8a6a52",
    marginBottom: 8,
  },
  ordersList: {
    flex: 1,
  },
  ordersListContent: {
    paddingRight: 12,
    paddingBottom: 16,
  },
  ordersListContentMobile: {
    paddingRight: 0,
  },
  card: {
    backgroundColor: "#fff8f1",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#ead8c8",
  },
  orderId: {
    fontWeight: "900",
    fontSize: 18,
  },
  text: {
    marginTop: 4,
    color: "#7a6a61",
  },
  itemsBox: {
    marginTop: 10,
  },
  itemText: {
    fontWeight: "700",
  },
  itemSub: {
    color: "#7a6a61",
    marginBottom: 6,
  },
  customizationText: {
    fontSize: 12,
    color: "#666",
    fontStyle: "italic",
    marginBottom: 4,
  },
  statusBadge: {
    marginTop: 6,
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 999,
    alignSelf: "flex-start",
  },
  statusText: {
    color: "#FFFFFF",
    fontWeight: "900",
    fontSize: 12,
  },
  cancelButton: {
    marginTop: 12,
    backgroundColor: "#b42318",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#fff",
    fontWeight: "800",
  },
  toastContainer: {
    position: "absolute",
    top: 80,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 1000,
  },
  toast: {
    backgroundColor: "#e7f7ed",
    color: "#1f7a3f",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 999,
    fontWeight: "700",
    fontSize: 13,
  },
  toastError: {
    backgroundColor: "#fdecea",
    color: "#b71c1c",
  },
  notAttendedText: {
    marginTop: 8,
    color: "#7C3AED",
    fontWeight: "800",
    fontSize: 12,
  },
});
