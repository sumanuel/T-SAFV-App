import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  ActionRow,
  AppScreen,
  EmptyState,
  HeroBanner,
  InfoPill,
  SectionHeader,
  StatPill,
  SurfaceCard,
} from "../components/AppChrome";
import { useAppSession } from "../context/AppSessionContext";
import {
  getRoleMeta,
  getStateMeta,
  palette,
  radii,
  spacing,
} from "../theme/appTheme";

export default function HomeScreen({ navigation, onOpenFichaMenu }) {
  const {
    associations,
    invitations,
    activeAssociation,
    activeAssociationId,
    setActiveAssociationId,
    loading,
    error,
    user,
    refreshSession,
  } = useAppSession();

  const actions = [
    {
      key: "units",
      icon: "bus-outline",
      title: "Unidades por asociación",
      subtitle:
        "Controla las unidades y su estado operativo desde la asociación activa.",
      onPress: () => navigation.getParent()?.navigate("Units"),
      disabled: !activeAssociation,
    },
    {
      key: "invites",
      icon: "mail-open-outline",
      title: "Invitaciones pendientes",
      subtitle: "Revisa invitaciones recibidas o pendientes por aceptar.",
      onPress: () => navigation.getParent()?.navigate("Invitations"),
      rightLabel: invitations.length ? String(invitations.length) : null,
    },
    {
      key: "ficha",
      icon: "apps-outline",
      title: "Ficha operativa",
      subtitle:
        "Abre accesos directos para asociaciones, propietarios y fiscales.",
      onPress: onOpenFichaMenu,
    },
    {
      key: "trace",
      icon: "pulse-outline",
      title: "Trazabilidad fiscal",
      subtitle:
        "Consulta registros hechos por fiscales en la asociación activa.",
      onPress: () => navigation.navigate("Traza"),
      disabled: !activeAssociation,
    },
  ];

  return (
    <AppScreen scroll contentContainerStyle={styles.content}>
      <HeroBanner
        eyebrow="Panel operativo"
        title={
          activeAssociation ? activeAssociation.nombre : "Operación T-SAFV"
        }
        subtitle={
          activeAssociation
            ? "Centraliza asociaciones, unidades y registros fiscales con una navegación clara para trabajo diario."
            : "Organiza asociaciones, propietarios y trazas desde una sola consola móvil."
        }
      >
        <StatPill label="Asociaciones" value={associations.length} />
        <StatPill label="Invitaciones" value={invitations.length} />
        <StatPill label="Usuario" value={user?.id || "-"} />
      </HeroBanner>

      <SectionHeader
        title="Accesos clave"
        subtitle="Tareas frecuentes organizadas para operación diaria similar al tablero comercial de tienda-app."
      />
      <View style={styles.actionList}>
        {actions.map((item) => (
          <ActionRow key={item.key} {...item} />
        ))}
      </View>

      <SectionHeader
        title="Asociaciones registradas"
        subtitle={
          error
            ? error
            : "Selecciona una asociación activa para usar Ficha, Traza y vistas detalladas."
        }
        actionLabel="Actualizar"
        onActionPress={refreshSession}
      />

      {loading && !associations.length ? (
        <SurfaceCard>
          <Text style={styles.loadingText}>
            Sincronizando asociaciones e invitaciones...
          </Text>
        </SurfaceCard>
      ) : null}

      {!loading && !associations.length ? (
        <EmptyState
          title="No hay asociaciones activas"
          message="Cuando recibas una invitación o crees una asociación, aparecerá aquí como punto de trabajo principal."
          actionLabel="Aceptar invitación"
          onActionPress={() => navigation.getParent()?.navigate("AcceptInvite")}
        />
      ) : null}

      <View style={styles.cardList}>
        {associations.map((association) => {
          const role = getRoleMeta(association.rol);
          const state = getStateMeta(association.estado_membresia);
          const isActive =
            String(association.id) === String(activeAssociationId);

          return (
            <Pressable
              key={association.id}
              onPress={() => setActiveAssociationId(association.id)}
              style={({ pressed }) => [
                styles.cardPressable,
                pressed ? styles.cardPressed : null,
              ]}
            >
              <SurfaceCard
                style={[
                  styles.associationCard,
                  isActive ? styles.associationCardActive : null,
                ]}
              >
                <View style={styles.cardHeader}>
                  <View style={styles.cardCopy}>
                    <Text style={styles.cardTitle}>{association.nombre}</Text>
                    <Text style={styles.cardSubtitle}>
                      {association.rif || "Sin RIF"}
                      {association.email ? ` · ${association.email}` : ""}
                    </Text>
                  </View>
                  <View style={styles.cardPills}>
                    <InfoPill {...role} />
                    <InfoPill {...state} />
                  </View>
                </View>

                <View style={styles.cardMeta}>
                  <View style={styles.metaRow}>
                    <Ionicons
                      name="call-outline"
                      size={16}
                      color={palette.inkMuted}
                    />
                    <Text style={styles.metaText}>
                      {association.telefonos || "Sin teléfonos"}
                    </Text>
                  </View>
                  <View style={styles.metaRow}>
                    <Ionicons
                      name="location-outline"
                      size={16}
                      color={palette.inkMuted}
                    />
                    <Text style={styles.metaText}>
                      {association.direccion_fiscal ||
                        "Sin dirección fiscal registrada"}
                    </Text>
                  </View>
                </View>

                <View style={styles.cardFooter}>
                  <Text style={styles.cardFooterText}>
                    {isActive ? "Asociación activa" : "Tocar para activar"}
                  </Text>
                  <Ionicons
                    name="arrow-forward"
                    size={18}
                    color={palette.primaryDeep}
                  />
                </View>
              </SurfaceCard>
            </Pressable>
          );
        })}
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.lg,
    paddingBottom: 132,
  },
  actionList: {
    gap: spacing.sm,
  },
  loadingText: {
    color: palette.inkSoft,
    fontSize: 14,
  },
  cardList: {
    gap: spacing.md,
  },
  cardPressable: {
    borderRadius: radii.md,
  },
  cardPressed: {
    opacity: 0.95,
  },
  associationCard: {
    gap: spacing.md,
  },
  associationCardActive: {
    borderColor: palette.primaryDeep,
    backgroundColor: "#F8FBFF",
  },
  cardHeader: {
    gap: spacing.sm,
  },
  cardCopy: {
    gap: 4,
  },
  cardTitle: {
    color: palette.ink,
    fontSize: 18,
    fontWeight: "800",
  },
  cardSubtitle: {
    color: palette.inkSoft,
    fontSize: 13,
    lineHeight: 19,
  },
  cardPills: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.xs,
  },
  cardMeta: {
    gap: spacing.sm,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  metaText: {
    flex: 1,
    color: palette.inkSoft,
    fontSize: 13,
    lineHeight: 19,
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: spacing.xs,
  },
  cardFooterText: {
    color: palette.primaryDeep,
    fontSize: 13,
    fontWeight: "700",
  },
});
