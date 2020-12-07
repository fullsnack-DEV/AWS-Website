import React from 'react';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

export default function DateTimePickerView({
  onDone,
  onCancel,
  visible = false,
  onHide,
  date,
  mode,
  minimumDate,
  maximumDate,
}) {
  return (
    <DateTimePickerModal
      isVisible={visible}
      mode={mode}
      onConfirm={onDone}
      onCancel={onCancel}
      onHide={onHide}
      date={date}
      minimumDate={minimumDate}
      maximumDate={maximumDate}
    />
  );
}
