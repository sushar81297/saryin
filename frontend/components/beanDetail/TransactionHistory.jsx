import { Card, IconButton, Paragraph, Text, Title } from "react-native-paper";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";

import TransactionDeleteDialog from "./TransactionDeleteDialog";
import axios from "axios";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

const BeanTransactionHistory = ({ balances, onBalanceDeleted }) => {
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [selectedBalanceId, setSelectedBalanceId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const showDeleteDialog = (balanceId) => {
    setSelectedBalanceId(balanceId);
    setDeleteDialogVisible(true);
  };

  const hideDeleteDialog = () => {
    setDeleteDialogVisible(false);
    setSelectedBalanceId(null);
  };

  const handleDeleteBalance = async () => {
    if (!selectedBalanceId) return;

    try {
      setIsDeleting(true);
      await axios.delete(`${API_URL}/balance/${selectedBalanceId}`);
      hideDeleteDialog();
      // Notify parent component to refresh data
      if (onBalanceDeleted) {
        onBalanceDeleted();
      }
    } catch (error) {
      console.error("Error deleting transaction:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Card.Content style={styles.section}>
        <Title style={styles.sectionTitle}>စာရင်း</Title>
        {balances && balances.length > 0 ? (
          balances.map((balance, index) => (
            <View key={index} style={styles.balanceItem}>
              <View style={styles.balanceHeader}>
                {balance.credit > 0 && (
                  <Text style={styles.creditText}>
                    အပ်ပဲ : {balance.credit} တင်း
                  </Text>
                )}
                {balance.debit > 0 && (
                  <Text style={styles.debitText}>
                    ရောင်းပဲ : {balance.debit} တင်း
                  </Text>
                )}
                <IconButton
                  icon="delete"
                  size={20}
                  onPress={() => showDeleteDialog(balance._id)}
                  style={styles.deleteButton}
                />
              </View>
              {balance.currentPrice > 0 && (
                <Text style={styles.balanceDate}>
                  စျေးနှုန်း : {balance.currentPrice}
                </Text>
              )}
              {balance.remark && (
                <Text style={styles.balanceDate}>
                  မှတ်ချက် : {balance.remark}
                </Text>
              )}
              <Text style={styles.balanceDate}>
                {new Date(balance.createdAt).toLocaleString()}
              </Text>
            </View>
          ))
        ) : (
          <Paragraph>စာရင်းမရှိပါ</Paragraph>
        )}
      </Card.Content>

      <TransactionDeleteDialog
        visible={deleteDialogVisible}
        onDismiss={hideDeleteDialog}
        onConfirm={handleDeleteBalance}
        isDeleting={isDeleting}
      />
    </>
  );
};

const styles = StyleSheet.create({
  section: {
    marginTop: 15,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  balanceItem: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 5,
    marginBottom: 8,
  },
  balanceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  balanceDate: {
    color: "#757575",
    flex: 1,
  },
  deleteButton: {
    margin: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  creditText: {
    color: "#4CAF50",
    fontWeight: "bold",
  },
  debitText: {
    color: "#F44336",
    fontWeight: "bold",
  },
});

export default BeanTransactionHistory;
