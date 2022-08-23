import React, {memo} from 'react';
import {View, Text, StyleSheet} from 'react-native';

import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

import LinearGradient from 'react-native-linear-gradient';
import colors from '../Constants/Colors';
import fonts from '../Constants/Fonts';
import TCEntityView from './TCEntityView';

function TCEntityListPlaceholder({cardWidth = '86%', placeholderText = ''}) {
  return (
    <View style={[styles.backgroundView, {width: wp(cardWidth)}]}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginLeft: 15,
          marginRight: 15,
        }}>
        <View style={{marginBottom: 15}}>
          <TCEntityView showStar={true} placeholder={true} />
        </View>
        <View style={{marginBottom: 15}}>
          <TCEntityView showStar={true} placeholder={true} />
        </View>
        <View style={{marginBottom: 15}}>
          <TCEntityView showStar={true} placeholder={true} />
        </View>
        <View style={{marginBottom: 15}}>
          <TCEntityView showStar={true} placeholder={true} />
        </View>
      </View>
      <LinearGradient
        colors={[colors.whiteColor, colors.whiteColor]}
        style={styles.overlayStyle}>
        <Text style={styles.placeholderTextStyle}>{placeholderText}</Text>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  backgroundView: {
    alignSelf: 'center',
    borderRadius: 8,
    height: 150,
    width: wp('86%'),
    marginBottom: 10,
  },

  overlayStyle: {
    borderBottomLeftRadius: 8,
    borderTopLeftRadius: 8,
    borderBottomRightRadius: 8,
    borderTopRightRadius: 8,
    height: 150,
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
});

export default memo(TCEntityListPlaceholder);
