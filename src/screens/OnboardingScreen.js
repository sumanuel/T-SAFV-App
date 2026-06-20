import React, { useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { palette, radii, shadow, spacing } from "../theme/appTheme";

const slides = [
  {
    key: "assoc",
    eyebrow: "Operación centralizada",
    title: "Administra asociaciones en una sola consola",
    body: "Selecciona la asociación activa y entra rápido a sus miembros, unidades y trazabilidad.",
  },
  {
    key: "trace",
    eyebrow: "Control diario",
    title: "Registra y audita la traza fiscal",
    body: "Consulta filtros por fecha, unidad y fiscal, y comparte exportaciones desde el móvil.",
  },
  {
    key: "team",
    eyebrow: "Equipo organizado",
    title: "Invita miembros y controla estados",
    body: "Gestiona propietarios y fiscales con pantallas dedicadas y acciones rápidas por rol.",
  },
];

export default function OnboardingScreen({ onDone }) {
  const [index, setIndex] = useState(0);
  const slide = slides[index];
  const isLast = index === slides.length - 1;

  return (
    <View style={styles.screen}>
      <View style={styles.backgroundOrbTop} />
      <View style={styles.backgroundOrbBottom} />

      <View style={styles.content}>
        <View style={styles.brandBlock}>
          <View style={styles.logoWrap}>
            <Image
              source={require("../../assets/android-icon-foreground.png")}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.brandTitle}>T-SAFV</Text>
          <Text style={styles.brandSubtitle}>
            Plataforma móvil para asociaciones, unidades y trazabilidad fiscal.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.eyebrow}>{slide.eyebrow}</Text>
          <Text style={styles.title}>{slide.title}</Text>
          <Text style={styles.body}>{slide.body}</Text>

          <View style={styles.dotsRow}>
            {slides.map((item, itemIndex) => (
              <View
                key={item.key}
                style={[
                  styles.dot,
                  itemIndex === index ? styles.dotActive : null,
                ]}
              />
            ))}
          </View>

          <Pressable
            onPress={() =>
              isLast ? onDone() : setIndex((current) => current + 1)
            }
            style={styles.primaryButton}
          >
            <Text style={styles.primaryButtonText}>
              {isLast ? "Comenzar" : "Continuar"}
            </Text>
          </Pressable>

          {!isLast ? (
            <Pressable onPress={onDone} style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>Omitir onboarding</Text>
            </Pressable>
          ) : null}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: palette.ink,
    overflow: "hidden",
  },
  backgroundOrbTop: {
    position: "absolute",
    top: -120,
    right: -80,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: "rgba(46, 147, 250, 0.24)",
  },
  backgroundOrbBottom: {
    position: "absolute",
    bottom: -130,
    left: -70,
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: "rgba(46, 147, 250, 0.18)",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xxl,
    gap: spacing.xl,
  },
  brandBlock: {
    alignItems: "center",
    gap: spacing.sm,
  },
  logoWrap: {
    width: 88,
    height: 88,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  logo: {
    width: 58,
    height: 58,
  },
  brandTitle: {
    color: palette.surface,
    fontSize: 30,
    fontWeight: "900",
  },
  brandSubtitle: {
    color: "rgba(234,243,251,0.84)",
    textAlign: "center",
    fontSize: 14,
    lineHeight: 21,
  },
  card: {
    backgroundColor: palette.surface,
    borderRadius: radii.lg,
    padding: spacing.xl,
    gap: spacing.md,
    ...shadow,
  },
  eyebrow: {
    color: palette.primaryDeep,
    textTransform: "uppercase",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0.9,
  },
  title: {
    color: palette.ink,
    fontSize: 28,
    fontWeight: "900",
    lineHeight: 34,
  },
  body: {
    color: palette.inkSoft,
    fontSize: 15,
    lineHeight: 24,
  },
  dotsRow: {
    flexDirection: "row",
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  dot: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: palette.borderStrong,
  },
  dotActive: {
    width: 26,
    backgroundColor: palette.primaryDeep,
  },
  primaryButton: {
    backgroundColor: palette.primaryDeep,
    borderRadius: radii.pill,
    paddingVertical: spacing.md,
    alignItems: "center",
    marginTop: spacing.sm,
  },
  primaryButtonText: {
    color: palette.surface,
    fontSize: 15,
    fontWeight: "800",
  },
  secondaryButton: {
    alignItems: "center",
    paddingVertical: spacing.sm,
  },
  secondaryButtonText: {
    color: palette.primaryDeep,
    fontSize: 14,
    fontWeight: "700",
  },
});
