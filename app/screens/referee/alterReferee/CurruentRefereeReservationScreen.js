/* eslint-disable react/no-unescaped-entities */
import React, { useEffect, useState, useContext } from 'react';
import {
 StyleSheet, View, Text, Image,
 } from 'react-native';
import moment from 'moment';
import { useIsFocused } from '@react-navigation/native';
import _ from 'lodash';

import fonts from '../../../Constants/Fonts';
import colors from '../../../Constants/Colors';
import AuthContext from '../../../auth/context';
import TCGradientButton from '../../../components/TCGradientButton';
import TCKeyboardView from '../../../components/TCKeyboardView';
import TCThickDivider from '../../../components/TCThickDivider';
import images from '../../../Constants/ImagePath';
import TCLabel from '../../../components/TCLabel';
import TCThinDivider from '../../../components/TCThinDivider';
import TCInfoField from '../../../components/TCInfoField';
import EventMapView from '../../../components/Schedule/EventMapView';
import ReservationStatus from '../../../Constants/ReservationStatus';

import MatchFeesCard from '../../../components/challenge/MatchFeesCard';
import ReservationNumber from '../../../components/reservations/ReservationNumber';
import TCGameCard from '../../../components/TCGameCard';
import {
  getGameFromToDateDiff,
  getGameHomeScreen,
} from '../../../utils/gameUtils';
import RefereeReservationStatus from '../../../Constants/RefereeReservationStatus';
import TCChallengeTitle from '../../../components/TCChallengeTitle';

let entity = {};

