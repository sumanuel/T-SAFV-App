import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, ActivityIndicator, View } from "react-native";
import {
  NavigationContainer,
  createNavigationContainerRef,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import HomeScreen from "./src/screens/HomeScreen";
import AcceptInviteScreen from "./src/screens/AcceptInviteScreen";
import InvitationsScreen from "./src/screens/InvitationsScreen";
import UnitsScreen from "./src/screens/UnitsScreen";
import {
  getToken as getStoredToken,
  deleteToken as removeStoredToken,
} from "./src/lib/authStore";
import { startTokenMonitor, stopTokenMonitor } from "./src/lib/authManager";

const navigationRef = createNavigationContainerRef();

const Stack = createNativeStackNavigator();

export default function App() {
  const [initialRoute, setInitialRoute] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    (async () => {
      const t = await getStoredToken();
      if (t) {
        setToken(t);
        setInitialRoute("Home");
      } else {
        setInitialRoute("Login");
      }
    })();
    startTokenMonitor(async () => {
      await removeStoredToken();
      if (navigationRef.isReady()) {
        navigationRef.reset({ index: 0, routes: [{ name: "Login" }] });
      }
    });

    return () => stopTokenMonitor();
  }, []);

  if (!initialRoute) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator initialRouteName={initialRoute}>
        <Stack.Screen name="Login">
          {(props) => (
            <LoginScreen
              {...props}
              onGoRegister={() => props.navigation.navigate("Register")}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="Register">
          {(props) => (
            <RegisterScreen
              {...props}
              onGoLogin={() => props.navigation.replace("Login")}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="Home">
          {(props) => (
            <HomeScreen
              {...props}
              route={{ ...props.route, params: { token } }}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="AcceptInvite">
          {(props) => (
            <AcceptInviteScreen
              {...props}
              token={token}
              onDone={() => props.navigation.goBack()}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="Invitations">
          {(props) => (
            <InvitationsScreen
              {...props}
              route={{ ...props.route, params: { token } }}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="Units" component={UnitsScreen} />
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({});
