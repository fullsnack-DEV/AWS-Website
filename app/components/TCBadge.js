import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { normalize } from 'react-native-elements';
import { widthPercentageToDP as wp } from '../utils';
import fonts from '../Constants/Fonts';
import colors from '../Constants/Colors';

const TCBadge = ({
  value = '',
  align = 'center',
}) => (
  <View style={{ ...styles.badgeContainer, alignSelf: align }}>
    <Text style={styles.valueText}>{value}</Text>
  </View>
)

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
    fontSize: normalize(10),
    color: colors.whiteColor,
  },
})
export default TCBadge;
