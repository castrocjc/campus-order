import { useEffect, useState } from "react";
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
  getCustomizationOptions,
  createCustomizationOption,
  updateCustomizationOption,
  activateCustomizationOption,
  deactivateCustomizationOption,
} from "../src/services/customizationService";

import AdminLayout from "../components/ui/AdminLayout";

type CustomizationOption = {
  id: number;
  name: string;
  description: string;
  active: boolean;
};

type CustomizationOptionForm = {
  name: string;
  description: string;
};

export default function AdminCustomizations() {
  const { width } = useWindowDimensions();
  const isWideLayout = width >= 900;

  const [customizationOptions, setCustomizationOptions] = useState<CustomizationOption[]>([]);
  const [editingCustomizationOptionId, setEditingCustomizationOptionId] = useState<number | null>(null);
  const [statusFilter, setStatusFilter] =
    useState<"ALL" | "ACTIVE" | "INACTIVE">("ALL");
  const [searchText, setSearchText] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"success" | "error">(
    "success",
  );

  const [form, setForm] = useState<CustomizationOptionForm>({
    name: "",
    description: "",
  });

  const loadCustomizationOptions = async () => {
    try {
      const data = await getCustomizationOptions();
      setCustomizationOptions(data || []);
    } catch (error) {
      console.error("Error cargando opciones de personalización:", error);
      showMessage("No se pudieron cargar las opciones de personalización.", "error");
    }
  };

  useEffect(() => {
    loadCustomizationOptions();
  }, []);

  const resetForm = () => {
    setForm({
      name: "",
      description: "",
    });
    setEditingCustomizationOptionId(null);
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
      showMessage("El nombre de la opción es obligatorio.", "error");
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
      if (editingCustomizationOptionId) {
        await updateCustomizationOption(editingCustomizationOptionId, {
          name,
          description,
        });

        showMessage("Opción actualizada correctamente.", "success");
      } else {
        await createCustomizationOption({
          name,
          description,
        });

        showMessage("Opción creada correctamente.", "success");
      }

      resetForm();
      loadCustomizationOptions();
    } catch (error) {
      console.error("Error guardando opción de personalización:", error);
      showMessage(
        getErrorMessage(error, "No se pudo guardar la opción de personalización."),
        "error",
      );
    }
  };

  const handleEdit = (option: CustomizationOption) => {
    setEditingCustomizationOptionId(option.id);

    setForm({
      name: option.name,
      description: option.description || "",
    });
  };

  const handleToggleActive = async (option: CustomizationOption) => {
    try {
      if (option.active) {
        await deactivateCustomizationOption(option.id);
        showMessage("Opción desactivada correctamente.", "success");
      } else {
        await activateCustomizationOption(option.id);
        showMessage("Opción activada correctamente.", "success");
      }

      loadCustomizationOptions();
    } catch (error) {
      console.error("Error cambiando estado de opción:", error);
      showMessage(
        getErrorMessage(error, "No se pudo cambiar el estado de la opción."),
        "error",
      );
    }
  };

  const totalOptions = customizationOptions.length;
  const activeOptions = customizationOptions.filter((o) => o.active).length;
  const inactiveOptions = customizationOptions.filter((o) => !o.active).length;

  const filteredOptions = customizationOptions
    .filter((option) => {
      const search = searchText.trim().toLowerCase();

      const matchesSearch =
        !search ||
        option.name.toLowerCase().includes(search) ||
        (option.description || "").toLowerCase().includes(search);

      const matchesStatus =
        statusFilter === "ALL" ||
        (statusFilter === "ACTIVE" && option.active) ||
        (statusFilter === "INACTIVE" && !option.active);

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (a.active !== b.active) {
        return a.active ? -1 : 1;
      }

      return a.name.localeCompare(b.name);
    });

  const formTitle = editingCustomizationOptionId ? "Editar opción" : "Nueva opción";
  const formButtonText = editingCustomizationOptionId
    ? "Actualizar opción"
    : "Crear opción";

  return (
    <AdminLayout
      title="Panel administrador"
      subtitle="Gestión de personalizaciones"
      allowedRoles={["ADMIN"]}
    >
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

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.summaryScroll}
          contentContainerStyle={styles.summaryContent}
        >
            <View style={styles.summaryChip}>
              <Text style={styles.summaryNumber}>{totalOptions}</Text>
              <Text style={styles.summaryLabel}>Opciones</Text>
            </View>

            <View style={styles.summaryChip}>
              <Text style={styles.summaryNumber}>{activeOptions}</Text>
              <Text style={styles.summaryLabel}>Activas</Text>
            </View>

            <View style={styles.summaryChip}>
              <Text style={styles.summaryNumber}>{inactiveOptions}</Text>
              <Text style={styles.summaryLabel}>Inactivas</Text>
            </View>
          </ScrollView>

        <View
          style={[
            styles.customizationsLayout,
            !isWideLayout && styles.customizationsLayoutStacked,
          ]}
        >
          <View style={styles.customizationsListColumn}>
            <View style={styles.listCard}>
              <View style={styles.listHeaderRow}>
                <View>
                  <Text style={styles.sectionTitle}>
                    Opciones registradas
                  </Text>
                  <Text style={styles.sectionSubtitle}>
                    {filteredOptions.length} opción
                    {filteredOptions.length === 1 ? "" : "s"} en vista
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
                data={filteredOptions}
                keyExtractor={(item) => String(item.id)}
                style={styles.customizationsFlatList}
                contentContainerStyle={styles.customizationsFlatListContent}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                  <Text style={styles.emptyText}>
                    No hay opciones para el filtro seleccionado.
                  </Text>
                }
                renderItem={({ item }) => (
                  <View style={styles.optionCard}>
                    <View style={styles.optionInfo}>
                      <View style={styles.optionTitleRow}>
                        <Text style={styles.optionName}>{item.name}</Text>

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

                      <Text style={styles.optionDescription} numberOfLines={2}>
                        {item.description || "Sin descripción"}
                      </Text>

                      <View style={styles.optionActions}>
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

          <View style={styles.customizationFormColumn}>
            <View style={styles.formCard}>
              <View style={styles.formHeaderRow}>
                <View>
                  <Text style={styles.sectionTitle}>{formTitle}</Text>
                  <Text style={styles.sectionSubtitle}>
                    {editingCustomizationOptionId
                      ? "Modifica la información de la opción seleccionada"
                      : "Registra una nueva opción de personalización"}
                  </Text>
                </View>
              </View>

              <Text style={styles.fieldLabel}>Nombre *</Text>
              <TextInput
                style={styles.input}
                placeholder="Ejemplo: Sin cebolla"
                value={form.name}
                onChangeText={(value) => setForm({ ...form, name: value })}
              />

              <Text style={styles.fieldLabel}>Descripción</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Describe brevemente la opción"
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
                    {editingCustomizationOptionId ? "Cancelar" : "Limpiar"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
    </View>
  </AdminLayout>
);
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#fff8f1",
  },
  summaryScroll: {
    maxHeight: 54,
    flexShrink: 0,
    marginBottom: 12,
  },

  summaryContent: {
    alignItems: "center",
    paddingVertical: 4,
    paddingHorizontal: 16,
  },
  summaryChip: {
    minWidth: 110,
    height: 52,
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
  customizationsLayout: {
    flex: 1,
    flexDirection: "row",
    gap: 16,
    alignItems: "stretch",
    paddingHorizontal: 20,
    paddingTop: 0,
    paddingBottom: 20,
    zIndex: 1,
    minHeight: 0,
  },
  customizationsLayoutStacked: {
    flexDirection: "column",
  },
  customizationsListColumn: {
    flex: 2,
    minWidth: 0,
    minHeight: 0,
  },
  customizationFormColumn: {
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
  customizationsFlatList: {
    flex: 1,
    minHeight: 0,
  },
  customizationsFlatListContent: {
    paddingBottom: 18,
  },
  optionCard: {
    backgroundColor: "#fffaf5",
    borderRadius: 18,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ead8c8",
  },
  optionInfo: {
    flex: 1,
  },
  optionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
  },
  optionName: {
    fontSize: 16,
    fontWeight: "800",
    color: "#3b2416",
  },
  optionDescription: {
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
  optionActions: {
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