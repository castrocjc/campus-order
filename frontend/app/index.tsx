import { useState } from "react";
import { Stack, useRouter } from "expo-router";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { loginUser, saveAuthData } from "../src/services/authService";

const logo = require("../assets/cofigo-logo.png");

export default function HomeScreen() {
  const router = useRouter();
  const { width, height } = useWindowDimensions();
  const isMobile = width < 768;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      setErrorMessage("Completa correo y contraseña.");
      return;
    }

    try {
      setLoading(true);
      setErrorMessage("");

      const data = await loginUser({ email, password });
      saveAuthData(data);

      router.replace("/home");
    } catch (error: any) {
      setErrorMessage(error.message || "No se pudo iniciar sesión.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView
        style={styles.screen}
        contentContainerStyle={[
          styles.scrollContent,
          { minHeight: height },
          isMobile && styles.scrollContentMobile,
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.page, isMobile && styles.pageMobile]}>
          <View style={[styles.heroPanel, isMobile && styles.heroPanelMobile]}>
            <Image
              source={logo}
              style={[styles.logo, isMobile && styles.logoMobile]}
            />

            <Text style={[styles.brand, isMobile && styles.brandMobile]}>
              COFIGO
            </Text>

            <Text style={[styles.slogan, isMobile && styles.sloganMobile]}>
              Pide hoy, disfruta sin esperas
            </Text>

            <Text style={[styles.title, isMobile && styles.titleMobile]}>
              Pide tu comida universitaria sin hacer cola
            </Text>

            <Text
              style={[styles.description, isMobile && styles.descriptionMobile]}
            >
              Consulta el menú, realiza tu pedido anticipado y recógelo en el
              horario que elijas.
            </Text>
          </View>

          <View style={[styles.formPanel, isMobile && styles.formPanelMobile]}>
            <View style={[styles.card, isMobile && styles.cardMobile]}>
              <Text style={[styles.cardTitle, isMobile && styles.cardTitleMobile]}>
                Bienvenido
              </Text>
              <Text style={styles.cardSubtitle}>Ingresa para continuar</Text>

              {errorMessage ? (
                <Text style={styles.errorMessage}>{errorMessage}</Text>
              ) : null}

              <TextInput
                style={styles.input}
                placeholder="Correo electrónico"
                placeholderTextColor="#9b8b82"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />

              <TextInput
                style={styles.input}
                placeholder="Contraseña"
                placeholderTextColor="#9b8b82"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />

              <TouchableOpacity
                style={[styles.primaryButton, loading && styles.disabledButton]}
                onPress={handleLogin}
                disabled={loading}
              >
                <Text style={styles.primaryButtonText}>
                  {loading ? "Ingresando..." : "Iniciar sesión"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() => router.push("/register")}
              >
                <Text style={styles.secondaryButtonText}>Crear cuenta</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#fff8f1",
  },

  scrollContent: {
    flexGrow: 1,
    backgroundColor: "#fff8f1",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    paddingVertical: 48,
  },

  scrollContentMobile: {
    justifyContent: "flex-start",
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 36,
  },

  page: {
    width: "100%",
    maxWidth: 1180,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 56,
  },

  pageMobile: {
    maxWidth: 520,
    flexDirection: "column",
    justifyContent: "flex-start",
    gap: 22,
  },

  heroPanel: {
    flex: 1,
    alignItems: "flex-start",
  },

  heroPanelMobile: {
    width: "100%",
    alignItems: "center",
  },

  formPanel: {
    flex: 1,
    alignItems: "center",
  },

  formPanelMobile: {
    width: "100%",
  },

  logo: {
    width: 126,
    height: 126,
    resizeMode: "contain",
    marginBottom: 18,
  },

  logoMobile: {
    width: 78,
    height: 78,
    marginBottom: 8,
  },

  brand: {
    fontSize: 54,
    lineHeight: 60,
    fontWeight: "900",
    color: "#3b1f12",
    letterSpacing: 2,
  },

  brandMobile: {
    fontSize: 36,
    lineHeight: 40,
    textAlign: "center",
  },

  slogan: {
    fontSize: 16,
    fontWeight: "800",
    color: "#f57c00",
    marginTop: 2,
    marginBottom: 30,
  },

  sloganMobile: {
    fontSize: 15,
    marginBottom: 14,
    textAlign: "center",
  },

  title: {
    maxWidth: 540,
    fontSize: 42,
    lineHeight: 50,
    fontWeight: "900",
    color: "#2b160d",
    marginBottom: 16,
  },

  titleMobile: {
    maxWidth: 360,
    fontSize: 27,
    lineHeight: 33,
    textAlign: "center",
    marginBottom: 10,
  },

  description: {
    maxWidth: 520,
    fontSize: 18,
    lineHeight: 28,
    color: "#6b5b52",
  },

  descriptionMobile: {
    maxWidth: 360,
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
  },

  card: {
    width: "100%",
    maxWidth: 430,
    backgroundColor: "#ffffff",
    padding: 36,
    borderRadius: 28,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 5,
  },

  cardMobile: {
    maxWidth: "100%",
    padding: 22,
    borderRadius: 24,
  },

  cardTitle: {
    fontSize: 32,
    lineHeight: 38,
    fontWeight: "900",
    color: "#3b1f12",
    marginBottom: 6,
  },

  cardTitleMobile: {
    fontSize: 27,
    lineHeight: 32,
  },

  cardSubtitle: {
    fontSize: 15,
    color: "#7a6a61",
    marginBottom: 20,
  },

  errorMessage: {
    backgroundColor: "#fdecea",
    color: "#b42318",
    padding: 12,
    borderRadius: 12,
    textAlign: "center",
    fontWeight: "700",
    marginBottom: 16,
  },

  input: {
    borderWidth: 1,
    borderColor: "#ead8c8",
    borderRadius: 14,
    paddingHorizontal: 15,
    paddingVertical: 15,
    fontSize: 15,
    marginBottom: 16,
    backgroundColor: "#fff",
  },

  primaryButton: {
    backgroundColor: "#f57c00",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    marginTop: 4,
  },

  disabledButton: {
    opacity: 0.7,
  },

  primaryButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "800",
  },

  secondaryButton: {
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    marginTop: 14,
    backgroundColor: "#3b1f12",
  },

  secondaryButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "800",
  },
});
