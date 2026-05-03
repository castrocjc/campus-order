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

      const data = await loginUser({
        email,
        password,
      });

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
        styles.container,
        isMobile && styles.containerMobile,
      ]}
    >
      <View style={[styles.leftPanel, isMobile && styles.leftPanelMobile]}>
        <Image source={logo} style={[styles.logo, isMobile && styles.logoMobile]} />

        <Text style={[styles.brand, isMobile && styles.brandMobile]}>
          COFIGO
        </Text>

        <Text style={styles.slogan}>Pide hoy, disfruta sin esperas</Text>

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
          <Text style={styles.cardTitle}>Bienvenido</Text>
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
  </>
);}

const styles = StyleSheet.create({

  logo: {
    width: 130,
    height: 130,
    resizeMode: "contain",
    marginBottom: 14,
  },

  brand: {
    fontSize: 52,
    fontWeight: "900",
    color: "#3b1f12",
    letterSpacing: 2,
  },

  slogan: {
    fontSize: 16,
    fontWeight: "700",
    color: "#f57c00",
    marginBottom: 32,
  },

  title: {
    maxWidth: 520,
    fontSize: 42,
    fontWeight: "900",
    color: "#2b160d",
    lineHeight: 48,
    marginBottom: 16,
  },

  description: {
    maxWidth: 500,
    fontSize: 18,
    color: "#6b5b52",
    lineHeight: 28,
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

  cardTitle: {
    fontSize: 32,
    fontWeight: "900",
    color: "#3b1f12",
    marginBottom: 6,
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
screen: {
  flex: 1,
  backgroundColor: "#fff8f1",
},

container: {
  flexGrow: 1,
  flexDirection: "row",
  backgroundColor: "#fff8f1",
},

containerMobile: {
  flexDirection: "column",
},

leftPanel: {
  flex: 1.1,
  justifyContent: "center",
  padding: 48,
},

leftPanelMobile: {
  flex: 0,
  paddingHorizontal: 24,
  paddingTop: 36,
  paddingBottom: 20,
  alignItems: "center",
},

rightPanel: {
  flex: 0.9,
  justifyContent: "center",
  alignItems: "center",
  padding: 48,
},

rightPanelMobile: {
  flex: 0,
  width: "100%",
  paddingHorizontal: 20,
  paddingTop: 8,
  paddingBottom: 32,
},

logoMobile: {
  width: 96,
  height: 96,
  marginBottom: 10,
},

brandMobile: {
  fontSize: 42,
  textAlign: "center",
},

titleMobile: {
  maxWidth: "100%",
  fontSize: 30,
  lineHeight: 36,
  textAlign: "center",
  marginBottom: 14,
},

descriptionMobile: {
  maxWidth: "100%",
  fontSize: 16,
  lineHeight: 24,
  textAlign: "center",
},

cardMobile: {
  maxWidth: "100%",
  padding: 24,
  borderRadius: 24,
},  
});