import React, {memo} from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {widthPercentageToDP as wp} from '../utils';
import fonts from '../Constants/Fonts';
import colors from '../Constants/Colors';

const TCBadge = ({value = '', align = 'center', style = {}}) => (
  <View style={{...styles.badgeContainer, alignSelf: align, ...style}}>
    <Text
      style={{
        fontFamily: fonts.LRegular,
        fontSize: 12,
        color: colors.whiteColor,
      }}>
      @<Text style={styles.valueText}>{value}</Text>
    </Text>
  </View>
);

const styles = StyleSheet.create({
  badgeContainer: {
    backgroundColor: '#FF4E00',
    paddingVertical: wp(0.5),
    paddingHorizontal: wp(1.5),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: wp(20),
  },
  valueText: {
    fontFamily: fonts.RRegular,
    fontSize: 12,
    color: colors.whiteColor,
  },
});
export default memo(TCBadge);
