import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import sdk from "../lib/tsafv-sdk";
import { setToken as storeToken } from "../lib/authStore";

export default function LoginScreen({ navigation, onGoRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const res = await sdk.login(email, password);
    if (res.status === 200 && res.data?.token) {
      const t = res.data.token;
      await storeToken(t);
      navigation.replace("Home", { token: t });
    } else {
      Alert.alert("Error", res.data?.message || "Error logging in");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        placeholder="Email"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Password"
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Iniciar sesión" onPress={handleLogin} />
      <View style={{ height: 8 }} />
      <Button title="Registrarse" onPress={onGoRegister} />
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
