import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { getMyOrders } from "../src/services/orderService";

export default function MyOrdersScreen() {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const data = await getMyOrders();
      setOrders(data);
    } catch (error) {
      console.error("Error cargando pedidos", error);
    } finally {
      setLoading(false);
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
    <View style={styles.container}>
      <Text style={styles.title}>Mis pedidos</Text>

      <FlatList
        data={orders}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.orderId}>Pedido #{item.id}</Text>

            <Text style={styles.status}>
              Estado: {item.status}
            </Text>

            <Text style={styles.text}>
              Recojo: {new Date(item.pickupTime).toLocaleString()}
            </Text>

            <Text style={styles.text}>
              Total: S/ {item.totalAmount}
            </Text>

            <View style={styles.itemsBox}>
              {item.items.map((prod: any) => (
                <View key={prod.productId}>
                  <Text style={styles.itemText}>
                    {prod.productName} x{prod.quantity}
                  </Text>
                  <Text style={styles.itemSub}>
                    S/ {prod.subtotal}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.replace("/home")}
      >
        <Text style={styles.buttonText}>Volver</Text>
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
});