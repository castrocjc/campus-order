import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import AdminLayout from "../components/ui/AdminLayout";
import { getCategoriesAdmin } from "../src/services/categoryService";
import { getToken } from "../src/services/authService";
import { getAllOrders } from "../src/services/orderService";
import { getProductsAdmin } from "../src/services/productService";
import { getUsers } from "../src/services/userService";

const cleanRole = (role?: string | null) =>
  role?.replaceAll("'", "").replaceAll('"', "").trim().toUpperCase();

const isTodayInLima = (dateValue?: string) => {
  if (!dateValue) return false;

  const date = new Date(dateValue);
  const limaDate = new Date(
    date.toLocaleString("en-US", {
      timeZone: "America/Lima",
    }),
  );

  const nowLima = new Date(
    new Date().toLocaleString("en-US", {
      timeZone: "America/Lima",
    }),
  );

  return (
    limaDate.getFullYear() === nowLima.getFullYear() &&
    limaDate.getMonth() === nowLima.getMonth() &&
    limaDate.getDate() === nowLima.getDate()
  );
};

const formatMoney = (value: number) => `S/ ${value.toFixed(2)}`;

export default function AdminDashboardScreen() {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = getToken();

    if (!token) {
      router.replace("/");
      return;
    }

    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      router.replace("/");
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);
      const normalizedUser = {
        ...parsedUser,
        role: cleanRole(parsedUser.role),
      };

      setUser(normalizedUser);

      if (normalizedUser.role === "WORKER") {
        router.replace("/admin-orders");
        return;
      }

      if (normalizedUser.role !== "ADMIN") {
        router.replace("/home");
        return;
      }
    } catch {
      router.replace("/");
    }
  }, [router]);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [usersData, productsData, categoriesData, ordersData] =
          await Promise.all([
            getUsers(),
            getProductsAdmin(),
            getCategoriesAdmin(),
            getAllOrders(),
          ]);

        setUsers(usersData || []);
        setProducts(productsData || []);
        setCategories(categoriesData || []);
        setOrders(ordersData || []);
      } catch {
        setMessage("No se pudo cargar la información del dashboard.");
      } finally {
        setLoading(false);
      }
    }

    if (user?.role === "ADMIN") {
      loadDashboard();
    }
  }, [user?.role]);

  const metrics = useMemo(() => {
    const activeUsers = users.filter((item) => item.active).length;
    const adminUsers = users.filter((item) => item.role === "ADMIN").length;
    const workerUsers = users.filter((item) => item.role === "WORKER").length;
    const regularUsers = users.filter((item) => item.role === "USER").length;

    const activeProducts = products.filter((item) => item.active).length;
    const outOfStockProducts = products.filter(
      (item) => Number(item.stock || 0) <= 0,
    ).length;

    const activeCategories = categories.filter((item) => item.active).length;

    const todayOrders = orders.filter((item) => isTodayInLima(item.createdAt));
    const activeTodayOrders = todayOrders.filter(
      (item) => item.status !== "CANCELLED",
    );

    const todaySales = activeTodayOrders.reduce(
      (sum, item) => sum + Number(item.totalAmount || 0),
      0,
    );

    const totalSales = orders
      .filter((item) => item.status !== "CANCELLED")
      .reduce((sum, item) => sum + Number(item.totalAmount || 0), 0);

    return {
      totalUsers: users.length,
      activeUsers,
      adminUsers,
      workerUsers,
      regularUsers,
      totalProducts: products.length,
      activeProducts,
      outOfStockProducts,
      totalCategories: categories.length,
      activeCategories,
      todayOrders: todayOrders.length,
      todaySales,
      totalSales,
      receivedOrders: orders.filter((item) => item.status === "RECEIVED").length,
      preparingOrders: orders.filter((item) => item.status === "IN_PREPARATION")
        .length,
      readyOrders: orders.filter((item) => item.status === "READY_FOR_PICKUP")
        .length,
      deliveredOrders: orders.filter((item) => item.status === "DELIVERED")
        .length,
      cancelledOrders: orders.filter((item) => item.status === "CANCELLED")
        .length,
    };
  }, [users, products, categories, orders]);

  if (loading && user?.role === "ADMIN") {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Cargando dashboard...</Text>
      </View>
    );
  }

