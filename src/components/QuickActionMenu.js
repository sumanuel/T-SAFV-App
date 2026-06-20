import React from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { palette, radii, shadow, spacing } from "../theme/appTheme";

export default function QuickActionMenu({
  visible,
  onClose,
  title,
  subtitle,
  sections,
  options,
}) {
  const groupedSections = sections || [
    { key: "default", options: options || [] },
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={() => {}}>
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
          </View>
          <View style={styles.optionList}>
            {groupedSections.map((section) => (
              <View key={section.key} style={styles.sectionBlock}>
                {section.title ? (
                  <Text style={styles.sectionTitle}>{section.title}</Text>
                ) : null}
                {section.options.map((option, index) => (
                  <Pressable
                    key={option.key}
                    disabled={option.disabled}
                    onPress={() => {
                      onClose();
                      option.onPress();
                    }}
                    style={({ pressed }) => [
                      styles.option,
                      pressed && !option.disabled ? styles.optionPressed : null,
                      option.disabled ? styles.optionDisabled : null,
                      index !== section.options.length - 1
                        ? styles.optionBorder
                        : null,
                    ]}
                  >
                    <View style={styles.optionIconWrap}>
                      <Ionicons
                        name={option.icon}
                        size={20}
                        color={palette.primaryDeep}
                      />
                    </View>
                    <View style={styles.optionCopy}>
                      <Text style={styles.optionLabel}>{option.label}</Text>
                      {option.description ? (
                        <Text style={styles.optionDescription}>
                          {option.description}
                        </Text>
                      ) : null}
                    </View>
                    {option.badge ? (
                      <View style={styles.optionBadge}>
                        <Text style={styles.optionBadgeText}>
                          {option.badge}
                        </Text>
                      </View>
                    ) : null}
                    <Ionicons
                      name="chevron-forward"
                      size={18}
                      color={palette.inkMuted}
                    />
                  </Pressable>
                ))}
              </View>
            ))}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: palette.overlay,
    justifyContent: "flex-end",
    padding: spacing.lg,
  },
  sheet: {
    backgroundColor: palette.surface,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: palette.border,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
    overflow: "hidden",
    ...shadow,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    gap: 4,
  },
  title: {
    color: palette.ink,
    fontSize: 20,
    fontWeight: "800",
  },
  subtitle: {
    color: palette.inkSoft,
    fontSize: 13,
    lineHeight: 19,
  },
  optionList: {
    paddingHorizontal: spacing.sm,
    gap: spacing.sm,
  },
  sectionBlock: {
    backgroundColor: palette.surfaceMuted,
    borderRadius: radii.md,
    overflow: "hidden",
  },
  sectionTitle: {
    color: palette.inkMuted,
    fontSize: 11,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  optionPressed: {
    backgroundColor: palette.surfaceMuted,
  },
  optionDisabled: {
    opacity: 0.48,
  },
  optionBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: palette.border,
  },
  optionIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: palette.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  optionCopy: {
    flex: 1,
    gap: 4,
  },
  optionLabel: {
    color: palette.ink,
    fontSize: 16,
    fontWeight: "700",
  },
  optionDescription: {
    color: palette.inkSoft,
    fontSize: 12,
    lineHeight: 18,
  },
  optionBadge: {
    backgroundColor: palette.primarySoft,
    paddingHorizontal: spacing.sm,
    paddingVertical: 5,
    borderRadius: radii.pill,
  },
  optionBadgeText: {
    color: palette.primaryDeep,
    fontSize: 11,
    fontWeight: "800",
  },
});
