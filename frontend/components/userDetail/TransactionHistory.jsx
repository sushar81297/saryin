import { Card, Paragraph, Text, Title } from "react-native-paper";
import { StyleSheet, View } from "react-native";

import React from "react";

const TransactionHistory = ({ balances }) => {
  return (
    <Card.Content style={styles.section}>
      <Title style={styles.sectionTitle}>အကြွေးစာရင်း</Title>
      {balances && balances.length > 0 ? (
        balances.map((balance, index) => (
          <View key={index} style={styles.balanceItem}>
            <Text style={styles.balanceDate}>
              {new Date(balance.createdAt).toLocaleDateString()}
            </Text>
            {balance.credit > 0 && (
              <Text style={styles.creditText}>
                ဆပ်ငွေ : {balance.credit} ကျပ်
              </Text>
            )}
            {balance.debit > 0 && (
              <Text style={styles.debitText}>
                အကြွေး : {balance.debit} ကျပ်
              </Text>
            )}
          </View>
        ))
      ) : (
        <Paragraph>စာရင်းမရှိပါ</Paragraph>
      )}
    </Card.Content>
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
  balanceDate: {
    color: "#757575",
    marginBottom: 5,
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

export default TransactionHistory;
