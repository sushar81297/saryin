import { Button, Dialog, Portal, TextInput } from "react-native-paper";
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

const PriceDialog = ({
  visible,
  hideDialog,
  addItem,
  itemName,
  setItemName,
  itemPrice,
  setItemPrice,
}) => {
  const [itemError, setItemError] = useState("");
  const [priceError, setPriceError] = useState("");
  const addItemFunc = () => {
    let valid = true;

    if (!itemName) {
      setItemError("ပစ္စည်းအမည်ထည့်ရန်လိုအပ်ပါသည်");
      valid = false;
    } else {
      setItemError("");
    }

    if (!itemPrice) {
      setPriceError("စျေးနှုန်းထည့်ရန်လိုအပ်ပါသည်");
      valid = false;
    } else {
      setPriceError("");
    }

    if (valid) {
      console.log("Username:", username);
      console.log("Password:", password);
      addItem();
    }
  };
  return (
    <Portal>
      <Dialog visible={visible} onDismiss={hideDialog}>
        <Dialog.Title>အသစ်ထည့်ရန်</Dialog.Title>
        <Dialog.Content>
          <View style={styles.formContainer}>
            <TextInput
              label="ပစ္စည်းအမည်"
              value={itemName}
              onChangeText={setItemName}
              style={styles.input}
              placeholder="ပစ္စည်းအမည်"
            />
            {itemError ? (
              <Text style={styles.errorText}>{itemError}</Text>
            ) : null}
            <TextInput
              label="စျေးနှုန်း"
              value={itemPrice}
              onChangeText={setItemPrice}
              keyboardType="numeric"
              style={styles.input}
              placeholder="စျေးနှုန်း"
            />
            {priceError ? (
              <Text style={styles.errorText}>{priceError}</Text>
            ) : null}
            <View style={styles.buttonContainer}>
              <Button
                mode="contained"
                style={styles.submitButton}
                onPress={addItemFunc}
              >
                ထည့်မည်
              </Button>
              <Button
                mode="text"
                onPress={hideDialog}
                style={styles.cancelButton}
              >
                ဖျက်သိမ်းမည်
              </Button>
            </View>
          </View>
        </Dialog.Content>
      </Dialog>
    </Portal>
  );
};

const styles = StyleSheet.create({
  input: {
    backgroundColor: "transparent",
    width: "100%",
    marginBottom: 10,
    fontSize: 12,
  },
  errorText: {
    color: "red",
    marginTop: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  submitButton: {
    flex: 1,
    marginRight: 8,
  },
  cancelButton: {
    flex: 1,
    marginLeft: 8,
  },
});

export default PriceDialog;
