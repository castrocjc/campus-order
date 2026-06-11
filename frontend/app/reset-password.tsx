import { useState } from "react";
import { Stack, router, useLocalSearchParams } from "expo-router";
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
import { forgotPassword, resetPassword } from "../src/services/authService";

const logo = require("../assets/cofigo-logo.png");

export default function ResetPasswordScreen() {
  const { width } = useWindowDimensions();
  const isMobile = width < 760;
  const params = useLocalSearchParams();
  const emailParam = typeof params.email === "string" ? params.email : "";

  const [email, setEmail] = useState(emailParam);
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);  
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");

  const handleResetPassword = async () => {
    setMessage("");
    setMessageType("");

    if (
      !email.trim() ||
      !code.trim() ||
      !newPassword.trim() ||
      !confirmPassword.trim()
    ) {
      setMessage("Completa todos los campos.");
      setMessageType("error");
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

    if (!passwordRegex.test(newPassword)) {
      setMessage(
        "La contraseña debe tener mínimo 8 caracteres, una mayúscula, una minúscula y un número."
      );
      setMessageType("error");
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("Las contraseñas no coinciden.");
      setMessageType("error");
      return;
    }

    try {
      setLoading(true);

      await resetPassword(email.trim(), code.trim(), newPassword);

      setMessage("Tu contraseña fue actualizada correctamente.");
      setMessageType("success");

      setTimeout(() => {
        router.replace("/");
      }, 1500);
    } catch (error: any) {
      setMessage(error.message || "No fue posible actualizar la contraseña.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!email.trim()) {
      setMessage("Ingresa tu correo institucional para reenviar el código.");
      setMessageType("error");
      return;
    }

    try {
      setLoading(true);
      setMessage("");
      setMessageType("");

      await forgotPassword(email.trim());

      setMessage("Se ha enviado un nuevo código de recuperación.");
      setMessageType("success");
    } catch (error: any) {
      setMessage(error.message || "No fue posible reenviar el código.");
      setMessageType("error");
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

            {!isMobile && (
              <>
                <Text style={styles.title}>Crea una nueva contraseña</Text>

                <Text style={styles.description}>
                  Usa el código recibido por correo y registra una nueva
                  contraseña para recuperar el acceso a tu cuenta.
                </Text>
              </>
            )}
          </View>

          <View style={[styles.loginArea, isMobile && styles.loginAreaMobile]}>
            <View style={[styles.card, isMobile && styles.cardMobile]}>
              <Text
                style={[styles.cardTitle, isMobile && styles.cardTitleMobile]}
              >
                Restablecer contraseña
              </Text>

              <Text style={styles.cardSubtitle}>
                Ingresa el código recibido y tu nueva contraseña.
              </Text>

              {message ? (
                <Text
                  style={[
                    styles.messageText,
                    messageType === "success"
                      ? styles.successMessage
                      : styles.errorMessage,
                  ]}
                >
                  {message}
                </Text>
              ) : null}

              <TextInput
                style={styles.input}
                placeholder="Correo institucional"
                placeholderTextColor="#9b8b82"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />

              <TextInput
                style={styles.input}
                placeholder="Código recibido"
                placeholderTextColor="#9b8b82"
                value={code}
                onChangeText={setCode}
                keyboardType="number-pad"
              />

              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Nueva contraseña"
                  placeholderTextColor="#9b8b82"
                  value={newPassword}
                  onChangeText={setNewPassword}
                  secureTextEntry={!showNewPassword}
                />

                <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)}>
                  <Text style={styles.showPasswordText}>
                    {showNewPassword ? "Ocultar" : "Ver"}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Confirmar nueva contraseña"
                  placeholderTextColor="#9b8b82"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                />

                <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                  <Text style={styles.showPasswordText}>
                    {showConfirmPassword ? "Ocultar" : "Ver"}
                  </Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={[styles.primaryButton, loading && styles.disabledButton]}
                onPress={handleResetPassword}
                disabled={loading}
              >
                <Text style={styles.primaryButtonText}>
                  {loading ? "Actualizando..." : "Actualizar contraseña"}
                </Text>
              </TouchableOpacity>

              <View style={styles.resendContainer}>
                <Text style={styles.resendQuestion}>¿No recibiste el código?</Text>

                <TouchableOpacity onPress={handleResendCode} disabled={loading}>
                  <Text style={styles.resendLink}>
                    Reenviar código
                  </Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() => router.replace("/")}
              >
                <Text style={styles.secondaryButtonText}>Volver al login</Text>
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

  messageText: {
    padding: 12,
    borderRadius: 12,
    textAlign: "center",
    fontWeight: "700",
    marginBottom: 16,
  },

  errorMessage: {
    backgroundColor: "#fdecea",
    color: "#b42318",
  },

  successMessage: {
    backgroundColor: "#e7f7ed",
    color: "#157347",
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

  resendContainer: {
    alignItems: "center",
    marginTop: 16,
  },

  resendQuestion: {
    color: "#7a6a61",
    fontSize: 14,
    marginBottom: 4,
  },

  resendLink: {
    color: "#f57c00",
    fontSize: 14,
    fontWeight: "800",
  },

  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ead8c8",
    borderRadius: 14,
    paddingHorizontal: 15,
    marginBottom: 16,
    backgroundColor: "#fff",
  },

  passwordInput: {
    flex: 1,
    paddingVertical: 15,
    fontSize: 15,
    outlineStyle: "none" as any,
  },

  showPasswordText: {
    color: "#f57c00",
    fontWeight: "800",
    fontSize: 13,
  },  
});
