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

  const menuOptions = useMemo(
    () => [
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
      },
      {
        key: "fiscales",
        label: "Fiscales",
        description:
          "Revisa el equipo fiscal y su cobertura sobre las unidades.",
        icon: "shield-checkmark-outline",
        onPress: () => navigation.navigate("Directory", { mode: "fiscales" }),
      },
    ],
    [navigation],
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
              Ficha: "add-outline",
              Traza: "pulse-outline",
              Ajustes: "settings-outline",
            };

            if (route.name === "Ficha") {
              return (
                <View style={styles.fichaTabWrap}>
                  <View style={styles.fichaTabButton}>
                    <Ionicons
                      name="apps-outline"
                      size={22}
                      color={palette.surface}
                    />
                  </View>
                  <Text style={styles.tabLabelActive}>Ficha</Text>
                </View>
              );
            }

            return (
              <View style={styles.tabItem}>
                <View
                  style={[
                    styles.tabIconWrap,
                    focused ? styles.tabIconWrapFocused : null,
                  ]}
                >
                  <Ionicons
                    name={iconByRoute[route.name] || "ellipse-outline"}
                    size={20}
                    color={focused ? palette.primaryDeep : palette.inkMuted}
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
        options={menuOptions}
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
    height: 74,
    paddingHorizontal: spacing.md,
    paddingTop: 12,
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
  fichaTabWrap: {
    marginTop: -34,
    alignItems: "center",
    gap: 6,
  },
  fichaTabButton: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: palette.primaryDeep,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 5,
    borderColor: palette.background,
  },
});
