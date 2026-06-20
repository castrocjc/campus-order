import { useRouter } from "expo-router";
import {
  ScrollView,
  useWindowDimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Role = "USER" | "WORKER" | "ADMIN";

type SideMenuProps = {
  role?: string;
  onLogout: () => void;
};

type MenuItem = {
  label: string;
  path: string;
  section?: string;
};

const getMenuItems = (role: Role): MenuItem[] => {
  if (role === "USER") {
    return [
      { label: "☕ Menú", path: "/home" },
      { label: "🧾 Mis Pedidos", path: "/my-orders" },
      { label: "👤 Perfil", path: "/profile" },
    ];
  }

  if (role === "WORKER") {
    return [
      { label: "🧾 Pedidos", path: "/admin-orders", section: "OPERACIÓN" },
    ];
  }

  return [
    { label: "📊 Dashboard", path: "/admin-dashboard" },
    { label: "☕ Productos", path: "/admin-products", section: "OPERACIÓN" },
    { label: "🏷️ Categorías", path: "/admin-categories" },
    { label: "📝 Personalizaciones", path: "/admin-customizations" },
    { label: "🧾 Pedidos", path: "/admin-orders" },
    { label: "👥 Usuarios", path: "/admin-users", section: "ADMINISTRACIÓN" },
    { label: "📈 Reportes", path: "/admin-reports" },
    { label: "⚙️ Configuración", path: "/admin-settings" },
  ];
};

export default function SideMenu({ role = "USER", onLogout }: SideMenuProps) {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const normalizedRole = role.toUpperCase() as Role;
  const menuItems = getMenuItems(normalizedRole);

  const goTo = (path: string) => {
    router.push(path as any);
  };

  if (isMobile) {
    return (
      <View style={styles.mobileMenu}>
        <Text style={styles.mobileBrand}>☰ CofiGO</Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.mobileMenuContent}
        >
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.path}
              style={styles.mobileMenuItem}
              onPress={() => goTo(item.path)}
            >
              <Text style={styles.mobileMenuText}>{item.label}</Text>
            </TouchableOpacity>
          ))}

          <TouchableOpacity
            style={styles.mobileLogoutButton}
            onPress={onLogout}
          >
            <Text style={styles.mobileLogoutText}>🚪 Salir</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  let currentSection = "";

  return (
    <View style={styles.menu}>
      <Text style={styles.brand}>☰ CofiGO</Text>

      {menuItems.map((item) => {
        const showSection = item.section && item.section !== currentSection;

        if (item.section) {
          currentSection = item.section;
        }

        return (
          <View key={item.path}>
            {showSection ? (
              <Text style={styles.sectionTitle}>{item.section}</Text>
            ) : null}

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => goTo(item.path)}
            >
              <Text style={styles.menuText}>{item.label}</Text>
            </TouchableOpacity>
          </View>
        );
      })}

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
  mobileMenu: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#ead8c8",
  },
  mobileBrand: {
    fontSize: 18,
    fontWeight: "900",
    color: "#3b1f12",
    marginBottom: 10,
  },
  mobileMenuContent: {
    gap: 8,
    paddingRight: 4,
  },
  mobileMenuItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: "#fff8f1",
    borderWidth: 1,
    borderColor: "#ead8c8",
  },
  mobileMenuText: {
    fontWeight: "900",
    color: "#3b1f12",
    fontSize: 13,
  },
  mobileLogoutButton: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: "#b42318",
  },
  mobileLogoutText: {
    color: "#fff",
    fontWeight: "900",
    fontSize: 13,
  },
});
