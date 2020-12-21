import React from 'react';
import {
  StyleSheet, View, SafeAreaView, StatusBar,
} from 'react-native';
import {
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import colors from '../../Constants/Colors';

function Header({
  leftComponent,
  leftContainerStyle,
  centerComponent,
  centerContainerStyle,
  rightComponent,
  rightContainerStyle,
  mainContainerStyle,
  statusbarColor,
  translucent,
  barStyle,
  safeAreaStyle,
}) {
  return (
    <SafeAreaView style={safeAreaStyle}>
      <StatusBar backgroundColor={statusbarColor || colors.grayColor} barStyle={barStyle || 'dark-content'} translucent={translucent} />
      <View style={[style.mainContainerStyle, mainContainerStyle]}>
        <View style={[style.leftContainerStyle, leftContainerStyle]}>{leftComponent}</View>
        <View style={[style.centerContainerStyle, centerContainerStyle]}>{centerComponent}</View>
        <View style={[style.rightContainerStyle, rightContainerStyle]}>{rightComponent}</View>
      </View>
    </SafeAreaView>
  );
}

const style = StyleSheet.create({
  mainContainerStyle: {
    width: wp('100%'),
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  leftContainerStyle: {
    width: wp('15%'),
    paddingLeft: 15,
  },
  rightContainerStyle: {
    width: wp('15%'),
    paddingRight: 15,
    alignItems: 'flex-end',
  },
  centerContainerStyle: {
    width: wp('70%'),
  },
});

export default Header;
