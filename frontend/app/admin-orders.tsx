import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import {
  closeDailyOperation,
  getAllOrders,
  updateOrderStatus,
} from "../src/services/orderService";

import AdminLayout from "../components/ui/AdminLayout";

export default function AdminOrdersScreen() {
  const [orders, setOrders] = useState<any[]>([]);
  const [filter, setFilter] = useState<string>("ALL");
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  useEffect(() => {
    loadOrders();

    const interval = setInterval(loadOrders, 8000);
    return () => clearInterval(interval);
  }, []);

  const loadOrders = async () => {
    try {
      const data = await getAllOrders();
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

  const handleCloseDailyOperation = async () => {
    const confirmed =
      typeof window === "undefined" ||
      window.confirm(
        "¿Confirmas el cierre operativo del día? Los pedidos pendientes pasarán a No atendido.",
      );

    if (!confirmed) {
      return;
    }

    try {
      const closedOrders = await closeDailyOperation();
      alert(
        `Cierre ejecutado correctamente. Pedidos cerrados: ${closedOrders}`,
      );
      loadOrders();
    } catch (error) {
      alert("Error ejecutando el cierre operativo diario");
    }
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
      case "NOT_ATTENDED":
        return "No atendido";
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
      case "NOT_ATTENDED":
        return { backgroundColor: "#7C3AED" };
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
      NOT_ATTENDED: [],
      CANCELLED: [],
    };

    return allowedTransitions[currentStatus]?.includes(nextStatus) ?? false;
  };

  const filteredOrders =
    filter === "ALL" ? orders : orders.filter((o) => o.status === filter);

  const totalRevenue = orders
    .filter(
      (order) =>
        order.status !== "CANCELLED" && order.status !== "NOT_ATTENDED",
    )
    .reduce((sum, order) => sum + Number(order.totalAmount || 0), 0);

  const countByStatus = (status: string) =>
    orders.filter((o) => o.status === status).length;

  return (
    <AdminLayout
      title="Panel administrador"
      subtitle="Gestión de pedidos"
      allowedRoles={["ADMIN", "WORKER"]}
    >
      <View style={[styles.screen, isMobile && styles.screenMobile]}>
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
            <Text style={styles.summaryNumber}>
              S/ {totalRevenue.toFixed(2)}
            </Text>
            <Text style={styles.summaryLabel}>Ventas</Text>
          </View>

          <View style={styles.summaryChip}>
            <Text style={styles.summaryNumber}>
              {countByStatus("RECEIVED")}
            </Text>
            <Text style={styles.summaryLabel}>Recibidos</Text>
          </View>

          <View style={styles.summaryChip}>
            <Text style={styles.summaryNumber}>
              {countByStatus("IN_PREPARATION")}
            </Text>
            <Text style={styles.summaryLabel}>En Preparación</Text>
          </View>

          <View style={styles.summaryChip}>
            <Text style={styles.summaryNumber}>
              {countByStatus("READY_FOR_PICKUP")}
            </Text>
            <Text style={styles.summaryLabel}>Listos</Text>
          </View>
        </ScrollView>

        <View style={[styles.ordersLayout, isMobile && styles.ordersLayoutMobile]}>
          <View style={[styles.ordersListColumn, isMobile && styles.ordersListColumnMobile]}>
            <View style={[styles.listCard, isMobile && styles.listCardMobile]}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Pedidos registrados</Text>
                <Text style={styles.cardSubtitle}>
                  {filteredOrders.length} pedidos en vista
                </Text>
              </View>

              <View style={styles.filters}>
                {[
                  "ALL",
                  "RECEIVED",
                  "IN_PREPARATION",
                  "READY_FOR_PICKUP",
                  "DELIVERED",
                  "CANCELLED",
                  "NOT_ATTENDED",
                ].map((status) => (
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
                ))}
              </View>

              <View style={styles.operationalCloseBox}>
                <Text style={styles.operationalCloseTitle}>
                  Cierre operativo diario
                </Text>
                <Text style={styles.operationalCloseText}>
                  Marca como No atendido los pedidos del día que no fueron
                  entregados ni cancelados.
                </Text>

                <TouchableOpacity
                  style={styles.operationalCloseButton}
                  onPress={handleCloseDailyOperation}
                >
                  <Text style={styles.operationalCloseButtonText}>
                    Cerrar operación del día
                  </Text>
                </TouchableOpacity>
              </View>

              {filteredOrders.length === 0 ? (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyTitle}>
                    No existen pedidos para el día
                  </Text>

                  <Text style={styles.emptyText}>
                    Cuando se registren nuevos pedidos aparecerán
                    automáticamente.
                  </Text>
                </View>
              ) : (
                <FlatList
                  style={[styles.ordersList, isMobile && styles.ordersListMobile]}
                  contentContainerStyle={[
                    styles.ordersListContent,
                    isMobile && styles.ordersListContentMobile,
                  ]}
                  data={filteredOrders}
                  nestedScrollEnabled
                  keyboardShouldPersistTaps="handled"
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({ item }) => (
                    <View style={[styles.card, isMobile && styles.orderCardMobile]}>
                      <Text style={styles.orderId}>Pedido #{item.id}</Text>

                      <View
                        style={[
                          styles.statusBadge,
                          getStatusStyle(item.status),
                        ]}
                      >
                        <Text style={styles.statusText}>
                          {formatStatus(item.status)}
                        </Text>
                      </View>
                      <Text style={styles.text}>
                        Total: S/ {item.totalAmount}
                      </Text>
                      <Text style={styles.text}>
                        Recojo:{" "}
                        {new Date(item.pickupTime).toLocaleString("es-PE")}
                      </Text>

                      <View style={styles.itemsBox}>
                        {item.items?.map((prod: any) => (
                          <View
                            key={`${prod.productId}-${prod.customizationNotes || ""}`}
                          >
                            <Text style={styles.itemText}>
                              {prod.productName} x{prod.quantity} - S/{" "}
                              {prod.subtotal}
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
                            !canChangeStatus(item.status, "IN_PREPARATION") &&
                              styles.btnDisabled,
                          ]}
                          disabled={
                            !canChangeStatus(item.status, "IN_PREPARATION")
                          }
                          onPress={() =>
                            changeStatus(item.id, "IN_PREPARATION")
                          }
                        >
                          <Text style={styles.btnText}>En Preparación</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={[
                            styles.btn,
                            !canChangeStatus(item.status, "READY_FOR_PICKUP") &&
                              styles.btnDisabled,
                          ]}
                          disabled={
                            !canChangeStatus(item.status, "READY_FOR_PICKUP")
                          }
                          onPress={() =>
                            changeStatus(item.id, "READY_FOR_PICKUP")
                          }
                        >
                          <Text style={styles.btnText}>Listo</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={[
                            styles.btn,
                            !canChangeStatus(item.status, "DELIVERED") &&
                              styles.btnDisabled,
                          ]}
                          disabled={!canChangeStatus(item.status, "DELIVERED")}
                          onPress={() => changeStatus(item.id, "DELIVERED")}
                        >
                          <Text style={styles.btnText}>Entregado</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={[
                            styles.cancelBtn,
                            !canChangeStatus(item.status, "CANCELLED") &&
                              styles.btnDisabled,
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
              )}
            </View>
          </View>
        </View>
      </View>
    </AdminLayout>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#fff8f1",
  },

  screenMobile: {
    width: "100%",
  },
  ordersLayout: {
    flex: 1,
    flexDirection: "row",
    gap: 16,
    alignItems: "stretch",
    paddingHorizontal: 20,
    paddingTop: 0,
    paddingBottom: 20,
    zIndex: 1,
    minHeight: 0,
  },

  ordersLayoutMobile: {
    flexDirection: "column",
    paddingHorizontal: 0,
    paddingBottom: 24,
    gap: 12,
  },

  ordersListColumn: {
    flex: 2,
    minWidth: 0,
    minHeight: 0,
  },

  ordersListColumnMobile: {
    width: "100%",
    minHeight: 480,
  },
  listCard: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderRadius: 22,
    paddingVertical: 12,
    paddingHorizontal: 14,
    zIndex: 1,
    minHeight: 0,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },

  listCardMobile: {
    width: "100%",
    flex: 1,
    minHeight: 480,
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
  summaryScroll: {
    maxHeight: 54,
    flexShrink: 0,
    marginBottom: 12,
  },
  summaryContent: {
    alignItems: "center",
    paddingVertical: 4,
    paddingHorizontal: 16,
  },
  summaryChip: {
    minWidth: 110,
    height: 52,
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
    backgroundColor: "#fff8f1",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#ead8c8",
  },

  orderCardMobile: {
    width: "100%",
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
  ordersList: {
    flex: 1,
  },

  ordersListMobile: {
    flex: 1,
    minHeight: 360,
  },

  ordersListContent: {
    paddingBottom: 12,
  },

  ordersListContentMobile: {
    paddingBottom: 80,
  },
  emptyState: {
    backgroundColor: "#fff8f1",
    borderWidth: 1,
    borderColor: "#ead8c8",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
  },

  emptyTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: "#3b1f12",
    marginBottom: 6,
  },

  emptyText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#8a6a52",
    textAlign: "center",
  },
  operationalCloseBox: {
    backgroundColor: "#fff8f1",
    borderWidth: 1,
    borderColor: "#ead8c8",
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
  },

  operationalCloseTitle: {
    fontSize: 14,
    fontWeight: "900",
    color: "#3b1f12",
    marginBottom: 4,
  },

  operationalCloseText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#8a6a52",
    marginBottom: 10,
  },

  operationalCloseButton: {
    backgroundColor: "#7C3AED",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignSelf: "flex-start",
  },

  operationalCloseButtonText: {
    color: "#fff",
    fontWeight: "900",
    fontSize: 12,
  },
});
