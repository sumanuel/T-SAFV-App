import React, { useCallback, useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import {
  AppScreen,
  EmptyState,
  HeroBanner,
  SectionHeader,
  StatPill,
  SurfaceCard,
} from "../components/AppChrome";
import { useAppSession } from "../context/AppSessionContext";
import sdk from "../lib/tsafv-sdk";
import { formatDateTime, palette, spacing } from "../theme/appTheme";

export default function TraceabilityScreen() {
  const { token, activeAssociation } = useAppSession();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadRecords = useCallback(async () => {
    if (!activeAssociation?.id) {
      setItems([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const res = await sdk.getAssociationTraceability(
      token,
      activeAssociation.id,
    );
    if (res.status === 200) {
      setItems(res.data || []);
    } else {
      setItems([]);
    }
    setLoading(false);
  }, [activeAssociation?.id, token]);

  useFocusEffect(
    useCallback(() => {
      loadRecords();
    }, [loadRecords]),
  );

  const stats = useMemo(() => {
    const today = new Date().toDateString();
    return {
      total: items.length,
      units: new Set(items.map((item) => item.unidad_id)).size,
      today: items.filter(
        (item) => new Date(item.fecha_hora_registro).toDateString() === today,
      ).length,
    };
  }, [items]);

  return (
    <AppScreen scroll contentContainerStyle={styles.content}>
      <HeroBanner
        eyebrow="Seguimiento fiscal"
        title={activeAssociation ? activeAssociation.nombre : "Traza"}
        subtitle="Audita recorridos y fiscalizaciones por unidad, chofer, destino y cantidad de pasajeros."
      >
        <StatPill label="Registros" value={stats.total} />
        <StatPill label="Unidades" value={stats.units} />
        <StatPill label="Hoy" value={stats.today} />
      </HeroBanner>

      <SectionHeader
        title="Actividad reciente"
        subtitle="Se listan primero los registros más nuevos de la asociación activa."
      />

      {loading ? (
        <SurfaceCard>
          <Text style={styles.loadingText}>
            Cargando trazabilidad fiscal...
          </Text>
        </SurfaceCard>
      ) : null}

      {!loading && !items.length ? (
        <EmptyState
          title="Sin registros disponibles"
          message="Todavía no hay fiscalizaciones visibles para esta asociación o el rol actual no tiene acceso a ellas."
        />
      ) : null}

      <View style={styles.cardList}>
        {items.map((item) => (
          <SurfaceCard
            key={String(
              item.id || `${item.unidad_id}-${item.fecha_hora_registro}`,
            )}
            style={styles.recordCard}
          >
            <View style={styles.recordHeader}>
              <Text style={styles.recordTitle}>
                Unidad {item.unidad_id || "-"}
              </Text>
              <Text style={styles.recordDate}>
                {formatDateTime(item.fecha_hora_registro)}
              </Text>
            </View>

            <View style={styles.recordGrid}>
              <View style={styles.recordBlock}>
                <Text style={styles.recordLabel}>Fiscal</Text>
                <Text style={styles.recordValue}>{item.fiscal_id || "-"}</Text>
              </View>
              <View style={styles.recordBlock}>
                <Text style={styles.recordLabel}>Chofer</Text>
                <Text style={styles.recordValue}>
                  {item.chofer || "Sin dato"}
                </Text>
              </View>
              <View style={styles.recordBlock}>
                <Text style={styles.recordLabel}>Destino</Text>
                <Text style={styles.recordValue}>
                  {item.destino || "Sin dato"}
                </Text>
              </View>
              <View style={styles.recordBlock}>
                <Text style={styles.recordLabel}>Pasajeros</Text>
                <Text style={styles.recordValue}>
                  {item.pasajeros ?? "Sin dato"}
                </Text>
              </View>
            </View>
          </SurfaceCard>
        ))}
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.lg,
    paddingBottom: 132,
  },
  loadingText: {
    color: palette.inkSoft,
    fontSize: 14,
  },
  cardList: {
    gap: spacing.md,
  },
  recordCard: {
    gap: spacing.md,
  },
  recordHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: spacing.sm,
  },
  recordTitle: {
    color: palette.ink,
    fontSize: 17,
    fontWeight: "800",
  },
  recordDate: {
    color: palette.inkSoft,
    fontSize: 12,
  },
  recordGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  recordBlock: {
    width: "47%",
    backgroundColor: palette.surfaceMuted,
    borderRadius: 16,
    padding: spacing.md,
    gap: 4,
  },
  recordLabel: {
    color: palette.inkMuted,
    fontSize: 12,
    fontWeight: "700",
  },
  recordValue: {
    color: palette.ink,
    fontSize: 14,
    fontWeight: "700",
  },
});
