import React from 'react';
import {
  StyleSheet, View, Text,
} from 'react-native';
import {
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';

function EventItemRender({
  title,
  children,
  containerStyle,
  headerTextStyle,
}) {
  return (
    <View style={[styles.containerStyle, containerStyle]}>
      <Text style={[styles.headerTextStyle, headerTextStyle]}>{title}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    width: wp('96%'),
    alignSelf: 'center',
    padding: wp('1.5%'),
  },
  headerTextStyle: {
    fontSize: 20,
    fontFamily: fonts.RRegular,
    marginVertical: 3,
    color: colors.lightBlackColor,
  },
});

export default EventItemRender;
