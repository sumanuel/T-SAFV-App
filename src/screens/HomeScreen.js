import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { deleteToken } from '../lib/authStore';

export default function HomeScreen({ navigation, route }) {
  const token = route.params?.token;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>
      <Text>Token: {token ? token.substring(0, 40) + '...' : 'no token'}</Text>
      <View style={{ height: 12 }} />
      <Button title="Invitaciones" onPress={() => navigation.navigate('Invitations', { token })} />
      <View style={{ height: 8 }} />
      <Button title="Unidades" onPress={() => navigation.navigate('Units', { token })} />
      <View style={{ height: 8 }} />
      <Button title="Aceptar invitación" onPress={() => navigation.navigate('AcceptInvite', { token })} />
      <View style={{ height: 8 }} />
      <Button
        title="Cerrar sesión"
        onPress={async () => {
          await deleteToken();
          navigation.replace('Login');
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, justifyContent: 'center' },
  title: { fontSize: 20, marginBottom: 12, textAlign: 'center' },
});
