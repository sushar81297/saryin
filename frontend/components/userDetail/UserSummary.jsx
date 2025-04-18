import { Button, Card, Text, Title } from "react-native-paper";
import { StyleSheet, View } from "react-native";

import React from "react";

const UserSummary = ({ user, onCreditPress, onDebitPress }) => {
  return (
    <>
      <Card.Content style={styles.section}>
        <Title style={styles.sectionTitle}>
          ‌ငွေစာရင်း အနှစ်ချုပ် (စုစုပေါင်း)
        </Title>
        <View style={styles.balanceSummary}>
          <Text style={styles.summaryItem}>
            ချေးငွေ : {user.totalDebit || 0} ကျပ်
          </Text>
          <Text style={styles.summaryItem}>
            ဆပ်ငွေ : {user.totalCredit || 0} ကျပ်
          </Text>
          <Text style={[styles.summaryItem, styles.totalAmount]}>
            ကျန်ငွေ : {Math.abs(user.totalAmount)} ကျပ်{" "}
            {`(${user.totalAmount >= 0 ? "ချန်ထားငွေ" : "အကြွေး"})`}
          </Text>
        </View>
      </Card.Content>

      <Card.Content style={styles.actionButtons}>
        <Button
          mode="contained"
          onPress={onCreditPress}
          style={[styles.actionButton, styles.creditButton]}
        >
          အကြွေးဆပ်ရန်
        </Button>
        <Button
          mode="contained"
          onPress={onDebitPress}
          style={[styles.actionButton, styles.debitButton]}
        >
          အကြွေးယူရန်
        </Button>
      </Card.Content>
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
  balanceSummary: {
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 5,
    marginBottom: 10,
  },
  summaryItem: {
    fontSize: 16,
    marginBottom: 5,
  },
  totalAmount: {
    fontWeight: "bold",
    fontSize: 18,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 5,
  },
  creditButton: {
    backgroundColor: "#4CAF50",
  },
  debitButton: {
    backgroundColor: "#F44336",
  },
});

export default UserSummary;
