import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { apiPost } from "../config/api";

export default function AcceptInviteScreen({ token, onDone }) {
  const [inviteToken, setInviteToken] = useState("");

  const handleAccept = async () => {
    const res = await apiPost(
      "/api/invitaciones/respond",
      { token: inviteToken },
      token,
    );
    if (res.status === 200) {
      Alert.alert("Éxito", "Invitación aceptada");
      onDone();
    } else {
      Alert.alert("Error", res.data?.message || "Error aceptando invitación");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Aceptar Invitación</Text>
      <TextInput
        placeholder="Token de invitación"
        style={styles.input}
        value={inviteToken}
        onChangeText={setInviteToken}
        autoCapitalize="none"
      />
      <Button title="Aceptar" onPress={handleAccept} />
      <View style={{ height: 8 }} />
      <Button title="Volver" onPress={onDone} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, justifyContent: "center" },
  title: { fontSize: 20, marginBottom: 12, textAlign: "center" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    marginBottom: 8,
    borderRadius: 4,
  },
});
