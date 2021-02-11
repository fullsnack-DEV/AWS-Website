import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import fonts from '../../../../../Constants/Fonts';
import colors from '../../../../../Constants/Colors';

const TCTextTableView = ({
 leftTitle, leftSubTitle, rightTitle,
}) => (
  <View style={styles.mainContainer}>
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
      <Text style={styles.leftTitle}>{leftTitle}</Text>
      <Text style={styles.subTitle}>{leftSubTitle}</Text>
    </View>
    <Text style={styles.rightTitle}>{rightTitle}</Text>
  </View>
)

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    },
    leftTitle: {
        color: colors.lightBlackColor,
        fontSize: 16,
        fontFamily: fonts.RRegular,
    },
    rightTitle: {
        color: colors.lightBlackColor,
        fontSize: 16,
        fontFamily: fonts.RRegular,
    },
    subTitle: {
        marginLeft: 5,
        fontSize: 12,
        color: colors.userPostTimeColor,
        fontFamily: fonts.RRegular,
    },
})
export default TCTextTableView;
