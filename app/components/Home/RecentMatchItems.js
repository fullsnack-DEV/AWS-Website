import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from 'react-native';
import {
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import moment from 'moment';
import images from '../../Constants/ImagePath';
import colors from '../../Constants/Colors'
import fonts from '../../Constants/Fonts';
import MatchBetweenRecentView from './MatchBetweenRecentView';

export default function RecentMatchItems({
  data,
  onThreeDotPress,
}) {
  let startDate = '';
  if (data && data.actual_startdatetime) {
    startDate = new Date(data.actual_startdatetime * 1000);
  }
  let endDate = '';
  if (data && data.actual_enddatetime) {
    endDate = new Date(data.actual_enddatetime * 1000);
  }
  let eventColor = colors.themeColor;
  if (data && data.eventColor) {
    eventColor = data.eventColor;
  }
  let location = '';
  if (data && data.venue && data.venue.address) {
    location = data.venue.address;
  }
  let title = '';
  if (data && data.sport) {
    title = data.sport;
  }
  let team1Image = null;
  if (data && data.home_team && data.home_team.thumbnail) {
    team1Image = data.home_team.thumbnail;
  }
  let team1Title = '';
  if (data && data.home_team && (data.home_team.full_name || data.home_team.group_name)) {
    team1Title = data.home_team.full_name || data.home_team.group_name;
  }
  let team1Point = '0';
  if (data && data.home_team_goal) {
    team1Point = data.home_team_goal;
  }
  let team2Image = null;
  if (data && data.away_team && data.away_team.thumbnail) {
    team2Image = data.away_team.thumbnail;
  }
  let team2Title = '';
  if (data && data.away_team && (data.away_team.full_name || data.away_team.group_name)) {
    team2Title = data.away_team.full_name || data.away_team.group_name;
  }
  let team2Point = '0';
  if (data && data.away_team_goal) {
    team2Point = data.away_team_goal;
  }

  return (
    <TouchableWithoutFeedback style={styles.backgroundView}>
      <View style={styles.backgroundView}>
        <View style={[styles.colorView, { backgroundColor: eventColor[0] !== '#' ? `#${eventColor}` : eventColor }]}>
          <Text style={styles.dateMonthText}>{moment(startDate).format('MMM')}</Text>
          <Text style={styles.dateText}>{moment(startDate).format('DD')}</Text>
        </View>
        <View style={styles.eventText}>
          <View style={styles.eventTitlewithDot}>
            <Text style={[styles.eventTitle, { color: eventColor[0] !== '#' ? `#${eventColor}` : eventColor }]} numberOfLines={1}>
              {title}
            </Text>
            <TouchableOpacity onPress={onThreeDotPress}>
              <Image source={images.vertical3Dot} style={styles.threedot} />
            </TouchableOpacity>
          </View>
          <View style={styles.bottomView}>
            <Text style={styles.eventTime}>{`${moment(startDate).format('LT')} - `}</Text>
            <Text style={styles.eventTime}>{moment(endDate).format('LT')}</Text>
            <View style={styles.timeCityDividerStyle} />
            <Text style={[styles.eventTime, { width: wp('42%') }]}>{location}</Text>
          </View>
          <MatchBetweenRecentView
            firstUserImage={team1Image ? { uri: team1Image } : images.team_ph}
            firstText={team1Title}
            secondUserImage={team2Image ? { uri: team2Image } : images.team_ph}
            secondText={team2Title}
            firstTeamPoint={team1Point}
            secondTeamPoint={team2Point}
            containerStyle={{ marginVertical: 20, marginBottom: 10, marginHorizontal: 8 }}
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  backgroundView: {
    alignSelf: 'center',
    backgroundColor: colors.whiteColor,
    borderRadius: 10,
    elevation: 5,
    flexDirection: 'row',
    marginBottom: 15,
    shadowColor: colors.googleColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    width: wp('94%'),
  },
  bottomView: {
    flexDirection: 'row',
    marginTop: 5,
  },
  colorView: {
    alignItems: 'center',
    backgroundColor: colors.orangeColor,
    borderBottomLeftRadius: 5,
    borderTopLeftRadius: 5,
    paddingTop: 10,
    paddingLeft: 5,
    width: wp('12%'),
  },
  dateMonthText: {
    color: colors.whiteColor,
    fontSize: 16,
    fontFamily: fonts.RLight,
  },
  dateText: {
    color: colors.whiteColor,
    fontSize: 20,
    fontFamily: fonts.RBold,
  },
  eventText: {
    padding: 10,
    width: wp('83%'),
  },
  eventTime: {
    fontSize: 12,
    color: colors.lightBlackColor,
    fontFamily: fonts.RLight,
    alignSelf: 'center',
  },
  eventTitle: {
    fontSize: 16,
    fontFamily: fonts.RBold,
    width: wp('70%'),
    color: colors.googleColor,
  },
  eventTitlewithDot: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  threedot: {
    height: 12,
    right: 6,
    marginTop: 5,
    resizeMode: 'contain',
    tintColor: colors.grayColor,
    width: 12,
  },
  timeCityDividerStyle: {
    width: 1,
    backgroundColor: colors.linesepratorColor,
    marginHorizontal: 12,
    marginVertical: 1,
  },
});
