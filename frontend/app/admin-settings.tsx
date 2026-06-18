import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";

import AdminLayout from "../components/ui/AdminLayout";
import {
  CafeteriaSchedule,
  CafeteriaSettings,
  getCafeteriaSettings,
  updateCafeteriaSettings,
} from "../src/services/cafeteriaSettingsService";

const TIMEZONE_CURRENCY_MAP: Record<string, string> = {
  "America/Lima": "PEN",
  "America/Mexico_City": "MXN",
  "America/Bogota": "COP",
  "America/Santiago": "CLP",
  "America/New_York": "USD",
};

const DAY_LABELS: Record<string, string> = {
  MONDAY: "Lunes",
  TUESDAY: "Martes",
  WEDNESDAY: "Miércoles",
  THURSDAY: "Jueves",
  FRIDAY: "Viernes",
  SATURDAY: "Sábado",
  SUNDAY: "Domingo",
};

const TIMEZONES = [
  "America/Lima",
  "America/Mexico_City",
  "America/Bogota",
  "America/Santiago",
  "America/New_York",
];

const CURRENCIES = [
  { code: "PEN", label: "Sol Peruano" },
  { code: "MXN", label: "Peso Mexicano" },
  { code: "COP", label: "Peso Colombiano" },
  { code: "CLP", label: "Peso Chileno" },
  { code: "USD", label: "Dólar Estadounidense" },
];

const DEFAULT_SETTINGS: CafeteriaSettings = {
  id: 1,
  name: "",
  description: "",
  active: true,
  address: "",
  reference: "",
  contactPhone: "",
  timezone: "America/Lima",
  currency: "PEN",
  minPreparationMinutes: 20,
  pickupIntervalMinutes: 30,
  schedules: [],
};

function toDisplayTime(value?: string) {
  if (!value) return "00:00";
  return value.substring(0, 5);
}

function toApiTime(value: string) {
  if (!value || value === "--") return "00:00:00";
  return value.length === 5 ? `${value}:00` : value;
}

function isValidTime(value: string) {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(value);
}

function normalizeSettings(data: CafeteriaSettings): CafeteriaSettings {
  return {
    ...data,
    schedules: data.schedules.map((schedule) => ({
      ...schedule,
      openingTime: toDisplayTime(schedule.openingTime),
      closingTime: toDisplayTime(schedule.closingTime),
    })),
  };
}

