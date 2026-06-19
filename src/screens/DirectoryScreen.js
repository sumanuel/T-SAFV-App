import React, { useCallback, useMemo, useState } from "react";
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
import { getRoleMeta, getStateMeta, palette, spacing } from "../theme/appTheme";

const modeConfig = {
  asociaciones: {
    title: "Asociaciones",
    subtitle: "Vista administrativa y de contexto activo.",
  },
  propietarios: {
    title: "Propietarios",
    subtitle: "Miembros con rol propietario dentro de la asociación activa.",
    role: "PROPIETARIO",
  },
  fiscales: {
    title: "Fiscales",
    subtitle: "Miembros con rol fiscal dentro de la asociación activa.",
    role: "FISCAL",
  },
};

export default function DirectoryScreen({ navigation, route }) {
  const mode = route.params?.mode || "asociaciones";
  const config = modeConfig[mode] || modeConfig.asociaciones;
  const {
    token,
    activeAssociation,
    associations,
    activeAssociationId,
    setActiveAssociationId,
  } = useAppSession();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(mode !== "asociaciones");

  const loadMembers = useCallback(async () => {
    if (mode === "asociaciones") {
      setLoading(false);
      return;
    }

    if (!activeAssociation?.id) {
      setMembers([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const res = await sdk.getAssociationMembers(token, activeAssociation.id);
    if (res.status === 200) {
      setMembers(res.data || []);
    } else {
      setMembers([]);
    }
    setLoading(false);
  }, [activeAssociation?.id, mode, token]);

  useFocusEffect(
    useCallback(() => {
      loadMembers();
    }, [loadMembers]),
  );

  const filteredMembers = useMemo(() => {
    if (!config.role) return members;
    return members.filter((member) => member.rol === config.role);
  }, [config.role, members]);

  return (
    <AppScreen scroll contentContainerStyle={styles.content}>
      <DetailHeader
        title={config.title}
        subtitle={config.subtitle}
        onBack={() => navigation.goBack()}
      />

      {mode === "asociaciones" ? (
        <>
          <SectionHeader
            title="Tus asociaciones"
            subtitle="Selecciona cuál será la activa para el resto de la navegación."
          />
          <View style={styles.cardList}>
            {associations.map((association) => {
              const role = getRoleMeta(association.rol);
              const state = getStateMeta(association.estado_membresia);
              const isActive =
                String(association.id) === String(activeAssociationId);

              return (
                <SurfaceCard key={association.id} style={styles.card}>
                  <Text style={styles.cardTitle}>{association.nombre}</Text>
                  <Text style={styles.cardSubtitle}>
                    {association.rif || "Sin RIF"}
                  </Text>
                  <View style={styles.pillRow}>
                    <InfoPill {...role} />
                    <InfoPill {...state} />
                  </View>
                  <Text style={styles.cardMeta}>
                    {association.email || "Sin correo registrado"}
                  </Text>
                  <Text style={styles.cardMeta}>
                    {association.telefonos || "Sin teléfonos"}
                  </Text>
                  <Text
                    onPress={() => setActiveAssociationId(association.id)}
                    style={styles.inlineAction}
                  >
                    {isActive
                      ? "Asociación activa"
                      : "Usar como asociación activa"}
                  </Text>
                </SurfaceCard>
              );
            })}
          </View>
        </>
      ) : (
        <>
          <SectionHeader
            title={
              activeAssociation
                ? activeAssociation.nombre
                : "Sin asociación activa"
            }
            subtitle="Directorio operativo filtrado por rol dentro de la asociación seleccionada."
          />

          {loading ? (
            <SurfaceCard>
              <Text style={styles.loadingText}>
                Cargando directorio de miembros...
              </Text>
            </SurfaceCard>
          ) : null}

          {!loading && !filteredMembers.length ? (
            <EmptyState
              title={`Sin ${config.title.toLowerCase()} visibles`}
              message="No se encontraron miembros para el rol solicitado dentro de la asociación activa."
            />
          ) : null}

          <View style={styles.cardList}>
            {filteredMembers.map((member) => {
              const role = getRoleMeta(member.rol);

              return (
                <SurfaceCard key={member.id} style={styles.card}>
                  <Text style={styles.cardTitle}>
                    {member.nombre || `Usuario ${member.id}`}
                  </Text>
                  <Text style={styles.cardSubtitle}>
                    {member.email || "Sin correo"}
                  </Text>
                  <View style={styles.pillRow}>
                    <InfoPill {...role} />
                  </View>
                </SurfaceCard>
              );
            })}
          </View>
        </>
      )}
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
  card: {
    gap: spacing.sm,
  },
  cardTitle: {
    color: palette.ink,
    fontSize: 18,
    fontWeight: "800",
  },
  cardSubtitle: {
    color: palette.inkSoft,
    fontSize: 13,
  },
  cardMeta: {
    color: palette.inkSoft,
    fontSize: 13,
  },
  pillRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.xs,
  },
  inlineAction: {
    color: palette.primaryDeep,
    fontSize: 13,
    fontWeight: "800",
  },
});
