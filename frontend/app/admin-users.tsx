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
    if (!form.name || !form.email || !form.role) {
      showMessage("Completa los campos obligatorios.", "error");
      return;
    }

    if (!editingUserId && !form.password) {
      showMessage("La contraseña es obligatoria para crear usuarios.", "error");
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

      showMessage(
        "Código de verificación reenviado correctamente.",
        "success",
      );
    } catch (error: any) {
      console.error("Error reenviando código:", error);

      showMessage(
        error?.message || "No se pudo reenviar el código.",
        "error",
      );
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
  const adminUsers = users.filter((u) => u.role === "ADMIN").length;
  const workerUsers = users.filter((u) => u.role === "WORKER").length;

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
              <Text style={styles.summaryNumber}>{adminUsers}</Text>
              <Text style={styles.summaryLabel}>Admins</Text>
            </View>

            <View style={styles.summaryChip}>
              <Text style={styles.summaryNumber}>{workerUsers}</Text>
              <Text style={styles.summaryLabel}>Workers</Text>
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

              <TextInput
                style={styles.input}
                placeholder="Nombre"
                value={form.name}
                onChangeText={(value) => setForm({ ...form, name: value })}
              />

              <TextInput
                style={styles.input}
                placeholder="Correo"
                value={form.email}
                onChangeText={(value) => setForm({ ...form, email: value })}
                autoCapitalize="none"
              />

              {!editingUserId && (
                <TextInput
                  style={styles.input}
                  placeholder="Contraseña"
                  value={form.password}
                  onChangeText={(value) =>
                    setForm({ ...form, password: value })
                  }
                  secureTextEntry
                />
              )}

              <Text style={styles.categoryLabel}>Rol</Text>

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

              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmit}
              >
                <Text style={styles.submitButtonText}>{formButtonText}</Text>
              </TouchableOpacity>

              {editingUserId && (
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={resetForm}
                >
                  <Text style={styles.cancelButtonText}>Cancelar edición</Text>
                </TouchableOpacity>
              )}
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
    backgroundColor: "#F3F4F6",
    padding: 16,
  },
  topStickyBar: {
    zIndex: 10,
    backgroundColor: "#F3F4F6",
    paddingBottom: 8,
  },
  header: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 18,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#111827",
  },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 4,
  },
  headerActions: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
    justifyContent: "flex-end",
  },
  backBtn: {
    backgroundColor: "#E5E7EB",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  backBtnText: {
    color: "#111827",
    fontWeight: "700",
  },
  logoutBtn: {
    backgroundColor: "#111827",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  logoutBtnText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  summaryScroll: {
    marginBottom: 12,
  },
  summaryContent: {
    gap: 10,
  },
  summaryChip: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 18,
    minWidth: 130,
  },
  summaryNumber: {
    fontSize: 22,
    fontWeight: "800",
    color: "#111827",
  },
  summaryLabel: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 2,
  },
  usersLayout: {
    flex: 1,
    flexDirection: "row",
    gap: 16,
  },
  usersLayoutStacked: {
    flexDirection: "column",
  },
  usersListColumn: {
    flex: 1.4,
  },
  userFormColumn: {
    flex: 0.8,
  },
  listCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
  },
  formCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
  },
  listHeaderRow: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111827",
  },
  sectionSubtitle: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 3,
    marginBottom: 12,
  },
  searchInput: {
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
filterScroll: {
  marginBottom: 12,
  maxHeight: 44,
},
filterContent: {
  flexDirection: "row",
  alignItems: "center",
  gap: 8,
  paddingVertical: 2,
},
filterChip: {
  height: 34,
  minWidth: 64,
  paddingHorizontal: 14,
  borderRadius: 999,
  backgroundColor: "#F3F4F6",
  alignItems: "center",
  justifyContent: "center",
},
  filterChipActive: {
    backgroundColor: "#111827",
  },
  filterText: {
    color: "#374151",
    fontWeight: "700",
  },
  filterTextActive: {
    color: "#FFFFFF",
  },
  usersFlatList: {
    flex: 1,
  },
  usersFlatListContent: {
    paddingBottom: 20,
    gap: 12,
  },
  emptyText: {
    color: "#6B7280",
    textAlign: "center",
    marginTop: 20,
  },
  userCard: {
    backgroundColor: "#F9FAFB",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  userInfo: {
    gap: 8,
  },
  userTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  userName: {
    fontSize: 16,
    fontWeight: "800",
    color: "#111827",
  },
  userEmail: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 2,
  },
  statusBadge: {
    borderRadius: 999,
    paddingVertical: 5,
    paddingHorizontal: 10,
    alignSelf: "flex-start",
  },
  statusActive: {
    backgroundColor: "#DCFCE7",
  },
  statusInactive: {
    backgroundColor: "#FEE2E2",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "800",
  },
  statusTextActive: {
    color: "#166534",
  },
  statusTextInactive: {
    color: "#991B1B",
  },
  metaRow: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
    alignItems: "center",
  },
  roleBadge: {
    backgroundColor: "#DBEAFE",
    color: "#1D4ED8",
    fontWeight: "800",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 999,
    overflow: "hidden",
  },
  verifiedText: {
    color: "#374151",
    fontWeight: "600",
  },
  codesBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 10,
    gap: 4,
  },
  codeText: {
    color: "#4B5563",
    fontSize: 12,
  },
  userActions: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
    marginTop: 4,
  },
  editButton: {
    backgroundColor: "#2563EB",
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  toggleButton: {
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  deactivateButton: {
    backgroundColor: "#DC2626",
  },
  activateButton: {
    backgroundColor: "#16A34A",
  },
  resetButton: {
    backgroundColor: "#7C3AED",
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  actionButtonText: {
    color: "#FFFFFF",
    fontWeight: "800",
  },
  input: {
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  categoryLabel: {
    fontSize: 13,
    color: "#374151",
    fontWeight: "800",
    marginBottom: 8,
  },
  roleOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 14,
  },
  roleOption: {
    backgroundColor: "#F3F4F6",
    borderRadius: 999,
    paddingVertical: 9,
    paddingHorizontal: 14,
  },
  roleOptionSelected: {
    backgroundColor: "#111827",
  },
  roleOptionText: {
    color: "#374151",
    fontWeight: "800",
  },
  roleOptionTextSelected: {
    color: "#FFFFFF",
  },
  submitButton: {
    backgroundColor: "#111827",
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontWeight: "800",
  },
  cancelButton: {
    marginTop: 10,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    backgroundColor: "#E5E7EB",
  },
  cancelButtonText: {
    color: "#111827",
    fontWeight: "800",
  },
  toastContainer: {
    position: "absolute",
    top: 14,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 99,
  },
  toast: {
    backgroundColor: "#16A34A",
    color: "#FFFFFF",
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 999,
    fontWeight: "800",
    overflow: "hidden",
  },
  toastError: {
    backgroundColor: "#DC2626",
  },
  resendButton: {
    backgroundColor: "#2563EB",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
});