export default function AdminSettingsScreen() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 900;

  const [settings, setSettings] = useState<CafeteriaSettings>(DEFAULT_SETTINGS);
  const [originalSettings, setOriginalSettings] =
    useState<CafeteriaSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">(
    "success",
  );

  useEffect(() => {
    loadSettings();
  }, []);

  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => {
      setMessage("");
    }, 3500);

    return () => clearTimeout(timer);
  }, [message]);

  async function loadSettings() {
    try {
      setLoading(true);
      const data = await getCafeteriaSettings();
      const normalizedData = normalizeSettings(data);

      setSettings(normalizedData);
      setOriginalSettings(normalizedData);
    } catch (error: any) {
      showMessage(
        error?.message || "No se pudo cargar la configuración.",
        "error",
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    try {
      validateForm();
      setSaving(true);

      const payload: CafeteriaSettings = {
        ...settings,
        name: settings.name.trim(),
        description: settings.description?.trim(),
        address: settings.address?.trim(),
        reference: settings.reference?.trim(),
        contactPhone: settings.contactPhone?.trim(),
        timezone: settings.timezone.trim(),
        currency: settings.currency.trim().toUpperCase(),
        schedules: settings.schedules.map((schedule) => ({
          ...schedule,
          openingTime: schedule.closed
            ? "00:00:00"
            : toApiTime(schedule.openingTime),
          closingTime: schedule.closed
            ? "00:00:00"
            : toApiTime(schedule.closingTime),
        })),
      };

      const updated = await updateCafeteriaSettings(payload);
      const normalizedUpdated = normalizeSettings(updated);

      setSettings(normalizedUpdated);
      setOriginalSettings(normalizedUpdated);
      showMessage("Configuración guardada correctamente.", "success");
    } catch (error: any) {
      showMessage(
        error?.message || "No se pudo guardar la configuración.",
        "error",
      );
    } finally {
      setSaving(false);
    }
  }

  function handleClear() {
    if (!originalSettings) return;

    setSettings(originalSettings);
    showMessage("Cambios descartados.", "success");
  }

  function showMessage(text: string, type: "success" | "error") {
    setMessage(text);
    setMessageType(type);
  }

  function validateForm() {
    if (!settings.name.trim()) {
      throw new Error("El nombre de la cafetería es obligatorio.");
    }

    if (settings.name.trim().length < 3) {
      throw new Error("El nombre debe tener al menos 3 caracteres.");
    }

    if (!settings.timezone.trim()) {
      throw new Error("La zona horaria es obligatoria.");
    }

    if (!settings.currency.trim()) {
      throw new Error("La moneda es obligatoria.");
    }

    if (settings.minPreparationMinutes < 1) {
      throw new Error("El tiempo mínimo de preparación debe ser mayor a cero.");
    }

    if (settings.pickupIntervalMinutes < 1) {
      throw new Error("El intervalo de recojo debe ser mayor a cero.");
    }

    if (settings.schedules.length !== 7) {
      throw new Error("Debe configurar los 7 días de la semana.");
    }

    settings.schedules.forEach((schedule) => {
      if (schedule.closed) return;

      if (!isValidTime(schedule.openingTime)) {
        throw new Error(
          `La hora de apertura de ${DAY_LABELS[schedule.dayOfWeek]} debe tener formato HH:mm.`,
        );
      }

      if (!isValidTime(schedule.closingTime)) {
        throw new Error(
          `La hora de cierre de ${DAY_LABELS[schedule.dayOfWeek]} debe tener formato HH:mm.`,
        );
      }

      if (schedule.openingTime >= schedule.closingTime) {
        throw new Error(
          `La apertura debe ser menor al cierre para ${DAY_LABELS[schedule.dayOfWeek]}.`,
        );
      }
    });
  }

  function updateField<K extends keyof CafeteriaSettings>(
    field: K,
    value: CafeteriaSettings[K],
  ) {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function updateSchedule(
    dayOfWeek: string,
    field: keyof CafeteriaSchedule,
    value: string | boolean,
  ) {
    setSettings((prev) => ({
      ...prev,
      schedules: prev.schedules.map((schedule) =>
        schedule.dayOfWeek === dayOfWeek
          ? {
              ...schedule,
              [field]: value,
              ...(field === "closed" && value === true
                ? { openingTime: "00:00", closingTime: "00:00" }
                : {}),
              ...(field === "closed" && value === false
                ? { openingTime: "07:00", closingTime: "21:00" }
                : {}),
            }
          : schedule,
      ),
    }));
  }

  if (loading) {
    return (
      <AdminLayout title="Configuración de Cafetería">
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
          <Text style={styles.loadingText}>Cargando configuración...</Text>
        </View>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Configuración de Cafetería">
      <View style={styles.page}>
        <View style={styles.headerCard}>
          <View style={styles.headerIconBox}>
            <Text style={styles.headerIcon}>⚙️</Text>
          </View>

          <View style={styles.headerTextBox}>
            <Text style={styles.headerTitle}>Configuración operativa</Text>
            <Text style={styles.headerSubtitle}>
              Administra los datos generales, horarios, ubicación y parámetros
              del sistema.
            </Text>
          </View>
        </View>

        {message ? (
          <View
            style={[
              styles.messageBox,
              messageType === "success"
                ? styles.messageSuccess
                : styles.messageError,
            ]}
          >
            <Text
              style={[
                styles.messageText,
                messageType === "success"
                  ? styles.messageTextSuccess
                  : styles.messageTextError,
              ]}
            >
              {message}
            </Text>
          </View>
        ) : null}

        <ScrollView
          style={styles.scrollArea}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator
        >
          <View
            style={[
              styles.contentGrid,
              isDesktop ? styles.contentGridDesktop : styles.contentGridMobile,
            ]}
          >
            <View style={styles.columnLarge}>
              <View
                style={[styles.card, isDesktop ? styles.topCardHeight : null]}
              >
                <Text style={styles.sectionTitle}>Horarios de Atención</Text>
                <Text style={styles.sectionSubtitle}>
                  Usa formato HH:mm. Marca cerrado cuando no haya atención.
                </Text>

                <View style={styles.scheduleHeader}>
                  <Text style={[styles.scheduleHeaderText, styles.dayColumn]}>
                    Día
                  </Text>
                  <Text style={styles.scheduleHeaderText}>Apertura</Text>
                  <Text style={styles.scheduleHeaderText}>Cierre</Text>
                  <Text style={styles.scheduleHeaderText}>Estado</Text>
                </View>

                {settings.schedules.map((schedule) => (
                  <View key={schedule.dayOfWeek} style={styles.scheduleRow}>
                    <Text style={[styles.dayLabel, styles.dayColumn]}>
                      {DAY_LABELS[schedule.dayOfWeek]}
                    </Text>

                    <TextInput
                      style={[
                        styles.timeInput,
                        schedule.closed ? styles.inputDisabled : null,
                      ]}
                      value={schedule.closed ? "--" : schedule.openingTime}
                      editable={!schedule.closed}
                      placeholder="07:00"
                      onChangeText={(value) =>
                        updateSchedule(schedule.dayOfWeek, "openingTime", value)
                      }
                    />

                    <TextInput
                      style={[
                        styles.timeInput,
                        schedule.closed ? styles.inputDisabled : null,
                      ]}
                      value={schedule.closed ? "--" : schedule.closingTime}
                      editable={!schedule.closed}
                      placeholder="21:00"
                      onChangeText={(value) =>
                        updateSchedule(schedule.dayOfWeek, "closingTime", value)
                      }
                    />

                    <TouchableOpacity
                      style={[
                        styles.closedButton,
                        schedule.closed ? styles.closedButtonSelected : null,
                      ]}
                      onPress={() =>
                        updateSchedule(
                          schedule.dayOfWeek,
                          "closed",
                          !schedule.closed,
                        )
                      }
                    >
                      <Text
                        style={[
                          styles.closedButtonText,
                          schedule.closed
                            ? styles.closedButtonTextSelected
                            : null,
                        ]}
                      >
                        {schedule.closed ? "Cerrado" : "Abierto"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.column}>
              <View
                style={[styles.card, isDesktop ? styles.topCardHeight : null]}
              >
                <Text style={styles.sectionTitle}>Sistema</Text>

                <Text style={styles.label}>Zona horaria *</Text>
                <View style={styles.optionContainer}>
                  {TIMEZONES.map((timezone) => (
                    <TouchableOpacity
                      key={timezone}
                      style={[
                        styles.optionChip,
                        settings.timezone === timezone &&
                          styles.optionChipSelected,
                      ]}
                      onPress={() => {
                        updateField("timezone", timezone);

                        const currency = TIMEZONE_CURRENCY_MAP[timezone];

                        if (currency) {
                          updateField("currency", currency);
                        }
                      }}
                    >
                      <Text
                        style={[
                          styles.optionChipText,
                          settings.timezone === timezone &&
                            styles.optionChipTextSelected,
                        ]}
                      >
                        {timezone}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={styles.label}>Moneda *</Text>
                <View style={styles.optionContainer}>
                  {CURRENCIES.map((currency) => (
                    <TouchableOpacity
                      key={currency.code}
                      style={[
                        styles.optionChip,
                        settings.currency === currency.code &&
                          styles.optionChipSelected,
                      ]}
                      onPress={() => updateField("currency", currency.code)}
                    >
                      <Text
                        style={[
                          styles.optionChipText,
                          settings.currency === currency.code &&
                            styles.optionChipTextSelected,
                        ]}
                      >
                        {currency.code}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={styles.label}>
                  Tiempo mínimo de preparación (min) *
                </Text>

                <View style={styles.spinContainer}>
                  <TouchableOpacity
                    style={styles.spinButton}
                    onPress={() =>
                      updateField(
                        "minPreparationMinutes",
                        Math.max(5, settings.minPreparationMinutes - 5),
                      )
                    }
                  >
                    <Text style={styles.spinButtonText}>−</Text>
                  </TouchableOpacity>

                  <Text style={styles.spinValue}>
                    {settings.minPreparationMinutes}
                  </Text>

                  <TouchableOpacity
                    style={styles.spinButton}
                    onPress={() =>
                      updateField(
                        "minPreparationMinutes",
                        Math.min(120, settings.minPreparationMinutes + 5),
                      )
                    }
                  >
                    <Text style={styles.spinButtonText}>+</Text>
                  </TouchableOpacity>
                </View>

                <Text style={styles.label}>Intervalo de recojo (min) *</Text>

                <View style={styles.spinContainer}>
                  <TouchableOpacity
                    style={styles.spinButton}
                    onPress={() =>
                      updateField(
                        "pickupIntervalMinutes",
                        Math.max(5, settings.pickupIntervalMinutes - 5),
                      )
                    }
                  >
                    <Text style={styles.spinButtonText}>−</Text>
                  </TouchableOpacity>

                  <Text style={styles.spinValue}>
                    {settings.pickupIntervalMinutes}
                  </Text>

                  <TouchableOpacity
                    style={styles.spinButton}
                    onPress={() =>
                      updateField(
                        "pickupIntervalMinutes",
                        Math.min(120, settings.pickupIntervalMinutes + 5),
                      )
                    }
                  >
                    <Text style={styles.spinButtonText}>+</Text>
                  </TouchableOpacity>
                </View>

                <Text style={styles.label}>Estado</Text>
                <TouchableOpacity
                  style={[
                    styles.statusButton,
                    settings.active
                      ? styles.statusActive
                      : styles.statusInactive,
                  ]}
                  onPress={() => updateField("active", !settings.active)}
                >
                  <Text style={styles.statusButtonText}>
                    {settings.active ? "🟢 Activa" : "🔴 Inactiva"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View
            style={[
              styles.contentGrid,
              isDesktop ? styles.contentGridDesktop : styles.contentGridMobile,
            ]}
          >
            <View style={styles.column}>
              <View
                style={[
                  styles.card,
                  isDesktop ? styles.bottomCardHeight : null,
                ]}
              >
                <Text style={styles.sectionTitle}>Información General</Text>

                <Text style={styles.label}>Nombre de la cafetería *</Text>
                <TextInput
                  style={styles.input}
                  value={settings.name}
                  placeholder="Ejemplo: Cafetería Central"
                  onChangeText={(value) => updateField("name", value)}
                />

                <Text style={styles.label}>Descripción corta</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={settings.description || ""}
                  placeholder="Ejemplo: Cafetería principal del campus"
                  multiline
                  onChangeText={(value) => updateField("description", value)}
                />
              </View>
            </View>

            <View style={styles.column}>
              <View
                style={[
                  styles.card,
                  isDesktop ? styles.bottomCardHeight : null,
                ]}
              >
                <Text style={styles.sectionTitle}>Ubicación</Text>

                <Text style={styles.label}>Dirección</Text>
                <TextInput
                  style={styles.input}
                  value={settings.address || ""}
                  placeholder="Ejemplo: Campus universitario"
                  onChangeText={(value) => updateField("address", value)}
                />

                <Text style={styles.label}>Referencia</Text>
                <TextInput
                  style={styles.input}
                  value={settings.reference || ""}
                  placeholder="Ejemplo: Frente al patio principal"
                  onChangeText={(value) => updateField("reference", value)}
                />

                <Text style={styles.label}>Teléfono de contacto</Text>
                <TextInput
                  style={styles.input}
                  value={settings.contactPhone || ""}
                  placeholder="Ejemplo: 999999999"
                  keyboardType="phone-pad"
                  onChangeText={(value) => updateField("contactPhone", value)}
                />
              </View>
            </View>
          </View>

          <View
            style={[
              styles.actionsCard,
              isDesktop ? styles.actionsCardDesktop : null,
            ]}
          >
            <TouchableOpacity
              style={[
                styles.primaryButton,
                saving ? styles.buttonDisabled : null,
              ]}
              onPress={handleSave}
              disabled={saving}
            >
              <Text style={styles.primaryButtonText}>
                {saving ? "Guardando..." : "💾 Guardar configuración"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={handleClear}
            >
              <Text style={styles.secondaryButtonText}>↩ Deshacer cambios</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </AdminLayout>
  );
}

const styles = {
  page: {
    flex: 1,
    minHeight: 0,
  },
  scrollArea: {
    flex: 1,
    minHeight: 0,
  },
  scrollContent: {
    paddingBottom: 18,
  },
  loadingContainer: {
    flex: 1,
    minHeight: 400,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  loadingText: {
    marginTop: 12,
    color: "#6B4F3A",
    fontSize: 15,
  },
  messageBox: {
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
  },
  messageSuccess: {
    backgroundColor: "#EAF7EE",
    borderColor: "#9BD3A8",
  },
  messageError: {
    backgroundColor: "#FDECEC",
    borderColor: "#E5A1A1",
  },
  messageText: {
    fontSize: 14,
    fontWeight: "700" as const,
  },
  messageTextSuccess: {
    color: "#256D3C",
  },
  messageTextError: {
    color: "#A33A3A",
  },
  headerCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#E7D8C5",
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 14,
  },
  headerIconBox: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: "#F5EFE7",
    borderWidth: 1,
    borderColor: "#D9C5AD",
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  headerIcon: {
    fontSize: 24,
  },
  headerTextBox: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "800" as const,
    color: "#3B2416",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#7A6048",
    lineHeight: 20,
  },
  contentGrid: {
    gap: 14,
    marginBottom: 14,
  },
  contentGridDesktop: {
    flexDirection: "row" as const,
    alignItems: "stretch" as const,
  },
  contentGridMobile: {
    flexDirection: "column" as const,
  },
  column: {
    flex: 1,
  },
  columnLarge: {
    flex: 1.45,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: "#E7D8C5",
  },
  topCardHeight: {
    minHeight: 384,
  },
  bottomCardHeight: {
    minHeight: 210,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800" as const,
    color: "#3B2416",
    marginBottom: 6,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: "#7A6048",
    marginBottom: 12,
  },
  label: {
    fontSize: 13,
    fontWeight: "700" as const,
    color: "#5B3A24",
    marginTop: 10,
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D9C5AD",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 14,
    color: "#3B2416",
  },
  inputDisabled: {
    backgroundColor: "#EEE6DC",
    color: "#9A8A7A",
  },
  textArea: {
    minHeight: 70,
    textAlignVertical: "top" as const,
  },
  scheduleHeader: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 10,
    paddingBottom: 8,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#E7D8C5",
  },
  scheduleHeaderText: {
    width: 90,
    fontSize: 12,
    fontWeight: "800" as const,
    color: "#7A6048",
  },
  dayColumn: {
    width: 120,
  },
  scheduleRow: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 10,
    marginBottom: 9,
  },
  dayLabel: {
    fontSize: 13,
    fontWeight: "800" as const,
    color: "#5B3A24",
  },
  timeInput: {
    width: 90,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D9C5AD",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 13,
    color: "#3B2416",
    textAlign: "center" as const,
  },
  closedButton: {
    width: 86,
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: "#EAF7EE",
    borderWidth: 1,
    borderColor: "#9BD3A8",
    alignItems: "center" as const,
  },
  closedButtonSelected: {
    backgroundColor: "#3B2416",
    borderColor: "#3B2416",
  },
  closedButtonText: {
    fontSize: 12,
    fontWeight: "800" as const,
    color: "#256D3C",
  },
  closedButtonTextSelected: {
    color: "#FFFFFF",
  },
  statusButton: {
    alignSelf: "flex-start" as const,
    borderRadius: 999,
    paddingVertical: 9,
    paddingHorizontal: 16,
    marginTop: 4,
  },
  statusActive: {
    backgroundColor: "#EAF7EE",
    borderWidth: 1,
    borderColor: "#9BD3A8",
  },
  statusInactive: {
    backgroundColor: "#FDECEC",
    borderWidth: 1,
    borderColor: "#E5A1A1",
  },
  statusButtonText: {
    fontSize: 14,
    fontWeight: "800" as const,
    color: "#3B2416",
  },
  actionsCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: "#E7D8C5",
    gap: 12,
  },
  actionsCardDesktop: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: "#6F4E37",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center" as const,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800" as const,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: "center" as const,
    borderWidth: 1,
    borderColor: "#D9C5AD",
  },
  secondaryButtonText: {
    color: "#5B3A24",
    fontSize: 14,
    fontWeight: "800" as const,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  optionContainer: {
    flexDirection: "row" as const,
    flexWrap: "wrap" as const,
    gap: 8,
  },

  optionChip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#D9C5AD",
    backgroundColor: "#F5EFE7",
  },

  optionChipSelected: {
    backgroundColor: "#6F4E37",
    borderColor: "#6F4E37",
  },

  optionChipText: {
    color: "#5B3A24",
    fontSize: 13,
    fontWeight: "700" as const,
  },

  optionChipTextSelected: {
    color: "#FFFFFF",
  },

  spinContainer: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 12,
    marginTop: 6,
  },

  spinButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: "center" as const,
    alignItems: "center" as const,
    backgroundColor: "#6F4E37",
  },

  spinButtonText: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "800" as const,
  },

  spinValue: {
    minWidth: 50,
    textAlign: "center" as const,
    fontSize: 18,
    fontWeight: "800" as const,
    color: "#3B2416",
  },
};
