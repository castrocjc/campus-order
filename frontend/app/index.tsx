import { useState } from "react";
import { Stack, useRouter } from "expo-router";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
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

      <KeyboardAvoidingView
        style={styles.screen}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          style={styles.screen}
          contentContainerStyle={[
            styles.container,
            isMobile ? styles.containerMobile : styles.containerDesktop,
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.leftPanel, isMobile && styles.leftPanelMobile]}>
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

            <Text style={[styles.description, isMobile && styles.descriptionMobile]}>
              Consulta el menú, realiza tu pedido anticipado y recógelo en el
              horario que elijas.
            </Text>
          </View>

          <View style={[styles.rightPanel, isMobile && styles.rightPanelMobile]}>
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
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#fff8f1",
  },

  container: {
    flexGrow: 1,
    backgroundColor: "#fff8f1",
  },

  containerDesktop: {
    minHeight: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 64,
    paddingVertical: 48,
    gap: 80,
  },

  containerMobile: {
    minHeight: "100%",
    flexDirection: "column",
    justifyContent: "flex-start",
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 28,
  },

  leftPanel: {
    flex: 1,
    justifyContent: "center",
  },

leftPanelMobile: {
  flex: 0,
  paddingHorizontal: 24,
  paddingTop: 24,
  paddingBottom: 8,
  alignItems: "center",
},

  rightPanel: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

rightPanelMobile: {
  flex: 0,
  width: "100%",
  paddingHorizontal: 20,
  paddingTop: 0,
  paddingBottom: 28,
  justifyContent: "flex-start",
},

  logo: {
    width: 130,
    height: 130,
    resizeMode: "contain",
    marginBottom: 14,
  },

logoMobile: {
  width: 72,
  height: 72,
  marginBottom: 6,
},

  brand: {
    fontSize: 52,
    fontWeight: "900",
    color: "#3b1f12",
    letterSpacing: 2,
  },

brandMobile: {
  fontSize: 34,
  lineHeight: 38,
  textAlign: "center",
},

slogan: {
  fontSize: 15,
  fontWeight: "700",
  color: "#f57c00",
  marginBottom: 14,
  textAlign: "center",
},

  sloganMobile: {
    fontSize: 15,
    textAlign: "center",
    marginBottom: 18,
  },

  title: {
    maxWidth: 520,
    fontSize: 42,
    fontWeight: "900",
    color: "#2b160d",
    lineHeight: 48,
    marginBottom: 16,
  },

titleMobile: {
  maxWidth: "100%",
  fontSize: 26,
  lineHeight: 31,
  textAlign: "center",
  marginBottom: 10,
},

  description: {
    maxWidth: 500,
    fontSize: 18,
    color: "#6b5b52",
    lineHeight: 28,
  },

descriptionMobile: {
  maxWidth: "100%",
  fontSize: 15,
  lineHeight: 21,
  textAlign: "center",
  marginBottom: 8,
},

  card: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: "#ffffff",
    padding: 36,
    borderRadius: 28,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },

cardMobile: {
  maxWidth: "100%",
  padding: 22,
  borderRadius: 24,
},

  cardTitle: {
    fontSize: 32,
    fontWeight: "900",
    color: "#3b1f12",
    marginBottom: 6,
  },

  cardTitleMobile: {
    fontSize: 26,
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
    padding: 15,
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
