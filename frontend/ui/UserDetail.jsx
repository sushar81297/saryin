import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { Avatar, Card, Paragraph, Text, Title } from "react-native-paper";
import React, { useEffect, useState } from "react";

import CreditDialog from "../components/userDetail/CreditDialog";
import DebitDialog from "../components/userDetail/DebitDialog";
import TransactionHistory from "../components/userDetail/TransactionHistory";
import UserSummary from "../components/userDetail/UserSummary";
import axios from "axios";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

const UserDetailScreen = ({ route }) => {
  const { userId } = route.params;
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [creditDialogVisible, setCreditDialogVisible] = useState(false);
  const [debitDialogVisible, setDebitDialogVisible] = useState(false);

  useEffect(() => {
    fetchUserDetails();
  }, [userId]);

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

  const handleAddCredit = async (amount) => {
    try {
      await axios.post(`${API_URL}/balance`, {
        credit: parseFloat(amount),
        debit: 0,
        userId: userId,
      });
      fetchUserDetails();
      setCreditDialogVisible(false);
    } catch (err) {
      console.error("Error adding credit:", err);
      Alert.prompt("Error");
    }
  };

  const handleAddDebit = async (amount) => {
    try {
      await axios.post(`${API_URL}/balance`, {
        credit: 0,
        debit: parseFloat(amount),
        userId: userId,
      });
      fetchUserDetails();
      setDebitDialogVisible(false);
    } catch (err) {
      console.error("Error adding debit:", err);
      Alert.prompt("Error");
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
          </View>

          {user.remark && (
            <Card.Content style={styles.section}>
              <Title style={styles.sectionTitle}>Remarks</Title>
              <Paragraph>{user.remark}</Paragraph>
            </Card.Content>
          )}

          <UserSummary
            user={user}
            onCreditPress={() => setCreditDialogVisible(true)}
            onDebitPress={() => setDebitDialogVisible(true)}
          />

          <TransactionHistory balances={user.balance} />
        </Card>
      </ScrollView>

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