export default function CurruentRefereeReservationScreen({ navigation, route }) {
  const authContext = useContext(AuthContext);

  const isFocused = useIsFocused();
  const [bodyParams, setbodyParams] = useState();

  useEffect(() => {
    entity = authContext.entity;
    const { reservationObj } = route.params ?? {};
    setbodyParams(reservationObj);
    // requester = getRequester()
  }, [isFocused]);

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
  const checkSenderOrReceiver = (reservationObj) => {
    const teampObj = { ...reservationObj };
    if (
      teampObj?.status === RefereeReservationStatus.pendingpayment
      || teampObj?.status === RefereeReservationStatus.pendingrequestpayment
    ) {
      if (teampObj?.updated_by) {
        if (teampObj?.updated_by?.group_id) {
          teampObj.requested_by = teampObj.updated_by.group_id;
        } else {
          teampObj.requested_by = teampObj.updated_by.uid;
        }
      } else if (teampObj?.created_by?.group_id) {
        teampObj.requested_by = teampObj.created_by.group_id;
      } else {
        teampObj.requested_by = teampObj.created_by.uid;
      }
    } else if (teampObj?.updated_by) {
      if (teampObj?.updated_by?.group_id) {
        if (
          teampObj?.automatic_request
          && teampObj?.status === RefereeReservationStatus.changeRequest
          && entity.obj.entity_type === 'team'
        ) {
          teampObj.requested_by = teampObj.initiated_by;
        } else {
          teampObj.requested_by = teampObj.updated_by.group_id;
        }
      } else if (
        teampObj?.automatic_request
        && teampObj?.status === RefereeReservationStatus.changeRequest
        && teampObj?.referee?.user_id !== entity.uid
      ) {
        teampObj.requested_by = teampObj.initiated_by;
      } else {
        teampObj.requested_by = teampObj.updated_by.uid;
      }
    } else if (teampObj?.created_by?.group_id) {
      teampObj.requested_by = teampObj.created_by.group_id;
    } else {
      teampObj.requested_by = teampObj.created_by.uid;
    }

    console.log('Temp Object::', teampObj);
    console.log(`${teampObj?.requested_by}:::${entity.uid}`);
    if (teampObj?.requested_by === entity.uid) {
      return 'sender';
    }
    return 'receiver';
  };

  const checkRefereeOrTeam = (reservationObj) => {
    const teampObj = { ...reservationObj };
    if (
      teampObj?.status === RefereeReservationStatus.pendingpayment
      || teampObj?.status === RefereeReservationStatus.pendingrequestpayment
    ) {
      if (teampObj?.updated_by) {
        if (teampObj?.updated_by?.group_id) {
          teampObj.requested_by = teampObj.updated_by.group_id;
        } else {
          teampObj.requested_by = teampObj.updated_by.uid;
        }
      } else if (teampObj?.created_by?.group_id) {
        teampObj.requested_by = teampObj.created_by.group_id;
      } else {
        teampObj.requested_by = teampObj.created_by.uid;
      }
    } else if (teampObj?.updated_by) {
      if (teampObj?.updated_by?.group_id) {
        if (
          teampObj?.automatic_request
          && teampObj?.status === RefereeReservationStatus.changeRequest
          && entity.obj.entity_type === 'team'
        ) {
          teampObj.requested_by = teampObj.initiated_by;
        } else {
          teampObj.requested_by = teampObj.updated_by.group_id;
        }
      } else if (
        teampObj?.automatic_request
        && teampObj?.status === RefereeReservationStatus.changeRequest
        && teampObj?.referee?.user_id !== entity.uid
      ) {
        teampObj.requested_by = teampObj.initiated_by;
      } else {
        teampObj.requested_by = teampObj.updated_by.uid;
      }
    } else if (teampObj?.created_by?.group_id) {
      teampObj.requested_by = teampObj.created_by.group_id;
    } else {
      teampObj.requested_by = teampObj.created_by.uid;
    }

    console.log('Temp Object::', teampObj);
    console.log(`${teampObj?.requested_by}:::${entity.uid}`);
    if (entity.uid === teampObj?.referee?.user_id) {
      if (teampObj?.requested_by === entity.uid) {
        return 'referee';
      }
      return 'team';
    }
    if (teampObj?.requested_by === entity.uid) {
      return 'team';
    }
    return 'referee';
  };

  const getEntityName = (reservationObj) => {
    if (reservationObj?.initiated_by === entity.uid) {
      return `${reservationObj?.referee?.first_name} ${reservationObj?.referee?.last_name}`;
    }
    if (!reservationObj?.game?.singlePlayerGame) {
      if (
        reservationObj?.initiated_by
        === reservationObj?.game?.home_team?.group_id
      ) {
        return `${reservationObj?.game?.home_team.group_name}`;
      }
      return `${reservationObj?.game?.away_team.group_name}`;
    }
    console.log('user challenge');
    if (
      reservationObj?.initiated_by === reservationObj?.game?.home_team?.user_id
    ) {
      return `${reservationObj?.game?.home_team.first_name} ${reservationObj?.game?.home_team.last_name}`;
    }
    return `${reservationObj?.game?.away_team.first_name} ${reservationObj?.game?.away_team.last_name}`;
  };

  const Title = ({ text, required }) => (
    <Text style={styles.titleText}>
      {text}
      {required && <Text style={{ color: colors.redDelColor }}> * </Text>}
    </Text>
  );

  const getDateDuration = (fromData, toDate) => {
    const startDate = moment(fromData * 1000).format('hh:mm a');
    const endDate = moment(toDate * 1000).format('hh:mm a');
    const duration = getGameFromToDateDiff(fromData, toDate);
    return `${startDate} - ${endDate} (${duration})`;
  };

  const Seperator = ({ height = 7 }) => (
    <View
      style={{
        width: '100%',
        height,
        marginVertical: 2,
        backgroundColor: colors.grayBackgroundColor,
      }}
    />
  );

  const getRequester = (param) => {
    if (entity.uid === param?.referee?.user_id) {
      if (
        param?.initiated_by
        === (param?.game?.home_team?.group_id || param?.game?.home_team?.user_id)
      ) {
        return param?.game?.home_team;
      }
      return param?.game?.away_team;
    }
    if (
      entity.uid
      === (param?.game?.home_team?.group_id || param?.game?.home_team?.user_id)
    ) {
      return param?.game?.home_team;
    }
    return param?.game?.away_team;
  };

  return (
    <TCKeyboardView>
      {bodyParams && (
        <View style={{ marginBottom: 20 }}>
          <ReservationNumber reservationNumber={bodyParams.reservation_id} />
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
              margin: 15,
            }}>
            <View style={styles.challengerView}>
              <View style={styles.teamView}>
                <Image
                    source={images.reqIcon}
                    style={styles.reqOutImage}
                  />
                <Text style={styles.challengerText}>Requester</Text>
              </View>

              <View style={styles.teamView}>
                <View style={styles.profileView}>
                  <Image
                    source={
                      getRequester(bodyParams).thumbnail
                        ? { uri: getRequester(bodyParams).thumbnail }
                        : images.teamPlaceholder
                    }
                    style={styles.profileImage}
                  />
                </View>
                <Text style={styles.teamNameText}>
                  {getRequester(bodyParams).group_id
                      ? `${getRequester(bodyParams).group_name}`
                      : `${getRequester(bodyParams).first_name} ${
                          getRequester(bodyParams).last_name
                        }`}
                </Text>
              </View>
            </View>
            <View style={styles.challengeeView}>
              <View style={styles.teamView}>
                <Image source={images.refIcon} style={styles.reqOutImage} />
                <Text style={styles.challengeeText}>Referee</Text>
              </View>

              <View style={styles.teamView}>
                {/* <Image
                    source={
                      bodyParams?.referee?.thumbnail
                        ? { uri: bodyParams?.referee?.thumbnail }
                        : images.teamPlaceholder
                    }
                    style={styles.teamImage}
                  /> */}
                <View style={styles.profileView}>
                  <Image
                      source={
                        bodyParams?.referee?.full_image
                          ? { uri: bodyParams?.referee?.full_image }
                          : images.profilePlaceHolder
                      }
                      style={styles.profileImage}
                    />
                </View>
                <Text
                    style={{
                      marginLeft: 5,
                      fontFamily: fonts.RMedium,
                      fontSize: 16,
                      color: colors.lightBlackColor,
                    }}>
                  {`${bodyParams?.referee?.first_name} ${bodyParams?.referee?.last_name}`}
                </Text>
              </View>
            </View>
          </View>
          <TCThinDivider />

          {/* status offered */}
          {checkSenderOrReceiver(bodyParams) === 'sender'
            && bodyParams.status === RefereeReservationStatus.offered && (
              <View>
                {bodyParams.expiry_datetime > new Date().getTime() ? (
                  <Text
                    style={[
                      styles.challengeMessage,
                      { color: colors.googleColor },
                    ]}>
                    EXPIRED
                  </Text>
                ) : (
                  <Text
                    style={[
                      styles.challengeMessage,
                      { color: colors.requestSentColor },
                    ]}>
                    SENT
                  </Text>
                )}
                {bodyParams.expiry_datetime > new Date().getTime() ? (
                  <Text style={styles.challengeText}>
                    Your referee reservation request has been expired.
                  </Text>
                ) : (
                  <Text style={styles.challengeText}>
                    Your team sent a match reservation request to{' '}
                    {getEntityName(bodyParams)}. This request will be expired in{' '}
                    <Text style={styles.timeText}>
                      {getDayTimeDifferent(
                        bodyParams?.expiry_datetime * 1000,
                        new Date().getTime(),
                      )}
                      .
                    </Text>
                  </Text>
                )}
              </View>
            )}
          {checkSenderOrReceiver(bodyParams) === 'receiver'
            && bodyParams.status === RefereeReservationStatus.offered && (
              <View>
                {bodyParams.expiry_datetime > new Date().getTime() ? (
                  <Text
                    style={[
                      styles.challengeMessage,
                      { color: colors.googleColor },
                    ]}>
                    EXPIRED
                  </Text>
                ) : (
                  <Text
                    style={[
                      styles.challengeMessage,
                      { color: colors.requestSentColor },
                    ]}>
                    PENDING
                  </Text>
                )}
                {bodyParams.expiry_datetime > new Date().getTime() ? (
                  <Text style={styles.challengeText}>
                    The referee reservation request from{' '}
                    {getEntityName(bodyParams)} has been expired.
                  </Text>
                ) : (
                  <Text style={styles.challengeText}>
                    You received a referee reservation request from{' '}
                    {getEntityName(bodyParams)}. Please, respond within{' '}
                    <Text style={styles.timeText}>
                      {getDayTimeDifferent(
                        bodyParams.expiry_datetime * 1000,
                        new Date().getTime(),
                      )}
                      .
                    </Text>
                  </Text>
                )}
              </View>
            )}
          {/* status pending payment */}
          {checkSenderOrReceiver(bodyParams) === 'sender'
            && bodyParams.status === RefereeReservationStatus.pendingpayment && (
              <View>
                <Text style={styles.challengeMessage}>AWAITING PAYMENT</Text>
                <Text style={styles.challengeText}>
                  You accepted a referee reservation from{' '}
                  {getEntityName(bodyParams)}, but the payment hasn't gone
                  through yet.
                </Text>
                <Text style={styles.pendingRequestText}>
                  {`This reservation will be canceled unless the payment goes through within ${getDayTimeDifferent(
                    bodyParams.expiry_datetime * 1000,
                    new Date().getTime(),
                  )}.\nYou can cancel the referee reservation without a penalty before the payment will go through.`}
                </Text>
              </View>
            )}
          {checkSenderOrReceiver(bodyParams) === 'receiver'
            && bodyParams.status === RefereeReservationStatus.pendingpayment && (
              <View>
                <Text style={styles.challengeMessage}>AWAITING PAYMENT</Text>
                <Text style={styles.challengeText}>
                  {getEntityName(bodyParams)} has accepted your referee
                  reservation, but your payment hasn't gone through yet.
                </Text>
                <Text style={styles.awatingNotesText}>
                  This reservation will be canceled unless the payment goes
                  through within{' '}
                  {getDayTimeDifferent(
                    bodyParams.expiry_datetime * 1000,
                    new Date().getTime(),
                  )}
                  .
                </Text>
              </View>
            )}
          {/* status pending payment */}
          {/* Status accepted */}
          {checkSenderOrReceiver(bodyParams) === 'sender'
            && (bodyParams.status === RefereeReservationStatus.accepted
              || bodyParams.status === RefereeReservationStatus.restored
              || bodyParams.status
                === RefereeReservationStatus.requestcancelled) && (
                  <View>
                    <Text
                  style={[
                    styles.challengeMessage,
                    { color: colors.requestConfirmColor },
                  ]}>
                      CONFIRMED
                    </Text>
                    <Text style={styles.challengeText}>
                      {checkRefereeOrTeam(bodyParams) === 'referee'
                    ? `You have a confirmed referee reservation booked by ${getEntityName(
                        bodyParams,
                      )}.`
                    : `Your team has the confirmed referee reservation for ${getEntityName(
                        bodyParams,
                      )}.`}
                    </Text>
                  </View>
            )}
          {checkSenderOrReceiver(bodyParams) === 'receiver'
            && (bodyParams.status === RefereeReservationStatus.accepted
              || bodyParams.status === RefereeReservationStatus.restored
              || bodyParams.status
                === RefereeReservationStatus.requestcancelled) && (
                  <View>
                    <Text
                  style={[
                    styles.challengeMessage,
                    { color: colors.requestConfirmColor },
                  ]}>
                      CONFIRMED
                    </Text>
                    <Text style={styles.challengeText}>
                      {/* {checkRefereeOrTeam(bodyParams) === 'referee' ? `${getEntityName(bodyParams)} has confirmed referee reservation request sent by you.` : `${getEntityName(bodyParams)} has confirmed referee reservation request sent to you.` } */}
                      {`${getEntityName(
                    bodyParams,
                  )} has confirmed referee reservation request sent by you.`}
                    </Text>
                  </View>
            )}
          {/* Status accepted */}
          {/* Status declined */}
          {checkSenderOrReceiver(bodyParams) === 'sender'
            && bodyParams.status === RefereeReservationStatus.declined && (
              <View>
                <Text
                  style={[
                    styles.challengeMessage,
                    { color: colors.googleColor },
                  ]}>
                  DECLINED
                </Text>
                <Text style={styles.challengeText}>
                  {checkRefereeOrTeam(bodyParams) === 'referee'
                    ? `You have declined a referee request from ${getEntityName(
                        bodyParams,
                      )}.`
                    : `Your team have declined referee reservation request from ${getEntityName(
                        bodyParams,
                      )}.`}
                </Text>
              </View>
            )}
          {checkSenderOrReceiver(bodyParams) === 'receiver'
            && bodyParams.status === RefereeReservationStatus.declined && (
              <View>
                <Text
                  style={[
                    styles.challengeMessage,
                    { color: colors.googleColor },
                  ]}>
                  DECLINED
                </Text>
                <Text style={styles.challengeText}>
                  {checkRefereeOrTeam(bodyParams) === 'referee'
                    ? `${getEntityName(
                        bodyParams,
                      )} has declined a referee request from your team.`
                    : `${getEntityName(
                        bodyParams,
                      )} have declined a referee reservation request sent by you.`}
                  .
                </Text>
              </View>
            )}
          {/* Status declined */}
          {/* Status cancelled */}
          {checkSenderOrReceiver(bodyParams) === 'sender'
            && bodyParams.status === RefereeReservationStatus.cancelled && (
              <View>
                <Text
                  style={[
                    styles.challengeMessage,
                    { color: colors.googleColor },
                  ]}>
                  RESERVATION CANCELLED
                </Text>
                <Text style={styles.challengeText}>
                  {checkRefereeOrTeam(bodyParams) === 'referee'
                    ? `You cancelled the referee reservation request booked by ${getEntityName(
                        bodyParams,
                      )}.`
                    : `Your team has cancelled the referee reservation for ${getEntityName(
                        bodyParams,
                      )}.`}
                </Text>
              </View>
            )}
          {checkSenderOrReceiver(bodyParams) === 'receiver'
            && bodyParams.status === RefereeReservationStatus.cancelled && (
              <View>
                <Text
                  style={[
                    styles.challengeMessage,
                    { color: colors.googleColor },
                  ]}>
                  RESERVATION CANCELLED
                </Text>
                <Text style={styles.challengeText}>
                  {checkRefereeOrTeam(bodyParams) === 'referee'
                    ? `${getEntityName(
                        bodyParams,
                      )} has cancelled the referee reservation request booked by your team.`
                    : `${getEntityName(
                        bodyParams,
                      )} has cancelled the referee reservation request for you.`}
                </Text>
              </View>
            )}

          {bodyParams?.referee?.user_id !== entity.uid
            && bodyParams.status === ReservationStatus.pendingpayment && (
              <TCGradientButton
                title={'TRY TO PAY AGAIN'}
                onPress={() => {
                  navigation.navigate('PayAgainRefereeScreen', {
                    body: bodyParams,
                    comeFrom: 'RefereeReservationScreen',
                  });
                }}
                marginBottom={15}
              />
            )}

          {/* {!(
              bodyParams.status === ReservationStatus.offered
              || bodyParams.status === ReservationStatus.cancelled
              || bodyParams.status === ReservationStatus.declined
            ) && (
              <TCBorderButton
                title={'GAME HOME'}
                onPress={() => {
                  if (`${bodyParams.sport}`.toLowerCase() === 'soccer') {
                    navigation.navigate('SoccerHome', {
                      gameId: bodyParams.game_id,
                    });
                  } else {
                    navigation.navigate('TennisHome', {
                      gameId: bodyParams.game_id,
                    });
                  }
                }}
                marginBottom={15}
              />
            )} */}

          <TCThickDivider marginTop={15} />

          {bodyParams && (
            <View>
              <TCLabel title="Game" />
              {bodyParams?.game && (
                <TCGameCard
                  data={bodyParams?.game}
                  onPress={() => {
                    const routeName = getGameHomeScreen(
                      bodyParams?.game?.sport,
                    );
                    navigation.push(routeName, {
                      gameId: bodyParams?.game?.game_id,
                    });
                  }}
                  cardWidth={'96%'}
                />
              )}
              {/* Date & Time */}
              {bodyParams?.game && (
                <View>
                  <View style={styles.contentContainer}>
                    <Title text={'Date & Time'} />
                    <TCInfoField
                      title={'Date'}
                      value={
                        bodyParams?.start_datetime
                        && moment(bodyParams?.start_datetime * 1000).format(
                          'MMM DD, YYYY',
                      )
                      }
                      titleStyle={{
                        alignSelf: 'flex-start',
                        fontFamily: fonts.RRegular,
                      }}
                    />
                    <Seperator height={2} />
                    <TCInfoField
                      title={'Time'}
                      value={
                        bodyParams?.start_datetime && bodyParams?.end_datetime
                          ? getDateDuration(
                              bodyParams?.start_datetime,
                              bodyParams?.end_datetime,
                            )
                          : ''
                      }
                      titleStyle={{
                        alignSelf: 'flex-start',
                        fontFamily: fonts.RRegular,
                      }}
                    />
                    <Seperator height={2} />
                  </View>

                  {/* Venue */}
                  <View style={styles.contentContainer}>
                    <Title text={'Venue'} />
                    <TCInfoField
                      title={'Venue'}
                      value={bodyParams?.game?.venue?.name}
                      titleStyle={{
                        alignSelf: 'flex-start',
                        fontFamily: fonts.RRegular,
                      }}
                    />
                    <TCInfoField
                      title={'Address'}
                      value={bodyParams?.game?.venue?.address}
                      titleStyle={{
                        alignSelf: 'flex-start',
                        fontFamily: fonts.RRegular,
                      }}
                    />
                    <EventMapView
                      coordinate={{
                        latitude:
                          bodyParams?.game?.venue?.coordinate?.latitude ?? 0.0,
                        longitude:
                          bodyParams?.game?.venue?.coordinate?.longitude ?? 0.0,
                      }}
                      region={{
                        latitude:
                          bodyParams?.game?.venue?.coordinate?.latitude ?? 0.0,
                        longitude:
                          bodyParams?.game?.venue?.coordinate?.longitude ?? 0.0,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                      }}
                    />
                  </View>
                </View>
              )}
            </View>
          )}

          {bodyParams && (
            <View>
              <TCChallengeTitle title={'Game Rules'} />
              <Text style={styles.rulesTitle}>General Rules</Text>
              <Text style={styles.rulesDetail}>{bodyParams?.game?.general_rules}</Text>
              <View style={{ marginBottom: 10 }} />
              <Text style={styles.rulesTitle}>Special Rules</Text>
              <Text style={[styles.rulesDetail, { marginBottom: 10 }]}>{bodyParams?.game?.special_rules}</Text>
            </View>
          )}
          <TCThickDivider marginTop={20} />

          {/* Chief or assistant */}
          <View style={styles.contentContainer}>
            <Title text={'Chief or assistant'} />
            <View
              style={{
                margin: 7,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text
                style={{
                  fontFamily: fonts.RRegular,
                  fontSize: 16,
                  color: colors.lightBlackColor,
                }}>
                {_.startCase(bodyParams?.chief_referee ? 'Chief' : 'Assistant')}{' '}
                Referee
              </Text>
            </View>
          </View>
          <TCThickDivider />
          <TCLabel
            title={
              checkSenderOrReceiver(bodyParams) === 'sender'
                ? 'Payment'
                : 'Earning'
            }
          />

          <MatchFeesCard
            challengeObj={{
              ...bodyParams,
              start_datetime: bodyParams.start_datetime * 1000,
              end_datetime: bodyParams.end_datetime * 1000,
            }}
            senderOrReceiver={
              checkSenderOrReceiver(bodyParams) === 'sender'
                ? 'sender'
                : 'receiver'
            }
          />
        </View>
      )}
    </TCKeyboardView>
  );
}
const styles = StyleSheet.create({

  teamView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
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
    fontSize: 18,
    color: colors.themeColor,
    margin: 15,
    marginBottom: 5,
  },
  challengeText: {
    fontFamily: fonts.RRegular,
    fontSize: 16,
    color: colors.lightBlackColor,
    marginLeft: 15,
    marginRight: 15,
    marginBottom: 15,
  },
  // challengeText: {
  //   fontFamily: fonts.RMedium,
  //   fontSize: 23,
  //   color: colors.lightBlackColor,
  //   marginLeft: 15,
  //   marginRight: 15,
  //   marginBottom: 15,
  // },
  timeText: {
    color: colors.themeColor,
  },
  awatingNotesText: {
    color: colors.userPostTimeColor,
    marginRight: 15,
    marginLeft: 15,
    marginBottom: 15,
  },
  pendingRequestText: {
    color: colors.userPostTimeColor,
    marginLeft: 15,
    marginRight: 15,
  },
  contentContainer: {
    padding: 15,
  },
  titleText: {
    color: colors.lightBlackColor,
    fontSize: 20,
    fontFamily: fonts.RRegular,
  },

  profileImage: {
    alignSelf: 'center',
    height: 40,
    width: 40,
    borderRadius: 80,
  },

  profileView: {
    backgroundColor: colors.whiteColor,
    height: 44,
    width: 44,
    borderRadius: 88,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.grayColor,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 3,
  },
  rulesTitle: {
    fontFamily: fonts.RMedium,
    fontSize: 16,
    color: colors.lightBlackColor,
    marginLeft: 15,
    marginBottom: 5,
  },
  rulesDetail: {
    fontFamily: fonts.RRegular,
    fontSize: 16,
    color: colors.lightBlackColor,
    marginLeft: 15,
    marginRight: 15,
  },
});
