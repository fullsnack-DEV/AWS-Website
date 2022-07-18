import React from 'react';
import {StyleSheet, View} from 'react-native';

import TCMessageButton from '../TCMessageButton';

import strings from '../../Constants/String';
import colors from '../../Constants/Colors';

export default function ReservationDetailButton({onPressButon}) {
  return (
    <View style={styles.detailButtonStyle}>
      <TCMessageButton
        title={strings.detailText}
        color={colors.yellowColor}
        width={'100%'}
        height={30}
        onPress={onPressButon}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  detailButtonStyle: {
    margin: 30,
    marginBottom: 5,
  },
});
