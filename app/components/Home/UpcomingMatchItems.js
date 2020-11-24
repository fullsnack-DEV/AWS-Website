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
import MatchBetweenUpcomingView from './MatchBetweenUpcomingView';

export default function UpcomingMatchItems({
  data,
  onThreeDotPress,
}) {
  let startDate = '';
  if (data && data.startDate) {
    startDate = data.startDate;
  }
  let endDate = '';
  if (data && data.endDate) {
    endDate = data.endDate;
  }
  let eventColor = '';
  if (data && data.eventColor) {
    eventColor = data.eventColor;
  }
  let location = '';
  if (data && data.location) {
    location = data.location;
  }
  let description = '';
  if (data && data.description) {
    description = data.description;
  }
  let title = '';
  if (data && data.title) {
    title = data.title;
  }
  let team1Image = null;
  if (data && data.team1Image) {
    team1Image = data.team1Image;
  }
  let team1Title = '';
  if (data && data.team1Title) {
    team1Title = data.team1Title;
  }
  let team2Image = null;
  if (data && data.team2Image) {
    team2Image = data.team2Image;
  }
  let team2Title = '';
  if (data && data.team2Title) {
    team2Title = data.team2Title;
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
          <Text style={styles.eventDescription} numberOfLines={1}>
            {description}
          </Text>
          <View style={styles.bottomView}>
            <Text style={styles.eventTime}>{`${moment(startDate).format('LT')} - `}</Text>
            <Text style={styles.eventTime}>{moment(endDate).format('LT')}</Text>
            <View style={styles.timeCityDividerStyle} />
            <Text style={styles.eventTime}>{location}</Text>
          </View>
          <MatchBetweenUpcomingView
            firstUserImage={team1Image}
            firstText={team1Title}
            secondUserImage={team2Image}
            secondText={team2Title}
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
  eventDescription: {
    fontSize: 14,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
    lineHeight: 15,
    marginRight: 5,
    marginTop: 6,
    marginBottom: 3,
  },
  eventText: {
    padding: 10,
    width: wp('83%'),
  },
  eventTime: {
    fontSize: 12,
    color: colors.lightBlackColor,
    fontFamily: fonts.RLight,
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
