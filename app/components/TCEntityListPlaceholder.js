import React, { memo } from 'react';
import {
View, Text, StyleSheet, TouchableOpacity,
} from 'react-native';

import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

import LinearGradient from 'react-native-linear-gradient';
import colors from '../Constants/Colors';
import fonts from '../Constants/Fonts';
import { widthPercentageToDP } from '../utils';
import TCEntityView from './TCEntityView';

function TCEntityListPlaceholder({ cardWidth = '86%', placeholderText = '' }) {
  return (
    <View style={[styles.backgroundView, { width: wp(cardWidth) }]}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginLeft: 15,
          marginRight: 15,
        }}>
        <View style={{ marginBottom: 15 }}>
          <TCEntityView showStar={true} />
        </View>
        <View style={{ marginBottom: 15 }}>
          <TCEntityView showStar={true} />
        </View>
        <View style={{ marginBottom: 15 }}>
          <TCEntityView showStar={true} />
        </View>
        <View style={{ marginBottom: 15 }}>
          <TCEntityView showStar={true} />
        </View>
      </View>
      <LinearGradient
        colors={[colors.yellowColor, colors.assistTextColor]}
        style={styles.overlayStyle}>
        <Text style={styles.placeholderTextStyle}>{placeholderText}</Text>
        <TouchableOpacity style={styles.startButton} onPress={() => {}}>
          <Text style={styles.startTitle}>Start</Text>
        </TouchableOpacity>
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
    opacity: 0.9,
    alignItems: 'center',
    justifyContent: 'center',
  },

  placeholderTextStyle: {
    fontSize: 16,
    fontFamily: fonts.RMedium,
    color: colors.whiteColor,
    textAlign: 'center',
  },
  startButton: {
    alignSelf: 'center',
    backgroundColor: colors.whiteColor,
    borderRadius: 5,
    elevation: 5,
    flexDirection: 'row',
    height: 25,
    shadowColor: colors.googleColor,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    width: widthPercentageToDP('20%'),
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  startTitle: {
    fontSize: 16,
    fontFamily: fonts.RMedium,
    color: colors.themeColor,
    alignSelf: 'center',
  },
});

export default memo(TCEntityListPlaceholder);
