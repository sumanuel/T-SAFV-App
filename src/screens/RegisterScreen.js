import React, { useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import sdk from "../lib/tsafv-sdk";
import { setToken as storeToken } from "../lib/authStore";
import { palette, radii, shadow, spacing } from "../theme/appTheme";

export default function RegisterScreen({ onAuthSuccess, onGoLogin }) {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [telefono, setTelefono] = useState("");
  const [rifCedula, setRifCedula] = useState("");
  const [direccion, setDireccion] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleRegister = async () => {
    if (!nombre.trim() || !email.trim() || !password) {
      Alert.alert(
        "Datos incompletos",
        "Nombre, correo y contraseña son obligatorios.",
      );
      return;
    }

    if (password !== repeatPassword) {
      Alert.alert(
        "Contraseñas distintas",
        "La confirmación de contraseña no coincide.",
      );
      return;
    }

    setSubmitting(true);
    const res = await sdk.register({
      nombre,
      email,
      password,
      telefono,
      rif_cedula: rifCedula,
      direccion,
    });
    if (res.status === 201 || res.status === 200) {
      const loginRes = await sdk.login(email, password);
      if (loginRes.status === 200 && loginRes.data?.token) {
        const t = loginRes.data.token;
        await storeToken(t);
        onAuthSuccess(t);
        return;
      }
      Alert.alert("Registro", "Usuario creado. Por favor inicia sesión.");
      if (onGoLogin) onGoLogin();
    } else {
      Alert.alert("Error", res.data?.message || "Error registrando usuario");
    }
    setSubmitting(false);
  };

  return (
    <View style={styles.screen}>
      <View style={styles.backgroundOrbTop} />
      <View style={styles.backgroundOrbBottom} />
      <KeyboardAvoidingView
        style={styles.keyboardWrap}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.brandBlock}>
            <View style={styles.logoWrap}>
              <Image
                source={require("../../assets/android-icon-foreground.png")}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.brandTitle}>T-SAFV</Text>
            <Text style={styles.brandSubtitle}>
              Crea un acceso completo con tus datos de contacto y validación
              segura.
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Crear cuenta</Text>
            <Text style={styles.cardSubtitle}>
              Registra tu acceso para administrar asociaciones, propietarios y
              trazabilidad desde móvil.
            </Text>

            <TextInput
              placeholder="Nombre completo"
              placeholderTextColor={palette.inkMuted}
              style={styles.input}
              value={nombre}
              onChangeText={setNombre}
            />
            <TextInput
              placeholder="Correo electrónico"
              placeholderTextColor={palette.inkMuted}
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <View style={styles.passwordField}>
              <TextInput
                placeholder="Contraseña"
                placeholderTextColor={palette.inkMuted}
                style={styles.passwordInput}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <Pressable onPress={() => setShowPassword((current) => !current)}>
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color={palette.inkMuted}
                />
              </Pressable>
            </View>
            <View style={styles.passwordField}>
              <TextInput
                placeholder="Repetir contraseña"
                placeholderTextColor={palette.inkMuted}
                style={styles.passwordInput}
                value={repeatPassword}
                onChangeText={setRepeatPassword}
                secureTextEntry={!showRepeatPassword}
              />
              <Pressable
                onPress={() => setShowRepeatPassword((current) => !current)}
              >
                <Ionicons
                  name={showRepeatPassword ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color={palette.inkMuted}
                />
              </Pressable>
            </View>
            <TextInput
              placeholder="Teléfono"
              placeholderTextColor={palette.inkMuted}
              style={styles.input}
              value={telefono}
              onChangeText={setTelefono}
              keyboardType="phone-pad"
            />
            <TextInput
              placeholder="RIF o cédula"
              placeholderTextColor={palette.inkMuted}
              style={styles.input}
              value={rifCedula}
              onChangeText={setRifCedula}
            />
            <TextInput
              placeholder="Dirección"
              placeholderTextColor={palette.inkMuted}
              style={[styles.input, styles.textarea]}
              value={direccion}
              onChangeText={setDireccion}
              multiline
            />

            <Pressable
              onPress={handleRegister}
              style={styles.primaryButton}
              disabled={submitting}
            >
              <Text style={styles.primaryButtonText}>
                {submitting ? "Creando cuenta..." : "Registrar usuario"}
              </Text>
            </Pressable>

            <Pressable onPress={onGoLogin} style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>
                Volver a inicio de sesión
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: palette.ink,
  },
  keyboardWrap: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xxl,
    gap: spacing.xl,
  },
  backgroundOrbTop: {
    position: "absolute",
    top: -120,
    right: -80,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: "rgba(46, 147, 250, 0.22)",
  },
  backgroundOrbBottom: {
    position: "absolute",
    bottom: -110,
    left: -70,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "rgba(46, 147, 250, 0.18)",
  },
  brandBlock: {
    alignItems: "center",
    gap: spacing.sm,
  },
  logoWrap: {
    width: 86,
    height: 86,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  logo: {
    width: 56,
    height: 56,
  },
  brandTitle: {
    color: palette.surface,
    fontSize: 30,
    fontWeight: "900",
    letterSpacing: 0.4,
  },
  brandSubtitle: {
    color: "rgba(234,243,251,0.84)",
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
  },
  card: {
    backgroundColor: palette.surface,
    borderRadius: radii.lg,
    padding: spacing.xl,
    gap: spacing.md,
    ...shadow,
  },
  cardTitle: {
    color: palette.ink,
    fontSize: 24,
    fontWeight: "800",
  },
  cardSubtitle: {
    color: palette.inkSoft,
    fontSize: 14,
    lineHeight: 21,
    marginBottom: spacing.xs,
  },
  input: {
    borderWidth: 1,
    borderColor: palette.borderStrong,
    backgroundColor: palette.surfaceMuted,
    color: palette.ink,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderRadius: radii.md,
  },
  passwordField: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: palette.borderStrong,
    backgroundColor: palette.surfaceMuted,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
  },
  passwordInput: {
    flex: 1,
    color: palette.ink,
    paddingVertical: spacing.md,
  },
  textarea: {
    minHeight: 92,
    textAlignVertical: "top",
  },
  primaryButton: {
    marginTop: spacing.xs,
    backgroundColor: palette.primaryDeep,
    borderRadius: radii.pill,
    paddingVertical: spacing.md,
    alignItems: "center",
  },
  primaryButtonText: {
    color: palette.surface,
    fontSize: 15,
    fontWeight: "800",
  },
  secondaryButton: {
    alignItems: "center",
    paddingVertical: spacing.sm,
  },
  secondaryButtonText: {
    color: palette.primaryDeep,
    fontSize: 14,
    fontWeight: "700",
  },
});
