import { Button, Dialog, Portal, TextInput } from "react-native-paper";
import React, { useState } from "react";

import { StyleSheet } from "react-native";

const EditUserDialog = ({ visible, onDismiss, onSubmit, user }) => {
  const [name, setName] = useState(user?.name || "");
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || "");

  const handleSubmit = () => {
    onSubmit(name, phoneNumber);
  };

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss}>
        <Dialog.Title>ပြင်ဆင်ရန်</Dialog.Title>
        <Dialog.Content>
          <TextInput
            label="နာမည်"
            defaultValue={name}
            onChangeText={setName}
            mode="outlined"
            style={styles.input}
          />
          <TextInput
            label="ဖုန်းနံပါတ်"
            defaultValue={phoneNumber}
            onChangeText={setPhoneNumber}
            mode="outlined"
            style={styles.input}
            keyboardType="phone-pad"
          />
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onDismiss}>ဖျက်သိမ်းမည်</Button>
          <Button onPress={handleSubmit}>ပြင်ဆင်မည်</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

const styles = StyleSheet.create({
  input: {
    marginBottom: 10,
  },
});

export default EditUserDialog;
