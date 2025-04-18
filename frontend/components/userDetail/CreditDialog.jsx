import { Alert, StyleSheet } from "react-native";
import { Button, Dialog, Portal, TextInput } from "react-native-paper";
import React, { useState } from "react";

const CreditDialog = ({ visible, onDismiss, onSubmit }) => {
  const [creditAmount, setCreditAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!creditAmount || isNaN(parseFloat(creditAmount))) {
      Alert.prompt("မှန်ကန်သော ပမာဏ ထည့်သွင်းပါ");
      return;
    }

    setLoading(true);
    try {
      await onSubmit(creditAmount);
      setCreditAmount("");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDismiss = () => {
    setCreditAmount("");
    onDismiss();
  };

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={handleDismiss}>
        <Dialog.Title>Add Credit</Dialog.Title>
        <Dialog.Content>
          <TextInput
            label="ဆပ်ငွေပမာဏ"
            onChangeText={setCreditAmount}
            keyboardType="numeric"
            mode="outlined"
            style={styles.dialogInput}
          />
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={handleDismiss}>ဖျက်သိမ်းမည်</Button>
          <Button onPress={handleSubmit} loading={loading} disabled={loading}>
            အကြွေးပေးမည်
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

export default CreditDialog;
