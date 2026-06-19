import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import sdk from "../lib/tsafv-sdk";
import { setToken as storeToken } from "../lib/authStore";

export default function RegisterScreen({ navigation, onGoLogin }) {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    const res = await sdk.register({ nombre, email, password });
    if (res.status === 201 || res.status === 200) {
      // try auto-login
      const loginRes = await sdk.login(email, password);
      if (loginRes.status === 200 && loginRes.data?.token) {
        const t = loginRes.data.token;
        await storeToken(t);
        navigation.replace("Home", { token: t });
        return;
      }
      Alert.alert("Registro", "Usuario creado. Por favor inicia sesión.");
      if (onGoLogin) onGoLogin();
    } else {
      Alert.alert("Error", res.data?.message || "Error registrando usuario");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registro</Text>
      <TextInput
        placeholder="Nombre"
        style={styles.input}
        value={nombre}
        onChangeText={setNombre}
      />
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
      <Button title="Registrar" onPress={handleRegister} />
      <View style={{ height: 8 }} />
      <Button title="Ir a Login" onPress={onGoLogin} />
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
