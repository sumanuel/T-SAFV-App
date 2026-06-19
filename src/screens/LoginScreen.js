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
import sdk from "../lib/tsafv-sdk";
import { setToken as storeToken } from "../lib/authStore";
import { palette, radii, shadow, spacing } from "../theme/appTheme";

export default function LoginScreen({ onAuthSuccess, onGoRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleLogin = async () => {
    setSubmitting(true);
    const res = await sdk.login(email, password);
    if (res.status === 200 && res.data?.token) {
      const t = res.data.token;
      await storeToken(t);
      onAuthSuccess(t);
    } else {
      Alert.alert("Error", res.data?.message || "Error logging in");
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
              Control profesional de asociaciones, unidades y trazabilidad
              fiscal.
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Iniciar sesión</Text>
            <Text style={styles.cardSubtitle}>
              Entra a tu operación diaria con una vista clara de asociaciones y
              registros.
            </Text>

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
              onPress={handleLogin}
              style={styles.primaryButton}
              disabled={submitting}
            >
              <Text style={styles.primaryButtonText}>
                {submitting ? "Validando acceso..." : "Iniciar sesión"}
              </Text>
            </Pressable>

            <Pressable onPress={onGoRegister} style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>Crear cuenta</Text>
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
