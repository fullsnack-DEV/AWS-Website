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
  minutesGap = 1,
  title = 'Pick a date',
}) {
  return (
    <DateTimePickerModal
    headerTextIOS={title}
      isVisible={visible}
      mode={mode}
      onConfirm={onDone}
      onCancel={onCancel}
      onHide={onHide}
      date={date}
      minuteInterval={minutesGap}
      minimumDate={minimumDate}
      maximumDate={maximumDate}
    />
  );
}
