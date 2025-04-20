import { Alert, StyleSheet } from "react-native";
import { Button, Dialog, Portal, TextInput } from "react-native-paper";
import React, { useEffect, useState } from "react";

const BeanTransactionUpdateDialog = ({
  visible,
  onDismiss,
  onSubmit,
  isEditing,
  data,
}) => {
  const [amount, setAmount] = useState("");
  const [remark, setRemark] = useState("");
  const [currentPrice, setCurrentPrice] = useState("");

  const handleSubmit = async () => {
    if (!amount || isNaN(parseFloat(amount))) {
      Alert.prompt("မှန်ကန်သော ပမာဏ ထည့်သွင်းပါ");
      return;
    }

    try {
      await onSubmit({ amount, remark, currentPrice });
      setAmount("");
      setRemark("");
      setCurrentPrice("");
    } catch (error) {
      console.error(error);
    }
  };

  const handleDismiss = () => {
    setAmount("");
    onDismiss();
  };

  useEffect(() => {
    if (data) {
      if (data?.credit) setAmount(data.credit.toString());
      if (data?.debit) setAmount(data.debit.toString());
      if (data?.remark) setRemark(data.remark.toString());
      if (data?.currentPrice) setCurrentPrice(data.currentPrice.toString());
    }
  }, [data]);

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={handleDismiss}>
        <Dialog.Title>ပြင်ဆင်ရန်</Dialog.Title>
        <Dialog.Content>
          <TextInput
            label="ပမာဏ"
            onChangeText={setAmount}
            keyboardType="numeric"
            mode="outlined"
            defaultValue={amount}
            style={styles.dialogInput}
          />
        </Dialog.Content>
        <Dialog.Content>
          <TextInput
            label="လက်တလော စျေးနုန်း"
            onChangeText={setCurrentPrice}
            keyboardType="numeric"
            mode="outlined"
            defaultValue={currentPrice}
            style={styles.dialogInput}
          />
        </Dialog.Content>
        <Dialog.Content>
          <TextInput
            label="မှတ်ချက်"
            onChangeText={setRemark}
            mode="outlined"
            defaultValue={remark}
            style={styles.dialogInput}
          />
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={handleDismiss}>ဖျက်သိမ်းမည်</Button>
          <Button
            onPress={handleSubmit}
            loading={isEditing}
            disabled={isEditing}
          >
            ပြင်ဆင်မည်
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

export default BeanTransactionUpdateDialog;
