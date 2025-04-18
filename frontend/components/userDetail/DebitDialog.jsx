import { Alert, StyleSheet } from "react-native";
import { Button, Dialog, Portal, TextInput } from "react-native-paper";
import React, { useState } from "react";

const DebitDialog = ({ visible, onDismiss, onSubmit }) => {
  const [debitAmount, setDebitAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!debitAmount || isNaN(parseFloat(debitAmount))) {
      Alert.prompt("မှန်ကန်သော ပမာဏ ထည့်သွင်းပါ");
      return;
    }

    setLoading(true);
    try {
      await onSubmit(debitAmount);
      setDebitAmount("");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDismiss = () => {
    setDebitAmount("");
    onDismiss();
  };

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={handleDismiss}>
        <Dialog.Title>Add Debit</Dialog.Title>
        <Dialog.Content>
          <TextInput
            label="အကြွေး ပမာဏ"
            onChangeText={setDebitAmount}
            keyboardType="numeric"
            mode="outlined"
            style={styles.dialogInput}
          />
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={handleDismiss}>ဖျက်သိမ်းမည်</Button>
          <Button onPress={handleSubmit} loading={loading} disabled={loading}>
            အကြွေးယူမည်
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

const styles = StyleSheet.create({
  dialogInput: {
    marginTop: 10,
  },
});

export default DebitDialog;
