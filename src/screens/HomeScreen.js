import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  ActionRow,
  AppScreen,
  EmptyState,
  InfoPill,
  MetricBadge,
  SectionHeader,
  SurfaceCard,
} from "../components/AppChrome";
import { useAppSession } from "../context/AppSessionContext";
import {
  formatDateTime,
  getRoleMeta,
  getStateMeta,
  palette,
  radii,
  shadow,
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
    lastSyncAt,
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

  const heroBackground = {
    backgroundColor: palette.ink,
  };

  return (
    <AppScreen scroll contentContainerStyle={styles.content}>
      <View style={[styles.heroShell, heroBackground]}>
        <View style={styles.heroGlow} />
        <View style={styles.heroTopRow}>
          <View style={styles.heroCopy}>
            <Text style={styles.heroEyebrow}>Panel operativo</Text>
            <Text style={styles.heroTitle}>
              {activeAssociation
                ? activeAssociation.nombre
                : "Operación T-SAFV"}
            </Text>
            <Text style={styles.heroSubtitle}>
              Última sincronización: {formatDateTime(lastSyncAt || new Date())}
            </Text>
          </View>

          <View style={styles.heroActionsCol}>
            <Pressable onPress={refreshSession} style={styles.circleAction}>
              <Ionicons
                name="refresh-outline"
                size={20}
                color={palette.surface}
              />
            </Pressable>
            <Pressable
              onPress={() => navigation.getParent()?.navigate("Invitations")}
              style={styles.circleAction}
            >
              <Ionicons
                name="mail-unread-outline"
                size={20}
                color={palette.surface}
              />
              {invitations.length ? (
                <View style={styles.badgeBubble}>
                  <Text style={styles.badgeText}>{invitations.length}</Text>
                </View>
              ) : null}
            </Pressable>
          </View>
        </View>

        <View style={styles.heroButtonRow}>
          <Pressable style={styles.heroPrimaryButton} onPress={onOpenFichaMenu}>
            <Text style={styles.heroPrimaryButtonText}>Abrir ficha</Text>
          </Pressable>
          <Pressable
            style={styles.heroSecondaryButton}
            onPress={() =>
              activeAssociation
                ? navigation.navigate("Traza")
                : navigation.getParent()?.navigate("CreateAssociation")
            }
          >
            <Text style={styles.heroSecondaryButtonText}>
              {activeAssociation ? "Ver traza" : "Crear asociación"}
            </Text>
          </Pressable>
        </View>

        <View style={styles.heroAssociationBlock}>
          <Text style={styles.heroSectionLabel}>Asociaciones disponibles</Text>
          {associations.length ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.heroChipsRow}
            >
              {associations.map((association) => {
                const selected =
                  String(association.id) === String(activeAssociationId);
                return (
                  <Pressable
                    key={association.id}
                    onPress={() => setActiveAssociationId(association.id)}
                    style={[
                      styles.associationChip,
                      selected ? styles.associationChipActive : null,
                    ]}
                  >
                    <Text
                      style={
                        selected
                          ? styles.associationChipTextActive
                          : styles.associationChipText
                      }
                    >
                      {association.nombre}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          ) : (
            <Text style={styles.heroEmptyText}>
              Crea o acepta una asociación para comenzar la operación.
            </Text>
          )}
        </View>
      </View>

      <SectionHeader
        title="Asociaciones registradas"
        subtitle={
          error
            ? error
            : "Cada tarjeta resume tu rol y la estructura operativa de la asociación."
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
          actionLabel="Crear asociación"
          onActionPress={() =>
            navigation.getParent()?.navigate("CreateAssociation")
          }
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

                <View style={styles.metricRow}>
                  <MetricBadge
                    label="Admins"
                    value={association.admin_count || 0}
                  />
                  <MetricBadge
                    label="Fiscales"
                    value={association.fiscal_count || 0}
                    tone="warning"
                  />
                  <MetricBadge
                    label="Propietarios"
                    value={association.propietario_count || 0}
                    tone="success"
                  />
                  <MetricBadge
                    label="Unidades"
                    value={association.units_count || 0}
                  />
                </View>

                <View style={styles.cardMetaGrid}>
                  <View style={styles.metaInlineCard}>
                    <Text style={styles.metaInlineLabel}>Miembros activos</Text>
                    <Text style={styles.metaInlineValue}>
                      {association.members_count || 0}
                    </Text>
                  </View>
                  <View style={styles.metaInlineCard}>
                    <Text style={styles.metaInlineLabel}>Trazas hoy</Text>
                    <Text style={styles.metaInlineValue}>
                      {association.trazas_hoy || 0}
                    </Text>
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

      <SectionHeader
        title="Accesos clave"
        subtitle="Tareas frecuentes organizadas para operación diaria similar al tablero comercial de tienda-app."
      />
      <View style={styles.actionList}>
        {actions.map(({ key, ...item }) => (
          <ActionRow key={key} {...item} />
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
  heroShell: {
    borderRadius: 34,
    padding: spacing.xl,
    gap: spacing.lg,
    overflow: "hidden",
    ...shadow,
  },
  heroGlow: {
    position: "absolute",
    right: -40,
    top: -25,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  heroTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: spacing.md,
  },
  heroCopy: {
    flex: 1,
    gap: spacing.xs,
  },
  heroEyebrow: {
    color: palette.heroTextSoft,
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  heroTitle: {
    color: palette.surface,
    fontSize: 34,
    fontWeight: "900",
  },
  heroSubtitle: {
    color: palette.heroTextSoft,
    fontSize: 14,
    lineHeight: 21,
  },
  heroActionsCol: {
    gap: spacing.sm,
  },
  circleAction: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: palette.heroSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeBubble: {
    position: "absolute",
    top: -3,
    right: -3,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: palette.surface,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 5,
  },
  badgeText: {
    color: palette.ink,
    fontSize: 11,
    fontWeight: "900",
  },
  heroButtonRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  heroPrimaryButton: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.14)",
    borderRadius: radii.pill,
    paddingVertical: spacing.md,
    alignItems: "center",
  },
  heroPrimaryButtonText: {
    color: palette.surface,
    fontSize: 15,
    fontWeight: "800",
  },
  heroSecondaryButton: {
    flex: 1,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    paddingVertical: spacing.md,
    alignItems: "center",
  },
  heroSecondaryButtonText: {
    color: palette.surface,
    fontSize: 15,
    fontWeight: "800",
  },
  heroAssociationBlock: {
    gap: spacing.sm,
  },
  heroSectionLabel: {
    color: palette.heroTextSoft,
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.9,
  },
  heroChipsRow: {
    gap: spacing.sm,
    paddingRight: spacing.sm,
  },
  associationChip: {
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: radii.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  associationChipActive: {
    backgroundColor: palette.surface,
  },
  associationChipText: {
    color: palette.surface,
    fontSize: 13,
    fontWeight: "700",
  },
  associationChipTextActive: {
    color: palette.heroTop,
    fontSize: 13,
    fontWeight: "800",
  },
  heroEmptyText: {
    color: palette.heroTextSoft,
    fontSize: 13,
    lineHeight: 19,
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
  metricRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  cardMetaGrid: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  metaInlineCard: {
    flex: 1,
    backgroundColor: palette.surfaceMuted,
    borderRadius: 16,
    padding: spacing.md,
    gap: 4,
  },
  metaInlineLabel: {
    color: palette.inkMuted,
    fontSize: 12,
    fontWeight: "700",
  },
  metaInlineValue: {
    color: palette.ink,
    fontSize: 18,
    fontWeight: "800",
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
