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
  Image,
  useWindowDimensions,
  Platform,
} from "react-native";

import {
  getProductsAdmin,
  createProduct,
  updateProduct,
  toggleProductActive,
} from "../src/services/productService";

import { getCategories } from "../src/services/categoryService";

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  categoryId: number;
  categoryName: string;
  active: boolean;
  customizable: boolean;
};

type Category = {
  id: number;
  name: string;
};

type ProductForm = {
  name: string;
  description: string;
  price: string;
  stock: string;
  imageUrl: string;
  categoryId: string;
  customizable: boolean;
};

export default function AdminProducts() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isWideLayout = width >= 900;

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>("ALL");
  const [searchText, setSearchText] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"success" | "error">(
    "success",
  );

  const [form, setForm] = useState<ProductForm>({
    name: "",
    description: "",
    price: "",
    stock: "",
    imageUrl: "",
    categoryId: "",
    customizable: false,
  });

  const loadProducts = async () => {
    try {
      const data = await getProductsAdmin();
      setProducts(data || []);
    } catch (error) {
      console.error("Error cargando productos:", error);
    }
  };

  const loadCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data || []);
    } catch (error) {
      console.error("Error cargando categorías:", error);
    }
  };

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  const resetForm = () => {
    setForm({
      name: "",
      description: "",
      price: "",
      stock: "",
      imageUrl: "",
      categoryId: "",
      customizable: false,
    });
    setEditingProductId(null);
  };

  const showMessage = (text: string, type: "success" | "error" = "success") => {
    setMessageType(type);
    setMessage(text);

    setTimeout(() => {
      setMessage(null);
    }, 1200);
  };

  const handleSubmit = async () => {
    const name = form.name.trim();
    const description = form.description.trim();
    const imageUrl = form.imageUrl.trim();
    const price = Number(form.price);
    const stock = Number(form.stock);

    if (!name || !form.price || !form.stock || !form.categoryId) {
      showMessage("Completa los campos obligatorios.", "error");
      return;
    }

    if (name.length < 3) {
      showMessage("El nombre debe tener al menos 3 caracteres.", "error");
      return;
    }

    if (name.length > 100) {
      showMessage("El nombre no debe superar 100 caracteres.", "error");
      return;
    }

    if (description.length > 500) {
      showMessage("La descripción no debe superar 500 caracteres.", "error");
      return;
    }

    if (Number.isNaN(price) || price <= 0) {
      showMessage("El precio debe ser mayor a cero.", "error");
      return;
    }

    if (!/^\d+(\.\d{1,2})?$/.test(form.price.trim())) {
      showMessage("El precio debe tener máximo 2 decimales.", "error");
      return;
    }

    if (!Number.isInteger(stock) || stock < 0) {
      showMessage(
        "El stock debe ser un número entero mayor o igual a cero.",
        "error",
      );
      return;
    }

    if (
      imageUrl &&
      !imageUrl.startsWith("http://") &&
      !imageUrl.startsWith("https://")
    ) {
      showMessage(
        "La URL de imagen debe iniciar con http:// o https://",
        "error",
      );
      return;
    }

    const payload = {
      name,
      description,
      price,
      stock,
      imageUrl,
      categoryId: Number(form.categoryId),
      customizable: form.customizable,
    };

    try {
      if (editingProductId) {
        await updateProduct(editingProductId, payload);
        showMessage("Producto actualizado correctamente.", "success");
      } else {
        await createProduct(payload);
        showMessage("Producto creado correctamente.", "success");
      }

      resetForm();
      loadProducts();
    } catch (error) {
      console.error("Error guardando producto:", error);
      showMessage("No se pudo guardar el producto.", "error");
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProductId(product.id);

    setForm({
      name: product.name,
      description: product.description || "",
      price: String(product.price),
      stock: String(product.stock),
      imageUrl: product.imageUrl || "",
      categoryId: String(product.categoryId),
      customizable: product.customizable,
    });
  };

  const handleToggleActive = async (product: Product) => {
    try {
      await toggleProductActive(product.id);
      await loadProducts();

      showMessage(
        product.active
          ? "Producto desactivado correctamente."
          : "Producto activado correctamente.",
        "success",
      );
    } catch (error) {
      console.error("Error cambiando estado:", error);
      showMessage("No se pudo cambiar el estado del producto.", "error");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    router.replace("/");
  };

  const totalProducts = products.length;
  const activeProducts = products.filter((p) => p.active).length;
  const inactiveProducts = products.filter((p) => !p.active).length;
  const noStockProducts = products.filter((p) => p.stock === 0).length;

  const getStockStatus = (stock: number) => {
    if (stock === 0) {
      return {
        label: "Sin stock",
        style: styles.stockBadgeEmpty,
      };
    }

    if (stock <= 5) {
      return {
        label: "Stock bajo",
        style: styles.stockBadgeLow,
      };
    }

    return {
      label: "Stock normal",
      style: styles.stockBadgeOk,
    };
  };

  const filteredProducts = products
    .filter((product) => {
      const matchesCategory =
        selectedCategoryFilter === "ALL" ||
        String(product.categoryId) === selectedCategoryFilter;

      const search = searchText.trim().toLowerCase();
      const matchesSearch =
        !search ||
        product.name.toLowerCase().includes(search) ||
        product.description?.toLowerCase().includes(search) ||
        product.categoryName?.toLowerCase().includes(search);

      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      if (a.active !== b.active) {
        return a.active ? -1 : 1;
      }

      const aHasStock = a.stock > 0;
      const bHasStock = b.stock > 0;

      if (aHasStock !== bHasStock) {
        return aHasStock ? -1 : 1;
      }

      return a.name.localeCompare(b.name);
    });

  const formTitle = editingProductId ? "Editar producto" : "Nuevo producto";
  const formButtonText = editingProductId
    ? "Actualizar producto"
    : "Crear producto";

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
              <Text style={styles.subtitle}>Gestión de productos</Text>
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
              <Text style={styles.summaryNumber}>{totalProducts}</Text>
              <Text style={styles.summaryLabel}>Productos</Text>
            </View>

            <View style={styles.summaryChip}>
              <Text style={styles.summaryNumber}>{activeProducts}</Text>
              <Text style={styles.summaryLabel}>Activos</Text>
            </View>

            <View style={styles.summaryChip}>
              <Text style={styles.summaryNumber}>{inactiveProducts}</Text>
              <Text style={styles.summaryLabel}>Inactivos</Text>
            </View>

            <View style={styles.summaryChip}>
              <Text style={styles.summaryNumber}>{noStockProducts}</Text>
              <Text style={styles.summaryLabel}>Sin stock</Text>
            </View>
          </ScrollView>
        </View>

        <View
          style={[
            styles.productsLayout,
            !isWideLayout && styles.productsLayoutStacked,
          ]}
        >
          <View style={styles.productsListColumn}>
            <View style={styles.listCard}>
              <View style={styles.listHeaderRow}>
                <View>
                  <Text style={styles.sectionTitle}>Productos registrados</Text>
                  <Text style={styles.sectionSubtitle}>
                    {filteredProducts.length} producto
                    {filteredProducts.length === 1 ? "" : "s"} en vista
                  </Text>
                </View>
              </View>

              <TextInput
                style={styles.searchInput}
                placeholder="Buscar por nombre, descripción o categoría"
                value={searchText}
                onChangeText={setSearchText}
              />

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.filterScroll}
                contentContainerStyle={styles.filterContent}
              >
                <TouchableOpacity
                  style={[
                    styles.filterChip,
                    selectedCategoryFilter === "ALL" && styles.filterChipActive,
                  ]}
                  onPress={() => setSelectedCategoryFilter("ALL")}
                >
                  <Text
                    style={[
                      styles.filterText,
                      selectedCategoryFilter === "ALL" &&
                        styles.filterTextActive,
                    ]}
                  >
                    Todas
                  </Text>
                </TouchableOpacity>

                {categories.map((category) => (
                  <TouchableOpacity
                    key={category.id}
                    style={[
                      styles.filterChip,
                      selectedCategoryFilter === String(category.id) &&
                        styles.filterChipActive,
                    ]}
                    onPress={() =>
                      setSelectedCategoryFilter(String(category.id))
                    }
                  >
                    <Text
                      style={[
                        styles.filterText,
                        selectedCategoryFilter === String(category.id) &&
                          styles.filterTextActive,
                      ]}
                    >
                      {category.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <FlatList
                data={filteredProducts}
                keyExtractor={(item) => String(item.id)}
                style={styles.productsFlatList}
                contentContainerStyle={styles.productsFlatListContent}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                  <Text style={styles.emptyText}>
                    No hay productos para el filtro seleccionado.
                  </Text>
                }
                renderItem={({ item }) => (
                  <View style={styles.productCard}>
                    <Image
                      source={{ uri: item.imageUrl }}
                      style={styles.productImage}
                    />

                    <View style={styles.productInfo}>
                      <View style={styles.productTitleRow}>
                        <Text style={styles.productName}>{item.name}</Text>

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

                      <Text style={styles.productCategory}>
                        {item.categoryName}
                      </Text>
                      <Text style={styles.productDescription} numberOfLines={2}>
                        {item.description}
                      </Text>

                      <View style={styles.productMeta}>
                        <Text style={styles.productPrice}>
                          S/ {Number(item.price).toFixed(2)}
                        </Text>

                        <View
                          style={[
                            styles.stockBadge,
                            getStockStatus(item.stock).style,
                          ]}
                        >
                          <Text style={styles.stockBadgeText}>
                            {getStockStatus(item.stock).label} · {item.stock}
                          </Text>
                        </View>
                      </View>

                      <View style={styles.productActions}>
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

          <View style={styles.productFormColumn}>
            <View style={styles.formCard}>
              <View style={styles.formHeaderRow}>
                <View>
                  <Text style={styles.sectionTitle}>{formTitle}</Text>
                  <Text style={styles.sectionSubtitle}>
                    {editingProductId
                      ? "Modifica la información del producto seleccionado"
                      : "Registra un nuevo producto para la cafetería"}
                  </Text>
                </View>
              </View>

              <Text style={styles.fieldLabel}>Nombre *</Text>
              <TextInput
                style={styles.input}
                placeholder="Ejemplo: Sandwich de pollo"
                value={form.name}
                onChangeText={(value) => setForm({ ...form, name: value })}
              />

              <Text style={styles.fieldLabel}>Descripción</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Describe brevemente el producto"
                value={form.description}
                onChangeText={(value) =>
                  setForm({ ...form, description: value })
                }
                multiline
              />

              <Text style={styles.fieldLabel}>Precio *</Text>
              <TextInput
                style={styles.input}
                placeholder="Ejemplo: 12.50"
                value={form.price}
                onChangeText={(value) => {
                  const cleanValue = value.replace(/[^0-9.]/g, "");

                  const parts = cleanValue.split(".");

                  if (parts.length > 2) {
                    return;
                  }

                  setForm({
                    ...form,
                    price: cleanValue,
                  });
                }}
                onBlur={() => {
                  if (!form.price) {
                    return;
                  }

                  const formatted = Number(form.price).toFixed(2);

                  setForm({
                    ...form,
                    price: formatted,
                  });
                }}
                keyboardType="numeric"
              />

              <Text style={styles.fieldLabel}>Stock *</Text>
              <TextInput
                style={styles.input}
                placeholder="Ejemplo: 20"
                value={form.stock}
                onChangeText={(value) => {
                  const cleanValue = value.replace(/[^0-9]/g, "");
                  setForm({ ...form, stock: cleanValue });
                }}
                keyboardType="numeric"
              />

              <Text style={styles.fieldLabel}>URL de imagen</Text>
              <TextInput
                style={styles.input}
                placeholder="https://..."
                value={form.imageUrl}
                onChangeText={(value) => setForm({ ...form, imageUrl: value })}
              />
              <View style={styles.categoryContainer}>
                <Text style={styles.categoryLabel}>Categoría</Text>

                <View style={styles.categoryList}>
                  {categories.map((category) => (
                    <TouchableOpacity
                      key={category.id}
                      style={[
                        styles.categoryOption,
                        form.categoryId === String(category.id) &&
                          styles.categoryOptionSelected,
                      ]}
                      onPress={() =>
                        setForm({ ...form, categoryId: String(category.id) })
                      }
                    >
                      <Text
                        style={[
                          styles.categoryOptionText,
                          form.categoryId === String(category.id) &&
                            styles.categoryOptionTextSelected,
                        ]}
                      >
                        {category.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <View style={styles.checkboxContainer}>
                  <TouchableOpacity
                    style={styles.checkboxRow}
                    onPress={() =>
                      setForm({
                        ...form,
                        customizable: !form.customizable,
                      })
                    }
                  >
                    <View
                      style={[
                        styles.checkboxBox,
                        form.customizable && styles.checkboxBoxChecked,
                      ]}
                    >
                      {form.customizable && (
                        <Text style={styles.checkboxCheck}>✓</Text>
                      )}
                    </View>

                    <View style={styles.checkboxTextContainer}>
                      <Text style={styles.checkboxLabel}>
                        Producto personalizable
                      </Text>
                      <Text style={styles.checkboxHelp}>
                        Actívalo si el cliente podrá elegir salsas u opciones
                        adicionales.
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>

              {form.imageUrl ? (
                <Image
                  source={{ uri: form.imageUrl }}
                  style={styles.previewImage}
                />
              ) : null}

              <View style={styles.formActions}>
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={handleSubmit}
                >
                  <Text style={styles.saveButtonText}>{formButtonText}</Text>
                </TouchableOpacity>

                {editingProductId && (
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={resetForm}
                  >
                    <Text style={styles.cancelButtonText}>Cancelar</Text>
                  </TouchableOpacity>
                )}
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
  productsLayout: {
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
  productsLayoutStacked: {
    flexDirection: "column",
  },
  productsListColumn: {
    flex: 2,
    minWidth: 0,
    minHeight: 0,
  },
  productFormColumn: {
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
  categoryContainer: {
    marginBottom: 12,
  },
  categoryLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#3b2416",
    marginBottom: 8,
  },
  categoryList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  categoryOption: {
    borderWidth: 1,
    borderColor: "#d8c2ad",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: "#fffaf5",
  },
  categoryOptionSelected: {
    backgroundColor: "#6f4e37",
    borderColor: "#6f4e37",
  },
  checkboxContainer: {
    marginTop: 16,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    backgroundColor: "#fffaf5",
    borderWidth: 1,
    borderColor: "#ead8c8",
    borderRadius: 14,
    padding: 12,
  },
  checkboxBox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#6f4e37",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
  },
  checkboxBoxChecked: {
    backgroundColor: "#6f4e37",
  },
  checkboxCheck: {
    color: "#ffffff",
    fontWeight: "900",
    fontSize: 14,
  },
  checkboxTextContainer: {
    flex: 1,
  },
  checkboxLabel: {
    color: "#3b2416",
    fontWeight: "800",
    fontSize: 14,
  },
  checkboxHelp: {
    marginTop: 3,
    color: "#8a6a52",
    fontSize: 12,
    lineHeight: 16,
  },
  categoryOptionText: {
    color: "#6f4e37",
    fontWeight: "700",
  },
  categoryOptionTextSelected: {
    color: "#ffffff",
  },
  previewImage: {
    width: "100%",
    height: 180,
    borderRadius: 18,
    marginBottom: 14,
    backgroundColor: "#f1e4d8",
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
  productsFlatList: {
    flex: 1,
    minHeight: 0,
  },
  productsFlatListContent: {
    paddingBottom: 18,
  },
  productCard: {
    flexDirection: "row",
    gap: 12,
    backgroundColor: "#fffaf5",
    borderRadius: 18,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ead8c8",
  },
  productImage: {
    width: 76,
    height: 76,
    borderRadius: 14,
    backgroundColor: "#f1e4d8",
  },
  productInfo: {
    flex: 1,
  },
  productTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
  },
  productName: {
    fontSize: 16,
    fontWeight: "800",
    color: "#3b2416",
  },
  productCategory: {
    marginTop: 3,
    color: "#8a6a52",
    fontSize: 13,
    fontWeight: "700",
  },
  productDescription: {
    marginTop: 4,
    color: "#6f5a49",
    fontSize: 12,
    lineHeight: 16,
  },
  productMeta: {
    flexDirection: "row",
    gap: 14,
    marginTop: 8,
  },
  productPrice: {
    fontWeight: "800",
    color: "#3b2416",
  },
  productStock: {
    color: "#6f5a49",
    fontWeight: "700",
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
  productActions: {
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
  stockBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    alignSelf: "flex-start",
  },
  stockBadgeOk: {
    backgroundColor: "#e7f7ed",
  },
  stockBadgeLow: {
    backgroundColor: "#fff4d6",
  },
  stockBadgeEmpty: {
    backgroundColor: "#fde2e2",
  },
  stockBadgeText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#3b2416",
  },  
});
