import React, { useCallback } from "react";
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

export default function InvitationsScreen({ navigation }) {
  const { invitations, refreshSession, loading } = useAppSession();

  useFocusEffect(
    useCallback(() => {
      refreshSession();
    }, [refreshSession]),
  );

  return (
    <AppScreen scroll contentContainerStyle={styles.content}>
      <DetailHeader
        title="Invitaciones"
        subtitle="Bandeja de invitaciones pendientes y accesos por rol."
        onBack={() => navigation.goBack()}
        rightActionLabel="Aceptar token"
        onRightActionPress={() => navigation.navigate("AcceptInvite")}
      />

      <SectionHeader
        title="Pendientes de aceptación"
        subtitle="Úsalas para incorporarte a una asociación sin salir de la app."
      />

      {loading && !invitations.length ? (
        <SurfaceCard>
          <Text style={styles.loadingText}>Actualizando invitaciones...</Text>
        </SurfaceCard>
      ) : null}

      {!loading && !invitations.length ? (
        <EmptyState
          title="No hay invitaciones pendientes"
          message="Cuando un administrador te invite a una asociación, podrás aceptarla desde este módulo."
          actionLabel="Ingresar token"
          onActionPress={() => navigation.navigate("AcceptInvite")}
        />
      ) : null}

      <View style={styles.cardList}>
        {invitations.map((item) => {
          const state = getStateMeta(item.estado || item.status || "ACTIVO");
          const inviteToken = item.token_invitacion || item.token || "";

          return (
            <SurfaceCard
              key={String(item.id || inviteToken)}
              style={styles.card}
            >
              <View style={styles.cardHeader}>
                <View style={styles.cardCopy}>
                  <Text style={styles.cardTitle}>
                    {item.email_invitado || item.email || "Invitación"}
                  </Text>
                  <Text style={styles.cardSubtitle}>
                    Rol: {item.rol_invitado || item.role || "Sin rol"}
                  </Text>
                </View>
                <InfoPill {...state} />
              </View>
              <Text style={styles.tokenLabel}>Token</Text>
              <Text style={styles.tokenValue}>
                {inviteToken || "No disponible"}
              </Text>
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
  card: {
    gap: spacing.md,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: spacing.sm,
  },
  cardCopy: {
    flex: 1,
    gap: 4,
  },
  cardTitle: {
    color: palette.ink,
    fontSize: 17,
    fontWeight: "800",
  },
  cardSubtitle: {
    color: palette.inkSoft,
    fontSize: 13,
  },
  tokenLabel: {
    color: palette.inkMuted,
    fontSize: 12,
    fontWeight: "700",
  },
  tokenValue: {
    color: palette.ink,
    fontSize: 13,
    lineHeight: 20,
  },
});
