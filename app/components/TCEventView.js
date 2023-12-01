import React, {useContext} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableWithoutFeedback,
  ImageBackground,
} from 'react-native';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import moment from 'moment';
import images from '../Constants/ImagePath';
import colors from '../Constants/Colors';
import fonts from '../Constants/Fonts';
import EventBetweenUserItem from './Schedule/EventBetweenUserItem';
import {getSportName} from '../utils';
import AuthContext from '../auth/context';

export default function TCEventView({
  onPress,
  data,
  eventBetweenSection,
  // entity,
}) {
  const authContext = useContext(AuthContext);

  const isGame = !!(data?.game_id && data?.game);

  // let showDot = false;
  const startDate = data?.start_datetime
    ? new Date(data.start_datetime * 1000)
    : '';
  // const endDate = data?.end_datetime ? new Date(data.end_datetime * 1000) : '';
  const location =
    data?.location?.location_name ??
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
    // showDot = true;
  } else {
    // showDot = false;
  }

  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={styles.backgroundView} onPress={onPress}>
        <View>
          <ImageBackground
            source={{uri: data.background_thumbnail}}
            resizeMode="cover"
            imageStyle={styles.imageBorder}
            style={styles.eventImage}>
            <View style={{height: 100}} />
            <View style={styles.eventTitlewithDot}>
              <Text
                style={[styles.eventTitle, {color: colors.whiteColor}]}
                numberOfLines={1}>
                {title ? title.toUpperCase() : null}
              </Text>
            </View>
          </ImageBackground>
        </View>
        <View style={styles.eventText}>
          {description && (
            <Text style={styles.eventDescription} numberOfLines={2}>
              {description}
            </Text>
          )}
          <View style={styles.bottomView}>
            <Text style={styles.eventTime}>{`${moment(startDate).format(
              'ddd, MMM DD',
            )} - `}</Text>
            <Text style={styles.eventTime}>{`${moment(startDate).format(
              'h:mma',
            )}`}</Text>
            {/* <Text style={styles.eventTime}>
              {moment(endDate).format('h:mma')}
            </Text> */}
            {location !== '' && <Text style={styles.eventTime}> | </Text>}
            <Text numberOfLines={1} style={{...styles.eventTime, flex: 1}}>
              {location !== '' && location}
            </Text>
          </View>
        </View>
        <View style={styles.challengeContainer}>
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
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  eventImage: {
    flex: 1,
    borderRadius: 10,
  },
  imageBorder: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  backgroundView: {
    alignSelf: 'center',
    backgroundColor: colors.whiteColor,
    borderRadius: 10,
    elevation: 5,
    flexDirection: 'column',
    marginBottom: 15,
    shadowColor: colors.googleColor,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.5,
    shadowRadius: 7,
    width: wp('94%'),
  },
  bottomView: {
    flexDirection: 'row',
    marginTop: 5,
    alignItems: 'center',
  },
  eventDescription: {
    fontSize: 14,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
    lineHeight: 15,
  },
  eventText: {
    paddingTop: 15,
    paddingLeft: 15,
    paddingRight: 15,
    width: wp('90%'),
  },
  eventTime: {
    fontSize: 12,
    color: colors.darkBlackColor,
    fontFamily: fonts.RLight,
  },
  eventTitle: {
    fontSize: 16,
    fontFamily: fonts.RMedium,
    width: wp('90%'),
    color: colors.googleColor,
    textShadowColor: 'rgba(0, 0, 0, 1)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 7,
    fontWeight: 'bold',
  },
  eventTitlewithDot: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  challengeContainer: {
    padding: 10,
  },
});
