import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  Avatar,
  Card,
  Divider,
  IconButton,
  Paragraph,
  Title,
} from "react-native-paper";
import React, { useState } from "react";

import UserDeleteDialog from "./UserDeleteDialog";
import axios from "axios";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

const UserList = ({ users, loading, navigation, onRefresh }) => {
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const showDeleteDialog = (user) => {
    setUserToDelete(user);
    setDeleteDialogVisible(true);
  };

  const hideDeleteDialog = () => {
    setDeleteDialogVisible(false);
    setUserToDelete(null);
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    setIsDeleting(true);
    try {
      await axios.delete(`${API_URL}/users/${userToDelete._id}`);
      hideDeleteDialog();
      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      Alert.prompt("Error");
    } finally {
      setIsDeleting(false);
    }
  };

  const renderUserItem = ({ item }) => {
    const initials = item.name
      ? item.name
          .split(" ")
          .map((word) => word[0])
          .join("")
          .toUpperCase()
      : "?";

    return (
      <TouchableOpacity
        onPress={() => navigation.navigate("UserDetail", { userId: item._id })}
      >
        <Card style={styles.userCard}>
          <Card.Content style={styles.userCardContent}>
            <Avatar.Text size={50} label={initials} style={styles.avatar} />
            {item.type && item.type === "bean" ? (
              <View style={styles.userInfo}>
                {item.name && <Title>{item.name}</Title>}
                {item.phoneNumber && <Paragraph>{item.phoneNumber}</Paragraph>}
                <View style={styles.financialInfo}>
                  <Paragraph>
                    <Text style={styles.label}>
                      {Math.abs(item.totalAmount)} တင်း{" "}
                      {`(${item.totalAmount >= 0 ? "အပ်ပဲ" : "‌ရောင်းပဲ"})`}
                    </Text>
                  </Paragraph>
                </View>
              </View>
            ) : (
              <View style={styles.userInfo}>
                {item.name && <Title>{item.name}</Title>}
                {item.phoneNumber && <Paragraph>{item.phoneNumber}</Paragraph>}
                <View style={styles.financialInfo}>
                  <Paragraph>
                    <Text style={styles.label}>
                      {Math.abs(item.totalAmount)} ကျပ်{" "}
                      {`(${item.totalAmount >= 0 ? "ချန်ထားငွေ" : "အကြွေး"})`}
                    </Text>
                  </Paragraph>
                </View>
              </View>
            )}

            <IconButton
              icon="delete"
              size={24}
              iconColor="#FF5252"
              onPress={() => showDeleteDialog(item)}
            />
          </Card.Content>
        </Card>
        <Divider />
      </TouchableOpacity>
    );
  };

  if (loading) {
    return <ActivityIndicator size="large" style={styles.loader} />;
  }

  return (
    <>
      <FlatList
        data={users}
        keyExtractor={(item) => item._id}
        renderItem={renderUserItem}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>စာရင်းမရှိပါ</Text>
          </View>
        }
      />

      <UserDeleteDialog
        visible={deleteDialogVisible}
        onDismiss={hideDeleteDialog}
        onConfirm={handleDeleteUser}
        userName={userToDelete?.name}
        isDeleting={isDeleting}
      />
    </>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    flexGrow: 1,
    padding: 10,
  },
  userCard: {
    marginBottom: 8,
    elevation: 1,
  },
  userCardContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  avatar: {
    marginRight: 40,
    backgroundColor: "#2196F3",
  },
  userInfo: {
    flex: 1,
  },
  financialInfo: {
    marginTop: 5,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: "#757575",
  },
  label: {
    fontWeight: "bold",
    marginRight: 5,
  },
});

export default UserList;
