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
import CreateAssociationScreen from "./src/screens/CreateAssociationScreen";
import CreateInvitationScreen from "./src/screens/CreateInvitationScreen";
import FiscalRecordFormScreen from "./src/screens/FiscalRecordFormScreen";
import AssociationInvitationsScreen from "./src/screens/AssociationInvitationsScreen";
import OnboardingScreen from "./src/screens/OnboardingScreen";
import MainTabs from "./src/navigation/MainTabs";
import {
  getHasSeenOnboarding,
  getToken as getStoredToken,
  deleteToken as removeStoredToken,
  setHasSeenOnboarding,
} from "./src/lib/authStore";
import { startTokenMonitor, stopTokenMonitor } from "./src/lib/authManager";
import { AppSessionProvider } from "./src/context/AppSessionContext";
import { palette } from "./src/theme/appTheme";

const navigationRef = createNavigationContainerRef();

const Stack = createNativeStackNavigator();

export default function App() {
  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const [token, setToken] = useState(null);
  const [hasSeenOnboarding, setHasSeenOnboardingState] = useState(true);

  useEffect(() => {
    (async () => {
      const [t, onboardingSeen] = await Promise.all([
        getStoredToken(),
        getHasSeenOnboarding(),
      ]);
      if (t) {
        setToken(t);
      }
      setHasSeenOnboardingState(onboardingSeen);
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

  const handleCompleteOnboarding = async () => {
    await setHasSeenOnboarding();
    setHasSeenOnboardingState(true);
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
            <Stack.Screen
              name="CreateAssociation"
              component={CreateAssociationScreen}
            />
            <Stack.Screen
              name="CreateInvitation"
              component={CreateInvitationScreen}
            />
            <Stack.Screen
              name="CreateFiscalRecord"
              component={FiscalRecordFormScreen}
            />
            <Stack.Screen
              name="AssociationInvitations"
              component={AssociationInvitationsScreen}
            />
          </Stack.Navigator>
        </AppSessionProvider>
      ) : (
        <Stack.Navigator
          key="auth-stack"
          initialRouteName={hasSeenOnboarding ? "Login" : "Onboarding"}
          screenOptions={{ headerShown: false, animation: "fade" }}
        >
          {!hasSeenOnboarding ? (
            <Stack.Screen name="Onboarding">
              {() => <OnboardingScreen onDone={handleCompleteOnboarding} />}
            </Stack.Screen>
          ) : null}
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
