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
import TransactionDeleteDialog from "../components/userDetail/TransactionDeleteDialog";
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

  const onUpdate = (item) => {
    setSelectedId(item._id);
    setVisible(true);
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
      console.log("Deleting item with ID:", selectedId);
      hideDialog();
      setIsLoading(false);
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const renderItem = ({ item }) => (
    <Card style={styles.card}>
      <Card.Content style={styles.cardContent}>
        <Text style={styles.dateText}>
          {new Date(item.changedAt).toLocaleString()}
        </Text>
        <Text style={styles.priceText}>${item.value}</Text>

        <View style={styles.iconContainer}>
          <TouchableOpacity onPress={() => onUpdate(item)}>
            <Icon name="pencil" size={24} color="blue" style={styles.icon} />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => onDelete(item)}>
            <Icon name="trash-can" size={24} color="red" style={styles.icon} />
          </TouchableOpacity>
        </View>
      </Card.Content>
    </Card>
  );

  const handleAddItem = async () => {
    if (itemName && itemPrice) {
      setVisible(false);
      setItemPrice("");
      try {
        await axios.post(`/inventory/${id}`, {
          name: itemName,
          price: itemPrice,
        });
        fetchItem();
      } catch (error) {
        console.error("Error registering user:", error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.stickyHeader}>
        <Button mode="contained" icon="plus" style={styles.addButton}>
          အသစ်ထည့်ရန်
        </Button>
      </View>
      <FlatList
        data={history}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No price history available.</Text>
        }
      />

      <TransactionDeleteDialog
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
