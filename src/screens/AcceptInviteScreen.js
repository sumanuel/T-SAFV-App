import React, { useState } from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import {
  AppScreen,
  DetailHeader,
  HeroBanner,
  SurfaceCard,
} from "../components/AppChrome";
import { useAppSession } from "../context/AppSessionContext";
import sdk from "../lib/tsafv-sdk";
import { palette, radii, spacing } from "../theme/appTheme";

export default function AcceptInviteScreen({ navigation, route }) {
  const { token, refreshSession } = useAppSession();
  const [inviteToken, setInviteToken] = useState(route.params?.token || "");
  const [submitting, setSubmitting] = useState(false);

  const handleAccept = async () => {
    if (!inviteToken.trim()) {
      Alert.alert("Token requerido", "Ingresa el token de invitación.");
      return;
    }

    setSubmitting(true);
    const res = await sdk.acceptInvitation(token, inviteToken.trim());
    if (res.status === 200) {
      Alert.alert("Éxito", "Invitación aceptada");
      await refreshSession();
      navigation.goBack();
    } else {
      Alert.alert("Error", res.data?.message || "Error aceptando invitación");
    }
    setSubmitting(false);
  };

  return (
    <AppScreen scroll contentContainerStyle={styles.content}>
      <DetailHeader
        title="Aceptar invitación"
        subtitle="Vincúlate a una asociación con el token recibido."
        onBack={() => navigation.goBack()}
      />

      <HeroBanner
        eyebrow="Ingreso asistido"
        title="Activa una afiliación"
        subtitle="Pega el token enviado por el administrador para sumarte a la asociación y habilitar Inicio, Ficha y Traza."
      />

      <SurfaceCard style={styles.formCard}>
        <Text style={styles.label}>Token de invitación</Text>
        <TextInput
          placeholder="Ejemplo: 7d3e-..."
          placeholderTextColor={palette.inkMuted}
          style={styles.input}
          value={inviteToken}
          onChangeText={setInviteToken}
          autoCapitalize="none"
          multiline
        />

        <Pressable
          onPress={handleAccept}
          style={styles.primaryButton}
          disabled={submitting}
        >
          <Text style={styles.primaryButtonText}>
            {submitting ? "Validando token..." : "Aceptar invitación"}
          </Text>
        </Pressable>
      </SurfaceCard>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.lg,
  },
  formCard: {
    gap: spacing.md,
  },
  label: {
    color: palette.ink,
    fontSize: 14,
    fontWeight: "700",
  },
  input: {
    borderWidth: 1,
    borderColor: palette.borderStrong,
    backgroundColor: palette.surfaceMuted,
    color: palette.ink,
    minHeight: 112,
    padding: spacing.md,
    borderRadius: radii.md,
    textAlignVertical: "top",
  },
  primaryButton: {
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
});
