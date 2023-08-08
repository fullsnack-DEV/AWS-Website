// @flow
import React from 'react';
import {View, Text} from 'react-native';
import {strings} from '../../../Localization/translation';

import CustomDropDown from './CustomDropDown';
import styles from './ModalStyles';

const ScorekeeperModal = ({scorekeeperCount = 0, onChange = () => {}}) => {
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

    const scorekeeperDetails = {
      responsible_for_scorekeeper: {
        who_secure: [...arr],
      },
    };
    onChange(scorekeeperDetails);
  };

  return (
    <View>
      <Text style={styles.title}>{strings.scorekeeperModalTitle}</Text>
      <View style={[styles.row, {alignItems: 'flex-start', marginBottom: 13}]}>
        <Text style={[styles.label, {marginRight: 5}]}>•</Text>
        <Text style={styles.label}>{strings.scorekeeperSelectionRule1}</Text>
      </View>
      <View style={[styles.row, {alignItems: 'flex-start'}]}>
        <Text style={[styles.label, {marginRight: 5}]}>•</Text>
        <Text style={styles.label}>{strings.scorekeeperSelectionRule2}</Text>
      </View>

      <View style={[styles.row, {marginTop: 23, paddingHorizontal: 10}]}>
        <Text style={styles.label}>{strings.Minimum}</Text>
        <CustomDropDown
          selectedValue={scorekeeperCount}
          prefix={strings.scorekeeper}
          onSelect={handleSelection}
        />
      </View>
    </View>
  );
};

export default ScorekeeperModal;
