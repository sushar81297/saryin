import { Card, IconButton, Text, useTheme } from "react-native-paper";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";

import React from "react";

const categories = [
  { id: "1", name: "Debit", icon: "cash", routeName: "Money" },
  { id: "2", name: "Market", icon: "tag", routeName: "Price" },
  { id: "3", name: "Bean", icon: "seed", routeName: "Bean" },
  { id: "4", name: "Tailor", icon: "tshirt-crew", routeName: "Home" },
];

export default function CategoryScreen({ navigation }) {
  const theme = useTheme();

  const goToPage = (item) => {
    navigation.navigate(item.routeName);
  };

  const renderItem = ({ item }) => (
    <Card style={styles.card}>
      <Card.Content style={styles.cardContent}>
        <TouchableOpacity onPress={() => goToPage(item)}>
          <IconButton
            icon={item.icon}
            size={36}
            iconColor={theme.colors.primary}
          />
          <Text style={styles.label}>{item.name}</Text>
        </TouchableOpacity>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={categories}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={{ paddingBottom: 16 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: "#f8f9fb",
    paddingHorizontal: 16,
  },
  header: {
    marginBottom: 20,
    alignSelf: "center",
  },
  row: {
    justifyContent: "space-between",
    marginBottom: 16,
  },
  card: {
    width: "48%",
    borderRadius: 16,
    elevation: 4,
    backgroundColor: "#ffffff",
  },
  cardContent: {
    alignItems: "center",
    paddingVertical: 20,
  },
  label: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "600",
  },
});
