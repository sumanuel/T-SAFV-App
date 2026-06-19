import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import {
  ActionRow,
  AppScreen,
  HeroBanner,
  InfoPill,
  SectionHeader,
  SurfaceCard,
} from "../components/AppChrome";
import { API_BASE_URL } from "../config/api";
import { useAppSession } from "../context/AppSessionContext";
import { getRoleMeta, getStateMeta, palette, spacing } from "../theme/appTheme";

export default function SettingsScreen({ navigation }) {
  const { user, activeAssociation, invitations, signOut, refreshSession } =
    useAppSession();
  const role = getRoleMeta(activeAssociation?.rol);
  const state = getStateMeta(activeAssociation?.estado_membresia);

  return (
    <AppScreen scroll contentContainerStyle={styles.content}>
      <HeroBanner
        eyebrow="Ajustes"
        title={user?.nombre || user?.email || "Perfil operativo"}
        subtitle="Resumen de sesión, asociación activa y accesos administrativos del entorno móvil."
      />

      <SectionHeader
        title="Cuenta"
        subtitle="Datos básicos de acceso actual."
      />
      <SurfaceCard style={styles.card}>
        <View style={styles.metaRow}>
          <Text style={styles.metaLabel}>Correo</Text>
          <Text style={styles.metaValue}>{user?.email || "No disponible"}</Text>
        </View>
        <View style={styles.metaRow}>
          <Text style={styles.metaLabel}>Usuario</Text>
          <Text style={styles.metaValue}>{user?.id || "-"}</Text>
        </View>
        <View style={styles.metaRow}>
          <Text style={styles.metaLabel}>API</Text>
          <Text style={styles.metaValue}>{API_BASE_URL}</Text>
        </View>
      </SurfaceCard>

      <SectionHeader
        title="Asociación activa"
        subtitle="Contexto de trabajo usado por Inicio, Ficha y Traza."
      />
      <SurfaceCard style={styles.card}>
        <Text style={styles.cardTitle}>
          {activeAssociation?.nombre || "Sin asociación seleccionada"}
        </Text>
        <Text style={styles.cardSubtitle}>
          {activeAssociation?.rif || "Sin RIF registrado"}
        </Text>
        <View style={styles.pillRow}>
          {activeAssociation ? <InfoPill {...role} /> : null}
          {activeAssociation ? <InfoPill {...state} /> : null}
        </View>
      </SurfaceCard>

      <SectionHeader
        title="Operación"
        subtitle="Accesos rápidos de soporte diario."
      />
      <View style={styles.actionList}>
        <ActionRow
          icon="mail-open-outline"
          title="Invitaciones"
          subtitle="Revisa accesos pendientes y tokens recibidos."
          onPress={() => navigation.getParent()?.navigate("Invitations")}
          rightLabel={invitations.length ? String(invitations.length) : null}
        />
        <ActionRow
          icon="key-outline"
          title="Aceptar invitación"
          subtitle="Ingresa manualmente un token para activar una membresía."
          onPress={() => navigation.getParent()?.navigate("AcceptInvite")}
        />
        <ActionRow
          icon="sync-outline"
          title="Sincronizar sesión"
          subtitle="Actualiza asociaciones, invitaciones y estado operativo visible."
          onPress={refreshSession}
        />
      </View>

      <Pressable onPress={signOut} style={styles.signOutButton}>
        <Text style={styles.signOutText}>Cerrar sesión</Text>
      </Pressable>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.lg,
    paddingBottom: 132,
  },
  card: {
    gap: spacing.md,
  },
  metaRow: {
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
  cardTitle: {
    color: palette.ink,
    fontSize: 18,
    fontWeight: "800",
  },
  cardSubtitle: {
    color: palette.inkSoft,
    fontSize: 13,
  },
  pillRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.xs,
  },
  actionList: {
    gap: spacing.sm,
  },
  signOutButton: {
    backgroundColor: palette.danger,
    borderRadius: 999,
    paddingVertical: spacing.md,
    alignItems: "center",
  },
  signOutText: {
    color: palette.surface,
    fontSize: 15,
    fontWeight: "800",
  },
});
