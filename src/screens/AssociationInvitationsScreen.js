import React, { useCallback, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import {
  AppScreen,
  DetailHeader,
  EmptyState,
  FloatingActionButton,
  InfoPill,
  SectionHeader,
  SurfaceCard,
} from "../components/AppChrome";
import { useAppSession } from "../context/AppSessionContext";
import sdk from "../lib/tsafv-sdk";
import { formatDate, getStateMeta, palette, spacing } from "../theme/appTheme";

export default function AssociationInvitationsScreen({ navigation }) {
  const { token, activeAssociation } = useAppSession();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadItems = useCallback(async () => {
    if (!activeAssociation?.id) {
      setItems([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const res = await sdk.getAssociationInvitations(
      token,
      activeAssociation.id,
    );
    setItems(res.status === 200 ? res.data || [] : []);
    setLoading(false);
  }, [activeAssociation?.id, token]);

  useFocusEffect(
    useCallback(() => {
      loadItems();
    }, [loadItems]),
  );

  return (
    <AppScreen scroll contentContainerStyle={styles.content}>
      <DetailHeader
        title="Invitar Miembro"
        subtitle={
          activeAssociation ? activeAssociation.nombre : "Sin asociación activa"
        }
        onBack={() => navigation.goBack()}
      />

      <SectionHeader
        title="Invitaciones emitidas"
        subtitle="Revisa invitaciones generadas para la asociación activa y crea nuevas desde el botón flotante."
      />

      {loading ? (
        <SurfaceCard>
          <Text style={styles.loadingText}>Cargando invitaciones...</Text>
        </SurfaceCard>
      ) : null}

      {!loading && !items.length ? (
        <EmptyState
          title="Sin invitaciones registradas"
          message="Usa el botón + para invitar administradores, fiscales o propietarios a esta asociación."
        />
      ) : null}

      <View style={styles.cardList}>
        {items.map((item) => {
          const state = getStateMeta(item.estado || "ACTIVO");
          return (
            <SurfaceCard key={item.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.cardCopy}>
                  <Text style={styles.cardTitle}>{item.email_invitado}</Text>
                  <Text style={styles.cardSubtitle}>
                    Rol: {item.rol_invitado}
                  </Text>
                </View>
                <InfoPill {...state} />
              </View>
              <Text style={styles.metaText}>
                Expira: {formatDate(item.expira_en, "Sin fecha")}
              </Text>
              <Text style={styles.metaText}>
                Token: {item.token_invitacion}
              </Text>
            </SurfaceCard>
          );
        })}
      </View>

      <FloatingActionButton
        label="Invitar"
        onPress={() => navigation.navigate("CreateInvitation")}
      />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  content: { gap: spacing.lg, paddingBottom: 140 },
  loadingText: { color: palette.inkSoft, fontSize: 14 },
  cardList: { gap: spacing.md },
  card: { gap: spacing.sm },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: spacing.sm,
  },
  cardCopy: { flex: 1, gap: 4 },
  cardTitle: { color: palette.ink, fontSize: 17, fontWeight: "800" },
  cardSubtitle: { color: palette.inkSoft, fontSize: 13 },
  metaText: { color: palette.inkSoft, fontSize: 13 },
});
