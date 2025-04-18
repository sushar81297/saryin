import { Button, Dialog, Paragraph, Portal } from "react-native-paper";

import React from "react";

const UserDeleteDialog = ({
  visible,
  onDismiss,
  onConfirm,
  userName,
  isDeleting,
}) => {
  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss}>
        <Dialog.Title>ဖျက်ရန် သေချာပါသလား?</Dialog.Title>
        <Dialog.Content>
          <Paragraph>
            {userName} နှင့်ပတ်သက်သော အကြွေးစားရင်းများကို ဖျက်ရန် သေချာပါသလား?
          </Paragraph>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onDismiss}>Cancel</Button>
          <Button
            textColor="#FF5252"
            onPress={onConfirm}
            loading={isDeleting}
            disabled={isDeleting}
          >
            Delete
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export default UserDeleteDialog;
