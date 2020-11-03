import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';

export default function RadioBtnItem({ titleName, onRadioBtnPress, selected }) {
  return (
    <View style={styles.containerStyle}>
      <Text style={styles.titleTextStyle}>{titleName}</Text>
      <TouchableOpacity style={styles.touchRedStyle}
        onPress={onRadioBtnPress}
      >
        <View style={selected ? styles.viewFirstStyle : styles.viewSecondStyle}></View>
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
  touchRedStyle: {
    height: 22,
    width: 22,
    borderRadius: 22 / 2,
    borderWidth: 0.8,
    borderColor: colors.magnifyIconColor,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewFirstStyle: {
    height: 13,
    width: 13,
    borderRadius: 13 / 2,
    backgroundColor: colors.greeColor,
  },
  viewSecondStyle: {
  },
});
