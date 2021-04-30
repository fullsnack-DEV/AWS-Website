/* eslint-disable react-native/no-raw-text */
import React from 'react';
import {
  StyleSheet,
  Text,
  View,

} from 'react-native';
import fonts from '../../Constants/Fonts';
import colors from '../../Constants/Colors';

export default function ChallengeStatusView() {
  return (
    <View style={styles.viewContainer}>
      <Text style={styles.statusTitleText} >RESERVATION REQUEST SENT</Text>
      <Text style={styles.statusDescription} >Your team sent a match reservation  request to
        Vancouver Whitecaps. This request will be
        expired in <Text style={{ color: colors.darkThemeColor }}>47h 59m.</Text></Text>
    </View>
  );
}
const styles = StyleSheet.create({

  statusDescription: {
    fontSize: 16,
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,

    marginRight: 15,

  },
  statusTitleText: {
    fontSize: 16,
    color: colors.darkThemeColor,
    fontFamily: fonts.RBold,
  },
  viewContainer: {
      margin: 15,
      marginBottom: 25,
  },
});
