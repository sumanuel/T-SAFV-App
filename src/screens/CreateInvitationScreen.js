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
  InfoPill,
  SectionHeader,
  SurfaceCard,
} from "../components/AppChrome";
import { useAppSession } from "../context/AppSessionContext";
import sdk from "../lib/tsafv-sdk";
import { getRoleMeta, palette, radii, spacing } from "../theme/appTheme";

const roles = ["ADMIN", "FISCAL", "PROPIETARIO"];

export default function CreateInvitationScreen({ navigation, route }) {
  const { token, activeAssociation, refreshSession } = useAppSession();
  const defaultRole = route.params?.defaultRole;
  const [email, setEmail] = useState("");
  const [role, setRole] = useState(defaultRole || "FISCAL");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!activeAssociation?.id) {
      Alert.alert(
        "Sin asociación activa",
        "Selecciona una asociación antes de invitar miembros.",
      );
      return;
    }

    if (!email.trim()) {
      Alert.alert("Correo requerido", "Ingresa el correo del invitado.");
      return;
    }

    setSubmitting(true);
    const res = await sdk.createInvitacion(token, {
      asociacion_id: activeAssociation.id,
      email_invitado: email.trim(),
      rol_invitado: role,
    });

    if (res.status === 201 || res.status === 200) {
      await refreshSession();
      Alert.alert(
        "Invitación creada",
        "Se generó la invitación correctamente.",
      );
      navigation.goBack();
    } else {
      Alert.alert(
        "Error",
        res.data?.message || "No se pudo crear la invitación.",
      );
    }
    setSubmitting(false);
  };

  return (
    <AppScreen scroll contentContainerStyle={styles.content}>
      <DetailHeader
        title="Invitar miembro"
        subtitle={
          activeAssociation ? activeAssociation.nombre : "Sin asociación activa"
        }
        onBack={() => navigation.goBack()}
      />

      <SectionHeader
        title="Acceso por rol"
        subtitle="Genera una invitación para sumar administradores, fiscales o propietarios."
      />

      <SurfaceCard style={styles.formCard}>
        <View style={styles.fieldWrap}>
          <Text style={styles.label}>Correo del invitado</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholder="usuario@dominio.com"
            placeholderTextColor={palette.inkMuted}
            style={styles.input}
          />
        </View>

        <View style={styles.fieldWrap}>
          <Text style={styles.label}>Rol a otorgar</Text>
          <View style={styles.roleRow}>
            {roles.map((item) => {
              const meta = getRoleMeta(item);
              const selected = role === item;
              return (
                <Pressable
                  key={item}
                  onPress={() => setRole(item)}
                  style={[
                    styles.roleChip,
                    selected ? styles.roleChipSelected : null,
                  ]}
                >
                  <InfoPill
                    label={meta.label}
                    textColor={meta.textColor}
                    backgroundColor={meta.backgroundColor}
                  />
                </Pressable>
              );
            })}
          </View>
        </View>

        <Pressable
          onPress={handleSubmit}
          style={styles.primaryButton}
          disabled={submitting}
        >
          <Text style={styles.primaryButtonText}>
            {submitting ? "Generando invitación..." : "Crear invitación"}
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
  fieldWrap: {
    gap: 6,
  },
  label: {
    color: palette.ink,
    fontSize: 13,
    fontWeight: "800",
  },
  input: {
    borderWidth: 1,
    borderColor: palette.borderStrong,
    backgroundColor: palette.surfaceMuted,
    color: palette.ink,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  roleRow: {
    gap: spacing.sm,
  },
  roleChip: {
    alignSelf: "flex-start",
  },
  roleChipSelected: {
    transform: [{ scale: 1.02 }],
  },
  primaryButton: {
    marginTop: spacing.sm,
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
