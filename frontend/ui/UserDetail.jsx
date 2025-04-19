import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import {
  Avatar,
  Card,
  IconButton,
  Paragraph,
  Text,
  Title,
} from "react-native-paper";
import React, { useCallback, useEffect, useState } from "react";

import BeanCreditDialog from "../components/beanDetail/CreditDialog";
import BeanDebitDialog from "../components/beanDetail/DebitDialog";
import BeanSummary from "../components/beanDetail/BeanSummary";
import BeanTransactionHistory from "../components/beanDetail/TransactionHistory";
import CreditDialog from "../components/userDetail/CreditDialog";
import DebitDialog from "../components/userDetail/DebitDialog";
import EditUserDialog from "../components/userDetail/EditUserDialog";
import TransactionHistory from "../components/userDetail/TransactionHistory";
import UserSummary from "../components/userDetail/UserSummary";
import axios from "axios";
import { useFocusEffect } from "@react-navigation/native";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

const UserDetailScreen = ({ route }) => {
  const { userId } = route.params;
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [creditDialogVisible, setCreditDialogVisible] = useState(false);
  const [debitDialogVisible, setDebitDialogVisible] = useState(false);
  const [editDialogVisible, setEditDialogVisible] = useState(false);

  useEffect(() => {
    fetchUserDetails();
  }, [userId]);

  useFocusEffect(
    useCallback(() => {
      fetchUserDetails();
      return () => {
        // Optional cleanup if needed
      };
    }, [userId])
  );

  const fetchUserDetails = async () => {
    try {
      const response = await axios.get(`${API_URL}/users/${userId}`);
      setUser(response.data);
    } catch (err) {
      console.error("Error fetching user details:", err);
      setError("Failed to load user details");
    } finally {
      setLoading(false);
    }
  };

  const handleAddCredit = async (data) => {
    try {
      await axios.post(`${API_URL}/balance`, {
        credit: parseFloat(data.creditAmount),
        debit: 0,
        userId: userId,
        remark: data.remark,
      });
      fetchUserDetails();
      setCreditDialogVisible(false);
    } catch (err) {
      console.error("Error adding credit:", err);
      Alert.prompt("Error");
    }
  };

  const handleAddDebit = async (data) => {
    try {
      await axios.post(`${API_URL}/balance`, {
        credit: 0,
        debit: parseFloat(data.debitAmount),
        userId: userId,
        remark: data.remark,
        currentPrice: parseFloat(data.currentPrice) || 0,
      });
      fetchUserDetails();
      setDebitDialogVisible(false);
    } catch (err) {
      console.error("Error adding debit:", err);
      Alert.prompt("Error");
    }
  };

  const handleEditUser = async (name, phoneNumber) => {
    try {
      await axios.put(`${API_URL}/users/${userId}`, {
        name,
        phoneNumber,
      });
      fetchUserDetails();
      setEditDialogVisible(false);
    } catch (err) {
      console.error("Error updating user:", err);
      Alert.alert("Error", "Failed to update user information");
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>{error}</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.centered}>
        <Text>User not found</Text>
      </View>
    );
  }

  const initials = user.name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  return (
    <>
      <ScrollView style={styles.container}>
        <Card style={styles.card}>
          <View style={styles.headerContainer}>
            <Avatar.Text size={80} label={initials} style={styles.avatar} />
            <View style={styles.userInfo}>
              <Title style={styles.name}>{user.name}</Title>
              <Paragraph style={styles.phone}>{user.phoneNumber}</Paragraph>
            </View>
            <IconButton
              icon="pencil"
              size={24}
              onPress={() => setEditDialogVisible(true)}
            />
          </View>

          {user.type && user.type === "bean" ? (
            <>
              <BeanSummary
                user={user}
                onCreditPress={() => setCreditDialogVisible(true)}
                onDebitPress={() => setDebitDialogVisible(true)}
              />
              <BeanTransactionHistory
                balances={user.balance}
                onBalanceDeleted={fetchUserDetails}
              />
            </>
          ) : (
            <>
              <UserSummary
                user={user}
                onCreditPress={() => setCreditDialogVisible(true)}
                onDebitPress={() => setDebitDialogVisible(true)}
              />

              <TransactionHistory
                balances={user.balance}
                onBalanceDeleted={fetchUserDetails}
              />
            </>
          )}
        </Card>
      </ScrollView>

      {user.type && user.type === "bean" ? (
        <>
          <BeanCreditDialog
            visible={creditDialogVisible}
            onDismiss={() => setCreditDialogVisible(false)}
            onSubmit={handleAddCredit}
          />
          <BeanDebitDialog
            visible={debitDialogVisible}
            onDismiss={() => setDebitDialogVisible(false)}
            onSubmit={handleAddDebit}
          />
        </>
      ) : (
        <>
          <CreditDialog
            visible={creditDialogVisible}
            onDismiss={() => setCreditDialogVisible(false)}
            onSubmit={handleAddCredit}
          />
          <DebitDialog
            visible={debitDialogVisible}
            onDismiss={() => setDebitDialogVisible(false)}
            onSubmit={handleAddDebit}
          />
        </>
      )}

      <EditUserDialog
        visible={editDialogVisible}
        onDismiss={() => setEditDialogVisible(false)}
        onSubmit={handleEditUser}
        user={user}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 10,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    marginBottom: 10,
    padding: 10,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  avatar: {
    marginRight: 20,
    backgroundColor: "#2196F3",
  },
  userInfo: {
    flex: 1,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
  },
  phone: {
    fontSize: 16,
    color: "#757575",
  },
  section: {
    marginTop: 15,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 10,
  },
});

export default UserDetailScreen;
