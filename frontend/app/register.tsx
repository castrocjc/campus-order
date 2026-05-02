import { useState } from "react";
import { Stack, useRouter } from "expo-router";
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { registerUser } from "../src/services/userService";

const logo = require("../assets/cofigo-logo.png");

export default function RegisterScreen() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      setErrorMessage("Completa nombre, correo y contraseña.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email.trim())) {
      setErrorMessage("Ingresa un correo válido.");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    try {
      setLoading(true);

      setErrorMessage("");
      setSuccessMessage("");

      await registerUser({
        name: name.trim(),
        email: email.trim(),
        password,
      });

      setSuccessMessage("Cuenta creada correctamente. Redirigiendo al login...");

      setTimeout(() => {
        router.replace("/");
      }, 1500);
        } catch (error: any) {
          setErrorMessage(error.message || "No se pudo crear la cuenta.");
        } finally {
      setLoading(false);
    }
  };

return (
  <>
    <Stack.Screen options={{ headerShown: false }} />
    <View style={styles.container}>
      <View style={styles.card}>
        <Image source={logo} style={styles.logo} />

        <Text style={styles.title}>Crear cuenta</Text>
        <Text style={styles.subtitle}>
          Regístrate para pedir sin hacer cola
        </Text>

        {successMessage ? (
          <Text style={styles.successMessage}>
            {successMessage}
          </Text>
        ) : null}

        {errorMessage ? (
          <Text style={styles.errorMessage}>
            {errorMessage}
          </Text>
        ) : null}

        <TextInput
          style={styles.input}
          placeholder="Nombre completo"
          placeholderTextColor="#9b8b82"
          value={name}
          onChangeText={(text) => {
            setName(text);
            setErrorMessage("");
          }}
        />

        <TextInput
          style={styles.input}
          placeholder="Correo electrónico"
          placeholderTextColor="#9b8b82"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            setErrorMessage("");
          }}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          placeholderTextColor="#9b8b82"
          secureTextEntry
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            setErrorMessage("");
          }}
        />

        <TouchableOpacity
          style={[styles.primaryButton, loading && styles.disabledButton]}
          onPress={handleRegister}
          disabled={loading}
        >
          <Text style={styles.primaryButtonText}>
            {loading ? "Creando..." : "Crear cuenta"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => router.replace("/")}
        >
          <Text style={styles.secondaryButtonText}>Ya tengo cuenta</Text>
        </TouchableOpacity>
      </View>
    </View>
  </>
);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff8f1",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
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
    elevation: 5,
  },
  logo: {
    width: 110,
    height: 110,
    resizeMode: "contain",
    alignSelf: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: "900",
    color: "#3b1f12",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    color: "#7a6a61",
    textAlign: "center",
    marginTop: 6,
    marginBottom: 28,
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
  successMessage: {
  backgroundColor: "#e7f7ed",
  color: "#1f7a3f",
  padding: 12,
  borderRadius: 12,
  textAlign: "center",
  fontWeight: "700",
  marginBottom: 16,
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