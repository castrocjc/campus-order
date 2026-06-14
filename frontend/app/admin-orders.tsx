import { useEffect, useState } from "react";
import { Stack, useRouter } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from "react-native";
import {
  getAllOrders,
  updateOrderStatus,
} from "../src/services/orderService";

export default function AdminOrdersScreen() {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [filter, setFilter] = useState<string>("ALL");

  useEffect(() => {
    loadOrders();

    const interval = setInterval(loadOrders, 8000);
    return () => clearInterval(interval);
  }, []);

  const loadOrders = async () => {
    try {
      const data = await getAllOrders();

      data.sort(
        (a: any, b: any) =>
          new Date(a.pickupTime).getTime() - new Date(b.pickupTime).getTime()
      );

      setOrders(data);
    } catch (error) {
      console.error("Error cargando pedidos", error);
    }
  };

  const changeStatus = async (orderId: number, status: string) => {
    try {
      await updateOrderStatus(orderId, status);
      loadOrders();
    } catch (error) {
      alert("Error actualizando estado");
    }
  };

  const goBackToOrders = () => {
    router.replace("/home");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    router.replace("/");
  };

  const formatStatus = (status: string) => {
    switch (status) {
      case "RECEIVED":
        return "Recibido";
      case "IN_PREPARATION":
        return "En Preparación";
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

  const canChangeStatus = (currentStatus: string, nextStatus: string) => {
  const allowedTransitions: Record<string, string[]> = {
    RECEIVED: ["IN_PREPARATION", "CANCELLED"],
    IN_PREPARATION: ["READY_FOR_PICKUP"],
    READY_FOR_PICKUP: ["DELIVERED"],
    DELIVERED: [],
    CANCELLED: [],
  };

    return allowedTransitions[currentStatus]?.includes(nextStatus) ?? false;
  };

  const totalOrders = orders.length;

  const filteredOrders =
  filter === "ALL"
    ? orders
    : orders.filter((o) => o.status === filter);

  const totalRevenue = orders
    .filter((order) => order.status === "DELIVERED")
    .reduce(
      (sum, order) => sum + Number(order.totalAmount || 0),
      0
    );

  const countByStatus = (status: string) =>
    orders.filter((o) => o.status === status).length;

return (
  <>
    <Stack.Screen options={{ headerShown: false }} />
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Panel de administración</Text>
          <Text style={styles.subtitle}>Gestión de pedidos</Text>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.backBtn} onPress={goBackToOrders}>
            <Text style={styles.backBtnText}>Volver</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <Text style={styles.logoutBtnText}>Salir</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.summaryScroll}
        contentContainerStyle={styles.summaryContent}
      >
        <View style={styles.summaryChip}>
          <Text style={styles.summaryNumber}>{orders.length}</Text>
          <Text style={styles.summaryLabel}>Pedidos</Text>
        </View>

        <View style={styles.summaryChip}>
          <Text style={styles.summaryNumber}>S/ {totalRevenue.toFixed(2)}</Text>
          <Text style={styles.summaryLabel}>Ventas</Text>
        </View>

        <View style={styles.summaryChip}>
          <Text style={styles.summaryNumber}>{countByStatus("RECEIVED")}</Text>
          <Text style={styles.summaryLabel}>Recibidos</Text>
        </View>

        <View style={styles.summaryChip}>
          <Text style={styles.summaryNumber}>{countByStatus("IN_PREPARATION")}</Text>
          <Text style={styles.summaryLabel}>En Preparación</Text>
        </View>

        <View style={styles.summaryChip}>
          <Text style={styles.summaryNumber}>{countByStatus("READY_FOR_PICKUP")}</Text>
          <Text style={styles.summaryLabel}>Listos</Text>
        </View>

        <View style={styles.summaryChip}>
          <Text style={styles.summaryNumber}>{countByStatus("DELIVERED")}</Text>
          <Text style={styles.summaryLabel}>Entregados</Text>
        </View>

        <View style={styles.summaryChip}>
          <Text style={styles.summaryNumber}>{countByStatus("CANCELLED")}</Text>
          <Text style={styles.summaryLabel}>Cancelados</Text>
        </View>
      </ScrollView>

      <View style={styles.filters}>
        {["ALL", "RECEIVED", "IN_PREPARATION", "READY_FOR_PICKUP", "DELIVERED", "CANCELLED"].map(
          (status) => (
            <TouchableOpacity
              key={status}
              style={[
                styles.filterBtn,
                filter === status && styles.filterActive,
              ]}
              onPress={() => setFilter(status)}
            >
              <Text
                style={[
                  styles.filterText,
                  filter === status && styles.filterTextActive,
                ]}
              >
              {status === "ALL" ? "Todos" : formatStatus(status)}
              </Text>
            </TouchableOpacity>
          )
        )}
      </View>

      <FlatList
        data={filteredOrders}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.orderId}>Pedido #{item.id}</Text>

            <View style={[styles.statusBadge, getStatusStyle(item.status)]}>
              <Text style={styles.statusText}>{formatStatus(item.status)}</Text>
            </View>
            <Text style={styles.text}>Total: S/ {item.totalAmount}</Text>
            <Text style={styles.text}>
              Recojo: {new Date(item.pickupTime).toLocaleString("es-PE")}
            </Text>

            <View style={styles.itemsBox}>
              {item.items?.map((prod: any) => (
                <View
                  key={`${prod.productId}-${prod.customizationNotes || ""}`}
                >
                  <Text style={styles.itemText}>
                    {prod.productName} x{prod.quantity} - S/ {prod.subtotal}
                  </Text>

                  {prod.customizationNotes ? (
                    <Text style={styles.customizationText}>
                      Personalización: {prod.customizationNotes}
                    </Text>
                  ) : null}
                </View>
              ))}
            </View>

            <View style={styles.buttons}>
              <TouchableOpacity
                style={[
                  styles.btn,
                  !canChangeStatus(item.status, "IN_PREPARATION") && styles.btnDisabled,
                ]}
                disabled={!canChangeStatus(item.status, "IN_PREPARATION")}
                onPress={() => changeStatus(item.id, "IN_PREPARATION")}
              >
                <Text style={styles.btnText}>En Preparación</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.btn,
                  !canChangeStatus(item.status, "READY_FOR_PICKUP") && styles.btnDisabled,
                ]}
                disabled={!canChangeStatus(item.status, "READY_FOR_PICKUP")}
                onPress={() => changeStatus(item.id, "READY_FOR_PICKUP")}
              >
                <Text style={styles.btnText}>Listo</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.btn,
                  !canChangeStatus(item.status, "DELIVERED") && styles.btnDisabled,
                ]}
                disabled={!canChangeStatus(item.status, "DELIVERED")}
                onPress={() => changeStatus(item.id, "DELIVERED")}
              >
                <Text style={styles.btnText}>Entregado</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.cancelBtn,
                  !canChangeStatus(item.status, "CANCELLED") && styles.btnDisabled,
                ]}
                disabled={!canChangeStatus(item.status, "CANCELLED")}
                onPress={() => changeStatus(item.id, "CANCELLED")}
              >
                <Text style={styles.btnText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
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
    fontSize: 26,
    fontWeight: "900",
    marginBottom: 0,
    color: "#3b1f12",
  },
  dashboard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
  },
  dashboardTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#3b1f12",
    marginBottom: 12,
  },
  dashboardGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  dashboardCard: {
    width: "31%",
    backgroundColor: "#fff8f1",
    borderRadius: 14,
    padding: 12,
  },
  dashboardNumber: {
    fontSize: 20,
    fontWeight: "900",
    color: "#f57c00",
  },
  dashboardLabel: {
    marginTop: 4,
    fontSize: 12,
    color: "#7a6a61",
    fontWeight: "700",
  },
