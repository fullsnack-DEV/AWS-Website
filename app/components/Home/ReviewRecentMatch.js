import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableWithoutFeedback,
} from 'react-native';
import {
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import colors from '../../Constants/Colors'
import fonts from '../../Constants/Fonts';
import MatchBetweenRecentView from './MatchBetweenRecentView';

export default function RecentMatchItems({
  eventColor,
  startDate1,
  startDate2,
  title,
  startTime,
  endTime,
  location,
  firstUserImage,
  firstTeamText,
  secondUserImage,
  secondTeamText,
  firstTeamPoint,
  secondTeamPoint,
}) {
  return (
    <TouchableWithoutFeedback style={styles.backgroundView}>
      <View style={styles.backgroundView}>
        <View style={[styles.colorView, { backgroundColor: eventColor }]}>
          <Text style={styles.dateMonthText}>{startDate1}</Text>
          <Text style={styles.dateText}>{startDate2}</Text>
        </View>
        <View style={styles.eventText}>
          <Text style={[styles.eventTitle, { color: eventColor }]} numberOfLines={1}>
            {title}
          </Text>
          <View style={styles.bottomView}>
            <Text style={styles.eventTime}>{startTime}</Text>
            <Text style={styles.eventTime}>{endTime}</Text>
            <View style={styles.timeCityDividerStyle} />
            <Text style={[styles.eventTime, { width: wp('42%') }]}>{location}</Text>
          </View>
          <MatchBetweenRecentView
            firstUserImage={firstUserImage}
            firstText={firstTeamText}
            secondUserImage={secondUserImage}
            secondText={secondTeamText}
            firstTeamPoint={firstTeamPoint}
            secondTeamPoint={secondTeamPoint}
            containerStyle={{ marginVertical: 15, marginBottom: 10, marginHorizontal: 8 }}
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
    shadowColor: colors.googleColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    width: wp('94%'),
    marginVertical: 15,
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
    color: colors.googleColor,
  },
  timeCityDividerStyle: {
    width: 1,
    backgroundColor: colors.linesepratorColor,
    marginHorizontal: 12,
    marginVertical: 1,
  },
});
