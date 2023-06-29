import React from 'react';
import {StyleSheet, View, SafeAreaView, StatusBar} from 'react-native';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import colors from '../../Constants/Colors';

function Header({
  leftComponent,
  leftContainerStyle,
  centerComponent,
  centerContainerStyle,
  rightComponent,
  rightContainerStyle,
  statusbarColor,
  translucent,
  barStyle,
  safeAreaStyle,
  showBackgroundColor = false,
  isHeaderBlack = false,
}) {
  return (
    <SafeAreaView
      style={{
        ...safeAreaStyle,
        backgroundColor: isHeaderBlack ? colors.blackColor : colors.offwhite,
      }}>
      <StatusBar
        backgroundColor={statusbarColor || colors.offwhite}
        barStyle={barStyle || 'dark-content'}
        translucent={translucent}
      />
      <View
        style={[
          style.mainContainerStyle,
          {
            backgroundColor: showBackgroundColor
              ? colors.offwhite
              : 'transparent',
          },
        ]}>
        <View style={[style.leftContainerStyle, leftContainerStyle]}>
          {leftComponent}
        </View>
        <View style={[style.centerContainerStyle, centerContainerStyle]}>
          {centerComponent}
        </View>
        <View style={[style.rightContainerStyle, rightContainerStyle]}>
          {rightComponent}
        </View>
      </View>
    </SafeAreaView>
  );
}

const style = StyleSheet.create({
  mainContainerStyle: {
    width: '100%',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    height: 46,
  },
  leftContainerStyle: {
    width: wp('25%'),
    paddingLeft: 15,
  },
  rightContainerStyle: {
    width: wp('25%'),
    paddingRight: 15,
    alignItems: 'flex-end',
  },
  centerContainerStyle: {
    width: wp('50%'),
  },
});

export default Header;
