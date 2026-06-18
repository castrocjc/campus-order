import { useEffect, useState } from "react";
import { Stack, useRouter } from "expo-router";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import SideMenu from "../components/ui/SideMenu";
import { getUser, logout } from "../src/services/authService";
import {
  changeMyPassword,
  getMyProfile,
  updateMyProfile,
  UserProfile,
} from "../src/services/userService";

const isMobile = Dimensions.get("window").width < 768;

export default function ProfileScreen() {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"success" | "error">(
    "success",
  );

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/");
      return;
    }

    const storedUser = getUser();
    setUser(storedUser);

    loadProfile();
  }, [router]);

  const showMessage = (text: string, type: "success" | "error") => {
    setMessage(text);
    setMessageType(type);

    setTimeout(() => {
      setMessage(null);
    }, 3500);
  };

  const loadProfile = async () => {
    try {
      setLoading(true);

      const data = await getMyProfile();

      setProfile(data);
      setName(data.name || "");
      setPhone(data.phone || "");
    } catch (error: any) {
      showMessage(error?.message || "No se pudo cargar el perfil.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.replace("/");
  };

  const handleCleanProfile = () => {
    setName(profile?.name || "");
    setPhone(profile?.phone || "");
  };

  const handleSaveProfile = async () => {
    if (!name.trim()) {
      showMessage("El nombre es obligatorio.", "error");
      return;
    }

    try {
      setSavingProfile(true);

      const updatedProfile = await updateMyProfile({
        name: name.trim(),
        phone: phone.trim(),
      });

      setProfile(updatedProfile);
      setName(updatedProfile.name || "");
      setPhone(updatedProfile.phone || "");

      const storedUser = getUser();

      if (storedUser) {
        localStorage.setItem(
          "user",
          JSON.stringify({
            ...storedUser,
            name: updatedProfile.name,
            email: updatedProfile.email,
            role: updatedProfile.role,
            phone: updatedProfile.phone,
          }),
        );

        setUser({
          ...storedUser,
          name: updatedProfile.name,
          email: updatedProfile.email,
          role: updatedProfile.role,
          phone: updatedProfile.phone,
        });
      }

      showMessage("Perfil actualizado correctamente.", "success");
    } catch (error: any) {
      showMessage(
        error?.message || "No se pudo actualizar el perfil.",
        "error",
      );
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      showMessage("Completa todos los campos de contraseña.", "error");
      return;
    }

    if (newPassword !== confirmPassword) {
      showMessage(
        "La nueva contraseña y la confirmación no coinciden.",
        "error",
      );
      return;
    }

    if (newPassword.length < 8) {
      showMessage(
        "La nueva contraseña debe tener al menos 8 caracteres.",
        "error",
      );
      return;
    }

    try {
      setSavingPassword(true);

      await changeMyPassword({
        currentPassword,
        newPassword,
        confirmPassword,
      });

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      showMessage("Contraseña actualizada correctamente.", "success");
    } catch (error: any) {
      showMessage(
        error?.message || "No se pudo cambiar la contraseña.",
        "error",
      );
    } finally {
      setSavingPassword(false);
    }
  };

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

        <View style={[styles.header, isMobile && styles.headerMobile]}>
          <View>
            <Text style={styles.title}>Menú COFIGO</Text>

            <Text style={styles.welcomeText}>
              Bienvenido {user?.name || "Usuario"}
            </Text>

            <Text style={styles.roleText}>Rol: {user?.role || "USER"}</Text>

            <Text style={styles.subtitle}>Gestión de tu perfil</Text>
          </View>

          {isMobile && (
            <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
              <Text style={styles.logoutBtnText}>Salir</Text>
            </TouchableOpacity>
          )}
        </View>

        <View
          style={[styles.shellLayout, isMobile && styles.shellLayoutMobile]}
        >
          {!isMobile && (
            <SideMenu role={user?.role || "USER"} onLogout={handleLogout} />
          )}

          <ScrollView
            style={styles.content}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.profileCard}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Mi Perfil</Text>
                <Text style={styles.cardSubtitle}>
                  Administra tu información personal y la seguridad de tu
                  cuenta.
                </Text>
              </View>

              {loading ? (
                <Text style={styles.loadingText}>Cargando perfil...</Text>
              ) : (
                <View
                  style={[
                    styles.cardsLayout,
                    isMobile && styles.cardsLayoutMobile,
                  ]}
                >
                  <View style={styles.card}>
                    <Text style={styles.cardTitle}>Información personal</Text>

                    <Text style={styles.label}>Nombre *</Text>
                    <TextInput
                      style={styles.input}
                      value={name}
                      onChangeText={setName}
                      placeholder="Ejemplo: Juan Carlos Castro"
                      placeholderTextColor="#9a8a7d"
                    />

                    <Text style={styles.label}>Celular</Text>
                    <TextInput
                      style={styles.input}
                      value={phone}
                      onChangeText={setPhone}
                      placeholder="Ejemplo: +51 999 999 999"
                      placeholderTextColor="#9a8a7d"
                      keyboardType="phone-pad"
                    />

                    <Text style={styles.label}>Correo institucional</Text>
                    <Text style={styles.readOnlyValue}>{profile?.email}</Text>

                    <Text style={styles.label}>Rol</Text>
                    <Text style={styles.readOnlyValue}>{profile?.role}</Text>

                    <Text style={styles.label}>Estado</Text>
                    <Text style={styles.readOnlyValue}>
                      {profile?.active ? "Activo" : "Inactivo"}
                    </Text>

                    <Text style={styles.label}>Correo verificado</Text>
                    <Text style={styles.readOnlyValue}>
                      {profile?.emailVerified ? "Sí" : "No"}
                    </Text>

                    <View style={styles.buttonRow}>
                      <TouchableOpacity
                        style={styles.secondaryButton}
                        onPress={handleCleanProfile}
                      >
                        <Text style={styles.secondaryButtonText}>Limpiar</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[
                          styles.primaryButton,
                          savingProfile && styles.buttonDisabled,
                        ]}
                        onPress={handleSaveProfile}
                        disabled={savingProfile}
                      >
                        <Text style={styles.primaryButtonText}>
                          {savingProfile ? "Guardando..." : "Guardar cambios"}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View style={styles.card}>
                    <Text style={styles.cardTitle}>Seguridad</Text>

                    <Text style={styles.label}>Contraseña actual *</Text>
                    <TextInput
                      style={styles.input}
                      value={currentPassword}
                      onChangeText={setCurrentPassword}
                      placeholder="Ingresa tu contraseña actual"
                      placeholderTextColor="#9a8a7d"
                      secureTextEntry
                    />

                    <Text style={styles.label}>Nueva contraseña *</Text>
                    <TextInput
                      style={styles.input}
                      value={newPassword}
                      onChangeText={setNewPassword}
                      placeholder="Mínimo 8 caracteres"
                      placeholderTextColor="#9a8a7d"
                      secureTextEntry
                    />

                    <Text style={styles.label}>
                      Confirmar nueva contraseña *
                    </Text>
                    <TextInput
                      style={styles.input}
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                      placeholder="Repite la nueva contraseña"
                      placeholderTextColor="#9a8a7d"
                      secureTextEntry
                    />

                    <TouchableOpacity
                      style={[
                        styles.primaryButton,
                        savingPassword && styles.buttonDisabled,
                      ]}
                      onPress={handleChangePassword}
                      disabled={savingPassword}
                    >
                      <Text style={styles.primaryButtonText}>
                        {savingPassword
                          ? "Actualizando..."
                          : "Cambiar contraseña"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          </ScrollView>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff8f1",
    padding: isMobile ? 14 : 20,
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
  contentContainer: {
    paddingBottom: 24,
  },
  header: {
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  headerMobile: {
    flexDirection: "column",
    alignItems: "flex-start",
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
  cardsLayout: {
    flexDirection: "row",
    gap: 16,
    alignItems: "flex-start",
  },
  cardsLayoutMobile: {
    flexDirection: "column",
  },
  card: {
    flex: 1,
    width: "100%",
    backgroundColor: "#fff8f1",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#ead8c8",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#3b2416",
    marginBottom: 2,
  },
  label: {
    fontSize: 13,
    fontWeight: "900",
    color: "#3b1f12",
    marginBottom: 6,
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ead8c8",
    backgroundColor: "#fff8f1",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    fontSize: 14,
    color: "#3b1f12",
    fontWeight: "700",
  },
  readOnlyValue: {
    backgroundColor: "#f4eadf",
    borderWidth: 1,
    borderColor: "#ead8c8",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    color: "#7a6a61",
    fontWeight: "800",
  },
  buttonRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 18,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: "#f57c00",
    paddingVertical: 13,
    paddingHorizontal: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 18,
  },
  primaryButtonText: {
    color: "#fff",
    fontWeight: "900",
    fontSize: 14,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ead8c8",
    paddingVertical: 13,
    paddingHorizontal: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 18,
  },
  secondaryButtonText: {
    color: "#3b1f12",
    fontWeight: "900",
    fontSize: 14,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  loadingText: {
    color: "#7a6a61",
    fontWeight: "800",
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
  toastContainer: {
    position: "absolute",
    top: 70,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 1000,
  },
  toast: {
    alignSelf: "center",
    backgroundColor: "#e7f7ed",
    color: "#1f7a3f",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
    fontWeight: "700",
    fontSize: 13,
    textAlign: "center",
  },
  toastError: {
    backgroundColor: "#fdecea",
    color: "#b71c1c",
  },
  welcomeText: {
    marginTop: 4,
    fontSize: 15,
    fontWeight: "700",
    color: "#3b1f12",
  },
  roleText: {
    marginTop: 2,
    fontSize: 12,
    fontWeight: "600",
    color: "#7a6a61",
  },
  profileCard: {
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
    marginBottom: 12,
  },
  cardSubtitle: {
    fontSize: 12,
    color: "#8a6a52",
    marginBottom: 8,
  },
});
