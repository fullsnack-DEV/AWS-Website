import React from 'react';

import {View, Text} from 'react-native';

import Dash from 'react-native-dash';

import colors from '../../../../../Constants/Colors';
import fonts from '../../../../../Constants/Fonts';
import {
  tennisGameStats,
  getGameConvertMinsToTime,
  getGameDateTimeInHMSformat,
} from '../../../../../utils/gameUtils';

export default function TennisGameState({
  recordData,
  titleColor = colors?.blackColor,
}) {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 5,
      }}
    >
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
          fontSize: 12,
          fontFamily: fonts.RRegular,
          textAlign: 'center',
          color: colors.darkGrayColor,
          position: 'absolute',
          bottom: 0,
        }}
      >
        <Text
          style={{
            fontFamily: fonts.RBold,
            color: colors.blackColor,
          }}
        >
          {getGameConvertMinsToTime(recordData?.minutes) ?? 0}
        </Text>{' '}
        ({getGameDateTimeInHMSformat(recordData?.timestamp ?? new Date())}){' '}
        <Text
          style={{
            fontFamily: fonts.RMedium,
            fontSize: 16,
            color: titleColor,
          }}
        >
          {recordData?.verb in tennisGameStats &&
            tennisGameStats?.[recordData?.verb]}
        </Text>
      </Text>
    </View>
  );
}
