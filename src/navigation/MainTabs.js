import React, { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/HomeScreen";
import TraceabilityScreen from "../screens/TraceabilityScreen";
import SettingsScreen from "../screens/SettingsScreen";
import QuickActionMenu from "../components/QuickActionMenu";
import { useAppSession } from "../context/AppSessionContext";
import { palette, radii, shadow, spacing } from "../theme/appTheme";

const Tab = createBottomTabNavigator();

function PlaceholderScreen() {
  return null;
}

export default function MainTabs({ navigation }) {
  const [showFichaMenu, setShowFichaMenu] = useState(false);
  const { activeAssociation } = useAppSession();

  const menuSections = useMemo(
    () => [
      {
        key: "consultar",
        title: "Consulta",
        options: [
          {
            key: "asociaciones",
            label: "Asociaciones",
            description:
              "Vista maestra de afiliaciones, selección y resumen operativo.",
            icon: "business-outline",
            onPress: () =>
              navigation.navigate("Directory", { mode: "asociaciones" }),
          },
          {
            key: "propietarios",
            label: "Propietarios",
            description:
              "Consulta los miembros con rol propietario de la asociación activa.",
            icon: "people-outline",
            onPress: () =>
              navigation.navigate("Directory", { mode: "propietarios" }),
            disabled: !activeAssociation,
          },
          {
            key: "fiscales",
            label: "Fiscales",
            description:
              "Revisa el equipo fiscal y su cobertura sobre las unidades.",
            icon: "shield-checkmark-outline",
            onPress: () =>
              navigation.navigate("Directory", { mode: "fiscales" }),
            disabled: !activeAssociation,
          },
        ],
      },
      {
        key: "crear",
        title: "Registrar",
        options: [
          {
            key: "crear-asociacion",
            label: "Nueva asociación",
            description:
              "Crea una asociación operativa con sus datos fiscales y de contacto.",
            icon: "add-circle-outline",
            onPress: () => navigation.navigate("CreateAssociation"),
          },
          {
            key: "crear-invitacion",
            label: "Invitar miembro",
            description:
              "Genera una invitación para administrador, fiscal o propietario.",
            icon: "mail-unread-outline",
            onPress: () => navigation.navigate("CreateInvitation"),
            disabled: !activeAssociation || activeAssociation?.rol !== "ADMIN",
            badge:
              !activeAssociation || activeAssociation?.rol === "ADMIN"
                ? null
                : "Sólo admin",
          },
          {
            key: "crear-registro",
            label: "Registro fiscal",
            description:
              "Carga una fiscalización real para una unidad de la asociación activa.",
            icon: "create-outline",
            onPress: () => navigation.navigate("CreateFiscalRecord"),
            disabled: !activeAssociation || activeAssociation?.rol !== "FISCAL",
            badge:
              !activeAssociation || activeAssociation?.rol === "FISCAL"
                ? null
                : "Sólo fiscal",
          },
        ],
      },
    ],
    [activeAssociation, navigation],
  );

  return (
    <>
      <Tab.Navigator
        initialRouteName="Inicio"
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: styles.tabBar,
          tabBarIcon: ({ focused }) => {
            const iconByRoute = {
              Inicio: "grid-outline",
              Ficha: "apps-outline",
              Traza: "pulse-outline",
              Ajustes: "settings-outline",
            };

            return (
              <View style={styles.tabItem}>
                <View
                  style={[
                    styles.tabIconWrap,
                    focused ? styles.tabIconWrapFocused : null,
                    route.name === "Ficha" ? styles.tabIconWrapFicha : null,
                  ]}
                >
                  <Ionicons
                    name={iconByRoute[route.name] || "ellipse-outline"}
                    size={20}
                    color={
                      focused || route.name === "Ficha"
                        ? palette.primaryDeep
                        : palette.inkMuted
                    }
                  />
                </View>
                <Text style={focused ? styles.tabLabelActive : styles.tabLabel}>
                  {route.name}
                </Text>
              </View>
            );
          },
        })}
      >
        <Tab.Screen name="Inicio">
          {(props) => (
            <HomeScreen
              {...props}
              onOpenFichaMenu={() => setShowFichaMenu(true)}
            />
          )}
        </Tab.Screen>
        <Tab.Screen
          name="Ficha"
          component={PlaceholderScreen}
          listeners={{
            tabPress: (event) => {
              event.preventDefault();
              setShowFichaMenu(true);
            },
          }}
        />
        <Tab.Screen name="Traza" component={TraceabilityScreen} />
        <Tab.Screen name="Ajustes" component={SettingsScreen} />
      </Tab.Navigator>

      <QuickActionMenu
        visible={showFichaMenu}
        onClose={() => setShowFichaMenu(false)}
        title="Ficha operativa"
        subtitle={
          activeAssociation
            ? `Asociación activa: ${activeAssociation.nombre}`
            : "Selecciona una asociación para navegar los registros claves."
        }
        sections={menuSections}
      />
    </>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    left: spacing.lg,
    right: spacing.lg,
    bottom: spacing.lg,
    height: 78,
    paddingHorizontal: spacing.md,
    paddingTop: 10,
    borderTopWidth: 0,
    borderRadius: radii.lg,
    backgroundColor: palette.surface,
    ...shadow,
  },
  tabItem: {
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  tabIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },
  tabIconWrapFocused: {
    backgroundColor: palette.primarySoft,
  },
  tabIconWrapFicha: {
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: palette.surfaceMuted,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: palette.inkMuted,
  },
  tabLabelActive: {
    fontSize: 11,
    fontWeight: "800",
    color: palette.primaryDeep,
  },
});
