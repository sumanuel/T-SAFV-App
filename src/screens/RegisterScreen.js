import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import sdk from "../lib/tsafv-sdk";
import { setToken as storeToken } from "../lib/authStore";
import { palette, radii, shadow, spacing } from "../theme/appTheme";

export default function RegisterScreen({ onAuthSuccess, onGoLogin }) {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleRegister = async () => {
    setSubmitting(true);
    const res = await sdk.register({ nombre, email, password });
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
      <KeyboardAvoidingView
        style={styles.keyboardWrap}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
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
            <TextInput
              placeholder="Contraseña"
              placeholderTextColor={palette.inkMuted}
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
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
    backgroundColor: palette.background,
  },
  keyboardWrap: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xxl,
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
