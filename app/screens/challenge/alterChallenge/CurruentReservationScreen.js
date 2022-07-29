import React, {useEffect, useState, useContext} from 'react';
import {StyleSheet, View, Text, Image, FlatList} from 'react-native';
import moment from 'moment';
import {useIsFocused} from '@react-navigation/native';

import strings from '../../../Constants/String';
import fonts from '../../../Constants/Fonts';
import colors from '../../../Constants/Colors';
import AuthContext from '../../../auth/context';
import TCKeyboardView from '../../../components/TCKeyboardView';
import TCThickDivider from '../../../components/TCThickDivider';
import images from '../../../Constants/ImagePath';
import TCLabel from '../../../components/TCLabel';
import TCThinDivider from '../../../components/TCThinDivider';
import TCInfoImageField from '../../../components/TCInfoImageField';
import TCInfoField from '../../../components/TCInfoField';
import EventMapView from '../../../components/Schedule/EventMapView';
import ReservationStatus from '../../../Constants/ReservationStatus';
import TCBorderButton from '../../../components/TCBorderButton';
import MatchFeesCard from '../../../components/challenge/MatchFeesCard';
import ReservationNumber from '../../../components/reservations/ReservationNumber';

let entity = {};

export default function CurruentReservationScreen({route}) {
  const authContext = useContext(AuthContext);

  const isFocused = useIsFocused();
  const [homeTeam, setHomeTeam] = useState();
  const [awayTeam, setAwayTeam] = useState();
  const [bodyParams, setbodyParams] = useState();

  useEffect(() => {
    entity = authContext.entity;

    const {body} = route.params ?? {};

    setbodyParams(body);

    if (body.away_team.group_id === entity.uid) {
      setHomeTeam(body.away_team);
      setAwayTeam(body.home_team);
    } else {
      setHomeTeam(body.home_team);
      setAwayTeam(body.away_team);
    }
  }, [isFocused]);

  const getDateFormat = (dateValue) => {
    moment.locale('en');
    return moment(new Date(dateValue)).format('MMM DD, yy hh:mm a');
  };

  // eslint-disable-next-line consistent-return
  const getTimeDifferent = (sDate, eDate) => {
    let delta =
      Math.abs(new Date(sDate).getTime() - new Date(eDate).getTime()) / 1000;

    const days = Math.floor(delta / 86400);
    delta -= days * 86400;

    const hours = Math.floor(delta / 3600) % 24;
    delta -= hours * 3600;

    const minutes = Math.floor(delta / 60) % 60;
    delta -= minutes * 60;

    return `${hours} hours ${minutes} minutes`;
  };
  const renderSecureReferee = ({item, index}) => (
    <TCInfoImageField
      title={
        index === 0 ? `Referee ${index + 1} (Chief)` : `Referee ${index + 1}`
      }
      name={
        homeTeam &&
        awayTeam &&
        ((item.responsible_team_id === 'none' && 'None') ||
          (item.responsible_team_id === (homeTeam.group_id ?? homeTeam.user_id)
            ? homeTeam.group_name ||
              `${homeTeam.first_name} ${homeTeam.last_name}`
            : awayTeam.group_name ||
              `${awayTeam.first_name} ${awayTeam.last_name}`))
      }
      marginLeft={30}
    />
  );

  const renderSecureScorekeeper = ({item, index}) => (
    <TCInfoImageField
      title={`Scorekeeper ${index + 1}`}
      name={
        homeTeam &&
        awayTeam &&
        ((item.responsible_team_id === 'none' && 'None') ||
          (item.responsible_team_id === (homeTeam.group_id ?? awayTeam.user_id)
            ? homeTeam.group_name ||
              `${homeTeam.first_name} ${homeTeam.last_name}`
            : awayTeam.group_name ||
              `${awayTeam.first_name} ${awayTeam.last_name}`))
      }
      marginLeft={30}
    />
  );

  // eslint-disable-next-line consistent-return
  const checkSenderOrReceiver = (challengeObj) => {
    if (!challengeObj.userChallenge) {
      if (
        challengeObj.status === ReservationStatus.pendingpayment ||
        challengeObj.status === ReservationStatus.pendingrequestpayment
      ) {
        if (challengeObj.invited_by === entity.uid) {
          return 'sender';
        }
        return 'receiver';
      }
      if (challengeObj.status === ReservationStatus.offered) {
        if (entity.uid === bodyParams.created_by.group_id) {
          return 'sender';
        }
        return 'receiver';
      }

      if (challengeObj.updated_by.group_id === entity.uid) {
        return 'sender';
      }
      return 'receiver';
      // if (challengeObj.requested_by === entity.uid) {
      //   return 'sender';
      // }
      // return 'receiver';
    }
    console.log('challenge for user to user');
    if (
      challengeObj.status === ReservationStatus.pendingpayment ||
      challengeObj.status === ReservationStatus.pendingrequestpayment
    ) {
      if (challengeObj.invited_by === entity.uid) {
        return 'sender';
      }
      return 'receiver';
    }
    if (challengeObj.status === ReservationStatus.offered) {
      if (entity.uid === bodyParams.created_by.uid) {
        return 'sender';
      }
      return 'receiver';
    }

    if (challengeObj.updated_by.uid === entity.uid) {
      return 'sender';
    }
    return 'receiver';
    // if (challengeObj.requested_by === entity.uid) {
    //   return 'sender';
    // }
    // return 'receiver';
  };

  return (
    <TCKeyboardView>
      {homeTeam && awayTeam && bodyParams && (
        <View>
          <ReservationNumber reservationNumber={bodyParams.challenge_id} />
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
                <Image
                  source={images.teamPlaceholder}
                  style={styles.teamImage}
                />
                <Text style={styles.teamNameText}>
                  {bodyParams?.invited_by ===
                  (bodyParams?.home_team?.group_id ??
                    bodyParams?.home_team?.user_id)
                    ? bodyParams.home_team.group_name ||
                      `${bodyParams.home_team.first_name} ${bodyParams.home_team.last_name}`
                    : bodyParams.away_team.group_name ||
                      `${bodyParams.away_team.first_name} ${bodyParams.away_team.last_name}`}
                </Text>
              </View>
            </View>
            <View style={styles.challengeeView}>
              <View style={styles.teamView}>
                <Image source={images.requestIn} style={styles.reqOutImage} />
                <Text style={styles.challengeeText}>Challengee</Text>
              </View>

              <View style={styles.teamView}>
                <Image
                  source={images.teamPlaceholder}
                  style={styles.teamImage}
                />
                <Text
                  style={{
                    marginLeft: 5,
                    fontFamily: fonts.RMedium,
                    fontSize: 16,
                    color: colors.lightBlackColor,
                  }}>
                  {bodyParams.invited_by ===
                  (bodyParams.home_team.group_id ??
                    bodyParams.home_team.user_id)
                    ? bodyParams.away_team.group_name ||
                      `${bodyParams.away_team.first_name} ${bodyParams.away_team.last_name}`
                    : bodyParams.home_team.group_name ||
                      `${bodyParams.home_team.first_name} ${bodyParams.home_team.last_name}`}
                </Text>
              </View>
            </View>
          </View>

          <TCThickDivider />
          {bodyParams && (
            <View>
              <View style={styles.editableView}>
                <TCLabel title={`Match · ${bodyParams.sport}`} />
              </View>
              <TCInfoImageField
                title={'Home'}
                name={
                  bodyParams.home_team.group_name ||
                  `${bodyParams.home_team.first_name} ${bodyParams.home_team.last_name}`
                }
                marginLeft={30}
              />
              <TCThinDivider />
              <TCInfoImageField
                title={'Away'}
                name={
                  bodyParams.away_team.group_name ||
                  `${bodyParams.away_team.first_name} ${bodyParams.away_team.last_name}`
                }
                marginLeft={30}
              />
              <TCThinDivider />
              <TCInfoField
                title={'Time'}
                value={`${getDateFormat(
                  bodyParams.start_datetime * 1000,
                )} -\n${getDateFormat(
                  bodyParams.end_datetime * 1000,
                )}\n${getTimeDifferent(
                  new Date(bodyParams.start_datetime * 1000),
                  new Date(bodyParams.end_datetime * 1000),
                )}`}
                marginLeft={30}
                titleStyle={{fontSize: 16}}
              />
              <TCThinDivider />
              <TCInfoField
                title={'Venue'}
                value={bodyParams.venue.title}
                marginLeft={30}
                titleStyle={{fontSize: 16}}
              />
              <TCThinDivider />
              <TCInfoField
                title={'Address'}
                value={bodyParams.venue.address}
                marginLeft={30}
                titleStyle={{fontSize: 16}}
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
              <View style={styles.editableView}>
                <TCLabel title={'Responsibility  to Secure Venue'} />
              </View>

              <View style={styles.viewContainer}>
                <View style={styles.fieldValue}>
                  <Image
                    source={
                      // eslint-disable-next-line no-nested-ternary
                      bodyParams.home_team.group_name ===
                      bodyParams.responsible_to_secure_venue
                        ? bodyParams.home_team.thumbnail
                          ? {uri: bodyParams.home_team.thumbnail}
                          : images.teamPlaceholder
                        : bodyParams.away_team.thumbnail
                        ? {uri: bodyParams.away_team.thumbnail}
                        : images.teamPlaceholder
                    }
                    style={styles.imageView}
                  />
                  <Text style={styles.teamNameText} numberOfLines={1}>
                    {bodyParams.responsible_to_secure_venue}
                  </Text>
                </View>
              </View>

              <TCThickDivider marginTop={20} />
            </View>
          )}
          {bodyParams && (
            <View>
              <View style={styles.editableView}>
                <TCLabel title={'Rules'} />
              </View>
              <Text style={styles.rulesText}>{bodyParams.special_rule}</Text>
            </View>
          )}
          <TCThickDivider marginTop={20} />
          <View>
            <View style={styles.editableView}>
              <TCLabel title={'Responsibility to Secure Referees'} />
            </View>
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
            <View style={styles.editableView}>
              <TCLabel title={'Responsibility to Secure ScoreKeeper'} />
            </View>
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
          <View style={styles.editableView}>
            <TCLabel
              title={
                checkSenderOrReceiver(bodyParams) === 'sender'
                  ? 'Payment'
                  : 'Earning'
              }
            />
          </View>

          <MatchFeesCard
            challengeObj={bodyParams}
            senderOrReceiver={
              checkSenderOrReceiver(bodyParams) === 'sender'
                ? 'sender'
                : 'receiver'
            }
          />
          <Text style={styles.responsibilityNote}>
            These match fee doesn’t include the{' '}
            <Text style={styles.responsibilityNoteMedium}>
              Match Place Fee, Referee Fee
            </Text>{' '}
            and{' '}
            <Text style={styles.responsibilityNoteMedium}>
              Scorekeeper Fee.
            </Text>{' '}
            The match place, referees and scorekeepers should be secured by the
            team who has charge of them at its own expense.
          </Text>
          {checkSenderOrReceiver(bodyParams) === 'sender' &&
            bodyParams.status === ReservationStatus.offered &&
            bodyParams.offer_expiry < new Date().getTime() && (
              <View>
                <TCBorderButton
                  title={strings.calcelRequest}
                  textColor={colors.grayColor}
                  borderColor={colors.grayColor}
                  height={40}
                  shadow={true}
                />
              </View>
            )}
        </View>
      )}
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
    borderRadius: 13,
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

  editableView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginRight: 15,
  },
});
