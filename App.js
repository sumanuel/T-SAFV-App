import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import HomeScreen from "./src/screens/HomeScreen";
import AcceptInviteScreen from "./src/screens/AcceptInviteScreen";

export default function App() {
  const [screen, setScreen] = useState("login");
  const [token, setToken] = useState(null);

  if (screen === "login") {
    return (
      <View style={styles.container}>
        <LoginScreen
          onLoginSuccess={(t) => {
            setToken(t);
            setScreen("home");
          }}
          onGoRegister={() => setScreen("register")}
        />
        <StatusBar style="auto" />
      </View>
    );
  }

  if (screen === "register") {
    return (
      <View style={styles.container}>
        <RegisterScreen onGoLogin={() => setScreen("login")} />
        <StatusBar style="auto" />
      </View>
    );
  }

  if (screen === "accept") {
    return (
      <View style={styles.container}>
        <AcceptInviteScreen token={token} onDone={() => setScreen("home")} />
        <StatusBar style="auto" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <HomeScreen
        token={token}
        onLogout={() => {
          setToken(null);
          setScreen("login");
        }}
        onAcceptInvite={() => setScreen("accept")}
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
