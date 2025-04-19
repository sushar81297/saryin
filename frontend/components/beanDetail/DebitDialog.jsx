import { Alert, StyleSheet } from "react-native";
import { Button, Dialog, Portal, TextInput } from "react-native-paper";
import React, { useState } from "react";

const BeanDebitDialog = ({ visible, onDismiss, onSubmit }) => {
  const [debitAmount, setDebitAmount] = useState("");
  const [currentPrice, setCurrentPrice] = useState("");
  const [remark, setRemark] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!debitAmount || isNaN(parseFloat(debitAmount))) {
      Alert.prompt("မှန်ကန်သော ပမာဏ ထည့်သွင်းပါ");
      return;
    }

    setLoading(true);
    try {
      await onSubmit({ debitAmount, currentPrice, remark });
      setDebitAmount("");
      setRemark("");
      setCurrentPrice("");
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
        <Dialog.Title>ပဲရောင်းမည်</Dialog.Title>
        <Dialog.Content>
          <TextInput
            label="တင်း ပမာဏ"
            onChangeText={setDebitAmount}
            keyboardType="numeric"
            mode="outlined"
            style={styles.dialogInput}
          />
        </Dialog.Content>
        <Dialog.Content>
          <TextInput
            label="လက်တလော စျေးနုန်း"
            onChangeText={setCurrentPrice}
            keyboardType="numeric"
            mode="outlined"
            style={styles.dialogInput}
          />
        </Dialog.Content>
        <Dialog.Content>
          <TextInput
            label="မှတ်ချက်"
            onChangeText={setRemark}
            mode="outlined"
            style={styles.dialogInput}
          />
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={handleDismiss}>ဖျက်သိမ်းမည်</Button>
          <Button onPress={handleSubmit} loading={loading} disabled={loading}>
            ပဲရောင်းမည်
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

export default BeanDebitDialog;
