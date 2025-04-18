import { Button, Dialog, Paragraph, Portal } from "react-native-paper";

import React from "react";

const TransactionDeleteDialog = ({
  visible,
  onDismiss,
  onConfirm,
  isDeleting,
}) => {
  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss}>
        <Dialog.Title>ဖျက်ရန် သေချာပါသလား?</Dialog.Title>
        <Dialog.Content>
          <Paragraph>ဤအကြွေးစာရင်းကို ဖျက်ရန် သေချာပါသလား?</Paragraph>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onDismiss}>မလုပ်တော့ပါ</Button>
          <Button
            textColor="#FF5252"
            onPress={onConfirm}
            loading={isDeleting}
            disabled={isDeleting}
          >
            ဖျက်မည်
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export default TransactionDeleteDialog;
