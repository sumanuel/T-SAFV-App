import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function UnitsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Unidades</Text>
      <Text>Lista de unidades pendiente de implementar.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 18, marginBottom: 12 },
});
