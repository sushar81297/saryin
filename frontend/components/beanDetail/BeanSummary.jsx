import { Button, Card, Text, Title } from "react-native-paper";
import { StyleSheet, View } from "react-native";

import React from "react";

const UserSummary = ({ user, onCreditPress, onDebitPress }) => {
  return (
    <>
      <Card.Content style={styles.section}>
        <Title style={styles.sectionTitle}>အနှစ်ချုပ်</Title>
        <View style={styles.balanceSummary}>
          <Text style={styles.summaryItem}>
            အပ်ပဲ : {user.totalCredit || 0} တင်း
          </Text>
          <Text style={styles.summaryItem}>
            ရောင်းပဲ : {user.totalDebit || 0} တင်း
          </Text>
          <Text style={[styles.summaryItem, styles.totalAmount]}>
            လက်ကျန် : {Math.abs(user.totalAmount)} တင်း{" "}
            {`(${user.totalAmount >= 0 ? "အပ်ပဲ" : "ရရန်ပဲ"})`}
          </Text>
        </View>
      </Card.Content>

      <Card.Content style={styles.actionButtons}>
        <Button
          mode="contained"
          onPress={onCreditPress}
          style={[styles.actionButton, styles.creditButton]}
        >
          ပဲအပ်မည်
        </Button>
        <Button
          mode="contained"
          onPress={onDebitPress}
          style={[styles.actionButton, styles.debitButton]}
        >
          ပဲရောင်းမည်
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
