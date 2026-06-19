import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { palette, radii, shadow, spacing } from "../theme/appTheme";

function toneToColors(tone) {
  if (tone === "success") {
    return { iconBg: palette.successSoft, iconColor: palette.success };
  }
  if (tone === "warning") {
    return { iconBg: palette.warningSoft, iconColor: palette.warning };
  }
  if (tone === "danger") {
    return { iconBg: palette.dangerSoft, iconColor: palette.danger };
  }
  return { iconBg: palette.primarySoft, iconColor: palette.primaryDeep };
}

export function AppScreen({
  children,
  scroll = false,
  contentContainerStyle,
  style,
}) {
  const baseStyle = [styles.screen, contentContainerStyle];

  if (scroll) {
    return (
      <View style={[styles.screenShell, style]}>
        <View style={styles.backgroundOrbTop} />
        <View style={styles.backgroundOrbBottom} />
        <ScrollView
          contentContainerStyle={baseStyle}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={[styles.screenShell, style]}>
      <View style={styles.backgroundOrbTop} />
      <View style={styles.backgroundOrbBottom} />
      <View style={styles.screen}>{children}</View>
    </View>
  );
}

export function HeroBanner({ eyebrow, title, subtitle, children }) {
  return (
    <View style={styles.heroCard}>
      {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
      <Text style={styles.heroTitle}>{title}</Text>
      {subtitle ? <Text style={styles.heroSubtitle}>{subtitle}</Text> : null}
      {children ? <View style={styles.heroContent}>{children}</View> : null}
    </View>
  );
}

export function SectionHeader({ title, subtitle, actionLabel, onActionPress }) {
  return (
    <View style={styles.sectionRow}>
      <View style={styles.sectionCopy}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {subtitle ? (
          <Text style={styles.sectionSubtitle}>{subtitle}</Text>
        ) : null}
      </View>
      {actionLabel && onActionPress ? (
        <Pressable onPress={onActionPress} style={styles.sectionAction}>
          <Text style={styles.sectionActionLabel}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

export function SurfaceCard({ children, style }) {
  return <View style={[styles.surfaceCard, style]}>{children}</View>;
}

export function MetricBadge({ label, value, tone = "primary" }) {
  const colors = toneToColors(tone);

  return (
    <View style={[styles.metricBadge, { backgroundColor: colors.iconBg }]}>
      <Text style={[styles.metricBadgeValue, { color: colors.iconColor }]}>
        {value}
      </Text>
      <Text style={styles.metricBadgeLabel}>{label}</Text>
    </View>
  );
}

export function DetailHeader({
  title,
  subtitle,
  onBack,
  rightActionLabel,
  onRightActionPress,
}) {
  return (
    <View style={styles.detailHeader}>
      <Pressable onPress={onBack} style={styles.backButton}>
        <Ionicons name="chevron-back" size={20} color={palette.ink} />
      </Pressable>
      <View style={styles.detailHeaderCopy}>
        <Text style={styles.detailHeaderTitle}>{title}</Text>
        {subtitle ? (
          <Text style={styles.detailHeaderSubtitle}>{subtitle}</Text>
        ) : null}
      </View>
      {rightActionLabel ? (
        <Pressable
          onPress={onRightActionPress}
          style={styles.headerActionButton}
        >
          <Text style={styles.headerActionText}>{rightActionLabel}</Text>
        </Pressable>
      ) : (
        <View style={styles.headerSpacer} />
      )}
    </View>
  );
}

export function StatPill({ label, value }) {
  return (
    <View style={styles.statPill}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

export function InfoPill({ label, textColor, backgroundColor }) {
  return (
    <View style={[styles.infoPill, { backgroundColor }]}>
      <Text style={[styles.infoPillLabel, { color: textColor }]}>{label}</Text>
    </View>
  );
}

export function ActionRow({
  icon,
  title,
  subtitle,
  tone = "primary",
  onPress,
  disabled = false,
  rightLabel,
}) {
  const colors = toneToColors(tone);

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.actionRow,
        pressed && !disabled ? styles.actionRowPressed : null,
        disabled ? styles.actionRowDisabled : null,
      ]}
    >
      <View style={[styles.actionIconWrap, { backgroundColor: colors.iconBg }]}>
        <Ionicons name={icon} size={20} color={colors.iconColor} />
      </View>
      <View style={styles.actionCopy}>
        <Text style={styles.actionTitle}>{title}</Text>
        {subtitle ? (
          <Text style={styles.actionSubtitle}>{subtitle}</Text>
        ) : null}
      </View>
      {rightLabel ? (
        <Text style={styles.actionRightLabel}>{rightLabel}</Text>
      ) : null}
      <Ionicons name="chevron-forward" size={18} color={palette.inkMuted} />
    </Pressable>
  );
}

export function EmptyState({ title, message, actionLabel, onActionPress }) {
  return (
    <SurfaceCard style={styles.emptyState}>
      <View style={styles.emptyIconWrap}>
        <Ionicons name="layers-outline" size={22} color={palette.primaryDeep} />
      </View>
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptyMessage}>{message}</Text>
      {actionLabel && onActionPress ? (
        <Pressable onPress={onActionPress} style={styles.emptyButton}>
          <Text style={styles.emptyButtonText}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </SurfaceCard>
  );
}

const styles = StyleSheet.create({
  screenShell: {
    flex: 1,
    backgroundColor: palette.background,
    overflow: "hidden",
  },
  backgroundOrbTop: {
    position: "absolute",
    top: -130,
    right: -60,
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: "rgba(46, 147, 250, 0.12)",
  },
  backgroundOrbBottom: {
    position: "absolute",
    bottom: -120,
    left: -75,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "rgba(22, 105, 209, 0.09)",
  },
  screen: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxl,
    gap: spacing.lg,
  },
  heroCard: {
    backgroundColor: palette.surface,
    borderRadius: radii.lg,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: palette.border,
    ...shadow,
  },
  eyebrow: {
    color: palette.primaryDeep,
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: spacing.xs,
  },
  heroTitle: {
    color: palette.ink,
    fontSize: 28,
    fontWeight: "800",
  },
  heroSubtitle: {
    color: palette.inkSoft,
    fontSize: 14,
    lineHeight: 21,
    marginTop: spacing.sm,
  },
  heroContent: {
    marginTop: spacing.lg,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  sectionRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: spacing.md,
  },
  sectionCopy: {
    flex: 1,
    gap: 4,
  },
  sectionTitle: {
    color: palette.ink,
    fontSize: 20,
    fontWeight: "800",
  },
  sectionSubtitle: {
    color: palette.inkSoft,
    fontSize: 13,
    lineHeight: 19,
  },
  sectionAction: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  sectionActionLabel: {
    color: palette.primaryDeep,
    fontSize: 13,
    fontWeight: "700",
  },
  surfaceCard: {
    backgroundColor: palette.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: palette.border,
    padding: spacing.lg,
    ...shadow,
  },
  detailHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.border,
    alignItems: "center",
    justifyContent: "center",
  },
  detailHeaderCopy: {
    flex: 1,
    gap: 2,
  },
  detailHeaderTitle: {
    color: palette.ink,
    fontSize: 22,
    fontWeight: "800",
  },
  detailHeaderSubtitle: {
    color: palette.inkSoft,
    fontSize: 13,
  },
  headerActionButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.pill,
    backgroundColor: palette.primarySoft,
  },
  headerActionText: {
    color: palette.primaryDeep,
    fontSize: 12,
    fontWeight: "800",
  },
  headerSpacer: {
    width: 42,
  },
  statPill: {
    minWidth: 88,
    backgroundColor: palette.surfaceMuted,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: palette.border,
  },
  statValue: {
    color: palette.ink,
    fontSize: 22,
    fontWeight: "800",
  },
  statLabel: {
    color: palette.inkSoft,
    fontSize: 12,
    marginTop: 2,
  },
  infoPill: {
    alignSelf: "flex-start",
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: radii.pill,
  },
  infoPillLabel: {
    fontSize: 12,
    fontWeight: "800",
  },
  metricBadge: {
    minWidth: 86,
    borderRadius: 18,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: 2,
  },
  metricBadgeValue: {
    fontSize: 19,
    fontWeight: "900",
  },
  metricBadgeLabel: {
    color: palette.inkSoft,
    fontSize: 12,
    fontWeight: "700",
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: radii.md,
    padding: spacing.md,
  },
  actionRowPressed: {
    opacity: 0.92,
  },
  actionRowDisabled: {
    opacity: 0.55,
  },
  actionIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  actionCopy: {
    flex: 1,
    gap: 3,
  },
  actionTitle: {
    color: palette.ink,
    fontSize: 16,
    fontWeight: "700",
  },
  actionSubtitle: {
    color: palette.inkSoft,
    fontSize: 12,
    lineHeight: 18,
  },
  actionRightLabel: {
    color: palette.primaryDeep,
    fontSize: 12,
    fontWeight: "700",
  },
  emptyState: {
    alignItems: "center",
    gap: spacing.sm,
    paddingVertical: spacing.xxl,
  },
  emptyIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: palette.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyTitle: {
    color: palette.ink,
    fontSize: 18,
    fontWeight: "800",
  },
  emptyMessage: {
    color: palette.inkSoft,
    fontSize: 13,
    lineHeight: 20,
    textAlign: "center",
  },
  emptyButton: {
    marginTop: spacing.xs,
    backgroundColor: palette.primaryDeep,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  emptyButtonText: {
    color: palette.surface,
    fontWeight: "800",
  },
});
