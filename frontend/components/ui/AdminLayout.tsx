import { Stack, useRouter } from "expo-router";
import { ReactNode, useEffect, useState } from "react";
import { StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { getToken, logout } from "../../src/services/authService";
import SideMenu from "./SideMenu";

type AdminLayoutProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
  allowedRoles?: string[];
};

const cleanRole = (role?: string | null) =>
  role?.replaceAll("'", "").replaceAll('"', "").trim().toUpperCase();

export default function AdminLayout({
  title,
  subtitle,
  children,
  allowedRoles = ["ADMIN"],
}: AdminLayoutProps) {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const [user, setUser] = useState<any>(null);

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

      if (!allowedRoles.includes(normalizedUser.role)) {
        if (normalizedUser.role === "USER") {
          router.replace("/home");
        } else if (normalizedUser.role === "WORKER") {
          router.replace("/admin-orders");
        } else {
          router.replace("/");
        }

        return;
      }

      if (normalizedUser.role === "USER") {
        router.replace("/home");
        return;
      }

      setUser(normalizedUser);
    } catch {
      router.replace("/");
    }
  }, [router, allowedRoles]);

  const handleLogout = () => {
    logout();
    localStorage.removeItem("cart");
    router.replace("/");
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={[styles.container, isMobile && styles.containerMobile]}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {user?.role === "WORKER" ? "Panel operario" : title}
          </Text>

          <Text style={styles.subtitle}>
            {subtitle ||
              `Bienvenido ${user?.name || "Usuario"} (${user?.role || ""})`}
          </Text>
        </View>

        <View
          style={[styles.shellLayout, isMobile && styles.shellLayoutMobile]}
        >
          <SideMenu role={user?.role || "ADMIN"} onLogout={handleLogout} />

          <View style={[styles.workArea, isMobile && styles.workAreaMobile]}>{children}</View>
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
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
    color: "#3b1f12",
  },
  subtitle: {
    marginTop: 4,
    color: "#7a6a61",
    fontWeight: "700",
  },
shellLayout: {
  flex: 1,
  flexDirection: "row",
  gap: 16,
},
shellLayoutMobile: {
  flexDirection: "column",
  width: "100%",
},
workArea: {
  flex: 1,
  minWidth: 0,
},
workAreaMobile: {
  width: "100%",
}
});