summaryScroll: {
  height: 72,
  minHeight: 72,
  maxHeight: 72,
  marginBottom: 12,
  flexShrink: 0,
},
summaryContent: {
  alignItems: "center",
  paddingRight: 8,
  paddingVertical: 6,
},
summaryChip: {
  minWidth: 110,
  height: 56,
  backgroundColor: "#fff",
  borderRadius: 14,
  paddingVertical: 8,
  paddingHorizontal: 12,
  marginRight: 8,
  borderWidth: 1,
  borderColor: "#ead8c8",
  justifyContent: "center",
},

  summaryNumber: {
    fontSize: 17,
    fontWeight: "900",
    color: "#f57c00",
  },

  summaryLabel: {
    marginTop: 2,
    fontSize: 11,
    fontWeight: "700",
    color: "#7a6a61",
  },  
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  orderId: {
    fontWeight: "900",
    fontSize: 16,
    color: "#3b1f12",
  },

  statusBadge: {
    marginTop: 8,
    marginBottom: 4,
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

  text: {
    marginTop: 4,
    color: "#7a6a61",
    fontWeight: "600",
  },
  itemsBox: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#ead8c8",
  },
  itemText: {
    color: "#3b1f12",
    fontWeight: "700",
    marginBottom: 4,
  },
  buttons: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 12,
    gap: 8,
  },
  btn: {
    backgroundColor: "#3b1f12",
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  cancelBtn: {
    backgroundColor: "#b42318",
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  btnDisabled: {
    backgroundColor: "#d6d3d1",
    opacity: 0.6,
  },  
  btnText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 12,
  },

  filters: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 12,
    gap: 8,
  },

  filterBtn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: "#eee",
  },

  filterActive: {
    backgroundColor: "#3b1f12",
  },

  filterText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#333",
  },

  filterTextActive: {
    color: "#fff",
  },
  
  customizationText: {
    fontSize: 12,
    color: "#666",
    fontStyle: "italic",
    marginBottom: 6,
  },

});