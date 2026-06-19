import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import sdk from "../lib/tsafv-sdk";

export default function UnitsScreen({ route }) {
  const token = route.params?.token;
  const [items, setItems] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const res = await sdk.getUnits(token);
      if (!mounted) return;
      if (res.status === 200) setItems(res.data || []);
      else setItems([]);
    })();
    return () => (mounted = false);
  }, [token]);

  if (items === null) return <ActivityIndicator style={{ flex: 1 }} />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Unidades</Text>
      <FlatList
        data={items}
        keyExtractor={(i) => String(i.id || Math.random())}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.large}>
              {item.placa || item.name || item.id}
            </Text>
            <Text>{item.modelo || item.description || ""}</Text>
          </View>
        )}
        ListEmptyComponent={<Text>No hay unidades</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 18, marginBottom: 12 },
  row: { padding: 8, borderBottomWidth: 1, borderColor: "#eee" },
  large: { fontWeight: "600" },
});
