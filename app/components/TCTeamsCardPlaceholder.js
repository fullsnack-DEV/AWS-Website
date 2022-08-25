import React, {memo} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';

import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';

import colors from '../Constants/Colors';
import fonts from '../Constants/Fonts';

import TCChallengerCard from './TCChallengerCard';

const TCTeamsCardPlaceholder = ({
  cardWidth = '86%',
  placeholderText = '',
  buttonTitle = '',
  onPress,
}) => (
  <View style={[styles.backgroundView, {width: wp(cardWidth)}]}>
    <TCChallengerCard />
    <View style={{width: 15}} />
    <TCChallengerCard />
    <LinearGradient
      colors={[colors.whiteColor, colors.whiteColor]}
      style={styles.overlayStyle}>
      <Text style={styles.placeholderTextStyle}>{placeholderText}</Text>
      <TouchableOpacity onPress={onPress}>
        <Text style={styles.startTitle} numberOfLines={2}>
          {buttonTitle}
        </Text>
      </TouchableOpacity>
    </LinearGradient>
  </View>
);

const styles = StyleSheet.create({
  backgroundView: {
    flexDirection: 'row',
    marginBottom: 10,
  },

  overlayStyle: {
    borderBottomLeftRadius: 8,
    borderTopLeftRadius: 8,
    borderBottomRightRadius: 8,
    borderTopRightRadius: 8,
    height: 102,
    width: '100%',
    position: 'absolute',
    opacity: 0.8,
    alignItems: 'center',
    justifyContent: 'center',
  },

  placeholderTextStyle: {
    fontSize: 14,
    fontFamily: fonts.RMedium,
    color: colors.googleColor,
    textAlign: 'center',
  },

  startTitle: {
    fontSize: 20,
    fontFamily: fonts.RMedium,
    color: colors.themeColor,
    alignSelf: 'center',
    textAlign: 'center',
  },
});

export default memo(TCTeamsCardPlaceholder);
