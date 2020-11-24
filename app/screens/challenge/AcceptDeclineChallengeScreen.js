import React, { useEffect, useState } from 'react';
import {
  StyleSheet, View, Text, Image, FlatList, Alert,
} from 'react-native';

import { useIsFocused } from '@react-navigation/native';
import { getChallenge, acceptDeclineChallenge } from '../../api/Challenge';
import ActivityLoader from '../../components/loader/ActivityLoader';
import * as Utility from '../../utils/index';
import strings from '../../Constants/String';
import fonts from '../../Constants/Fonts';
import colors from '../../Constants/Colors';
import TCGradientButton from '../../components/TCGradientButton';
import TCKeyboardView from '../../components/TCKeyboardView';
import TCThickDivider from '../../components/TCThickDivider';
import images from '../../Constants/ImagePath';
import TCLabel from '../../components/TCLabel';
import TCThinDivider from '../../components/TCThinDivider';
import TCInfoImageField from '../../components/TCInfoImageField';
import TCInfoField from '../../components/TCInfoField';
import EventMapView from '../../components/Schedule/EventMapView';
import ReservationStatus from '../../Constants/ReservationStatus';
import TCBorderButton from '../../components/TCBorderButton';
import MatchFeesCard from '../../components/challenge/MatchFeesCard';

