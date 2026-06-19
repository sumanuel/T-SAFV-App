import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, ActivityIndicator, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import HomeScreen from "./src/screens/HomeScreen";
import AcceptInviteScreen from "./src/screens/AcceptInviteScreen";
import InvitationsScreen from "./src/screens/InvitationsScreen";
import UnitsScreen from "./src/screens/UnitsScreen";
import {
  getToken as getStoredToken,
  setToken as storeToken,
  deleteToken as removeStoredToken,
} from "./src/lib/authStore";

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
  }, []);

  if (!initialRoute) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute}>
        <Stack.Screen name="Login">
          {(props) => (
            <LoginScreen
              {...props}
              onLoginSuccess={async (t) => {
                await storeToken(t);
                setToken(t);
                props.navigation.replace("Home", { token: t });
              }}
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
