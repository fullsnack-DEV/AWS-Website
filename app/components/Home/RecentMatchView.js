import React from 'react';
import {
  StyleSheet,
  View,
  Text,
} from 'react-native';
import moment from 'moment';
import colors from '../../Constants/Colors'
import fonts from '../../Constants/Fonts';
import MatchBetweenRecentView from './MatchBetweenRecentView';
import images from '../../Constants/ImagePath';

export default function RecentMatchView({
  data,
}) {
  let startDate = '';
  if (data && data.actual_startdatetime) {
    startDate = new Date(data.actual_startdatetime * 1000);
  }
  let endDate = '';
  if (data && data.actual_enddatetime) {
    endDate = new Date(data.actual_enddatetime * 1000);
  }
  return (
    data === null ? <View style={styles.backgroundView}>
      <Text style={styles.dataNotFoundText}>Data Not Found!</Text>
    </View> : <View style={styles.backgroundView}>
      <View style={styles.timeCityViewStyle}>
        <Text style={styles.dateTextStyle}>{moment(startDate).format('MMM DD.')}</Text>
        <Text style={styles.eventTime}>{`${moment(startDate).format('LT')} - `}</Text>
        <Text style={styles.eventTime}>{moment(endDate).format('LT')}</Text>
        <View style={styles.citydeviderStyle} />
        <Text style={[styles.eventTime, { width: '40%' }]}>{data && data.venue ? data.venue.address : ''}</Text>
      </View>
      <MatchBetweenRecentView
        firstUserImage={data.home_team && data.home_team.thumbnail ? { uri: data.home_team.thumbnail } : images.team_ph}
        firstText={data.home_team ? data.home_team.full_name || data.home_team.group_name : ''}
        secondUserImage={data.away_team && data.away_team.thumbnail ? { uri: data.away_team.thumbnail } : images.team_ph}
        secondText={data.away_team ? data.away_team.full_name || data.away_team.group_name : ''}
        firstTeamPoint={data.home_team_goal ? data.home_team_goal : 0}
        secondTeamPoint={data.away_team_goal ? data.away_team_goal : 0}
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
  dataNotFoundText: {
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
    alignSelf: 'center',
    marginVertical: 10,
  },
});
