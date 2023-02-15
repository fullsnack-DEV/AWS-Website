// @flow
import React from 'react';
import {View, Text, TextInput, TouchableOpacity} from 'react-native';
import {strings} from '../../../Localization/translation';

import styles from './ModalStyles';

const MatchFeeModal = ({
  gameFee = {},
  onChange = () => {},
  onChangeCurrency = () => {},
  currency = '',
}) => (
  <View>
    <Text style={styles.title}>{strings.chooseMatchType}</Text>

    <View style={[styles.greyContainer, styles.row]}>
      <View />
      <TextInput
        value={`${gameFee.fee}`}
        style={[styles.label, {marginRight: 5, flex: 1, textAlign: 'center'}]}
        onChangeText={(text) => {
          onChange({currency_type: currency, fee: text});
        }}
        keyboardType="decimal-pad"
      />
      <Text style={styles.label}>{`${currency}/${strings.match}`}</Text>
    </View>

    <TouchableOpacity style={styles.linkButton} onPress={onChangeCurrency}>
      <Text style={styles.linkButtonText}>{strings.changeCurrency}</Text>
    </TouchableOpacity>
  </View>
);

export default MatchFeeModal;
