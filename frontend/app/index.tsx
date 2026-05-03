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
  const { width } = useWindowDimensions();
  const isMobile = width < 760;

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
          styles.content,
          isMobile ? styles.contentMobile : styles.contentDesktop,
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.shell, isMobile && styles.shellMobile]}>
          <View style={[styles.hero, isMobile && styles.heroMobile]}>
            <Image source={logo} style={[styles.logo, isMobile && styles.logoMobile]} />

            <Text style={[styles.brand, isMobile && styles.brandMobile]}>
              COFIGO
            </Text>

            <Text style={[styles.slogan, isMobile && styles.sloganMobile]}>
              Pide hoy, disfruta sin esperas
            </Text>

            {!isMobile && (
              <>
                <Text style={styles.title}>
                  Pide tu comida universitaria sin hacer cola
                </Text>

                <Text style={styles.description}>
                  Consulta el menú, realiza tu pedido anticipado y recógelo en el
                  horario que elijas.
                </Text>
              </>
            )}
          </View>

          <View style={[styles.loginArea, isMobile && styles.loginAreaMobile]}>
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

  content: {
    flexGrow: 1,
    backgroundColor: "#fff8f1",
    alignItems: "center",
  },

  contentDesktop: {
    justifyContent: "center",
    paddingHorizontal: 48,
    paddingVertical: 48,
  },

  contentMobile: {
    justifyContent: "flex-start",
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 32,
  },

  shell: {
    width: "100%",
    maxWidth: 1120,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  shellMobile: {
    maxWidth: 460,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
  },

  hero: {
    width: "50%",
    maxWidth: 540,
    paddingRight: 32,
    alignItems: "flex-start",
  },

  heroMobile: {
    width: "100%",
    maxWidth: 420,
    paddingRight: 0,
    alignItems: "center",
    marginBottom: 14,
  },

  loginArea: {
    width: "50%",
    alignItems: "center",
    paddingLeft: 32,
  },

  loginAreaMobile: {
    width: "100%",
    paddingLeft: 0,
  },

  logo: {
    width: 130,
    height: 130,
    resizeMode: "contain",
    marginBottom: 12,
  },

  logoMobile: {
    width: 82,
    height: 82,
    marginBottom: 6,
  },

  brand: {
    fontSize: 56,
    lineHeight: 62,
    fontWeight: "900",
    color: "#3b1f12",
    letterSpacing: 1.5,
  },

  brandMobile: {
    fontSize: 34,
    lineHeight: 38,
    textAlign: "center",
  },

  slogan: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: "800",
    color: "#f57c00",
    marginTop: 2,
    marginBottom: 28,
  },

  sloganMobile: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 0,
    textAlign: "center",
  },

  title: {
    maxWidth: 520,
    fontSize: 42,
    lineHeight: 50,
    fontWeight: "900",
    color: "#2b160d",
    marginBottom: 16,
  },

  description: {
    maxWidth: 500,
    fontSize: 18,
    lineHeight: 28,
    color: "#6b5b52",
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
    fontSize: 26,
    lineHeight: 31,
  },

  cardSubtitle: {
    fontSize: 15,
    lineHeight: 21,
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
