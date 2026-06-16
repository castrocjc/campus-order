import { useEffect, useState } from "react";
import { Stack, useRouter } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ScrollView,
  TextInput,
  useWindowDimensions,
  Platform,
} from "react-native";

import {
  getUsers,
  createAdminUser,
  updateUser,
  toggleUserActive,
  resetUserPassword,
  resendVerificationCode,
  UserAdmin,
  UserRole,
} from "../src/services/userService";

type UserForm = {
  name: string;
  email: string;
  password: string;
  role: UserRole;
};

export default function AdminUsersScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isWideLayout = width >= 900;

  const [users, setUsers] = useState<UserAdmin[]>([]);
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [searchText, setSearchText] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("ALL");
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"success" | "error">(
    "success",
  );

  const [form, setForm] = useState<UserForm>({
    name: "",
    email: "",
    password: "",
    role: "USER",
  });

  const loadUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data || []);
    } catch (error) {
      console.error("Error cargando usuarios:", error);
      showMessage("No se pudo cargar la lista de usuarios.", "error");
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const showMessage = (text: string, type: "success" | "error" = "success") => {
    setMessageType(type);
    setMessage(text);

    setTimeout(() => {
      setMessage(null);
    }, 1800);
  };

  const resetForm = () => {
    setForm({
      name: "",
      email: "",
      password: "",
      role: "USER",
    });
    setEditingUserId(null);
  };

  const handleSubmit = async () => {
    const missingFields = [];

    if (!form.name.trim()) {
      missingFields.push("Nombre");
    }

    if (!form.email.trim()) {
      missingFields.push("Correo");
    }

    if (!form.role) {
      missingFields.push("Rol");
    }

    if (missingFields.length > 0) {
      showMessage(
        `Complete los campos obligatorios: ${missingFields.join(", ")}.`,
        "error",
      );
      return;
    }

    if (!editingUserId && !form.password.trim()) {
      showMessage("Complete los campos obligatorios: Contraseña.", "error");
      return;
    }

    try {
      if (editingUserId) {
        await updateUser(editingUserId, {
          name: form.name,
          email: form.email,
          role: form.role,
        });

        showMessage("Usuario actualizado correctamente.", "success");
      } else {
        await createAdminUser({
          name: form.name,
          email: form.email,
          password: form.password,
          role: form.role,
        });

        showMessage("Usuario creado correctamente.", "success");
      }

      resetForm();
      loadUsers();
    } catch (error: any) {
      console.error("Error guardando usuario:", error);
      showMessage(error?.message || "No se pudo guardar el usuario.", "error");
    }
  };

  const handleEdit = (user: UserAdmin) => {
    setEditingUserId(user.id);

    setForm({
      name: user.name,
      email: user.email,
      password: "",
      role: user.role,
    });
  };

  const handleToggleActive = async (user: UserAdmin) => {
    try {
      await toggleUserActive(user.id);
      await loadUsers();

      showMessage(
        user.active
          ? "Usuario desactivado correctamente."
          : "Usuario activado correctamente.",
        "success",
      );
    } catch (error: any) {
      console.error("Error cambiando estado:", error);
      showMessage(error?.message || "No se pudo cambiar el estado.", "error");
    }
  };

  const handleResetPassword = async (user: UserAdmin) => {
    try {
      const temporaryPassword = await resetUserPassword(user.id);
      showMessage(`Contraseña temporal: ${temporaryPassword}`, "success");
    } catch (error: any) {
      console.error("Error reseteando contraseña:", error);
      showMessage(
        error?.message || "No se pudo resetear la contraseña.",
        "error",
      );
    }
  };

  const handleResendVerificationCode = async (user: UserAdmin) => {
    try {
      await resendVerificationCode(user.email);

      showMessage("Código de verificación reenviado correctamente.", "success");
    } catch (error: any) {
      console.error("Error reenviando código:", error);

      showMessage(error?.message || "No se pudo reenviar el código.", "error");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    router.replace("/");
  };

  const filteredUsers = users
    .filter((user) => {
      const search = searchText.trim().toLowerCase();

      const matchesSearch =
        !search ||
        user.name?.toLowerCase().includes(search) ||
        user.email?.toLowerCase().includes(search) ||
        user.role?.toLowerCase().includes(search);

      const matchesRole = roleFilter === "ALL" || user.role === roleFilter;

      return matchesSearch && matchesRole;
    })
    .sort((a, b) => {
      if (a.active !== b.active) {
        return a.active ? -1 : 1;
      }

      return a.name.localeCompare(b.name);
    });

  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.active).length;
  const inactiveUsers = users.filter((u) => !u.active).length;
  const adminUsers = users.filter((u) => u.role === "ADMIN").length;
  const workerUsers = users.filter((u) => u.role === "WORKER").length;
  const regularUsers = users.filter((u) => u.role === "USER").length;

  const formTitle = editingUserId ? "Editar usuario" : "Nuevo usuario";
  const formButtonText = editingUserId ? "Actualizar usuario" : "Crear usuario";

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.screen}>
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

        <View style={styles.topStickyBar}>
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Panel administrador</Text>
              <Text style={styles.subtitle}>Gestión de usuarios</Text>
            </View>

            <View style={styles.headerActions}>
              <TouchableOpacity
                style={styles.backBtn}
                onPress={() => router.replace("/home")}
              >
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
              <Text style={styles.summaryNumber}>{totalUsers}</Text>
              <Text style={styles.summaryLabel}>Usuarios</Text>
            </View>

            <View style={styles.summaryChip}>
              <Text style={styles.summaryNumber}>{activeUsers}</Text>
              <Text style={styles.summaryLabel}>Activos</Text>
            </View>

            <View style={styles.summaryChip}>
              <Text style={styles.summaryNumber}>{inactiveUsers}</Text>
              <Text style={styles.summaryLabel}>Inactivos</Text>
            </View>

            <View style={styles.summaryChip}>
              <Text style={styles.summaryNumber}>{adminUsers}</Text>
              <Text style={styles.summaryLabel}>Admins</Text>
            </View>

            <View style={styles.summaryChip}>
              <Text style={styles.summaryNumber}>{workerUsers}</Text>
              <Text style={styles.summaryLabel}>Workers</Text>
            </View>

            <View style={styles.summaryChip}>
              <Text style={styles.summaryNumber}>{regularUsers}</Text>
              <Text style={styles.summaryLabel}>Users</Text>
            </View>
          </ScrollView>
        </View>

        <View
          style={[
            styles.usersLayout,
            !isWideLayout && styles.usersLayoutStacked,
          ]}
        >
          <View style={styles.usersListColumn}>
            <View style={styles.listCard}>
              <View style={styles.listHeaderRow}>
                <View>
                  <Text style={styles.sectionTitle}>Usuarios registrados</Text>
                  <Text style={styles.sectionSubtitle}>
                    {filteredUsers.length} usuario
                    {filteredUsers.length === 1 ? "" : "s"} en vista
                  </Text>
                </View>
              </View>

              <TextInput
                style={styles.searchInput}
                placeholder="Buscar por nombre, correo o rol"
                value={searchText}
                onChangeText={setSearchText}
              />

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.filterScroll}
                contentContainerStyle={styles.filterContent}
              >
                {["ALL", "ADMIN", "WORKER", "USER"].map((role) => (
                  <TouchableOpacity
                    key={role}
                    style={[
                      styles.filterChip,
                      roleFilter === role && styles.filterChipActive,
                    ]}
                    onPress={() => setRoleFilter(role)}
                  >
                    <Text
                      style={[
                        styles.filterText,
                        roleFilter === role && styles.filterTextActive,
                      ]}
                    >
                      {role === "ALL" ? "Todos" : role}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <FlatList
                data={filteredUsers}
                keyExtractor={(item) => String(item.id)}
                style={styles.usersFlatList}
                contentContainerStyle={styles.usersFlatListContent}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                  <Text style={styles.emptyText}>
                    No hay usuarios para el filtro seleccionado.
                  </Text>
                }
                renderItem={({ item }) => (
                  <View style={styles.userCard}>
                    <View style={styles.userInfo}>
                      <View style={styles.userTitleRow}>
                        <View>
                          <Text style={styles.userName}>{item.name}</Text>
                          <Text style={styles.userEmail}>{item.email}</Text>
                        </View>

                        <View
                          style={[
                            styles.statusBadge,
                            item.active
                              ? styles.statusActive
                              : styles.statusInactive,
                          ]}
                        >
                          <Text
                            style={[
                              styles.statusText,
                              item.active
                                ? styles.statusTextActive
                                : styles.statusTextInactive,
                            ]}
                          >
                            {item.active ? "Activo" : "Inactivo"}
                          </Text>
                        </View>
                      </View>

                      <View style={styles.metaRow}>
                        <Text style={styles.roleBadge}>{item.role}</Text>
                        <Text style={styles.verifiedText}>
                          {item.emailVerified
                            ? "Correo verificado"
                            : "Correo pendiente"}
                        </Text>
                      </View>

                      <View style={styles.userActions}>
                        <TouchableOpacity
                          style={styles.editButton}
                          onPress={() => handleEdit(item)}
                        >
                          <Text style={styles.actionButtonText}>Editar</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={[
                            styles.toggleButton,
                            item.active
                              ? styles.deactivateButton
                              : styles.activateButton,
                          ]}
                          onPress={() => handleToggleActive(item)}
                        >
                          <Text style={styles.actionButtonText}>
                            {item.active ? "Desactivar" : "Activar"}
                          </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={styles.resetButton}
                          onPress={() => handleResetPassword(item)}
                        >
                          <Text style={styles.actionButtonText}>Reset</Text>
                        </TouchableOpacity>

                        {!item.emailVerified && (
                          <TouchableOpacity
                            style={styles.resendButton}
                            onPress={() => handleResendVerificationCode(item)}
                          >
                            <Text style={styles.actionButtonText}>
                              Reenviar código
                            </Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>
                  </View>
                )}
              />
            </View>
          </View>

          <View style={styles.userFormColumn}>
            <View style={styles.formCard}>
              <Text style={styles.sectionTitle}>{formTitle}</Text>
              <Text style={styles.sectionSubtitle}>
                {editingUserId
                  ? "Modifica la información del usuario seleccionado"
                  : "Registra un nuevo usuario para CofiGO"}
              </Text>

              <Text style={styles.fieldLabel}>Nombre *</Text>
              <TextInput
                style={styles.input}
                placeholder="Ejemplo: Juan Pérez"
                value={form.name}
                onChangeText={(value) => setForm({ ...form, name: value })}
              />

              <Text style={styles.fieldLabel}>Correo institucional *</Text>
              <TextInput
                style={styles.input}
                placeholder="Ejemplo: juan.perez@institucion.edu"
                value={form.email}
                onChangeText={(value) => setForm({ ...form, email: value })}
                autoCapitalize="none"
              />

              {!editingUserId && (
                <>
                  <Text style={styles.fieldLabel}>Contraseña *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Ejemplo: Temporal123"
                    value={form.password}
                    onChangeText={(value) =>
                      setForm({ ...form, password: value })
                    }
                    secureTextEntry
                  />
                </>
              )}

              <Text style={styles.fieldLabel}>Rol *</Text>

              <View style={styles.roleOptions}>
                {(["USER", "WORKER", "ADMIN"] as UserRole[]).map((role) => (
                  <TouchableOpacity
                    key={role}
                    style={[
                      styles.roleOption,
                      form.role === role && styles.roleOptionSelected,
                    ]}
                    onPress={() => setForm({ ...form, role })}
                  >
                    <Text
                      style={[
                        styles.roleOptionText,
                        form.role === role && styles.roleOptionTextSelected,
                      ]}
                    >
                      {role}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.formActions}>
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={handleSubmit}
                >
                  <Text style={styles.saveButtonText}>{formButtonText}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={resetForm}
                >
                  <Text style={styles.cancelButtonText}>
                    {editingUserId ? "Cancelar" : "Limpiar"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#fff8f1",
  },
  topStickyBar: {
    backgroundColor: "#fff8f1",
    paddingTop: 20,
    paddingBottom: 14,
    paddingHorizontal: 20,
    zIndex: 99999,
    elevation: 30,
    borderBottomWidth: 1,
    borderBottomColor: "#f0dfd1",
    ...(Platform.OS === "web"
      ? ({
          boxShadow: "0 8px 18px rgba(59, 36, 22, 0.12)",
        } as any)
      : {}),
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
    gap: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#3b2416",
  },
  subtitle: {
    marginTop: 4,
    fontSize: 15,
    color: "#7c5f4a",
  },
  headerActions: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
    justifyContent: "flex-end",
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
  summaryScroll: {
    height: 72,
    minHeight: 72,
    maxHeight: 72,
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
  usersLayout: {
    flex: 1,
    flexDirection: "row",
    gap: 16,
    alignItems: "stretch",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    zIndex: 1,
    minHeight: 0,
  },
  usersLayoutStacked: {
    flexDirection: "column",
  },
  usersListColumn: {
    flex: 2,
    minWidth: 0,
    minHeight: 0,
  },
  userFormColumn: {
    flex: 1,
    minWidth: 320,
    alignSelf: "stretch",
    minHeight: 0,
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
  formCard: {
    backgroundColor: "#ffffff",
    borderRadius: 22,
    padding: 18,
    marginBottom: 40,
    borderWidth: 1,
    borderColor: "#f0dfd1",
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 14,
    elevation: 5,
    ...(Platform.OS === "web"
      ? ({
          maxHeight: "100%",
          overflow: "auto",
        } as any)
      : {}),
  },
  listHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#3b2416",
    marginBottom: 2,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: "#8a6a52",
    marginBottom: 8,
  },
  searchInput: {
    backgroundColor: "#fffaf5",
    borderWidth: 1,
    borderColor: "#ead8c8",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
    fontSize: 13,
    color: "#3b2416",
    marginBottom: 8,
  },
  filterScroll: {
    marginBottom: 8,
    maxHeight: 34,
    flexShrink: 0,
  },
  filterContent: {
    alignItems: "center",
    paddingRight: 8,
  },
  filterChip: {
    backgroundColor: "#fffaf5",
    borderWidth: 1,
    borderColor: "#ead8c8",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 6,
  },
  filterChipActive: {
    backgroundColor: "#6f4e37",
    borderColor: "#6f4e37",
  },
  filterText: {
    color: "#6f4e37",
    fontWeight: "800",
    fontSize: 12,
  },
  filterTextActive: {
    color: "#ffffff",
  },
  usersFlatList: {
    flex: 1,
    minHeight: 0,
  },
  usersFlatListContent: {
    paddingBottom: 18,
  },
  emptyText: {
    color: "#7c5f4a",
    fontSize: 15,
    paddingVertical: 12,
    textAlign: "center",
  },
  userCard: {
    backgroundColor: "#fffaf5",
    borderRadius: 18,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ead8c8",
  },
  userInfo: {
    gap: 8,
  },
  userTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
  },
  userName: {
    fontSize: 16,
    fontWeight: "800",
    color: "#3b2416",
  },
  userEmail: {
    marginTop: 3,
    color: "#8a6a52",
    fontSize: 13,
    fontWeight: "700",
  },
  statusBadge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: "flex-start",
  },
  statusActive: {
    backgroundColor: "#d1e7dd",
  },
  statusInactive: {
    backgroundColor: "#f8d7da",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "800",
  },
  statusTextActive: {
    color: "#0f5132",
  },
  statusTextInactive: {
    color: "#842029",
  },
  metaRow: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
    alignItems: "center",
  },
  roleBadge: {
    backgroundColor: "#f1e4d8",
    color: "#3b2416",
    fontWeight: "800",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 999,
    overflow: "hidden",
  },
  verifiedText: {
    color: "#6f5a49",
    fontWeight: "700",
    fontSize: 12,
  },
  codesBox: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 10,
    gap: 4,
  },
  codeText: {
    color: "#6f5a49",
    fontSize: 12,
  },
  userActions: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
    marginTop: 4,
  },
  editButton: {
    backgroundColor: "#0d6efd",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
    alignItems: "center",
  },
  toggleButton: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: "center",
  },
  deactivateButton: {
    backgroundColor: "#f59f00",
  },
  activateButton: {
    backgroundColor: "#198754",
  },
  resetButton: {
    backgroundColor: "#6f4e37",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
    alignItems: "center",
  },
  resendButton: {
    backgroundColor: "#0d6efd",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
    alignItems: "center",
  },
  actionButtonText: {
    color: "#ffffff",
    fontWeight: "800",
    fontSize: 12,
  },
  input: {
    backgroundColor: "#fffaf5",
    borderWidth: 1,
    borderColor: "#ead8c8",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    marginBottom: 10,
    color: "#3b2416",
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: "800",
    color: "#3b2416",
    marginBottom: 6,
  },
  categoryLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#3b2416",
    marginBottom: 8,
  },
  roleOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 14,
  },
  roleOption: {
    borderWidth: 1,
    borderColor: "#d8c2ad",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: "#fffaf5",
  },
  roleOptionSelected: {
    backgroundColor: "#6f4e37",
    borderColor: "#6f4e37",
  },
  roleOptionText: {
    color: "#6f4e37",
    fontWeight: "700",
  },
  roleOptionTextSelected: {
    color: "#ffffff",
  },
  formActions: {
    flexDirection: "row",
    gap: 10,
    paddingTop: 12,
    backgroundColor: "#ffffff",
    ...(Platform.OS === "web"
      ? ({
          position: "sticky",
          bottom: 0,
        } as any)
      : {}),
  },
  saveButton: {
    flex: 1,
    backgroundColor: "#6f4e37",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#ffffff",
    fontWeight: "800",
  },
  cancelButton: {
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 18,
    alignItems: "center",
    backgroundColor: "#f1e4d8",
  },
  cancelButtonText: {
    color: "#3b2416",
    fontWeight: "800",
  },
  toastContainer: {
    position: "absolute",
    top: 70,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 100000,
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
    overflow: "hidden",
  },
  toastError: {
    backgroundColor: "#fdecea",
    color: "#b71c1c",
  },
});
