import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from 'react-native';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import moment from 'moment';
import images from '../Constants/ImagePath';
import colors from '../Constants/Colors';
import fonts from '../Constants/Fonts';
import EventOfItem from './Schedule/EventOfItem';
import EventBetweenUserItem from './Schedule/EventBetweenUserItem';
import {getHitSlop} from '../utils';

export default function TCEventView({
  onPress,
  data,
  onThreeDotPress,
  eventBetweenSection,
  eventOfSection,
  entity,
  profileID,
  screenUserId,
}) {
  console.log('data.game.referees', data);
  let showDot = false;
  let startDate = '';
  if (data && data.start_datetime) {
    startDate = new Date(data.start_datetime * 1000);
  }
  let endDate = '';
  if (data && data.end_datetime) {
    endDate = new Date(data.end_datetime * 1000);
  }
  let eventColor = colors.themeColor;
  if (data && data.color) {
    eventColor = data.color;
  }
  let location = '';
  if (data && data.location) {
    location = data.location;
  }
  let venue = '';
  if (data && data.game && data.game.venue) {
    venue = data.game.venue.address ?? data.game.venue.description;
  }
  let description = 'Game With';
  if (data && data.descriptions) {
    description = data.descriptions;
  }
  let description2 = '';
  if (data?.game) {
    if (
      profileID ===
      (data?.game?.home_team?.group_id || data?.game?.home_team?.user_id)
    ) {
      if (data?.game?.home_team?.group_id) {
        description2 = data?.game?.away_team?.group_name;
      } else {
        description2 = `${data?.game?.away_team?.first_name} ${data?.game?.away_team?.last_name}`;
      }
    } else if (data?.game?.away_team?.group_id) {
      description2 = data?.game?.home_team?.group_name;
    } else {
      description2 = `${data?.game?.home_team?.first_name} ${data?.game?.home_team?.last_name}`;
    }
  } else {
    description2 = '';
  }

  // if (data && data.game && data.game.away_team) {
  //   if (data.game.away_team.full_name) {
  //     description2 = data.game.away_team.full_name;
  //   } else {
  //     description2 = data.game.away_team.group_name;
  //   }
  // }
  let title = 'Game';
  if (data && data.title) {
    title = data.title;
  }
  let homeTeamName = '';
  let homeTeamImage = null;
  if (data && data.game && data.game.home_team) {
    if (data.game.home_team.full_name) {
      homeTeamName = data.game.home_team.full_name;
    } else {
      homeTeamName = data.game.home_team.group_name;
    }
    if (data.game.home_team.thumbnail) {
      homeTeamImage = data.game.home_team.thumbnail;
    }
  }
  let awayTeamName = '';
  let awayTeamImage = null;
  if (data && data.game && data.game.away_team) {
    if (data.game.away_team.full_name) {
      awayTeamName = data.game.away_team.full_name;
    } else {
      awayTeamName = data.game.away_team.group_name;
    }
    if (data.game.away_team.thumbnail) {
      awayTeamImage = data.game.away_team.thumbnail;
    }
  }
  const refereeFound = (dataObj) =>
    (dataObj?.game?.referees || []).some((e) => entity.uid === e.referee_id);
  const scorekeeperFound = (dataObj) =>
    (dataObj?.game?.scorekeepers || []).some(
      (e) => entity.uid === e.scorekeeper_id,
    );

  

  if (
    screenUserId === entity.uid ||
    refereeFound(data) ||
    scorekeeperFound(data)
  ) {
    showDot = true;
  } else {
    showDot = false;
  }

  return (
    <TouchableWithoutFeedback style={styles.backgroundView} onPress={onPress}>
      <View style={styles.backgroundView} onPress={onPress}>
        <View
          style={[
            styles.colorView,
            {
              backgroundColor:
                eventColor[0] !== '#' ? `#${eventColor}` : eventColor,
            },
          ]}>
          <Text style={styles.dateMonthText}>
            {moment(startDate).format('MMM')}
          </Text>
          <Text style={styles.dateText}>{moment(startDate).format('DD')}</Text>
        </View>
        <View style={styles.eventText}>
          <View style={styles.eventTitlewithDot}>
            <Text
              style={[
                styles.eventTitle,
                {color: eventColor[0] !== '#' ? `#${eventColor}` : eventColor},
              ]}
              numberOfLines={1}>
              {title}
            </Text>
            {showDot && (
              <TouchableOpacity
                onPress={onThreeDotPress}
                hitSlop={getHitSlop(15)}>
                <Image source={images.vertical3Dot} style={styles.threedot} />
              </TouchableOpacity>
            )}
          </View>
          <Text style={styles.eventDescription} numberOfLines={2}>
            {description} {description2}
          </Text>
          <View style={styles.bottomView}>
            <Text style={styles.eventTime}>{`${moment(startDate).format(
              'LT',
            )} - `}</Text>
            <Text style={styles.eventTime}>{moment(endDate).format('LT')}</Text>
            {(location !== '' || venue !== '') && (
              <Text style={[styles.eventTime, {marginHorizontal: 5}]}> | </Text>
            )}
            <Text numberOfLines={1} style={{...styles.eventTime, flex: 1}}>
              {location !== '' ? location : venue}
            </Text>
          </View>
          {eventBetweenSection && (
            <EventBetweenUserItem
              firstUserImage={
                homeTeamImage ? {uri: homeTeamImage} : images.team_ph
              }
              firstText={homeTeamName !== '' ? homeTeamName : 'Newyork City FC'}
              secondUserImage={
                awayTeamImage ? {uri: awayTeamImage} : images.team_ph
              }
              secondText={
                awayTeamName !== '' ? awayTeamName : 'Vancouver Whitecaps'
              }
            />
          )}
          {eventOfSection && (
            <EventOfItem
              eventOfText={'Referee'}
              refereeList={data?.game?.referees}
              // countryIcon={
              //   refereeImage ? { uri: refereeImage } : images.profilePlaceHolder
              // }
            />
          )}
          {data?.game?.scorekeepers?.length > 0 && (
            <EventOfItem
              eventOfText={'Scorekeeper'}
              refereeList={data?.game?.scorekeepers}
              // countryIcon={
              //   refereeImage ? { uri: refereeImage } : images.profilePlaceHolder
              // }
            />
          )}
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
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.5,
    shadowRadius: 5,
    width: wp('94%'),
  },
  bottomView: {
    flexDirection: 'row',
    marginTop: 10,
    alignItems: 'center',
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
    fontFamily: fonts.RRegular,
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
});
