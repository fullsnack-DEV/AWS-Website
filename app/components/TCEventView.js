import React, {useContext} from 'react';
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
import LinearGradient from 'react-native-linear-gradient';
import images from '../Constants/ImagePath';
import colors from '../Constants/Colors';
import fonts from '../Constants/Fonts';
import EventOfItem from './Schedule/EventOfItem';
import EventBetweenUserItem from './Schedule/EventBetweenUserItem';
import {getHitSlop, getSportName} from '../utils';
import AuthContext from '../auth/context';

export default function TCEventView({
  onPress,
  data,
  onThreeDotPress,
  eventBetweenSection,
  // entity,
}) {
  const authContext = useContext(AuthContext);

  console.log('data::=>', data);
  const isGame = !!(data?.game_id && data?.game);

  let showDot = false;
  const startDate = data?.start_datetime
    ? new Date(data.start_datetime * 1000)
    : '';
  const endDate = data?.end_datetime ? new Date(data.end_datetime * 1000) : '';
  const location =
    data?.location ??
    data?.game?.venue?.address ??
    data?.game?.venue?.description ??
    '';
  const description = data?.descriptions ? data.descriptions : null;
  const title = isGame ? getSportName(data.game, authContext) : data.title;

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
    (dataObj?.game?.referees || []).some(
      (e) => authContext.entity.uid === e.referee_id,
    );
  const scorekeeperFound = (dataObj) =>
    (dataObj?.game?.scorekeepers || []).some(
      (e) => authContext.entity.uid === e.scorekeeper_id,
    );

  if (
    data?.game?.home_team?.group_id === authContext.entity.uid ||
    data?.game?.away_team?.group_id === authContext.entity.uid ||
    data?.game?.home_team?.user_id === authContext.entity.uid ||
    data?.game?.away_team?.user_id === authContext.entity.uid ||
    (!data?.game &&
      data?.participants?.[0]?.entity_id === authContext.entity.uid) ||
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
        <LinearGradient
          colors={
            isGame
              ? [colors.yellowColor, colors.darkThemeColor]
              : [colors.greenGradientEnd, colors.greenGradientStart]
          }
          style={styles.colorView}>
          {data?.allDay && data?.allDay === true ? (
            <Text style={styles.allTypeText}>{'All'}</Text>
          ) : (
            <Text style={styles.dateMonthText}>
              {moment(startDate).format('h')}
              <Text style={styles.dateMonthSmallText}>
                :{moment(startDate).format('mm')}
              </Text>
            </Text>
          )}
          {data?.allDay && data?.allDay === true ? (
            <Text style={styles.dateText}>Day</Text>
          ) : (
            <Text style={styles.dateText}>{moment(startDate).format('a')}</Text>
          )}
        </LinearGradient>
        <View style={styles.eventText}>
          <View style={styles.eventTitlewithDot}>
            <Text
              style={[
                styles.eventTitle,
                {color: isGame ? colors.themeColor : colors.greenGradientStart},
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
          {description && (
            <Text style={styles.eventDescription} numberOfLines={2}>
              {description}
            </Text>
          )}
          <View style={styles.bottomView}>
            <Text style={styles.eventTime}>{`${moment(startDate).format(
              'h:mma',
            )} - `}</Text>
            <Text style={styles.eventTime}>
              {moment(endDate).format('h:mma')}
            </Text>
            {location !== '' && (
              <Text style={[styles.eventTime, {marginHorizontal: 5}]}> | </Text>
            )}
            <Text numberOfLines={1} style={{...styles.eventTime, flex: 1}}>
              {location !== '' && location}
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
          {data?.game?.referees?.length > 0 && (
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
    fontSize: 20,
    fontFamily: fonts.RBold,
  },
  dateMonthSmallText: {
    color: colors.whiteColor,
    fontSize: 10,
    fontFamily: fonts.RBold,
  },
  allTypeText: {
    color: colors.whiteColor,
    fontSize: 20,
    fontFamily: fonts.RBold,
  },
  dateText: {
    color: colors.whiteColor,
    fontSize: 16,
    fontFamily: fonts.RLight,
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
    fontFamily: fonts.RMedium,
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
