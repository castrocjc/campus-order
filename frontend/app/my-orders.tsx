import { useEffect, useState } from "react";
import { Stack, useRouter } from "expo-router";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { cancelOrder, getMyOrders } from "../src/services/orderService";

export default function MyOrdersScreen() {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"success" | "error">("success");  

  useEffect(() => {
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
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      const readyOrder = data.find((order: any) => order.status === "READY_FOR_PICKUP");

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
    } catch (error: any) {
      showMessage("No se pudo cancelar el pedido", "error");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
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
    <View style={styles.container}>
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
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Mis pedidos</Text>
          <Text style={styles.subtitle}>Seguimiento de tus pedidos</Text>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.replace("/home")}
          >
            <Text style={styles.backBtnText}>Volver</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.logoutBtn}
            onPress={handleLogout}
          >
            <Text style={styles.logoutBtnText}>Salir</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={orders}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.orderId}>Pedido #{item.id}</Text>

            <View style={[styles.statusBadge, getStatusStyle(item.status)]}>
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

                <Text style={styles.itemSub}>
                  S/ {prod.subtotal}
                </Text>
              </View>
              ))}
            </View>

            {item.status !== "CANCELLED" && item.status !== "DELIVERED" ? (
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => handleCancelOrder(item.id)}
              >
                <Text style={styles.cancelButtonText}>Cancelar pedido</Text>
              </TouchableOpacity>
            ) : null}

          </View>
        )}
      />

    </View>
  </>
);}

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
    marginBottom: 20,
    gap: 12,
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
  title: {
    fontSize: 28,
    fontWeight: "900",
    color: "#3b1f12",
    marginBottom: 0,
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  orderId: {
    fontWeight: "900",
    fontSize: 18,
  },
  status: {
    color: "#f57c00",
    fontWeight: "800",
    marginTop: 4,
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
  customizationText: {
    fontSize: 12,
    color: "#666",
    fontStyle: "italic",
    marginBottom: 4,
  },  
});