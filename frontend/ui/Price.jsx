import { Button, Card, IconButton, Searchbar } from "react-native-paper";
import { FlatList, StyleSheet, Text, View } from "react-native";
import React, { useCallback, useEffect, useState } from "react";

import PriceDialog from "../components/price/PriceDialog";
import UserPagination from "../components/home/UserPagination";
import axios from "../api/axiosConfig";
import { useFocusEffect } from "@react-navigation/native";

export default function Price({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  });
  const [items, setItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [itemName, setItemName] = useState("");
  const [itemPrice, setItemPrice] = useState("");

  const fetchItem = async (page = 1, name = "") => {
    setLoading(true);
    try {
      const response = await axios.get(`/inventory`, {
        params: {
          page,
          limit: 10,
          name,
        },
      });
      setItems(response.data.items);
      setPagination({
        currentPage: response.data.currentPage,
        totalPages: response.data.totalPages,
        totalItems: response.data.totalItems,
        itemsPerPage: 10,
      });
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItem();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchItem();
      return () => {};
    }, [])
  );

  const handleAddItem = async () => {
    if (itemName && itemPrice) {
      const newItem = {
        _id: item._id,
        name: itemName,
        latestPrice: parseFloat(itemPrice),
      };
      setItems([...items, newItem]);
      setShowForm(false);
      setItemName("");
      setItemPrice("");
      try {
        await axios.post(`/inventory/create`, {
          name: itemName,
          price: itemPrice,
        });
        fetchItem();
      } catch (error) {
        console.error("Error registering user:", error);
        setError("Something went wrong. Please try again.");
      }
    }
  };

  const handlePageChange = (newPage) => {
    fetchItem(newPage, nameFilter);
  };

  const renderItem = ({ item }) => (
    <Card
      style={styles.card}
      onPress={() => navigation.navigate("PriceHistory", { itemId: item._id })}
    >
      <Card.Content style={styles.cardContent}>
        <View style={styles.itemText}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.price}>{item.latestPrice} ကျပ်</Text>
        </View>
        <IconButton icon="chevron-right" size={24} color="black" />
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.stickyHeader}>
        <Button
          mode="contained"
          icon="plus"
          style={styles.addButton}
          onPress={() => setShowForm(true)}
        >
          အသစ်ထည့်ရန်
        </Button>

        <View style={styles.searchContainer}>
          <Searchbar
            placeholder="ပစ္စည်းအမည် ရိုက်ထည့်ပါ"
            style={styles.searchBar}
          />
          <IconButton
            icon="magnify"
            size={24}
            iconColor="#FFFFFF"
            style={styles.searchButton}
          />
        </View>
      </View>

      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />

      <UserPagination
        pagination={pagination}
        handlePageChange={handlePageChange}
      />

      <PriceDialog
        visible={showForm}
        hideDialog={() => setShowForm(false)}
        addItem={handleAddItem}
        setItemName={setItemName}
        setItemPrice={setItemPrice}
        itemPrice={itemPrice}
        itemName={itemName}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    padding: 10,
  },
  stickyHeader: {
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    elevation: 3,
    zIndex: 1000,
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: "#2196F3",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 20,
  },
  searchBar: {
    flex: 1,
    marginRight: 5,
    elevation: 0,
  },
  searchButton: {
    backgroundColor: "#2196F3",
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
  itemText: {
    flex: 1,
  },
  itemName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  price: {
    fontSize: 16,
    color: "#2196F3",
    marginTop: 4,
  },
  formContainer: {
    marginTop: 20,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
    elevation: 3,
  },
  formHeader: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
    color: "#333",
  },
  input: {
    marginBottom: 16,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 12,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  submitButton: {
    flex: 1,
    marginRight: 8,
  },
  cancelButton: {
    flex: 1,
    marginLeft: 8,
  },
});
