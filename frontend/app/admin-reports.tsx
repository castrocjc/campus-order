import { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import AdminLayout from "../components/ui/AdminLayout";
import SalesByDayChart from "../components/reports/SalesByDayChart";
import OrdersStatusChart from "../components/reports/OrdersStatusChart";
import PeakHoursChart from "../components/reports/PeakHoursChart";

import {
  getReportSummary,
  getSalesByDay,
  getOrdersByStatus,
  getTopProducts,
  getPeakHours,
  getOperationalMetrics,
} from "../src/services/reportService";

function getDefaultDates() {
  const today = new Date();
  const to = today.toISOString().split("T")[0];

  const fromDate = new Date();
  fromDate.setDate(today.getDate() - 7);
  const from = fromDate.toISOString().split("T")[0];

  return { from, to };
}

function formatCurrency(value: number | string | null | undefined) {
  const amount = Number(value || 0);

  return `S/ ${amount.toFixed(2)}`;
}

function formatMinutes(value: number | string | null | undefined) {
  const minutes = Number(value || 0);

  return `${minutes.toFixed(1)} min`;
}

function formatStatus(status: string) {
  const labels: Record<string, string> = {
    RECEIVED: "Recibido",
    IN_PREPARATION: "En preparación",
    READY_FOR_PICKUP: "Listo para recoger",
    DELIVERED: "Entregado",
    NOT_ATTENDED: "No entregado",
    CANCELLED: "Cancelado",
  };

  return labels[status] || status;
}

function formatHour(hour: number | string) {
  return `${String(hour).padStart(2, "0")}:00`;
}

export default function AdminReportsScreen() {
  const [summary, setSummary] = useState<any>(null);
  const [sales, setSales] = useState<any[]>([]);
  const [statuses, setStatuses] = useState<any[]>([]);
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [peakHours, setPeakHours] = useState<any[]>([]);
  const [operationalMetrics, setOperationalMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const defaultDates = getDefaultDates();

  const [from, setFrom] = useState(defaultDates.from);
  const [to, setTo] = useState(defaultDates.to);

  const operationalCards = [
    {
      title: "Inicio de preparación",
      description: "Recibido → En preparación",
      metric: operationalMetrics?.timeToPreparation,
    },
    {
      title: "Tiempo de preparación",
      description: "En preparación → Listo",
      metric: operationalMetrics?.preparation,
    },
    {
      title: "Espera de recojo",
      description: "Listo → Entregado",
      metric: operationalMetrics?.waitingPickup,
    },
    {
      title: "Tiempo total entrega",
      description: "Recibido → Entregado",
      metric: operationalMetrics?.totalDelivery,
    },
  ];

  useEffect(() => {
    loadReports();
  }, []);

  async function loadReports() {
    try {
      const [
        summaryData,
        salesData,
        statusData,
        productsData,
        peakData,
        operationalData,
      ] = await Promise.all([
        getReportSummary(from, to),
        getSalesByDay(from, to),
        getOrdersByStatus(from, to),
        getTopProducts(from, to, 10),
        getPeakHours(from, to),
        getOperationalMetrics(from, to),
      ]);

      setSummary(summaryData);
      setSales(salesData);
      setStatuses(statusData);
      setTopProducts(productsData);
      setPeakHours(peakData);
      setOperationalMetrics(operationalData);
    } finally {
      setLoading(false);
    }
  }

  function isValidDate(value: string) {
    return /^\d{4}-\d{2}-\d{2}$/.test(value);
  }

  function handleSearch() {
    if (!isValidDate(from) || !isValidDate(to)) {
      alert("Ingrese fechas válidas en formato YYYY-MM-DD");
      return;
    }

    if (from > to) {
      alert("La fecha Desde no puede ser mayor que la fecha Hasta");
      return;
    }

    setLoading(true);
    loadReports();
  }

  return (
    <AdminLayout title="Reportes">
      <View style={styles.dashboardContainer}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {loading ? (
            <Text style={styles.loading}>Cargando reportes...</Text>
          ) : (
            <>
              <View style={styles.header}>
                <View>
                  <Text style={styles.title}>Indicadores Ejecutivos</Text>
                  <Text style={styles.subtitle}>
                    Rango analizado: {from} al {to}
                  </Text>
                </View>
              </View>

              <View style={styles.filters}>
                <View style={styles.filterGroup}>
                  <Text style={styles.filterLabel}>Desde</Text>
                  <TextInput
                    style={styles.input}
                    value={from}
                    onChangeText={setFrom}
                    placeholder="2026-06-01"
                  />
                </View>

                <View style={styles.filterGroup}>
                  <Text style={styles.filterLabel}>Hasta</Text>
                  <TextInput
                    style={styles.input}
                    value={to}
                    onChangeText={setTo}
                    placeholder="2026-06-30"
                  />
                </View>

                <TouchableOpacity
                  style={[
                    styles.searchButton,
                    loading && styles.searchButtonDisabled,
                  ]}
                  onPress={handleSearch}
                  disabled={loading}
                >
                  <Text style={styles.searchButtonText}>
                    {loading ? "Consultando..." : "Consultar"}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.cards}>
                <View style={styles.card}>
                  <Text style={styles.cardLabel}>Ventas totales</Text>
                  <Text style={styles.cardValue}>
                    {formatCurrency(summary?.totalSales)}
                  </Text>
                  <Text style={styles.cardNote}>Solo pedidos entregados</Text>
                </View>

                <View style={styles.card}>
                  <Text style={styles.cardLabel}>Pedidos totales</Text>
                  <Text style={styles.cardValue}>
                    {summary?.totalOrders || 0}
                  </Text>
                  <Text style={styles.cardNote}>Incluye todos los estados</Text>
                </View>

                <View style={styles.card}>
                  <Text style={styles.cardLabel}>Ticket promedio</Text>
                  <Text style={styles.cardValue}>
                    {formatCurrency(summary?.averageTicket)}
                  </Text>
                  <Text style={styles.cardNote}>Ventas / entregados</Text>
                </View>

                <View style={styles.card}>
                  <Text style={styles.cardLabel}>Productos vendidos</Text>
                  <Text style={styles.cardValue}>
                    {summary?.productsSold || 0}
                  </Text>
                  <Text style={styles.cardNote}>Solo pedidos entregados</Text>
                </View>

                <View style={styles.card}>
                  <Text style={styles.cardLabel}>Usuarios registrados</Text>
                  <Text style={styles.cardValue}>
                    {summary?.registeredUsers || 0}
                  </Text>
                  <Text style={styles.cardNote}>Total histórico</Text>
                </View>

                <View style={styles.card}>
                  <Text style={styles.cardLabel}>Usuarios activos</Text>
                  <Text style={styles.cardValue}>
                    {summary?.activeUsers || 0}
                  </Text>
                  <Text style={styles.cardNote}>Cuentas habilitadas</Text>
                </View>
              </View>

<View style={styles.panelFull}>
  <View style={styles.operationalHeader}>
    <View>
      <Text style={styles.sectionTitle}>Indicadores Operativos</Text>
      <Text style={styles.operationalSubtitle}>
        Tiempos calculados desde la trazabilidad histórica de estados.
      </Text>
    </View>

    <View style={styles.ordersAnalyzedBadge}>
      <Text style={styles.ordersAnalyzedLabel}>Pedidos analizados</Text>
      <Text style={styles.ordersAnalyzedValue}>
        {operationalMetrics?.ordersAnalyzed || 0}
      </Text>
    </View>
  </View>

  <View style={styles.operationalGrid}>
    {operationalCards.map((item, index) => (
      <View key={index} style={styles.operationalCard}>
        <Text style={styles.operationalCardTitle}>{item.title}</Text>
        <Text style={styles.operationalCardDescription}>
          {item.description}
        </Text>

        <View style={styles.metricMainRow}>
          <Text style={styles.metricMainLabel}>Promedio</Text>
          <Text style={styles.metricMainValue}>
            {formatMinutes(item.metric?.average)}
          </Text>
        </View>

        <View style={styles.metricDetailRow}>
          <Text style={styles.metricDetailLabel}>Mínimo</Text>
          <Text style={styles.metricDetailValue}>
            {formatMinutes(item.metric?.minimum)}
          </Text>
        </View>

        <View style={styles.metricDetailRow}>
          <Text style={styles.metricDetailLabel}>Máximo</Text>
          <Text style={styles.metricDetailValue}>
            {formatMinutes(item.metric?.maximum)}
          </Text>
        </View>
      </View>
    ))}
  </View>
</View>

              <View style={styles.grid}>
                <View style={styles.panel}>
                  <Text style={styles.sectionTitle}>Ventas por día</Text>

                  {sales.length === 0 ? (
                    <Text style={styles.emptyText}>
                      No hay ventas entregadas en el rango seleccionado.
                    </Text>
                  ) : (
                    <>
                      <View style={styles.chartBox}>
                        <SalesByDayChart data={sales} />
                      </View>

                      {sales.map((item, index) => (
                        <View key={index} style={styles.listRow}>
                          <Text style={styles.rowLabel}>{item.date}</Text>
                          <Text style={styles.rowValue}>
                            {formatCurrency(item.total)}
                          </Text>
                        </View>
                      ))}
                    </>
                  )}
                </View>

                <View style={styles.panel}>
                  <Text style={styles.sectionTitle}>Pedidos por estado</Text>

                  {statuses.length > 0 && (
                    <View style={styles.donutBox}>
                      <OrdersStatusChart data={statuses} />
                    </View>
                  )}

                  {statuses.map((item, index) => (
                    <View key={index} style={styles.listRow}>
                      <Text style={styles.rowLabel}>
                        {formatStatus(item.status)}
                      </Text>
                      <Text style={styles.rowValue}>{item.total}</Text>
                    </View>
                  ))}
                </View>
              </View>

              <View style={styles.grid}>
                <View style={styles.panel}>
                  <Text style={styles.sectionTitle}>Top productos</Text>

                  {topProducts.length === 0 ? (
                    <Text style={styles.emptyText}>
                      No hay productos vendidos en pedidos entregados.
                    </Text>
                  ) : (
                    <>
                      <View style={styles.tableHeader}>
                        <Text style={[styles.tableCell, styles.productCol]}>
                          Producto
                        </Text>
                        <Text style={styles.tableCell}>Cant.</Text>
                        <Text style={styles.tableCell}>Ingresos</Text>
                      </View>

                      {topProducts.map((item, index) => (
                        <View key={index} style={styles.tableRow}>
                          <Text style={[styles.tableCell, styles.productCol]}>
                            {index + 1}. {item.productName}
                          </Text>
                          <Text style={styles.tableCell}>
                            {item.quantitySold}
                          </Text>
                          <Text style={styles.tableCell}>
                            {formatCurrency(item.revenue)}
                          </Text>
                        </View>
                      ))}
                    </>
                  )}
                </View>

                <View style={styles.panel}>
                  <Text style={styles.sectionTitle}>Horas pico</Text>

                  {peakHours.length === 0 ? (
                    <Text style={styles.emptyText}>
                      No existen pedidos en el rango seleccionado.
                    </Text>
                  ) : (
                    <>
                      <View style={styles.chartBox}>
                        <PeakHoursChart data={peakHours} />
                      </View>

                      {peakHours.map((item, index) => (
                        <View key={index} style={styles.hourCard}>
                          <Text style={styles.hourText}>
                            {formatHour(item.hour)}
                          </Text>
                          <Text style={styles.hourValue}>
                            {item.totalOrders === 1
                              ? "1 pedido"
                              : `${item.totalOrders} pedidos`}
                          </Text>
                        </View>
                      ))}
                    </>
                  )}
                </View>
              </View>
            </>
          )}
        </ScrollView>
      </View>
    </AdminLayout>
  );
}

const styles = StyleSheet.create({
  loading: {
    color: "#3b2418",
    fontWeight: "800",
  },
  header: {
    marginBottom: 18,
  },
  title: {
    color: "#3b2418",
    fontSize: 24,
    fontWeight: "900",
  },
  subtitle: {
    color: "#7b6254",
    fontWeight: "700",
    marginTop: 4,
  },
  cards: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 22,
  },
  card: {
    flexGrow: 1,
    minWidth: 180,
    backgroundColor: "#fff8f1",
    borderWidth: 1,
    borderColor: "#ead3bf",
    padding: 16,
    borderRadius: 14,
  },
  cardLabel: {
    color: "#7b6254",
    fontWeight: "800",
    marginBottom: 8,
  },
  cardValue: {
    color: "#f57c00",
    fontSize: 24,
    fontWeight: "900",
  },
  cardNote: {
    color: "#7b6254",
    fontSize: 12,
    fontWeight: "700",
    marginTop: 6,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 14,
  },
  panel: {
    flex: 1,
    minWidth: 360,
    backgroundColor: "#fff8f1",
    borderWidth: 1,
    borderColor: "#ead3bf",
    padding: 16,
    borderRadius: 14,
  },
  sectionTitle: {
    color: "#3b2418",
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 12,
  },
  emptyText: {
    color: "#7b6254",
    fontWeight: "700",
  },
  listRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#ead3bf",
    paddingVertical: 8,
  },
  rowLabel: {
    color: "#3b2418",
    fontWeight: "800",
  },
  rowValue: {
    color: "#3b2418",
    fontWeight: "900",
  },
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#d9b99f",
    paddingBottom: 8,
    marginBottom: 6,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#ead3bf",
    paddingVertical: 8,
  },
  tableCell: {
    flex: 1,
    color: "#3b2418",
    fontWeight: "800",
  },
  productCol: {
    flex: 2,
  },
  hourCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#ead3bf",
  },
  hourText: {
    color: "#f57c00",
    fontSize: 20,
    fontWeight: "900",
  },
  hourValue: {
    color: "#3b2418",
    fontWeight: "800",
    marginTop: 4,
  },
  chartBox: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#ead3bf",
    minHeight: 300,
  },
  donutBox: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#ead3bf",
    maxHeight: 260,
  },
  dashboardContainer: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#ead8c8",
    padding: 16,
  },

  scrollContent: {
    paddingBottom: 20,
  },
  filters: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 14,
    marginBottom: 18,
    alignItems: "flex-end",
  },
  filterGroup: {
    minWidth: 160,
  },
  filterLabel: {
    color: "#7b6254",
    fontWeight: "800",
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#ead3bf",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: "#3b2418",
    fontWeight: "700",
  },
  searchButton: {
    backgroundColor: "#f57c00",
    borderRadius: 10,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  searchButtonText: {
    color: "#fff",
    fontWeight: "900",
  },
  searchButtonDisabled: {
    opacity: 0.6,
  },

panelFull: {
  backgroundColor: "#fff8f1",
  borderWidth: 1,
  borderColor: "#ead3bf",
  padding: 16,
  borderRadius: 14,
  marginBottom: 14,
},
operationalHeader: {
  flexDirection: "row",
  justifyContent: "space-between",
  gap: 12,
  flexWrap: "wrap",
  marginBottom: 14,
},
operationalSubtitle: {
  color: "#7b6254",
  fontWeight: "700",
  marginTop: -4,
},
ordersAnalyzedBadge: {
  backgroundColor: "#ffffff",
  borderWidth: 1,
  borderColor: "#ead3bf",
  borderRadius: 12,
  paddingHorizontal: 14,
  paddingVertical: 10,
  minWidth: 150,
},
ordersAnalyzedLabel: {
  color: "#7b6254",
  fontSize: 12,
  fontWeight: "800",
},
ordersAnalyzedValue: {
  color: "#f57c00",
  fontSize: 24,
  fontWeight: "900",
  marginTop: 2,
},
operationalGrid: {
  flexDirection: "row",
  flexWrap: "wrap",
  gap: 12,
},
operationalCard: {
  flexGrow: 1,
  flexBasis: 220,
  backgroundColor: "#ffffff",
  borderWidth: 1,
  borderColor: "#ead3bf",
  borderRadius: 12,
  padding: 14,
},
operationalCardTitle: {
  color: "#3b2418",
  fontSize: 15,
  fontWeight: "900",
},
operationalCardDescription: {
  color: "#7b6254",
  fontSize: 12,
  fontWeight: "700",
  marginTop: 4,
  marginBottom: 12,
},
metricMainRow: {
  borderTopWidth: 1,
  borderTopColor: "#ead3bf",
  paddingTop: 10,
  marginBottom: 8,
},
metricMainLabel: {
  color: "#7b6254",
  fontSize: 12,
  fontWeight: "800",
},
metricMainValue: {
  color: "#f57c00",
  fontSize: 24,
  fontWeight: "900",
  marginTop: 2,
},
metricDetailRow: {
  flexDirection: "row",
  justifyContent: "space-between",
  borderTopWidth: 1,
  borderTopColor: "#f1dfcf",
  paddingTop: 8,
  marginTop: 8,
},
metricDetailLabel: {
  color: "#7b6254",
  fontWeight: "800",
},
metricDetailValue: {
  color: "#3b2418",
  fontWeight: "900",
},
  
});
