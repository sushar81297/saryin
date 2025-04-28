import {
  FlatList,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import axios from "../api/axiosConfig";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Card, Button } from "react-native-paper";
import DeleteConfirmDialog from "../components/common/DeleteConfirmDialog";
import PriceDialog from "../components/price/PriceDialog";

export default function PriceHistory({ route }) {
  const { id, name } = route.params;
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [visible, setVisible] = useState(false);
  const [itemName, setItemName] = useState(name);
  const [itemPrice, setItemPrice] = useState("");
  const [history, setHistory] = useState([]);
  useEffect(() => {
    fetchItem();
  }, [id]);

  const fetchItem = async () => {
    try {
      const response = await axios.get(`/inventory/${id}`);
      setHistory(response.data.prices);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const onDelete = (item) => {
    setSelectedId(item._id);
    setDeleteDialogVisible(true);
  };

  const hideDialog = () => {
    setDeleteDialogVisible(false);
    setVisible(false);
    setSelectedId(null);
  };

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      const response = await axios.delete(`/inventory/${id}`);
      console.log(response.data.prices, "response");
      hideDialog();
      setIsLoading(false);
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const handleAddItem = async () => {
    if (itemName && itemPrice) {
      setVisible(false);
      try {
        await axios.put(`/inventory/update-price/${id}`, {
          name: itemName,
          price: itemPrice,
        });
        fetchItem();
        setItemPrice("");
      } catch (error) {
        console.error("Error registering user:", error);
      }
    }
  };

  const renderItem = ({ item }) => (
    <Card style={styles.card}>
      <Card.Content style={styles.cardContent}>
        <Text style={styles.dateText}>
          {new Date(item.changedAt).toLocaleString()}
        </Text>
        <Text style={styles.priceText}>{item.value} ကျပ်</Text>

        <View style={styles.iconContainer}>
          <TouchableOpacity onPress={() => onDelete(item)}>
            <Icon name="trash-can" size={24} color="red" style={styles.icon} />
          </TouchableOpacity>
        </View>
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
          onPress={() => setVisible(true)}
        >
          အသစ်ထည့်ရန်
        </Button>
      </View>
      <Text style={styles.title}>{name}</Text>
      <FlatList
        data={history}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No price history available.</Text>
        }
      />

      <DeleteConfirmDialog
        visible={deleteDialogVisible}
        onDismiss={hideDialog}
        onConfirm={handleDelete}
        isDeleting={isLoading}
      />

      <PriceDialog
        visible={visible}
        hideDialog={hideDialog}
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
    padding: 16,
    backgroundColor: "#f8f9fa",
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
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
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
