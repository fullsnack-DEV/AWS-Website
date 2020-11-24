import React from 'react';
import {
  StyleSheet,
  View,
  Text,
} from 'react-native';
import colors from '../../Constants/Colors'
import fonts from '../../Constants/Fonts';
import ProgressBarCircle from './ProgressBarCircle';
import WinProgressView from './WinProgressView';

export default function StatsView({
  pastTime,
  TotalGameText,
  totalGameCounter,
  winTitle,
  winPercentage,
  winProgress,
  winProgressColor,
  winPercentageTextStyle,
  drawTitle,
  drawPercentage,
  drawProgress,
  drawProgressColor,
  drawPercentageTextStyle,
  lossTitle,
  lossPercentage,
  lossProgress,
  lossProgressColor,
  lossPercentageTextStyle,
  sections,
}) {
  return (
    <View style={styles.containerStyle}>
      <View>
        <Text style={styles.pastTimeText}>{pastTime}</Text>
        <View style={styles.totalGameViewStyle}>
          <Text style={styles.totalGameTextStyle}>{TotalGameText}</Text>
          <Text style={styles.totalGameCounterText}>{totalGameCounter}</Text>
        </View>
        <WinProgressView
            titleText={winTitle}
            percentageCount={winPercentage}
            progress={winProgress}
            prgressColor={winProgressColor}
            percentageTextStyle={winPercentageTextStyle}
        />
        <WinProgressView
            titleText={drawTitle}
            percentageCount={drawPercentage}
            progress={drawProgress}
            prgressColor={drawProgressColor}
            percentageTextStyle={drawPercentageTextStyle}
        />
        <WinProgressView
            titleText={lossTitle}
            percentageCount={lossPercentage}
            progress={lossProgress}
            prgressColor={lossProgressColor}
            percentageTextStyle={lossPercentageTextStyle}
        />
      </View>
      <ProgressBarCircle
        sections={sections}
        circleInnerText={'Win'}
        percentage={50}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: colors.matchViewColor,
    borderRadius: 5,
    elevation: 5,
    shadowColor: colors.googleColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  pastTimeText: {
    fontSize: 12,
    fontFamily: fonts.RMedium,
    color: colors.lightBlackColor,
  },
  totalGameViewStyle: {
    flexDirection: 'row',
    marginVertical: 8,
    alignItems: 'center',
  },
  totalGameTextStyle: {
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
  },
  totalGameCounterText: {
    fontSize: 16,
    fontFamily: fonts.RMedium,
    color: colors.lightBlackColor,
    marginLeft: 5,
  },
});
