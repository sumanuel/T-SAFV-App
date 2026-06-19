export const palette = {
  background: "#EAF3FB",
  backgroundStrong: "#D8EAFB",
  backgroundDeep: "#C7DDF4",
  surface: "#FFFFFF",
  surfaceMuted: "#F5F9FD",
  border: "#D0E0F2",
  borderStrong: "#A8C8E8",
  overlay: "rgba(8, 21, 38, 0.46)",
  primary: "#2E93FA",
  primaryDeep: "#1669D1",
  primarySoft: "#D9ECFF",
  ink: "#10243E",
  inkSoft: "#44617F",
  inkMuted: "#6E86A0",
  success: "#0F9F6E",
  successSoft: "#D9F6EB",
  warning: "#D88721",
  warningSoft: "#FFF1DE",
  danger: "#D55454",
  dangerSoft: "#FFE5E5",
  heroTop: "#1D7C59",
  heroBottom: "#2A8C66",
  heroSoft: "rgba(255,255,255,0.12)",
  heroTextSoft: "rgba(255,255,255,0.82)",
};

export const spacing = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
};

export const radii = {
  sm: 14,
  md: 20,
  lg: 28,
  pill: 999,
};

export const shadow = {
  shadowColor: "#0D355C",
  shadowOpacity: 0.12,
  shadowRadius: 18,
  shadowOffset: { width: 0, height: 10 },
  elevation: 5,
};

export const roleMeta = {
  ADMIN: {
    label: "Administrador",
    textColor: palette.primaryDeep,
    backgroundColor: palette.primarySoft,
  },
  PROPIETARIO: {
    label: "Propietario",
    textColor: palette.success,
    backgroundColor: palette.successSoft,
  },
  FISCAL: {
    label: "Fiscal",
    textColor: palette.warning,
    backgroundColor: palette.warningSoft,
  },
};

export const stateMeta = {
  ACTIVO: {
    label: "Activo",
    textColor: palette.success,
    backgroundColor: palette.successSoft,
  },
  INACTIVO: {
    label: "Inactivo",
    textColor: palette.inkMuted,
    backgroundColor: palette.surfaceMuted,
  },
  SUSPENDIDO: {
    label: "Suspendido",
    textColor: palette.warning,
    backgroundColor: palette.warningSoft,
  },
};

export function getRoleMeta(role) {
  return (
    roleMeta[role] || {
      label: role || "Rol",
      textColor: palette.inkSoft,
      backgroundColor: palette.surfaceMuted,
    }
  );
}

export function getStateMeta(state) {
  return (
    stateMeta[state] || {
      label: state || "Sin estado",
      textColor: palette.inkSoft,
      backgroundColor: palette.surfaceMuted,
    }
  );
}

export function formatDateTime(value) {
  if (!value) return "Sin fecha";

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return String(value);

  return parsed.toLocaleString("es-VE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatDate(value, fallback = "Sin fecha") {
  if (!value) return fallback;

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return String(value);

  return parsed.toLocaleDateString("es-VE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}
