import { Card, IconButton, Paragraph, Text, Title } from "react-native-paper";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";

import BeanTransactionUpdateDialog from "./BeanTransactionUpdateDialog";
import DeleteConfirmDialog from "../common/DeleteConfirmDialog";
import axios from "../../api/axiosConfig";

const BeanTransactionHistory = ({ userId, balances, onBalanceDeleted }) => {
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [selectedBalanceId, setSelectedBalanceId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [editDialogVisible, setEditDialogVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedEdit, setSelectedEdit] = useState(null);

  const showDeleteDialog = (balanceId) => {
    setSelectedBalanceId(balanceId);
    setDeleteDialogVisible(true);
  };

  const showEditDialog = (balance) => {
    setSelectedEdit(balance);
    setEditDialogVisible(true);
  };

  const hideDeleteDialog = () => {
    setDeleteDialogVisible(false);
    setSelectedBalanceId(null);
  };

  const hideEditDialog = () => {
    setEditDialogVisible(false);
    setSelectedEdit(null);
  };

  const handleDeleteBalance = async () => {
    if (!selectedBalanceId) return;

    try {
      setIsDeleting(true);
      await axios.delete(`/balance/${selectedBalanceId}`);
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

  const handleEditBalance = async (data) => {
    if (!selectedEdit || !selectedEdit._id) return;

    try {
      setIsEditing(true);
      let payload = { userId };
      if (data.amount) {
        if (selectedEdit.credit) {
          payload.credit = parseFloat(data.amount);
        } else {
          payload.debit = parseFloat(data.amount);
        }
      }
      payload.remark = data.remark;
      payload.currentPrice = parseFloat(data.currentPrice);
      await axios.put(`/balance/${selectedEdit._id}`, payload);
      hideEditDialog();
      // Notify parent component to refresh data
      if (onBalanceDeleted) {
        onBalanceDeleted();
      }
    } catch (error) {
      console.error("Error deleting transaction:", error);
    } finally {
      setIsEditing(false);
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
                  icon="pencil"
                  size={20}
                  onPress={() => showEditDialog(balance)}
                  iconColor="blue"
                  style={styles.deleteButton}
                />
                <IconButton
                  icon="delete"
                  size={20}
                  onPress={() => showDeleteDialog(balance._id)}
                  iconColor="red"
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

      <DeleteConfirmDialog
        visible={deleteDialogVisible}
        onDismiss={hideDeleteDialog}
        onConfirm={handleDeleteBalance}
        isDeleting={isDeleting}
      />

      <BeanTransactionUpdateDialog
        visible={editDialogVisible}
        onDismiss={hideEditDialog}
        onSubmit={handleEditBalance}
        isEditing={isEditing}
        data={selectedEdit}
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
    width: "75%",
  },
  debitText: {
    color: "#F44336",
    fontWeight: "bold",
    width: "75%",
  },
});

export default BeanTransactionHistory;
