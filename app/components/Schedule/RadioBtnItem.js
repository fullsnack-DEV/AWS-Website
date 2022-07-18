import React from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';

export default function RadioBtnItem({
  titleName,
  onRadioBtnPress,
  selected,
  touchRadioBtnStyle,
}) {
  return (
    <View style={styles.containerStyle}>
      <Text style={styles.titleTextStyle}>{titleName}</Text>
      <TouchableOpacity
        style={[styles.touchRadioBtnStyle, touchRadioBtnStyle]}
        onPress={onRadioBtnPress}
      >
        <LinearGradient
          colors={[colors.yellowColor, colors.orangeGradientColor]}
          style={selected ? styles.viewFirstStyle : styles.viewSecondStyle}
        ></LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleTextStyle: {
    marginLeft: 15,
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
  },
  touchRadioBtnStyle: {
    height: 22,
    width: 22,
    borderRadius: 22 / 2,
    borderWidth: 1,
    borderColor: colors.magnifyIconColor,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewFirstStyle: {
    height: 14,
    width: 14,
    borderRadius: 14 / 2,
    backgroundColor: colors.yellowColor,
  },
  viewSecondStyle: {},
});
