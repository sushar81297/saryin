import { FlatList, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";

import { Card } from "react-native-paper";

export default function PriceHistory({ route, navigation }) {
  const { itemId } = route.params;

  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fakeHistoryData = {
      1: [
        { date: "2025-04-27T02:30:00.000Z", price: 12 },
        { date: "2025-04-26T02:30:00.000Z", price: 15 },
      ],
      2: [
        { date: "2025-04-28T02:30:00.000Z", price: 4 },
        { date: "2025-04-27T02:30:00.000Z", price: 5 },
      ],
      3: [
        { date: "2025-04-29T02:30:00.000Z", price: 25 },
        { date: "2025-04-22T02:30:00.000Z", price: 30 },
      ],
      4: [
        { date: "2025-04-26T02:30:00.000Z", price: 45 },
        { date: "2025-04-26T02:20:00.000Z", price: 50 },
      ],
    };

    setHistory(fakeHistoryData[itemId] || []);
  }, [itemId]);

  const renderItem = ({ item }) => (
    <Card style={styles.card}>
      <Card.Content style={styles.cardContent}>
        <Text style={styles.dateText}>
          {new Date(item.date).toLocaleString()}
        </Text>
        <Text style={styles.priceText}>${item.price}</Text>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={history}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No price history available.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f8f9fa",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  card: {
    marginBottom: 12,
    borderRadius: 12,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    overflow: "hidden",
  },
  cardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  dateText: {
    fontSize: 16,
    color: "#333",
  },
  priceText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2196F3",
  },
  emptyText: {
    marginTop: 50,
    textAlign: "center",
    fontSize: 16,
    color: "#999",
  },
});
