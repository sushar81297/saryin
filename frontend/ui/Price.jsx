import { Button, Card, IconButton, Searchbar } from "react-native-paper";
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import React, { useCallback, useEffect, useState } from "react";
import DeleteConfirmDialog from "../components/common/DeleteConfirmDialog";
import PriceDialog from "../components/price/PriceDialog";
import UserPagination from "../components/home/UserPagination";
import axios from "../api/axiosConfig";
import { useFocusEffect } from "@react-navigation/native";

export default function Price({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [visible, setVisible] = useState(false);
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
  const [searchQuery, setSearchQuery] = useState("");

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
    }, []),
  );

  const handleAddItem = async () => {
    if (itemName && itemPrice) {
      const newItem = {
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
      }
    }
  };

  const handlePageChange = (newPage) => {
    fetchItem(newPage);
  };

  const handleSearch = () => {
    fetchItem(1, searchQuery);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    fetchItem();
  };

  const onDelete = (item) => {
    setSelectedId(item.id);
    setVisible(true);
  };

  const hideDialog = () => {
    setVisible(false);
    setSelectedId(null);
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/inventory/${selectedId}`);
      fetchItem();
      hideDialog();
      setLoading(false);
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const renderItem = ({ item }) => (
    <Card
      style={styles.card}
      onPress={() =>
        navigation.navigate("PriceHistory", {
          id: item.id,
          name: item.name,
        })
      }
    >
      <Card.Content style={styles.cardContent}>
        <View style={styles.itemText}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.price}>{item.latestPrice} ကျပ်</Text>
        </View>
        {/* <IconButton icon="chevron-right" size={24} color="black" /> */}
        <TouchableOpacity onPress={() => onDelete(item)}>
          <Icon name="trash-can" size={24} color="red" style={styles.icon} />
        </TouchableOpacity>
      </Card.Content>
    </Card>
  );

  if (loading) {
    return <ActivityIndicator size="large" style={styles.loader} />;
  }

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
            onChangeText={setSearchQuery}
            value={searchQuery}
            onSubmitEditing={handleSearch}
            onClearIconPress={handleClearSearch}
          />
          <IconButton
            icon="magnify"
            size={24}
            iconColor="#FFFFFF"
            onPress={handleSearch}
            style={styles.searchButton}
          />
        </View>
      </View>

      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>စာရင်းမရှိပါ</Text>
          </View>
        }
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

      <DeleteConfirmDialog
        visible={visible}
        onDismiss={hideDialog}
        onConfirm={handleDelete}
        isDeleting={loading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  stickyHeader: {
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    elevation: 3,
    zIndex: 1000,
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
  listContainer: {
    flexGrow: 1,
    padding: 10,
  },
  card: {
    marginBottom: 8,
    borderRadius: 12,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
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
