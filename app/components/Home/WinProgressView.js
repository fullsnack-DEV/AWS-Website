import React from 'react';
import {
  StyleSheet,
  View,
  Text,
} from 'react-native';
import * as Progress from 'react-native-progress';
import colors from '../../Constants/Colors'
import fonts from '../../Constants/Fonts';

export default function WinProgressView({
  titleText,
  percentageCount,
  progress,
  prgressColor,
  percentageTextStyle,
  textStyle,
  progressBarStyle,
  containerStyle,
}) {
  return (
    <View style={[styles.containerStyle, containerStyle]}>
      <Text style={[styles.textStyle, textStyle]}>{titleText}</Text>
      
      <Progress.Bar
          animated={false}
          progress={progress}
          width={100}
          height={6}
          borderRadius={8}
          style={[styles.progressBarStyle, progressBarStyle]}
          color={prgressColor}
        />
      <Text style={[styles.percentageTextStyle, percentageTextStyle]}>{percentageCount}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    flexDirection: 'row',
  },
  textStyle: {
    width: 42,
    fontSize: 12,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
  },
  percentageTextStyle: {
    marginRight: 10,
    fontSize: 12,
    fontFamily: fonts.RMedium,
  },
  progressBarStyle: {
    alignSelf: 'center',
    borderWidth: 0,
    backgroundColor: colors.whiteColor,
  },
});
