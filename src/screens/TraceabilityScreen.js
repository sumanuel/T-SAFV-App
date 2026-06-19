import React, { useCallback, useMemo, useState } from "react";
import {
  Pressable,
  Share,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
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
import { formatDateTime, palette, radii, spacing } from "../theme/appTheme";

function normalizeDateInput(value) {
  return value.replace(/[^0-9-]/g, "").slice(0, 10);
}

function matchesDateRange(itemDate, startDate, endDate) {
  const recordDate = new Date(itemDate);
  if (Number.isNaN(recordDate.getTime())) return true;

  if (startDate) {
    const start = new Date(`${startDate}T00:00:00`);
    if (!Number.isNaN(start.getTime()) && recordDate < start) return false;
  }

  if (endDate) {
    const end = new Date(`${endDate}T23:59:59`);
    if (!Number.isNaN(end.getTime()) && recordDate > end) return false;
  }

  return true;
}

export default function TraceabilityScreen({ navigation }) {
  const { token, activeAssociation } = useAppSession();
  const [items, setItems] = useState([]);
  const [members, setMembers] = useState([]);
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFiscalId, setSelectedFiscalId] = useState("ALL");
  const [selectedUnitId, setSelectedUnitId] = useState("ALL");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const loadRecords = useCallback(async () => {
    if (!activeAssociation?.id) {
      setItems([]);
      setMembers([]);
      setUnits([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const [traceRes, membersRes, unitsRes] = await Promise.all([
      sdk.getAssociationTraceability(token, activeAssociation.id),
      sdk.getAssociationMembers(token, activeAssociation.id),
      sdk.getAssociationUnits(token, activeAssociation.id),
    ]);

    setItems(traceRes.status === 200 ? traceRes.data || [] : []);
    setMembers(membersRes.status === 200 ? membersRes.data || [] : []);
    setUnits(unitsRes.status === 200 ? unitsRes.data || [] : []);
    setLoading(false);
  }, [activeAssociation?.id, token]);

  useFocusEffect(
    useCallback(() => {
      loadRecords();
    }, [loadRecords]),
  );

  const fiscalOptions = useMemo(
    () => members.filter((member) => member.rol === "FISCAL"),
    [members],
  );

  const unitMap = useMemo(() => {
    return units.reduce((acc, unit) => {
      acc[String(unit.id)] = unit;
      return acc;
    }, {});
  }, [units]);

  const memberMap = useMemo(() => {
    return members.reduce((acc, member) => {
      acc[String(member.id)] = member;
      return acc;
    }, {});
  }, [members]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (
        selectedFiscalId !== "ALL" &&
        String(item.fiscal_id) !== String(selectedFiscalId)
      ) {
        return false;
      }

      if (
        selectedUnitId !== "ALL" &&
        String(item.unidad_id) !== String(selectedUnitId)
      ) {
        return false;
      }

      return matchesDateRange(item.fecha_hora_registro, startDate, endDate);
    });
  }, [items, selectedFiscalId, selectedUnitId, startDate, endDate]);

  const exportTraceability = async () => {
    if (!filteredItems.length) return;

    const header = ["Fecha", "Unidad", "Fiscal", "Chofer", "Destino", "Pasajeros"];
    const rows = filteredItems.map((item) => {
      const unit = unitMap[String(item.unidad_id)];
      const fiscal = memberMap[String(item.fiscal_id)];

      return [
        formatDateTime(item.fecha_hora_registro),
        unit?.placa || item.unidad_id || "",
        fiscal?.nombre || item.fiscal_id || "",
        item.chofer || "",
        item.destino || "",
        item.pasajeros ?? "",
      ];
    });

    const csv = [header, ...rows]
      .map((line) =>
        line.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(","),
      )
      .join("\n");

    await Share.share({
      title: "Exportación de trazas",
      message: csv,
    });
  };

  return (
    <AppScreen scroll contentContainerStyle={styles.content}>
      <DetailHeader
        title="Traza"
        subtitle={
          activeAssociation ? activeAssociation.nombre : "Sin asociación activa"
        }
        onBack={() => navigation.navigate("Inicio")}
        rightActionLabel="Exportar"
        onRightActionPress={exportTraceability}
      />

      <SurfaceCard style={styles.filterCard}>
        <View style={styles.filterHeader}>
          <View style={styles.filterCopy}>
            <Text style={styles.filterTitle}>Filtros de trazabilidad</Text>
            <Text style={styles.filterSubtitle}>
              Filtra por rango de fechas, fiscal o unidad sin perder el orden
              cronológico.
            </Text>
          </View>
          <InfoPill
            label={`${filteredItems.length} registros`}
            textColor={palette.primaryDeep}
            backgroundColor={palette.primarySoft}
          />
        </View>

        <View style={styles.dateRow}>
          <View style={styles.dateField}>
            <Text style={styles.inputLabel}>Desde</Text>
            <TextInput
              value={startDate}
              onChangeText={(value) => setStartDate(normalizeDateInput(value))}
              placeholder="AAAA-MM-DD"
              placeholderTextColor={palette.inkMuted}
              style={styles.input}
            />
          </View>
          <View style={styles.dateField}>
            <Text style={styles.inputLabel}>Hasta</Text>
            <TextInput
              value={endDate}
              onChangeText={(value) => setEndDate(normalizeDateInput(value))}
              placeholder="AAAA-MM-DD"
              placeholderTextColor={palette.inkMuted}
              style={styles.input}
            />
          </View>
        </View>

        <View style={styles.quickRangeRow}>
          <Pressable
            onPress={() => {
              const today = new Date().toISOString().slice(0, 10);
              setStartDate(today);
              setEndDate(today);
            }}
            style={styles.quickRangeChip}
          >
            <Text style={styles.quickRangeText}>Hoy</Text>
          </Pressable>
          <Pressable
            onPress={() => {
              const now = new Date();
              const start = new Date(now);
              start.setDate(now.getDate() - 6);
              setStartDate(start.toISOString().slice(0, 10));
              setEndDate(now.toISOString().slice(0, 10));
            }}
            style={styles.quickRangeChip}
          >
            <Text style={styles.quickRangeText}>7 días</Text>
          </Pressable>
          <Pressable
            onPress={() => {
              setStartDate("");
              setEndDate("");
              setSelectedFiscalId("ALL");
              setSelectedUnitId("ALL");
            }}
            style={styles.quickRangeChip}
          >
            <Text style={styles.quickRangeText}>Limpiar</Text>
          </Pressable>
        </View>

        <Text style={styles.inputLabel}>Fiscal</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipRow}
        >
          <Pressable
            onPress={() => setSelectedFiscalId("ALL")}
            style={[
              styles.filterChip,
              selectedFiscalId === "ALL" ? styles.filterChipActive : null,
            ]}
          >
            <Text
              style={
                selectedFiscalId === "ALL"
                  ? styles.filterChipTextActive
                  : styles.filterChipText
              }
            >
              Todos
            </Text>
          </Pressable>
          {fiscalOptions.map((member) => (
            <Pressable
              key={member.id}
              onPress={() => setSelectedFiscalId(String(member.id))}
              style={[
                styles.filterChip,
                String(selectedFiscalId) === String(member.id)
                  ? styles.filterChipActive
                  : null,
              ]}
            >
              <Text
                style={
                  String(selectedFiscalId) === String(member.id)
                    ? styles.filterChipTextActive
                    : styles.filterChipText
                }
              >
                {member.nombre}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        <Text style={styles.inputLabel}>Unidad</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipRow}
        >
          <Pressable
            onPress={() => setSelectedUnitId("ALL")}
            style={[
              styles.filterChip,
              selectedUnitId === "ALL" ? styles.filterChipActive : null,
            ]}
          >
            <Text
              style={
                selectedUnitId === "ALL"
                  ? styles.filterChipTextActive
                  : styles.filterChipText
              }
            >
              Todas
            </Text>
          </Pressable>
          {units.map((unit) => (
            <Pressable
              key={unit.id}
              onPress={() => setSelectedUnitId(String(unit.id))}
              style={[
                styles.filterChip,
                String(selectedUnitId) === String(unit.id)
                  ? styles.filterChipActive
                  : null,
              ]}
            >
              <Text
                style={
                  String(selectedUnitId) === String(unit.id)
                    ? styles.filterChipTextActive
                    : styles.filterChipText
                }
              >
                {unit.placa || `Unidad ${unit.id}`}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </SurfaceCard>

      <SectionHeader
        title="Actividad reciente"
        subtitle="Se listan primero los registros más nuevos de la asociación activa."
      />

      {loading ? (
        <SurfaceCard>
          <Text style={styles.loadingText}>
            Cargando trazabilidad fiscal...
          </Text>
        </SurfaceCard>
      ) : null}

      {!loading && !items.length ? (
        <EmptyState
          title="Sin registros disponibles"
          message="Todavía no hay fiscalizaciones visibles para esta asociación o el rol actual no tiene acceso a ellas."
        />
      ) : null}

      {!loading && items.length && !filteredItems.length ? (
        <EmptyState
          title="Ningún registro coincide"
          message="Ajusta el rango de fechas o limpia los filtros de fiscal y unidad para volver a ver actividad."
        />
      ) : null}

      <View style={styles.cardList}>
        {filteredItems.map((item) => {
          const unit = unitMap[String(item.unidad_id)];
          const fiscal = memberMap[String(item.fiscal_id)];

          return (
            <SurfaceCard
              key={String(
                item.id || `${item.unidad_id}-${item.fecha_hora_registro}`,
              )}
              style={styles.recordCard}
            >
              <View style={styles.recordHeader}>
                <Text style={styles.recordTitle}>
                  {unit?.placa || `Unidad ${item.unidad_id || "-"}`}
                </Text>
                <Text style={styles.recordDate}>
                  {formatDateTime(item.fecha_hora_registro)}
                </Text>
              </View>

              <View style={styles.recordGrid}>
                <View style={styles.recordBlock}>
                  <Text style={styles.recordLabel}>Fiscal</Text>
                  <Text style={styles.recordValue}>
                    {fiscal?.nombre || item.fiscal_id || "-"}
                  </Text>
                </View>
                <View style={styles.recordBlock}>
                  <Text style={styles.recordLabel}>Chofer</Text>
                  <Text style={styles.recordValue}>
                    {item.chofer || "Sin dato"}
                  </Text>
                </View>
                <View style={styles.recordBlock}>
                  <Text style={styles.recordLabel}>Destino</Text>
                  <Text style={styles.recordValue}>
                    {item.destino || "Sin dato"}
                  </Text>
                </View>
                <View style={styles.recordBlock}>
                  <Text style={styles.recordLabel}>Pasajeros</Text>
                  <Text style={styles.recordValue}>
                    {item.pasajeros ?? "Sin dato"}
                  </Text>
                </View>
              </View>
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
    paddingBottom: 132,
  },
  filterCard: {
    gap: spacing.md,
  },
  filterHeader: {
    flexDirection: "row",
    gap: spacing.sm,
    justifyContent: "space-between",
  },
  filterCopy: {
    flex: 1,
    gap: 4,
  },
  filterTitle: {
    color: palette.ink,
    fontSize: 18,
    fontWeight: "800",
  },
  filterSubtitle: {
    color: palette.inkSoft,
    fontSize: 13,
    lineHeight: 19,
  },
  dateRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  dateField: {
    flex: 1,
    gap: 6,
  },
  inputLabel: {
    color: palette.inkMuted,
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  input: {
    borderWidth: 1,
    borderColor: palette.borderStrong,
    backgroundColor: palette.surfaceMuted,
    color: palette.ink,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 16,
  },
  quickRangeRow: {
    flexDirection: "row",
    gap: spacing.sm,
    flexWrap: "wrap",
  },
  quickRangeChip: {
    backgroundColor: palette.surfaceMuted,
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  quickRangeText: {
    color: palette.ink,
    fontSize: 12,
    fontWeight: "800",
  },
  chipRow: {
    gap: spacing.sm,
    paddingRight: spacing.sm,
  },
  filterChip: {
    backgroundColor: palette.surfaceMuted,
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  filterChipActive: {
    backgroundColor: palette.primaryDeep,
    borderColor: palette.primaryDeep,
  },
  filterChipText: {
    color: palette.ink,
    fontSize: 12,
    fontWeight: "700",
  },
  filterChipTextActive: {
    color: palette.surface,
    fontSize: 12,
    fontWeight: "800",
  },
  loadingText: {
    color: palette.inkSoft,
    fontSize: 14,
  },
  cardList: {
    gap: spacing.md,
  },
  recordCard: {
    gap: spacing.md,
  },
  recordHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: spacing.sm,
  },
  recordTitle: {
    color: palette.ink,
    fontSize: 17,
    fontWeight: "800",
  },
  recordDate: {
    color: palette.inkSoft,
    fontSize: 12,
  },
  recordGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  recordBlock: {
    width: "47%",
    backgroundColor: palette.surfaceMuted,
    borderRadius: 16,
    padding: spacing.md,
    gap: 4,
  },
  recordLabel: {
    color: palette.inkMuted,
    fontSize: 12,
    fontWeight: "700",
  },
  recordValue: {
    color: palette.ink,
    fontSize: 14,
    fontWeight: "700",
  },
});
