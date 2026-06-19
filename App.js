import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import {
  NavigationContainer,
  createNavigationContainerRef,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import AcceptInviteScreen from "./src/screens/AcceptInviteScreen";
import InvitationsScreen from "./src/screens/InvitationsScreen";
import UnitsScreen from "./src/screens/UnitsScreen";
import DirectoryScreen from "./src/screens/DirectoryScreen";
import MainTabs from "./src/navigation/MainTabs";
import {
  getToken as getStoredToken,
  deleteToken as removeStoredToken,
} from "./src/lib/authStore";
import { startTokenMonitor, stopTokenMonitor } from "./src/lib/authManager";
import { AppSessionProvider } from "./src/context/AppSessionContext";
import { palette } from "./src/theme/appTheme";

const navigationRef = createNavigationContainerRef();

const Stack = createNativeStackNavigator();

export default function App() {
  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const [token, setToken] = useState(null);

  useEffect(() => {
    (async () => {
      const t = await getStoredToken();
      if (t) {
        setToken(t);
      }
      setIsBootstrapping(false);
    })();

    startTokenMonitor(async () => {
      await removeStoredToken();
      setToken(null);
      if (navigationRef.isReady()) {
        navigationRef.reset({ index: 0, routes: [{ name: "Login" }] });
      }
    });

    return () => stopTokenMonitor();
  }, []);

  const handleAuthSuccess = (nextToken) => {
    setToken(nextToken);
  };

  const handleSignOut = async () => {
    await removeStoredToken();
    setToken(null);
  };

  if (isBootstrapping) {
    return (
      <View style={styles.loadingScreen}>
        <ActivityIndicator size="large" color={palette.primaryDeep} />
      </View>
    );
  }

  return (
    <NavigationContainer ref={navigationRef}>
      {token ? (
        <AppSessionProvider token={token} onSignOut={handleSignOut}>
          <Stack.Navigator
            key="app-stack"
            initialRouteName="MainTabs"
            screenOptions={{ headerShown: false, animation: "fade" }}
          >
            <Stack.Screen name="MainTabs" component={MainTabs} />
            <Stack.Screen name="Invitations" component={InvitationsScreen} />
            <Stack.Screen name="AcceptInvite" component={AcceptInviteScreen} />
            <Stack.Screen name="Units" component={UnitsScreen} />
            <Stack.Screen name="Directory" component={DirectoryScreen} />
          </Stack.Navigator>
        </AppSessionProvider>
      ) : (
        <Stack.Navigator
          key="auth-stack"
          initialRouteName="Login"
          screenOptions={{ headerShown: false, animation: "fade" }}
        >
          <Stack.Screen name="Login">
            {(props) => (
              <LoginScreen
                {...props}
                onAuthSuccess={handleAuthSuccess}
                onGoRegister={() => props.navigation.navigate("Register")}
              />
            )}
          </Stack.Screen>

          <Stack.Screen name="Register">
            {(props) => (
              <RegisterScreen
                {...props}
                onAuthSuccess={handleAuthSuccess}
                onGoLogin={() => props.navigation.replace("Login")}
              />
            )}
          </Stack.Screen>
        </Stack.Navigator>
      )}
      <StatusBar style={token ? "dark" : "light"} />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingScreen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: palette.background,
  },
});
