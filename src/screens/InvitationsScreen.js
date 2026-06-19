import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import sdk from "../lib/tsafv-sdk";

export default function InvitationsScreen({ route }) {
  const token = route.params?.token;
  const [items, setItems] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const res = await sdk.getMyInvitations(token);
      if (!mounted) return;
      if (res.status === 200) setItems(res.data || []);
      else setItems([]);
    })();
    return () => (mounted = false);
  }, [token]);

  if (items === null) return <ActivityIndicator style={{ flex: 1 }} />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Invitaciones</Text>
      <FlatList
        data={items}
        keyExtractor={(i) => String(i.id || i.token || Math.random())}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.large}>{item.email || item.target_email}</Text>
            <Text>{item.estado || item.status || ""}</Text>
          </View>
        )}
        ListEmptyComponent={<Text>No hay invitaciones</Text>}
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
