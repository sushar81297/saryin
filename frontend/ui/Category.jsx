import { Card, IconButton, Text, useTheme } from "react-native-paper";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";

import { getToken } from "../auth/tokenStorage";
import React, { useEffect, useState } from "react";

const categoryData = [
  {
    id: "1",
    name: "အကြွေးစာရင်း",
    icon: "cash",
    routeName: "Money",
    permission: "normal",
  },
  {
    id: "2",
    name: "ပစ္စည်းစာရင်း",
    icon: "tag",
    routeName: "Price",
    permission: "price",
  },
  {
    id: "3",
    name: "ပဲစာရင်း",
    icon: "seed",
    routeName: "Bean",
    permission: "bean",
  },
  // {
  //   id: "4",
  //   name: "စာရင်း",
  //   icon: "tshirt-crew",
  //   routeName: "Home",
  //   permission: "tailor",
  // },
];

export default function CategoryScreen({ navigation }) {
  const theme = useTheme();
  const [categories, setCategories] = useState(categoryData);
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
  const checkPermission = async () => {
    const response = await getToken("userCredential");
    const userData = response ? JSON.parse(response) : null;
    if (userData && userData.permissions.length > 1) {
      setCategories(
        categories.filter((item) =>
          userData.permissions.includes(item.permission),
        ),
      );
    }
  };

  useEffect(() => {
    checkPermission();
  }, []);

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
