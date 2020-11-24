import React from 'react';
import {
  StyleSheet,
  View,
  Text,
} from 'react-native';
import colors from '../../Constants/Colors'
import fonts from '../../Constants/Fonts';
import MatchBetweenRecentView from './MatchBetweenRecentView';

export default function RecentMatchView({
  date,
  startTime,
  endTime,
  cityName,
  firstTeamImage,
  secondTeamImage,
  firstTeamName,
  secondTeamName,
}) {
  return (
    <View style={ styles.backgroundView }>
      <View style={styles.timeCityViewStyle}>
        <Text style={styles.dateTextStyle}>{date}</Text>
        <Text style={styles.eventTime}>{startTime}</Text>
        <Text style={styles.eventTime}>{endTime}</Text>
        <View style={styles.citydeviderStyle} />
        <Text style={styles.eventTime}>{cityName}</Text>
      </View>
      <MatchBetweenRecentView
        firstUserImage={firstTeamImage}
        firstText={firstTeamName}
        secondUserImage={secondTeamImage}
        secondText={secondTeamName}
        firstTeamPoint={3}
        secondTeamPoint={1}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  backgroundView: {
    backgroundColor: colors.matchViewColor,
    borderRadius: 5,
    elevation: 5,
    shadowColor: colors.googleColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    marginTop: 10,
  },
  timeCityViewStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 12,
  },
  dateTextStyle: {
    fontSize: 16,
    fontFamily: fonts.RMedium,
    color: colors.themeColor,
    marginRight: 10,
  },
  citydeviderStyle: {
    marginHorizontal: 15,
    width: 1,
    backgroundColor: colors.grayColor,
    height: 20,
  },
  eventTime: {
    fontSize: 12,
    color: colors.lightBlackColor,
    fontFamily: fonts.RLight,
  },
});