return (
  <AdminLayout
    title="Dashboard Administrativo"
    subtitle={`Bienvenido ${user?.name || "Administrador"} (${user?.role || "ADMIN"})`}
  >
    <ScrollView style={styles.workArea}>
      {message ? <Text style={styles.message}>{message}</Text> : null}

      <Text style={styles.sectionTitle}>Resumen principal</Text>

      <View style={styles.cardsGrid}>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Usuarios</Text>
          <Text style={styles.cardValue}>{metrics.totalUsers}</Text>
          <Text style={styles.cardHelp}>{metrics.activeUsers} activos</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>Productos</Text>
          <Text style={styles.cardValue}>{metrics.totalProducts}</Text>
          <Text style={styles.cardHelp}>{metrics.activeProducts} activos</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>Categorías</Text>
          <Text style={styles.cardValue}>{metrics.totalCategories}</Text>
          <Text style={styles.cardHelp}>{metrics.activeCategories} activas</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>Pedidos hoy</Text>
          <Text style={styles.cardValue}>{metrics.todayOrders}</Text>
          <Text style={styles.cardHelp}>Hora oficial Perú</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Indicadores ejecutivos</Text>

      <View style={styles.cardsGrid}>
        <View style={styles.wideCard}>
          <Text style={styles.cardLabel}>Ventas de hoy</Text>
          <Text style={styles.cardValue}>{formatMoney(metrics.todaySales)}</Text>
          <Text style={styles.cardHelp}>Excluye pedidos cancelados</Text>
        </View>

        <View style={styles.wideCard}>
          <Text style={styles.cardLabel}>Ventas acumuladas</Text>
          <Text style={styles.cardValue}>{formatMoney(metrics.totalSales)}</Text>
          <Text style={styles.cardHelp}>Excluye pedidos cancelados</Text>
        </View>

        <View style={styles.wideCard}>
          <Text style={styles.cardLabel}>Usuarios por rol</Text>
          <Text style={styles.listText}>ADMIN: {metrics.adminUsers}</Text>
          <Text style={styles.listText}>WORKER: {metrics.workerUsers}</Text>
          <Text style={styles.listText}>USER: {metrics.regularUsers}</Text>
        </View>

        <View style={styles.wideCard}>
          <Text style={styles.cardLabel}>Pedidos por estado</Text>
          <Text style={styles.listText}>Recibidos: {metrics.receivedOrders}</Text>
          <Text style={styles.listText}>En preparación: {metrics.preparingOrders}</Text>
          <Text style={styles.listText}>Listos: {metrics.readyOrders}</Text>
          <Text style={styles.listText}>Entregados: {metrics.deliveredOrders}</Text>
          <Text style={styles.listText}>Cancelados: {metrics.cancelledOrders}</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Accesos rápidos</Text>

      <View style={styles.quickActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => router.push("/admin-products")}
        >
          <Text style={styles.actionText}>☕ Productos</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => router.push("/admin-categories")}
        >
          <Text style={styles.actionText}>📂 Categorías</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => router.push("/admin-orders")}
        >
          <Text style={styles.actionText}>🛒 Pedidos</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => router.push("/admin-users")}
        >
          <Text style={styles.actionText}>👥 Usuarios</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  </AdminLayout>
);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff8f1",
    padding: 20,
  },
  loadingText: {
    color: "#3b1f12",
    fontWeight: "900",
  },
  workArea: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: "#ead8c8",
  },
  message: {
    backgroundColor: "#fee4e2",
    color: "#b42318",
    padding: 12,
    borderRadius: 12,
    fontWeight: "800",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: "#3b1f12",
    marginBottom: 14,
  },
  cardsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 14,
    marginBottom: 28,
  },
  card: {
    width: "23%",
    minWidth: 180,
    backgroundColor: "#fff8f1",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#ead8c8",
  },
  wideCard: {
    width: "48%",
    minWidth: 260,
    backgroundColor: "#fff8f1",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#ead8c8",
  },
  cardLabel: {
    color: "#7a6a61",
    fontWeight: "800",
  },
  cardValue: {
    marginTop: 10,
    fontSize: 26,
    fontWeight: "900",
    color: "#f57c00",
  },
  cardHelp: {
    marginTop: 6,
    color: "#7a6a61",
    fontWeight: "700",
  },
  listText: {
    marginTop: 8,
    color: "#3b1f12",
    fontWeight: "800",
  },
  quickActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    paddingBottom: 20,
  },
  actionButton: {
    backgroundColor: "#f57c00",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 18,
  },
  actionText: {
    color: "#fff",
    fontWeight: "900",
  },
});