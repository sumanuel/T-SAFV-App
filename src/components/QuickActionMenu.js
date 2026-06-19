import React from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { palette, radii, shadow, spacing } from "../theme/appTheme";

export default function QuickActionMenu({
  visible,
  onClose,
  title,
  subtitle,
  options,
}) {
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
            {options.map((option, index) => (
              <Pressable
                key={option.key}
                onPress={() => {
                  onClose();
                  option.onPress();
                }}
                style={({ pressed }) => [
                  styles.option,
                  pressed ? styles.optionPressed : null,
                  index !== options.length - 1 ? styles.optionBorder : null,
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
                  <Text style={styles.optionDescription}>
                    {option.description}
                  </Text>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={18}
                  color={palette.inkMuted}
                />
              </Pressable>
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
});
