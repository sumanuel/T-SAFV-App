import React, { useCallback, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import {
  AppScreen,
  DetailHeader,
  EmptyState,
  InfoPill,
  SectionHeader,
  SurfaceCard,
} from "../components/AppChrome";
import { useAppSession } from "../context/AppSessionContext";
import sdk from "../lib/tsafv-sdk";
import { getStateMeta, palette, spacing } from "../theme/appTheme";

export default function UnitsScreen({ navigation }) {
  const { token, activeAssociation } = useAppSession();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadUnits = useCallback(async () => {
    if (!activeAssociation?.id) {
      setItems([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const res = await sdk.getAssociationUnits(token, activeAssociation.id);
    if (res.status === 200) {
      setItems(res.data || []);
    } else {
      setItems([]);
    }
    setLoading(false);
  }, [activeAssociation?.id, token]);

  useFocusEffect(
    useCallback(() => {
      loadUnits();
    }, [loadUnits]),
  );

  return (
    <AppScreen scroll contentContainerStyle={styles.content}>
      <DetailHeader
        title="Unidades"
        subtitle={
          activeAssociation ? activeAssociation.nombre : "Sin asociación activa"
        }
        onBack={() => navigation.goBack()}
      />

      <SectionHeader
        title="Parque operativo"
        subtitle="Consulta unidades, estado actual y propietario asignado por asociación."
      />

      {loading ? (
        <SurfaceCard>
          <Text style={styles.loadingText}>
            Cargando unidades registradas...
          </Text>
        </SurfaceCard>
      ) : null}

      {!loading && !items.length ? (
        <EmptyState
          title="No hay unidades visibles"
          message="La asociación activa aún no tiene unidades asociadas o tu rol no permite consultarlas."
        />
      ) : null}

      <View style={styles.cardList}>
        {items.map((item) => {
          const state = getStateMeta(item.ultimo_estado || item.estado);

          return (
            <SurfaceCard key={item.id} style={styles.unitCard}>
              <View style={styles.unitHeader}>
                <View style={styles.unitCopy}>
                  <Text style={styles.unitPlate}>
                    {item.placa || item.name || `Unidad ${item.id}`}
                  </Text>
                  <Text style={styles.unitMeta}>
                    {item.marca || "Marca no indicada"}
                    {item.modelo ? ` · ${item.modelo}` : ""}
                    {item.ano ? ` · ${item.ano}` : ""}
                  </Text>
                </View>
                <InfoPill {...state} />
              </View>

              <View style={styles.metaGrid}>
                <View style={styles.metaBlock}>
                  <Text style={styles.metaLabel}>Propietario</Text>
                  <Text style={styles.metaValue}>
                    {item.propietario_id || "Sin asignar"}
                  </Text>
                </View>
                <View style={styles.metaBlock}>
                  <Text style={styles.metaLabel}>Asociación</Text>
                  <Text style={styles.metaValue}>
                    {item.asociacion_id || activeAssociation?.id || "-"}
                  </Text>
                </View>
              </View>
            </SurfaceCard>
          );
        })}
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.lg,
  },
  loadingText: {
    color: palette.inkSoft,
    fontSize: 14,
  },
  cardList: {
    gap: spacing.md,
  },
  unitCard: {
    gap: spacing.md,
  },
  unitHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: spacing.sm,
  },
  unitCopy: {
    flex: 1,
    gap: 4,
  },
  unitPlate: {
    color: palette.ink,
    fontSize: 18,
    fontWeight: "800",
  },
  unitMeta: {
    color: palette.inkSoft,
    fontSize: 13,
  },
  metaGrid: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  metaBlock: {
    flex: 1,
    backgroundColor: palette.surfaceMuted,
    borderRadius: 16,
    padding: spacing.md,
    gap: 4,
  },
  metaLabel: {
    color: palette.inkMuted,
    fontSize: 12,
    fontWeight: "700",
  },
  metaValue: {
    color: palette.ink,
    fontSize: 14,
    fontWeight: "700",
  },
});
