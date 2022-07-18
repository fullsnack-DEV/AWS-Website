import React from 'react';

import RNPickerSelect from 'react-native-picker-select';

export default function InvoiceTypeSelection({
  dataSource,
  placeholder,
  value,
  onValueChange,
}) {
  return (
    <RNPickerSelect
      placeholder={{
        label: placeholder,
        value: '',
      }}
      items={dataSource}
      onValueChange={onValueChange}
      useNativeAndroidPickerStyle={true}
      // eslint-disable-next-line no-sequences
      value={value}
    />
  );
}
