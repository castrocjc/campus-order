import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const logo = require("../../assets/cofigo-logo.png");

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      
      {/* PANEL IZQUIERDO */}
      <View style={styles.leftPanel}>
        <Image source={logo} style={styles.logo} />

        <Text style={styles.brand}>COFIGO</Text>
        <Text style={styles.slogan}>Pide hoy, disfruta sin esperas</Text>

        <Text style={styles.title}>
          Pide tu comida universitaria sin hacer cola
        </Text>

        <Text style={styles.description}>
          Consulta el menú, realiza tu pedido anticipado y recógelo en el horario que elijas.
        </Text>
      </View>

      {/* PANEL DERECHO */}
      <View style={styles.rightPanel}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Bienvenido</Text>
          <Text style={styles.cardSubtitle}>Ingresa para continuar</Text>

          <TextInput
            style={styles.input}
            placeholder="Correo electrónico"
            placeholderTextColor="#9b8b82"
          />

          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            placeholderTextColor="#9b8b82"
            secureTextEntry
          />

          <TouchableOpacity style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Iniciar sesión</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>Crear cuenta</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#fff8f1",
  },

  leftPanel: {
    flex: 1.1,
    justifyContent: "center",
    padding: 48,
  },

  rightPanel: {
    flex: 0.9,
    justifyContent: "center",
    alignItems: "center",
    padding: 48,
  },

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
    elevation: 5, // importante para Android/web
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

  primaryButton: {
    backgroundColor: "#f57c00",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    marginTop: 4,
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