let entity = {};
export default function CreateChallengeForm4({ navigation, route }) {
  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'June',
    'July',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const isFocused = useIsFocused();
  const [loading, setloading] = useState(true);
  const [homeTeam, setHomeTeam] = useState();
  const [awayTeam, setAwayTeam] = useState();
  const [bodyParams, setbodyParams] = useState();

  useEffect(() => {
    const getAuthEntity = async () => {
      entity = await Utility.getStorage('loggedInEntity');
      if (route && route.params && route.params.challengeID) {
        getChallengeDetail(route.params.challengeID);

        console.log('TEams::', route.params.challengeID);
      }
    };
    getAuthEntity();
    if (route && route.params && route.params.body) {
      console.log('BODY PARAMS:', route.params.body);
      setbodyParams(route.params.body);
    }
  }, [isFocused]);

  const acceptDeclineChallengeOperation = (teamID, ChallengeId, versionNo, status) => {
    setloading(true)
    acceptDeclineChallenge(teamID, ChallengeId, versionNo, status).then((response) => {
      setloading(false);
      console.log(JSON.stringify(response.payload));
      console.log('STATUS::', status);

      if (status === 'accept') {
        navigation.navigate('ChallengeAcceptedDeclinedScreen', { teamObj: awayTeam, status: 'accept' })
      } else {
        navigation.navigate('ChallengeAcceptedDeclinedScreen', { teamObj: awayTeam, status: 'decline' })
      }
    }).catch((error) => {
      setloading(false)
      Alert.alert(error.messages)
    })
  }
  const getChallengeDetail = (challengeID) => {
    getChallenge(challengeID).then((response) => {
      setbodyParams(response.payload[0]);
      console.log(JSON.stringify(response.payload));
      setloading(false);
      if (response.payload[0].away_team.group_id === entity.uid) {
        setHomeTeam(response.payload[0].away_team);
        setAwayTeam(response.payload[0].home_team);
        console.log('HOME::', homeTeam);
      } else {
        setHomeTeam(response.payload[0].home_team);
        setAwayTeam(response.payload[0].away_team);
        console.log('HOME::', homeTeam);
        console.log('AWAY::', awayTeam);
      }
    }).catch((error) => {
      setloading(false)
      Alert.alert(error.messages)
    })
  };

  const tConvert = (timeString) => {
    const timeString12hr = new Date(
      `1970-01-01T${timeString}Z`,
    ).toLocaleTimeString(
      {},
      {
        timeZone: 'UTC',
        hour12: true,
        hour: 'numeric',
        minute: 'numeric',
      },
    );
    return timeString12hr;
  };
  const time_format = (d) => {
    const hours = format_two_digits(d.getHours());
    const minutes = format_two_digits(d.getMinutes());
    const seconds = format_two_digits(d.getSeconds());
    return tConvert(`${hours}:${minutes}:${seconds}`);
  };
  const format_two_digits = (n) => (n < 10 ? `0${n}` : n);
  // eslint-disable-next-line consistent-return
  const getTimeDifferent = (sDate, eDate) => {
    let delta = Math.abs(new Date(sDate).getTime() - new Date(eDate).getTime()) / 1000;

    const days = Math.floor(delta / 86400);
    delta -= days * 86400;

    const hours = Math.floor(delta / 3600) % 24;
    delta -= hours * 3600;

    const minutes = Math.floor(delta / 60) % 60;
    delta -= minutes * 60;

    return `${hours} hours ${minutes} minutes`;
  };
  const getDayTimeDifferent = (sDate, eDate) => {
    let delta = Math.abs(new Date(sDate).getTime() - new Date(eDate).getTime()) / 1000;

    const days = Math.floor(delta / 86400);
    delta -= days * 86400;

    const hours = Math.floor(delta / 3600) % 24;
    delta -= hours * 3600;

    const minutes = Math.floor(delta / 60) % 60;
    delta -= minutes * 60;

    return `${days}d ${hours}h ${minutes}m`;
  };

  const renderSecureReferee = ({ item, index }) => (
    <TCInfoImageField
      title={
        index === 0 ? `Referee ${index + 1} (Chief)` : `Referee ${index + 1}`
      }
      name={
        homeTeam
        && awayTeam
        && ((item.responsible_team_id === 'none' && 'None')
          || (item.responsible_team_id === homeTeam.group_id
            ? homeTeam.group_name
            : awayTeam.group_name))
      }
      marginLeft={30}
    />
  );

  const renderSecureScorekeeper = ({ item, index }) => (
    <TCInfoImageField
      title={`Scorekeeper ${index + 1}`}
      name={
        homeTeam
        && awayTeam
        && ((item.responsible_team_id === 'none' && 'None')
          || (item.responsible_team_id === homeTeam.group_id
            ? homeTeam.group_name
            : awayTeam.group_name))
      }
      marginLeft={30}
    />
  );

  // eslint-disable-next-line consistent-return
  const checkSenderOrReceiver = (challengeObj) => {
    if (!challengeObj.userChallenge) {
      if (challengeObj.status === ReservationStatus.offered) {
        if (entity.uid === bodyParams.created_by.group_id) {
          return 'sender';
        }
        return 'receiver';
      }
      if (challengeObj.change_requested_by === entity.uid) {
        return 'sender';
      }
      return 'receiver';
    }
    console.log('challenge for user to user');
  };

  // eslint-disable-next-line consistent-return
  const getTeamName = (challengeObject) => {
    if (!challengeObject.userChallenge) {
      if (challengeObject.home_team.group_id === entity.uid) {
        return challengeObject.away_team.group_name;
      }
      return challengeObject.home_team.group_name;
    }
    console.log('user challenge');
  };
  return (

    <TCKeyboardView>
      <ActivityLoader visible={loading} />
      {homeTeam && awayTeam && bodyParams && <View>
        <View
        style={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'space-between',
          margin: 15,
        }}>
          <View style={styles.challengerView}>
            <View style={styles.teamView}>
              <Image source={images.requestOut} style={styles.reqOutImage} />
              <Text style={styles.challengerText}>Challenger</Text>
            </View>

            <View style={styles.teamView}>
              <Image source={images.teamPlaceholder} style={styles.teamImage} />
              <Text style={styles.teamNameText}>
                {awayTeam && awayTeam.group_name}

              </Text>
            </View>
          </View>
          <View style={styles.challengeeView}>
            <View style={styles.teamView}>
              <Image source={images.requestIn} style={styles.reqOutImage} />
              <Text style={styles.challengeeText}>Challengee</Text>
            </View>

            <View style={styles.teamView}>
              <Image source={images.teamPlaceholder} style={styles.teamImage} />
              <Text
              style={{
                marginLeft: 5,
                fontFamily: fonts.RMedium,
                fontSize: 16,
                color: colors.lightBlackColor,
              }}>
                {homeTeam && homeTeam.group_name}
              </Text>
            </View>
          </View>
        </View>
        <TCThinDivider />
        {checkSenderOrReceiver(bodyParams) === 'sender'
      && bodyParams.status === ReservationStatus.offered ? (
        <View>
          {bodyParams.offer_expiry > new Date().getTime() ? (
            <Text style={styles.challengeMessage}>OFFER EXPIRED</Text>
          ) : (
            <Text style={styles.challengeMessage}>
              RESERVATION REQUEST SENT
            </Text>
          )}
          {bodyParams.offer_expiry > new Date().getTime() ? (
            <Text style={styles.challengeText}>
              Your team sent a match reservation request to{' '}
              {getTeamName(bodyParams)}.
            </Text>
          ) : (
            <Text style={styles.challengeText}>
              Your team sent a match reservation request to{' '}
              {getTeamName(bodyParams)}. This request will be expired in{' '}
              <Text style={styles.timeText}>
                {getDayTimeDifferent(
                  bodyParams.offer_expiry * 1000,
                  new Date().getTime(),
                )}
                .
              </Text>
            </Text>
          )}
        </View>
          ) : (
            <View>
              {bodyParams.offer_expiry > new Date().getTime() ? (
                <Text style={styles.challengeMessage}>OFFER EXPIRED</Text>
              ) : (
                <Text style={styles.challengeMessage}>
                  RESERVATION REQUEST RECEIVED
                </Text>
              )}
              {bodyParams.offer_expiry > new Date().getTime() ? (
                <Text style={styles.challengeText}>
                  Your team received a match reservation request from{' '}
                  {getTeamName(bodyParams)}.
                </Text>
              ) : (
                <Text style={styles.challengeText}>
                  Your team received a match reservation request from{' '}
                  {getTeamName(bodyParams)}. This request will be expired in{' '}
                  <Text style={styles.timeText}>
                    {getDayTimeDifferent(
                      bodyParams.offer_expiry * 1000,
                      new Date().getTime(),
                    )}
                    .
                  </Text>
                </Text>
              )}
            </View>
          )}

        <TCThickDivider />
        {bodyParams && (
          <View>
            <TCLabel title={`Match · ${bodyParams.sport}`} />
            <TCInfoImageField
            title={'Home'}
            name={bodyParams.home_team.group_name}
            marginLeft={30}
          />
            <TCThinDivider />
            <TCInfoImageField
            title={'Away'}
            name={bodyParams.away_team.group_name}
            marginLeft={30}
          />
            <TCThinDivider />
            <TCInfoField
            title={'Time'}
            value={`${
              monthNames[new Date(bodyParams.start_datetime * 1000).getMonth()]
            } ${new Date(
              bodyParams.start_datetime * 1000,
            ).getDate()}, ${new Date(
              bodyParams.start_datetime * 1000,
            ).getFullYear()} ${time_format(
              new Date(new Date(bodyParams.start_datetime * 1000)),
            )} - \n${
              monthNames[new Date(bodyParams.end_datetime * 1000).getMonth()]
            } ${new Date(bodyParams.end_datetime * 1000).getDate()}, ${new Date(
              bodyParams.end_datetime * 1000,
            ).getFullYear()} ${time_format(
              new Date(new Date(bodyParams.end_datetime * 1000)),
            )}\n( ${getTimeDifferent(
              new Date(bodyParams.start_datetime * 1000),
              new Date(bodyParams.end_datetime * 1000),
            )} )`}
            marginLeft={30}
            titleStyle={{ fontSize: 16 }}
          />
            <TCThinDivider />
            <TCInfoField
            title={'Venue'}
            value={bodyParams.venue.title}
            marginLeft={30}
            titleStyle={{ fontSize: 16 }}
          />
            <TCThinDivider />
            <TCInfoField
            title={'Address'}
            value={bodyParams.venue.address}
            marginLeft={30}
            titleStyle={{ fontSize: 16 }}
          />
            <EventMapView
            coordinate={{
              latitude: bodyParams.venue.lat,
              longitude: bodyParams.venue.long,
            }}
            region={{
              latitude: bodyParams.venue.lat,
              longitude: bodyParams.venue.long,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            style={styles.map}
          />
            <TCThickDivider marginTop={20} />
          </View>
        )}

        {bodyParams && (
          <View>
            <TCLabel title={'Responsibility  to Secure Venue'} />
            <View style={styles.viewContainer}>
              <View style={styles.fieldValue}>
                <Image source={images.teamPlaceholder} style={styles.imageView} />
                <Text style={styles.teamNameText} numberOfLines={1}>
                  {bodyParams.responsible_to_secure_venue}
                </Text>
              </View>
            </View>
            <TCThickDivider marginTop={8} />
          </View>
        )}
        {bodyParams && (
          <View>
            <TCLabel title={'Rules'} />
            <Text style={styles.rulesText}>{bodyParams.special_rule}</Text>
          </View>
        )}
        <TCThickDivider marginTop={20} />
        <View>
          <TCLabel title={'Responsibility to Secure Referees'} />
          {bodyParams && (
            <FlatList
            data={bodyParams.referee}
            renderItem={renderSecureReferee}
            keyExtractor={(item, index) => index.toString()}
            ItemSeparatorComponent={() => <TCThinDivider />}
          />
          )}
        </View>
        <TCThickDivider marginTop={10} />
        <View>
          <TCLabel title={'Responsibility to Secure ScoreKeeper'} />
          {bodyParams && (
            <FlatList
            data={bodyParams.scorekeeper}
            renderItem={renderSecureScorekeeper}
            keyExtractor={(item, index) => index.toString()}
            ItemSeparatorComponent={() => <TCThinDivider />}
          />
          )}
        </View>
        <TCThickDivider marginTop={10} />
        <TCLabel title={checkSenderOrReceiver(bodyParams) === 'sender' ? 'Payment' : 'Earning'} />
        <MatchFeesCard challengeObj={bodyParams} senderOrReceiver={checkSenderOrReceiver(bodyParams) === 'sender' ? 'sender' : 'receiver'}/>
        <Text style={styles.responsibilityNote}>
          These match fee doesn’t include the <Text style = {styles.responsibilityNoteMedium}>Match Place Fee, Referee Fee
          </Text> and <Text style = {styles.responsibilityNoteMedium}>Scorekeeper Fee.</Text> The match place, referees and
          scorekeepers should be secured by the team who has charge of
          them at its own expense.
        </Text>
        {checkSenderOrReceiver(bodyParams) === 'sender'
      && bodyParams.status === ReservationStatus.offered ? <View>
        <TCBorderButton title={strings.calcelRequest} textColor={colors.grayColor} borderColor={colors.grayColor} height={40} shadow={true}/>
      </View> : <View style={{ marginTop: 15 }}>
        <TCBorderButton
        title={strings.decline}
        textColor={colors.grayColor}
        borderColor={colors.grayColor}
        height={40}
        shadow={true}
        onPress={() => {
          acceptDeclineChallengeOperation(entity.uid, bodyParams.challenge_id, bodyParams.version, 'decline')
        }}/>
        <TCGradientButton
        title={strings.accept}
        onPress={() => {
          acceptDeclineChallengeOperation(entity.uid, bodyParams.challenge_id, bodyParams.version, 'accept')
        }
        }
      />
      </View> }
      </View>}
    </TCKeyboardView>
  );
}
const styles = StyleSheet.create({
  viewContainer: {
    marginLeft: 15,
    marginRight: 15,
  },

  map: {
    height: 150,
    marginTop: 15,
    marginBottom: 15,
    marginLeft: 15,
  },
  rulesText: {
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
    marginLeft: 15,
    marginRight: 15,
  },

  fieldValue: {
    flexDirection: 'row',
    alignItems: 'center',
    fontSize: 16,
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,
    flex: 0.7,
    marginRight: 15,
  },
  imageView: {
    width: 25,
    height: 25,
    resizeMode: 'cover',
  },
  teamView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reqOutImage: {
    width: 25,
    height: 25,
    resizeMode: 'cover',
  },
  challengeeText: {
    marginLeft: 5,
    fontFamily: fonts.RRegular,
    fontSize: 14,
    color: colors.themeColor,
  },
  challengerText: {
    marginLeft: 5,
    fontFamily: fonts.RRegular,
    fontSize: 14,
    color: colors.greenGradientStart,
  },
  teamImage: {
    width: 20,
    height: 20,
    resizeMode: 'cover',
  },
  teamNameText: {
    marginLeft: 5,
    fontFamily: fonts.RMedium,
    fontSize: 16,
    color: colors.lightBlackColor,
  },
  challengerView: {
    marginRight: 15,
    flex: 0.5,
  },
  challengeeView: {
    flex: 0.5,
  },
  challengeMessage: {
    fontFamily: fonts.RBold,
    fontSize: 12,
    color: colors.themeColor,
    margin: 15,
    marginBottom: 5,
  },
  challengeText: {
    fontFamily: fonts.RMedium,
    fontSize: 23,
    color: colors.lightBlackColor,
    marginLeft: 15,
    marginRight: 15,
    marginBottom: 15,
  },
  timeText: {
    color: colors.themeColor,
  },
  responsibilityNote: {
    fontSize: 12,
    fontFamily: fonts.RRegular,
    color: colors.orangeNotesColor,
    marginLeft: 15,
    marginRight: 15,
    marginTop: 10,
    marginBottom: 10,
  },
  responsibilityNoteMedium: {
    fontFamily: fonts.RMedium,
  },
});
