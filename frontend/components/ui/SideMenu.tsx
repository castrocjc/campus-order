import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Role = "USER" | "WORKER" | "ADMIN";

type SideMenuProps = {
  role?: string;
  onLogout: () => void;
};

export default function SideMenu({ role = "USER", onLogout }: SideMenuProps) {
  const router = useRouter();
  const normalizedRole = role.toUpperCase() as Role;

  const goTo = (path: string) => {
    router.push(path as any);
  };

  return (
    <View style={styles.menu}>
      <Text style={styles.brand}>☰ CofiGO</Text>

      {normalizedRole === "USER" && (
        <>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => goTo("/home")}
          >
            <Text style={styles.menuText}>Catálogo</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => goTo("/my-orders")}
          >
            <Text style={styles.menuText}>Mis Pedidos</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItemDisabled}>
            <Text style={styles.menuTextDisabled}>
              👤 Perfil (Próximamente)
            </Text>
          </TouchableOpacity>
        </>
      )}

      {normalizedRole === "WORKER" && (
        <>
          <Text style={styles.sectionTitle}>OPERACIÓN</Text>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => goTo("/admin-orders")}
          >
            <Text style={styles.menuText}>🛒 Pedidos</Text>
          </TouchableOpacity>
        </>
      )}

      {normalizedRole === "ADMIN" && (
        <>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => goTo("/admin-dashboard")}
          >
            <Text style={styles.menuText}>📊 Dashboard</Text>
          </TouchableOpacity>

          <Text style={styles.sectionTitle}>OPERACIÓN</Text>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => goTo("/admin-products")}
          >
            <Text style={styles.menuText}>☕ Productos</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => goTo("/admin-categories")}
          >
            <Text style={styles.menuText}>📂 Categorías</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => goTo("/admin-orders")}
          >
            <Text style={styles.menuText}>🛒 Pedidos</Text>
          </TouchableOpacity>

          <Text style={styles.sectionTitle}>ADMINISTRACIÓN</Text>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => goTo("/admin-users")}
          >
            <Text style={styles.menuText}>👥 Usuarios</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItemDisabled}>
            <Text style={styles.menuTextDisabled}>
              📈 Reportes (Próximamente)
            </Text>            
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => goTo("/admin-settings")}
          >
            <Text style={styles.menuText}>⚙️ Configuración</Text>
          </TouchableOpacity>

        </>
      )}

      <View style={styles.spacer} />

      <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
        <Text style={styles.logoutText}>🚪 Salir</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  menu: {
    width: 220,
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "#ead8c8",
    minHeight: "100%",
  },
  brand: {
    fontSize: 22,
    fontWeight: "900",
    color: "#3b1f12",
    marginBottom: 20,
  },
  sectionTitle: {
    marginTop: 16,
    marginBottom: 8,
    fontSize: 11,
    fontWeight: "900",
    color: "#9a6b43",
    letterSpacing: 1,
  },
  menuItem: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 6,
    backgroundColor: "#fff8f1",
  },
  menuText: {
    fontWeight: "900",
    color: "#3b1f12",
    fontSize: 14,
  },
  menuItemDisabled: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 6,
    backgroundColor: "#f2e7dc",
    opacity: 0.7,
  },
  menuTextDisabled: {
    fontWeight: "900",
    color: "#7a6a61",
    fontSize: 14,
  },
  spacer: {
    flex: 1,
  },
  logoutButton: {
    marginTop: 20,
    backgroundColor: "#b42318",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  logoutText: {
    color: "#fff",
    fontWeight: "900",
    fontSize: 14,
  },
});
