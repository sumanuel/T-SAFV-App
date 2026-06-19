import React, { useMemo, useState } from "react";
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
  SectionHeader,
  SurfaceCard,
} from "../components/AppChrome";
import { useAppSession } from "../context/AppSessionContext";
import sdk from "../lib/tsafv-sdk";
import { palette, radii, spacing } from "../theme/appTheme";

export default function CreateAssociationScreen({ navigation, route }) {
  const { token, refreshSession } = useAppSession();
  const association = route.params?.association || null;
  const isEditing = Boolean(association?.id);
  const initialForm = useMemo(
    () => ({
      nombre: association?.nombre || "",
      rif: association?.rif || "",
      direccion_fiscal: association?.direccion_fiscal || "",
      email: association?.email || "",
      telefonos: association?.telefonos || "",
    }),
    [association],
  );
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);

  const updateField = (key, value) =>
    setForm((current) => ({ ...current, [key]: value }));

  const handleSubmit = async () => {
    if (!form.nombre.trim()) {
      Alert.alert(
        "Datos incompletos",
        "El nombre de la asociación es obligatorio.",
      );
      return;
    }

    setSubmitting(true);
    const payload = {
      nombre: form.nombre.trim(),
      rif: form.rif.trim(),
      direccion_fiscal: form.direccion_fiscal.trim(),
      email: form.email.trim(),
      telefonos: form.telefonos.trim(),
    };
    const res = isEditing
      ? await sdk.updateAsociacion(token, association.id, payload)
      : await sdk.createAsociacion(token, payload);

    if (res.status === 201 || res.status === 200) {
      await refreshSession();
      Alert.alert(
        isEditing ? "Asociación actualizada" : "Asociación creada",
        isEditing
          ? "Los datos de la asociación fueron actualizados correctamente."
          : "La asociación fue registrada correctamente.",
      );
      navigation.goBack();
    } else {
      Alert.alert(
        "Error",
        res.data?.message || "No se pudo crear la asociación.",
      );
    }
    setSubmitting(false);
  };

  return (
    <AppScreen scroll contentContainerStyle={styles.content}>
      <DetailHeader
        title={isEditing ? "Editar asociación" : "Nueva asociación"}
        subtitle={
          isEditing
            ? "Actualiza los datos fiscales y operativos de la asociación activa."
            : "Registra la entidad operativa con sus datos fiscales y de contacto."
        }
        onBack={() => navigation.goBack()}
      />

      <SectionHeader
        title="Datos principales"
        subtitle="Estos datos alimentan el panel principal y la identificación administrativa."
      />

      <SurfaceCard style={styles.formCard}>
        <Field
          label="Nombre"
          value={form.nombre}
          onChangeText={(value) => updateField("nombre", value)}
        />
        <Field
          label="RIF"
          value={form.rif}
          onChangeText={(value) => updateField("rif", value)}
        />
        <Field
          label="Correo"
          value={form.email}
          onChangeText={(value) => updateField("email", value)}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <Field
          label="Teléfonos"
          value={form.telefonos}
          onChangeText={(value) => updateField("telefonos", value)}
        />
        <Field
          label="Dirección fiscal"
          value={form.direccion_fiscal}
          onChangeText={(value) => updateField("direccion_fiscal", value)}
          multiline
        />

        <Pressable
          onPress={handleSubmit}
          style={styles.primaryButton}
          disabled={submitting}
        >
          <Text style={styles.primaryButtonText}>
            {submitting
              ? "Guardando asociación..."
              : isEditing
                ? "Guardar cambios"
                : "Crear asociación"}
          </Text>
        </Pressable>
      </SurfaceCard>
    </AppScreen>
  );
}

function Field({ label, multiline = false, ...props }) {
  return (
    <View style={styles.fieldWrap}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        {...props}
        multiline={multiline}
        placeholderTextColor={palette.inkMuted}
        style={[styles.input, multiline ? styles.textarea : null]}
      />
    </View>
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
  textarea: {
    minHeight: 96,
    textAlignVertical: "top",
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
