import React, { useCallback, useMemo, useState } from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import {
  AppScreen,
  DetailHeader,
  SectionHeader,
  SurfaceCard,
} from "../components/AppChrome";
import { useAppSession } from "../context/AppSessionContext";
import sdk from "../lib/tsafv-sdk";
import { palette, radii, spacing } from "../theme/appTheme";

export default function FiscalRecordFormScreen({ navigation }) {
  const { token, activeAssociation } = useAppSession();
  const [units, setUnits] = useState([]);
  const [selectedUnitId, setSelectedUnitId] = useState(null);
  const [chofer, setChofer] = useState("");
  const [destino, setDestino] = useState("");
  const [pasajeros, setPasajeros] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const loadUnits = useCallback(async () => {
    if (!activeAssociation?.id) {
      setUnits([]);
      return;
    }

    const res = await sdk.getAssociationUnits(token, activeAssociation.id);
    if (res.status === 200) {
      const nextUnits = res.data || [];
      setUnits(nextUnits);
      setSelectedUnitId((current) => current || nextUnits[0]?.id || null);
    } else {
      setUnits([]);
      setSelectedUnitId(null);
    }
  }, [activeAssociation?.id, token]);

  useFocusEffect(
    useCallback(() => {
      loadUnits();
    }, [loadUnits]),
  );

  const selectedUnit = useMemo(
    () =>
      units.find((unit) => String(unit.id) === String(selectedUnitId)) || null,
    [selectedUnitId, units],
  );

  const handleSubmit = async () => {
    if (!activeAssociation?.id || !selectedUnitId) {
      Alert.alert(
        "Datos incompletos",
        "Selecciona una unidad válida para registrar la fiscalización.",
      );
      return;
    }

    setSubmitting(true);
    const res = await sdk.createFiscalRecord(token, {
      unidad_id: Number(selectedUnitId),
      asociacion_id: Number(activeAssociation.id),
      chofer: chofer.trim(),
      destino: destino.trim(),
      pasajeros: pasajeros ? Number(pasajeros) : undefined,
    });

    if (res.status === 201 || res.status === 200) {
      Alert.alert(
        "Registro creado",
        "La fiscalización fue guardada correctamente.",
      );
      navigation.goBack();
    } else {
      Alert.alert(
        "Error",
        res.data?.message || "No se pudo crear el registro fiscal.",
      );
    }
    setSubmitting(false);
  };

  return (
    <AppScreen scroll contentContainerStyle={styles.content}>
      <DetailHeader
        title="Registro fiscal"
        subtitle={
          activeAssociation ? activeAssociation.nombre : "Sin asociación activa"
        }
        onBack={() => navigation.goBack()}
      />

      <SectionHeader
        title="Fiscalización de unidad"
        subtitle="Registra chofer, destino y pasajeros para la traza operativa de la asociación."
      />

      <SurfaceCard style={styles.formCard}>
        <View style={styles.fieldWrap}>
          <Text style={styles.label}>Unidad</Text>
          <View style={styles.unitList}>
            {units.map((unit) => {
              const selected = String(unit.id) === String(selectedUnitId);
              return (
                <Pressable
                  key={unit.id}
                  onPress={() => setSelectedUnitId(unit.id)}
                  style={[
                    styles.unitChip,
                    selected ? styles.unitChipSelected : null,
                  ]}
                >
                  <Text
                    style={
                      selected
                        ? styles.unitChipTextSelected
                        : styles.unitChipText
                    }
                  >
                    {unit.placa || `Unidad ${unit.id}`}
                  </Text>
                </Pressable>
              );
            })}
          </View>
          {selectedUnit ? (
            <Text style={styles.helperText}>
              {selectedUnit.marca || "Marca no indicada"}
              {selectedUnit.modelo ? ` · ${selectedUnit.modelo}` : ""}
            </Text>
          ) : null}
        </View>

        <Field label="Chofer" value={chofer} onChangeText={setChofer} />
        <Field label="Destino" value={destino} onChangeText={setDestino} />
        <Field
          label="Pasajeros"
          value={pasajeros}
          onChangeText={(value) => setPasajeros(value.replace(/[^0-9]/g, ""))}
          keyboardType="numeric"
        />

        <Pressable
          onPress={handleSubmit}
          style={styles.primaryButton}
          disabled={submitting}
        >
          <Text style={styles.primaryButtonText}>
            {submitting ? "Guardando registro..." : "Crear registro fiscal"}
          </Text>
        </Pressable>
      </SurfaceCard>
    </AppScreen>
  );
}

function Field({ label, ...props }) {
  return (
    <View style={styles.fieldWrap}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        {...props}
        placeholderTextColor={palette.inkMuted}
        style={styles.input}
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
  unitList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  unitChip: {
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: palette.surfaceMuted,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  unitChipSelected: {
    borderColor: palette.primaryDeep,
    backgroundColor: palette.primarySoft,
  },
  unitChipText: {
    color: palette.ink,
    fontSize: 12,
    fontWeight: "700",
  },
  unitChipTextSelected: {
    color: palette.primaryDeep,
    fontSize: 12,
    fontWeight: "800",
  },
  helperText: {
    color: palette.inkSoft,
    fontSize: 12,
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
