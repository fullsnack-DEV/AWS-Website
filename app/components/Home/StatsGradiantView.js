import React from 'react';
import {StyleSheet, Text, TouchableOpacity, Image} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';

export default function StatsGradiantView({
  topGradiantColor1,
  bottomGradiantColor1,
  topGradiantColor2,
  bottomGradiantColor2,
  sourceImage,
  title,
  counterNumber,
  imageViewStyle,
  titleTextStyle,
  counterTextStyle,
  onItemPress,
}) {
  return (
    <TouchableOpacity style={styles.containerStyle} onPress={onItemPress}>
      <LinearGradient
        colors={[topGradiantColor1, bottomGradiantColor1]}
        style={styles.topLinearViewStyle}
      >
        <Image
          source={sourceImage}
          style={[styles.imageViewStyle, imageViewStyle]}
          resizeMode={'contain'}
        />
        <Text style={[styles.titleTextStyle, titleTextStyle]}>{title}</Text>
      </LinearGradient>
      <LinearGradient
        colors={[topGradiantColor2, bottomGradiantColor2]}
        style={styles.bottomLinearViewStyle}
      >
        <Text style={[styles.counterTextStyle, counterTextStyle]}>
          {counterNumber}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    alignSelf: 'center',
    shadowOpacity: 0.4,
    elevation: 10,
    shadowColor: colors.blackColor,
    shadowOffset: {
      height: 2,
      width: 1,
    },
  },
  topLinearViewStyle: {
    height: wp('17%'),
    width: wp('17%'),
    backgroundColor: colors.orangeColor,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  imageViewStyle: {
    height: 40,
    width: 40,
  },
  titleTextStyle: {
    fontSize: 12,
    color: colors.lightBlackColor,
    fontFamily: fonts.RBold,
    textAlign: 'center',
  },
  bottomLinearViewStyle: {
    height: wp('8.5%'),
    width: wp('17%'),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.orangeColor,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightgrayColor,
  },
  counterTextStyle: {
    fontSize: 16,
    color: colors.orangeColor,
    fontFamily: fonts.RBold,
  },
});
