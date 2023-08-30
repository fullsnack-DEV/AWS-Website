// @flow
import React from 'react';
import {View, Text} from 'react-native';
import {strings} from '../../../Localization/translation';
import CustomDropDown from './CustomDropDown';
import styles from './ModalStyles';

const RefreeModal = ({refreeCount = 0, onChange = () => {}}) => {
  const handleSelection = (count) => {
    const arr = [];
    if (count > 0) {
      for (let i = 0; i < count; i++) {
        const obj = {
          responsible_to_secure_referee: 'challengee',
          is_chief: i === 0,
        };
        arr.push(obj);
      }
    }

    const refreeDetails = {
      responsible_for_referee: {
        who_secure: [...arr],
      },
    };
    onChange(refreeDetails);
  };
  return (
    <View>
      <Text style={styles.title}>{strings.refeereModalTitle}</Text>
      <View style={[styles.row, {alignItems: 'flex-start', marginBottom: 13}]}>
        <Text style={[styles.label, {marginRight: 5}]}>•</Text>
        <Text style={styles.label}>{strings.refereeSelectionRule1}</Text>
      </View>
      <View style={[styles.row, {alignItems: 'flex-start'}]}>
        <Text style={[styles.label, {marginRight: 5}]}>•</Text>
        <Text style={styles.label}>{strings.refereeSelectionRule2}</Text>
      </View>

      <View style={[styles.row, {marginTop: 23, paddingHorizontal: 10}]}>
        <Text style={styles.label}>{strings.Minimum}</Text>
        <CustomDropDown
          selectedValue={refreeCount}
          prefix={strings.refereeText}
          onSelect={handleSelection}
        />
      </View>
    </View>
  );
};

export default RefreeModal;
