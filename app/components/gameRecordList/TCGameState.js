import React, {useEffect, useState, useContext, useLayoutEffect} from 'react';

import {View, Text, StyleSheet} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import Dash from 'react-native-dash';

import constants from '../../config/constants';
const {colors, fonts, urls} = constants;
import PATH from '../../Constants/ImagePath';
import strings from '../../Constants/String';

export default function TCGameState() {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 5,
        marginBottom: 5,
      }}>
      <Dash
        style={{
          width: 1,
          height: 20,
          flexDirection: 'column',
        }}
        dashColor={colors.lightgrayColor}
      />
      <Text
        style={{
          textAlign: 'center',

          color: colors.darkGrayColor,

          position: 'absolute',

          bottom: 0,
        }}>
        <Text
          style={{
            fontFamily: fonts.RRegular,
            fontSize: 12,
            color: colors.blackColor,
          }}>
          0m
        </Text>{' '}
        (11:10 AM){' '}
        <Text
          style={{
            fontFamily: fonts.RRegular,
            fontSize: 16,
            color: colors.blackColor,
          }}>
          Match paused
        </Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({});
