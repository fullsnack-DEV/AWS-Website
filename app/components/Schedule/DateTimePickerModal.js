import React from 'react';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

export default function DateTimePickerView({
  onDone,
  onCancel,
  visible = false,
  onHide,
}) {
  return (
    <DateTimePickerModal
        isVisible={visible}
        mode="datetime"
        onConfirm={onDone}
        onCancel={onCancel}
        onHide={onHide}
    />
  );
}
