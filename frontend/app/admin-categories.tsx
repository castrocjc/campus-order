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
  getCategoriesAdmin,
  createCategory,
  updateCategory,
  activateCategory,
  deactivateCategory,
} from "../src/services/categoryService";

type Category = {
  id: number;
  name: string;
  description: string;
  active: boolean;
};

type CategoryForm = {
  name: string;
  description: string;
};

export default function AdminCategories() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isWideLayout = width >= 900;

  const [categories, setCategories] = useState<Category[]>([]);
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);
  const [statusFilter, setStatusFilter] =
    useState<"ALL" | "ACTIVE" | "INACTIVE">("ALL");
  const [searchText, setSearchText] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"success" | "error">(
    "success",
  );

  const [form, setForm] = useState<CategoryForm>({
    name: "",
    description: "",
  });

  const loadCategories = async () => {
    try {
      const data = await getCategoriesAdmin();
      setCategories(data || []);
    } catch (error) {
      console.error("Error cargando categorías:", error);
      showMessage("No se pudieron cargar las categorías.", "error");
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const resetForm = () => {
    setForm({
      name: "",
      description: "",
    });
    setEditingCategoryId(null);
  };

  const showMessage = (text: string, type: "success" | "error" = "success") => {
    setMessageType(type);
    setMessage(text);

    setTimeout(() => {
      setMessage(null);
    }, 1200);
  };

  const getErrorMessage = (error: unknown, fallback: string) => {
    if (error instanceof Error && error.message) {
      return error.message;
    }

    return fallback;
  };

  const handleSubmit = async () => {
    const name = form.name.trim();
    const description = form.description.trim();

    if (!name) {
      showMessage("El nombre de la categoría es obligatorio.", "error");
      return;
    }

    if (name.length < 3) {
      showMessage("El nombre debe tener al menos 3 caracteres.", "error");
      return;
    }

    if (name.length > 50) {
      showMessage("El nombre no debe superar 50 caracteres.", "error");
      return;
    }

    if (description.length > 150) {
      showMessage("La descripción no debe superar 150 caracteres.", "error");
      return;
    }

    try {
      if (editingCategoryId) {
        await updateCategory(editingCategoryId, {
          name,
          description,
        });

        showMessage("Categoría actualizada correctamente.", "success");
      } else {
        await createCategory({
          name,
          description,
        });

        showMessage("Categoría creada correctamente.", "success");
      }

      resetForm();
      loadCategories();
    } catch (error) {
      console.error("Error guardando categoría:", error);
      showMessage(
        getErrorMessage(error, "No se pudo guardar la categoría."),
        "error",
      );
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategoryId(category.id);

    setForm({
      name: category.name,
      description: category.description || "",
    });
  };

  const handleToggleActive = async (category: Category) => {
    try {
      if (category.active) {
        await deactivateCategory(category.id);
        showMessage("Categoría desactivada correctamente.", "success");
      } else {
        await activateCategory(category.id);
        showMessage("Categoría activada correctamente.", "success");
      }

      loadCategories();
    } catch (error) {
      console.error("Error cambiando estado de categoría:", error);
      showMessage(
        getErrorMessage(error, "No se pudo cambiar el estado de la categoría."),
        "error",
      );
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    router.replace("/");
  };

  const totalCategories = categories.length;
  const activeCategories = categories.filter((c) => c.active).length;
  const inactiveCategories = categories.filter((c) => !c.active).length;

  const filteredCategories = categories
    .filter((category) => {
      const search = searchText.trim().toLowerCase();

      const matchesSearch =
        !search ||
        category.name.toLowerCase().includes(search) ||
        (category.description || "").toLowerCase().includes(search);

      const matchesStatus =
        statusFilter === "ALL" ||
        (statusFilter === "ACTIVE" && category.active) ||
        (statusFilter === "INACTIVE" && !category.active);

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (a.active !== b.active) {
        return a.active ? -1 : 1;
      }

      return a.name.localeCompare(b.name);
    });

  const formTitle = editingCategoryId ? "Editar categoría" : "Nueva categoría";
  const formButtonText = editingCategoryId
    ? "Actualizar categoría"
    : "Crear categoría";

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
              <Text style={styles.subtitle}>Gestión de categorías</Text>
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
              <Text style={styles.summaryNumber}>{totalCategories}</Text>
              <Text style={styles.summaryLabel}>Categorías</Text>
            </View>

            <View style={styles.summaryChip}>
              <Text style={styles.summaryNumber}>{activeCategories}</Text>
              <Text style={styles.summaryLabel}>Activas</Text>
            </View>

            <View style={styles.summaryChip}>
              <Text style={styles.summaryNumber}>{inactiveCategories}</Text>
              <Text style={styles.summaryLabel}>Inactivas</Text>
            </View>
          </ScrollView>
        </View>

        <View
          style={[
            styles.categoriesLayout,
            !isWideLayout && styles.categoriesLayoutStacked,
          ]}
        >
          <View style={styles.categoriesListColumn}>
            <View style={styles.listCard}>
              <View style={styles.listHeaderRow}>
                <View>
                  <Text style={styles.sectionTitle}>
                    Categorías registradas
                  </Text>
                  <Text style={styles.sectionSubtitle}>
                    {filteredCategories.length} categoría
                    {filteredCategories.length === 1 ? "" : "s"} en vista
                  </Text>
                </View>
              </View>

              <TextInput
                style={styles.searchInput}
                placeholder="Buscar por nombre o descripción"
                value={searchText}
                onChangeText={setSearchText}
              />

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.filterScroll}
                contentContainerStyle={styles.filterContent}
              >
                {[
                  { key: "ALL", label: "Todas" },
                  { key: "ACTIVE", label: "Activas" },
                  { key: "INACTIVE", label: "Inactivas" },
                ].map((filter) => (
                  <TouchableOpacity
                    key={filter.key}
                    style={[
                      styles.filterChip,
                      statusFilter === filter.key && styles.filterChipActive,
                    ]}
                    onPress={() => setStatusFilter(filter.key as any)}
                  >
                    <Text
                      style={[
                        styles.filterText,
                        statusFilter === filter.key &&
                          styles.filterTextActive,
                      ]}
                    >
                      {filter.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <FlatList
                data={filteredCategories}
                keyExtractor={(item) => String(item.id)}
                style={styles.categoriesFlatList}
                contentContainerStyle={styles.categoriesFlatListContent}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                  <Text style={styles.emptyText}>
                    No hay categorías para el filtro seleccionado.
                  </Text>
                }
                renderItem={({ item }) => (
                  <View style={styles.categoryCard}>
                    <View style={styles.categoryInfo}>
                      <View style={styles.categoryTitleRow}>
                        <Text style={styles.categoryName}>{item.name}</Text>

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
                            {item.active ? "Activa" : "Inactiva"}
                          </Text>
                        </View>
                      </View>

                      <Text style={styles.categoryDescription} numberOfLines={2}>
                        {item.description || "Sin descripción"}
                      </Text>

                      <View style={styles.categoryActions}>
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
                      </View>
                    </View>
                  </View>
                )}
              />
            </View>
          </View>

          <View style={styles.categoryFormColumn}>
            <View style={styles.formCard}>
              <View style={styles.formHeaderRow}>
                <View>
                  <Text style={styles.sectionTitle}>{formTitle}</Text>
                  <Text style={styles.sectionSubtitle}>
                    {editingCategoryId
                      ? "Modifica la información de la categoría seleccionada"
                      : "Registra una nueva categoría para el catálogo"}
                  </Text>
                </View>
              </View>

              <Text style={styles.fieldLabel}>Nombre *</Text>
              <TextInput
                style={styles.input}
                placeholder="Ejemplo: Bebidas"
                value={form.name}
                onChangeText={(value) => setForm({ ...form, name: value })}
              />

              <Text style={styles.fieldLabel}>Descripción</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Describe brevemente la categoría"
                value={form.description}
                onChangeText={(value) =>
                  setForm({ ...form, description: value })
                }
                multiline
                maxLength={150}
              />

              <Text style={styles.helperText}>Máximo 150 caracteres.</Text>

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
                    {editingCategoryId ? "Cancelar" : "Limpiar"}
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
  categoriesLayout: {
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
  categoriesLayoutStacked: {
    flexDirection: "column",
  },
  categoriesListColumn: {
    flex: 2,
    minWidth: 0,
    minHeight: 0,
  },
  categoryFormColumn: {
    flex: 1,
    minWidth: 320,
    alignSelf: "stretch",
    minHeight: 0,
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
  listHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
  },
  formHeaderRow: {
    marginBottom: 2,
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
  textArea: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  helperText: {
    color: "#8a6a52",
    fontSize: 12,
    marginTop: -4,
    marginBottom: 8,
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
    backgroundColor: "#f1e4d8",
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 18,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#3b2416",
    fontWeight: "800",
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
  categoriesFlatList: {
    flex: 1,
    minHeight: 0,
  },
  categoriesFlatListContent: {
    paddingBottom: 18,
  },
  categoryCard: {
    backgroundColor: "#fffaf5",
    borderRadius: 18,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ead8c8",
  },
  categoryInfo: {
    flex: 1,
  },
  categoryTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: "800",
    color: "#3b2416",
  },
  categoryDescription: {
    marginTop: 4,
    color: "#6f5a49",
    fontSize: 12,
    lineHeight: 16,
  },
  statusBadge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
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
  categoryActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 8,
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
  actionButtonText: {
    color: "#ffffff",
    fontWeight: "800",
    fontSize: 12,
  },
  emptyText: {
    color: "#7c5f4a",
    fontSize: 15,
    paddingVertical: 12,
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
  },
  toastError: {
    backgroundColor: "#fdecea",
    color: "#b71c1c",
  },
});