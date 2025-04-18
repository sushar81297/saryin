import {
  Button,
  Dialog,
  Portal,
  RadioButton,
  TextInput,
} from "react-native-paper";
import { StyleSheet, Text, View } from "react-native";

import React from "react";
import { useState } from "react";

const UserRegistrationDialog = ({
  visible,
  hideDialog,
  newUser,
  handleInputChange,
  handleRegisterUser,
  registering,
  registrationError,
}) => {
  const [transactionType, setTransactionType] = useState("debit");
  return (
    <Portal>
      <Dialog visible={visible} onDismiss={hideDialog}>
        <Dialog.Title>အသစ်ထည့်ရန်</Dialog.Title>
        <Dialog.Content>
          <TextInput
            label="နာမည်"
            value={newUser.name}
            onChangeText={(text) => handleInputChange("name", text)}
            style={styles.input}
            mode="outlined"
          />
          <TextInput
            label="ဖုန်းနံပါတ်"
            value={newUser.phoneNumber}
            onChangeText={(text) => handleInputChange("phoneNumber", text)}
            style={styles.input}
            mode="outlined"
            keyboardType="phone-pad"
          />

          <Text style={styles.radioLabel}>‌ငွေစာရင်း အမျိုးအစား :</Text>
          <RadioButton.Group
            onValueChange={(value) => setTransactionType(value)}
            value={transactionType || "debit"}
          >
            <View style={styles.radioContainer}>
              <View style={styles.radioOption}>
                <View style={styles.radioOption}>
                  <RadioButton value="debit" />
                  <Text>အကြွေး</Text>
                </View>
                <RadioButton value="credit" />
                <Text>ဆပ်ငွေ</Text>
              </View>
            </View>
          </RadioButton.Group>

          {transactionType === "credit" ? (
            <TextInput
              label="ဆပ်ငွေ"
              value={newUser.creditAmount}
              onChangeText={(text) => handleInputChange("totalCredit", text)}
              style={styles.input}
              mode="outlined"
              keyboardType="numeric"
            />
          ) : (
            <TextInput
              label="အကြွေး"
              value={newUser.debitAmount}
              onChangeText={(text) => handleInputChange("totalDebit", text)}
              style={styles.input}
              mode="outlined"
              keyboardType="numeric"
            />
          )}

          <TextInput
            label="မှတ်ချက်"
            value={newUser.remark}
            onChangeText={(text) => handleInputChange("remark", text)}
            style={styles.input}
            mode="outlined"
            multiline
            numberOfLines={3}
          />
          {registrationError ? (
            <Text style={styles.errorText}>{registrationError}</Text>
          ) : null}
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={hideDialog}>ဖျက်သိမ်းမည် </Button>
          <Button
            onPress={handleRegisterUser}
            loading={registering}
            disabled={registering}
          >
            သိမ်းမည်
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

const styles = StyleSheet.create({
  input: {
    marginBottom: 12,
  },
  errorText: {
    color: "red",
    marginTop: 10,
  },
  radioLabel: {
    marginBottom: 8,
    fontSize: 16,
  },
  radioContainer: {
    flexDirection: "row",
    marginBottom: 12,
  },
  radioOption: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
  },
});

export default UserRegistrationDialog;
