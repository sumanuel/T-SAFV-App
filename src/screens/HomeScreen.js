import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";

export default function HomeScreen({ token, onLogout, onAcceptInvite }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>
      <Text>Token: {token ? token.substring(0, 40) + "..." : "no token"}</Text>
      <View style={{ height: 12 }} />
      <Button title="Aceptar invitación" onPress={onAcceptInvite} />
      <View style={{ height: 8 }} />
      <Button title="Cerrar sesión" onPress={onLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, justifyContent: "center" },
  title: { fontSize: 20, marginBottom: 12, textAlign: "center" },
});
