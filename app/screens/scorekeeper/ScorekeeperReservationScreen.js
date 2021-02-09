/* eslint-disable consistent-return */
/* eslint-disable react/no-unescaped-entities */
import React, {
  useEffect, useState, useContext, useLayoutEffect,
} from 'react';
import {
  StyleSheet, View, Text, Image, Alert, ScrollView,
} from 'react-native';
import moment from 'moment';
import { useIsFocused } from '@react-navigation/native';
import { acceptDeclineReservation, getReservation } from '../../api/Challenge';
import ActivityLoader from '../../components/loader/ActivityLoader';
import strings from '../../Constants/String';
import fonts from '../../Constants/Fonts';
import colors from '../../Constants/Colors';
import AuthContext from '../../auth/context';
import TCGradientButton from '../../components/TCGradientButton';
import TCKeyboardView from '../../components/TCKeyboardView';
import TCThickDivider from '../../components/TCThickDivider';
import images from '../../Constants/ImagePath';
import TCLabel from '../../components/TCLabel';
import TCThinDivider from '../../components/TCThinDivider';
import TCInfoField from '../../components/TCInfoField';
import EventMapView from '../../components/Schedule/EventMapView';
import GameStatus from '../../Constants/GameStatus';
import TCBorderButton from '../../components/TCBorderButton';
import MatchFeesCard from '../../components/challenge/MatchFeesCard';
import ReservationNumber from '../../components/reservations/ReservationNumber';
import TCGameCard from '../../components/TCGameCard';
import { getGameFromToDateDiff, getGameHomeScreen } from '../../utils/gameUtils';
import TCProfileView from '../../components/TCProfileView';
import ScorekeeperReservationStatus from '../../Constants/ScorekeeperReservationStatus';

let entity = {};

export default function ScorekeeperReservationScreen({ navigation, route }) {
  const authContext = useContext(AuthContext);

  const isFocused = useIsFocused();
  const [loading, setloading] = useState(false);
  const [homeTeam, setHomeTeam] = useState();
  const [bodyParams, setbodyParams] = useState();

  useEffect(() => {
    entity = authContext.entity;
    const { reservationObj } = route.params ?? {};
    console.log('ALTER SCOREKEEPER RESERVATION OBJECT:', reservationObj);

    if (route?.params?.isRefresh) {
      getReservationDetails(reservationObj?.reservation_id);
    }
    setbodyParams(reservationObj);
    if ((reservationObj?.game?.away_team?.group_id || reservationObj?.game?.away_team?.user_id) === entity.uid) {
      setHomeTeam(reservationObj?.game?.away_team);
    } else {
      setHomeTeam(reservationObj?.game?.home_team);
    }
  }, [isFocused]);
  useLayoutEffect(() => {
    navigation.setOptions({
      title: getNavigationTitle(),
    });
  }, [navigation, bodyParams]);

  const getNavigationTitle = () => {
    console.log('Status::', bodyParams?.status);

    if (bodyParams?.status === ScorekeeperReservationStatus.offered || bodyParams?.status === ScorekeeperReservationStatus.declined) {
      return strings.scorekeeperRequestScreenTitle
    }
    return strings.scorekeeperScreenTitle
  }
  const acceptDeclineScorekeeperReservation = (
    reservationID,
    callerID,
    versionNo,
    status,
  ) => {
    setloading(true);
    acceptDeclineReservation(
      'scorekeepers',
      reservationID,
      callerID,
      versionNo,
      status,
      {},
      authContext,
    )
      .then((response) => {
        setloading(false);
        console.log('ACCEPT RESPONSE::', JSON.stringify(response.payload));

        if (status === 'accept') {
          navigation.navigate('ScorekeeperRequestSent', {
            operationType: strings.reservationRequestAccepted,
            imageAnimation: true,
          });
        } else if (status === 'decline') {
          navigation.navigate('ScorekeeperRequestSent', {
            operationType: strings.reservationRequestDeclined,
            imageAnimation: false,
          });
        } else if (status === 'cancel') {
          navigation.navigate('ScorekeeperRequestSent', {
            operationType: strings.reservationRequestCancelled,
            imageAnimation: false,
          });
        }
      })
      .catch((e) => {
        setloading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 0.7);
      });
  };
  const getReservationDetails = (reservationId) => {
    getReservation('scorekeepers', reservationId, authContext.entity.uid, authContext)
      .then((response) => {
        setloading(false);
        setbodyParams(response.payload[0]);
        if ((response.payload[0]?.game?.away_team?.group_id || response.payload[0]?.game?.away_team?.user_id) === entity.uid) {
          setHomeTeam(response.payload[0]?.game?.away_team);
        } else {
          setHomeTeam(response.payload[0]?.game?.home_team);
        }
        console.log(homeTeam);
      })
      .catch((e) => {
        setloading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 0.7);
      });
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

  const checkScorekeeperOrTeam = (reservationObj) => {
    const teampObj = { ...reservationObj }
    if (
      teampObj?.status === ScorekeeperReservationStatus.pendingpayment
      || teampObj?.status === ScorekeeperReservationStatus.pendingrequestpayment
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
        if (teampObj?.automatic_request && teampObj?.status === ScorekeeperReservationStatus.changeRequest && entity.obj.entity_type === 'team') {
          teampObj.requested_by = teampObj.initiated_by;
        } else {
          teampObj.requested_by = teampObj.updated_by.group_id;
        }
      } else if (teampObj?.automatic_request && teampObj?.status === ScorekeeperReservationStatus.changeRequest && teampObj?.scorekeeper?.user_id !== entity.uid) {
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
    if (entity.uid === teampObj?.scorekeeper?.user_id) {
      if (teampObj?.requested_by === entity.uid) {
        return 'scorekeeper'
      }
      return 'team'
    }
    if (teampObj?.requested_by === entity.uid) {
      return 'team'
    }
    return 'scorekeeper'
  };
  const checkSenderForPayment = (reservationObj) => {
    if (reservationObj?.scorekeeper?.user_id === entity.uid) {
      return 'receiver'
    }

    return 'sender'
  }
  const checkSenderOrReceiver = (reservationObj) => {
    const teampObj = { ...reservationObj }
    if (
      teampObj?.status === ScorekeeperReservationStatus.pendingpayment
      || teampObj?.status === ScorekeeperReservationStatus.pendingrequestpayment
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
        if (teampObj?.automatic_request && teampObj?.status === ScorekeeperReservationStatus.changeRequest && entity.obj.entity_type === 'team') {
          teampObj.requested_by = teampObj.initiated_by;
        } else {
          teampObj.requested_by = teampObj.updated_by.group_id;
        }
      } else if (teampObj?.automatic_request && teampObj?.status === ScorekeeperReservationStatus.changeRequest && teampObj?.scorekeeper?.user_id !== entity.uid) {
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
      return 'sender'
    }
    return 'receiver'
  };

  const getEntityName = (reservationObj) => {
    if (reservationObj?.initiated_by === entity.uid) {
      return `${reservationObj?.scorekeeper?.first_name} ${reservationObj?.scorekeeper?.last_name}`
    }
    if (!reservationObj?.game?.singlePlayerGame) {
      if (reservationObj?.initiated_by === reservationObj?.game?.home_team?.group_id) {
        return `${reservationObj?.game?.home_team.group_name}`
      }
      return `${reservationObj?.game?.away_team.group_name}`
    }
    console.log('user challenge');
    if (reservationObj?.initiated_by === reservationObj?.game?.home_team?.user_id) {
      return `${reservationObj?.game?.home_team.first_name} ${reservationObj?.game?.home_team.last_name}`
    }
    return `${reservationObj?.game?.away_team.first_name} ${reservationObj?.game?.away_team.last_name}`
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
    if (entity.uid === param?.scorekeeper?.user_id) {
      if (param?.initiated_by === (param?.game?.home_team?.group_id || param?.game?.home_team?.user_id)) {
        return param?.game?.home_team
      }
      return param?.game?.away_team
    }
    if (entity.uid === (param?.game?.home_team?.group_id || param?.game?.home_team?.user_id)) {
      return param?.game?.home_team
    }
    return param?.game?.away_team
  };

  return (
    <TCKeyboardView>
      <ScrollView style={{ flex: 1 }}>
        <ActivityLoader visible={loading} />
        { bodyParams && (
          <View>
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
                  <Image source={images.requestOut} style={styles.reqOutImage} />
                  <Text style={styles.challengerText}>Resv. Requester</Text>
                </View>

                <View style={styles.teamView}>
                  <Image
                  source={getRequester(bodyParams)?.thumbnail ? { uri: getRequester(bodyParams)?.thumbnail } : images.teamPlaceholder}
                  style={styles.teamImage}
                />
                  <Text style={styles.teamNameText}>
                    {getRequester(bodyParams)?.group_id ? `${getRequester(bodyParams).group_name}` : `${getRequester(bodyParams).first_name} ${getRequester(bodyParams).last_name}`}
                  </Text>
                </View>
              </View>
              <View style={styles.challengeeView}>
                <View style={styles.teamView}>
                  <Image source={images.requestIn} style={styles.reqOutImage} />
                  <Text style={styles.challengeeText}>Resv. Requestee</Text>
                </View>

                <View style={styles.teamView}>
                  <Image
                  source={bodyParams?.scorekeeper?.thumbnail ? { uri: bodyParams?.scorekeeper?.thumbnail } : images.teamPlaceholder}
                  style={styles.teamImage}
                />
                  <Text
                  style={{
                    marginLeft: 5,
                    fontFamily: fonts.RMedium,
                    fontSize: 16,
                    color: colors.lightBlackColor,
                  }}>
                    {`${bodyParams?.scorekeeper?.first_name} ${bodyParams?.scorekeeper?.last_name}`}
                  </Text>
                </View>
              </View>
            </View>
            <TCThinDivider />

            {/* status offered */}
            {checkSenderOrReceiver(bodyParams) === 'sender'
            && bodyParams.status === ScorekeeperReservationStatus.offered && (
              <View>
                {bodyParams.expiry_datetime > new Date().getTime() ? (
                  <Text style={[styles.challengeMessage, { color: colors.googleColor }]}>
                    EXPIRED
                  </Text>
                ) : (
                  <Text style={[styles.challengeMessage, { color: colors.requestSentColor }]}>
                    SENT
                  </Text>
                )}
                {bodyParams.expiry_datetime > new Date().getTime() ? (
                  <Text style={styles.challengeText}>
                    Your scorekeeper reservation request has been expired.
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
            && bodyParams.status === ScorekeeperReservationStatus.offered && (
              <View>
                {bodyParams.expiry_datetime > new Date().getTime() ? (
                  <Text style={[styles.challengeMessage, { color: colors.googleColor }]}>
                    EXPIRED
                  </Text>
                ) : (
                  <Text style={[styles.challengeMessage, { color: colors.requestSentColor }]}>
                    PENDING
                  </Text>
                )}
                {bodyParams.expiry_datetime > new Date().getTime() ? (
                  <Text style={styles.challengeText}>
                    The scorekeeper reservation request from {getEntityName(bodyParams)} has been expired.
                  </Text>
                ) : (
                  <Text style={styles.challengeText}>
                    You received a scorekeeper reservation request from{' '}
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
            && bodyParams.status === ScorekeeperReservationStatus.pendingpayment && (
              <View>
                <Text style={styles.challengeMessage}>AWAITING PAYMENT</Text>
                <Text style={styles.challengeText}>
                  You accepted a scorekeeper reservation from{' '}
                  {getEntityName(bodyParams)}, but the payment hasn't gone through
                  yet.
                </Text>
                <Text style={styles.pendingRequestText}>
                  {`This reservation will be canceled unless the payment goes through within ${getDayTimeDifferent(
                    bodyParams.expiry_datetime * 1000,
                    new Date().getTime(),
                  )}.\nYou can cancel the scorekeeper reservation without a penalty before the payment will go through.`}
                </Text>
              </View>
            )}
            {checkSenderOrReceiver(bodyParams) === 'receiver'
            && bodyParams.status === ScorekeeperReservationStatus.pendingpayment && (
              <View>
                <Text style={styles.challengeMessage}>AWAITING PAYMENT</Text>
                <Text style={styles.challengeText}>
                  {getEntityName(bodyParams)} has accepted your scorekeeper reservation,
                  but your payment hasn't gone through yet.
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
            && (bodyParams.status === ScorekeeperReservationStatus.accepted
              || bodyParams.status === ScorekeeperReservationStatus.restored || bodyParams.status === ScorekeeperReservationStatus.requestcancelled) && (
                <View>
                  <Text
                  style={[
                    styles.challengeMessage,
                    { color: colors.requestConfirmColor },
                  ]}>
                    {bodyParams.automatic_request ? 'CONFIRMED - RESCHEDULED' : 'CONFIRMED'}
                  </Text>
                  <Text style={styles.challengeText}>
                    {checkScorekeeperOrTeam(bodyParams) === 'scorekeeper' ? `You have a confirmed scorekeeper reservation booked by ${getEntityName(bodyParams)}.` : `Your team has the confirmed scorekeeper reservation for ${getEntityName(bodyParams)}.`}
                  </Text>
                </View>
            )}
            {checkSenderOrReceiver(bodyParams) === 'receiver'
            && (bodyParams.status === ScorekeeperReservationStatus.accepted
              || bodyParams.status === ScorekeeperReservationStatus.restored || bodyParams.status === ScorekeeperReservationStatus.requestcancelled) && (
                <View>
                  <Text
                  style={[
                    styles.challengeMessage,
                    { color: colors.requestConfirmColor },
                  ]}>
                    {bodyParams.automatic_request ? 'CONFIRMED - RESCHEDULED' : 'CONFIRMED'}
                  </Text>
                  <Text style={styles.challengeText}>
                    { `${getEntityName(bodyParams)} has confirmed scorekeeper reservation request sent by you.`}
                  </Text>
                </View>
            )}
            {/* Status accepted */}
            {/* Status declined */}
            {checkSenderOrReceiver(bodyParams) === 'sender'
            && bodyParams.status === ScorekeeperReservationStatus.declined && (
              <View>
                <Text
                  style={[
                    styles.challengeMessage,
                    { color: colors.googleColor },
                  ]}>
                  DECLINED
                </Text>
                <Text style={styles.challengeText}>
                  {checkScorekeeperOrTeam(bodyParams) === 'scorekeeper' ? `You have declined a scorekeeper request from ${getEntityName(bodyParams)}.` : `Your team have declined scorekeeper reservation request from ${getEntityName(bodyParams)}.` }

                </Text>
              </View>
            )}
            {checkSenderOrReceiver(bodyParams) === 'receiver'
            && bodyParams.status === ScorekeeperReservationStatus.declined && (
              <View>
                <Text
                  style={[
                    styles.challengeMessage,
                    { color: colors.googleColor },
                  ]}>
                  DECLINED
                </Text>
                <Text style={styles.challengeText}>
                  {checkScorekeeperOrTeam(bodyParams) === 'scorekeeper' ? `${getEntityName(bodyParams)} has declined a scorekeeper request from your team.` : `${getEntityName(bodyParams)} have declined a scorekeeper reservation request sent by you.` }
                  .
                </Text>
              </View>
            )}
            {/* Status declined */}
            {/* Status cancelled */}
            {checkSenderOrReceiver(bodyParams) === 'sender'
            && bodyParams.status === ScorekeeperReservationStatus.cancelled && (
              <View>
                <Text
                  style={[
                    styles.challengeMessage,
                    { color: colors.userPostTimeColor },
                  ]}>
                  CANCELLED
                </Text>
                <Text style={styles.challengeText}>
                  {checkScorekeeperOrTeam(bodyParams) === 'scorekeeper' ? `You cancelled the scorekeeper reservation request booked by ${getEntityName(bodyParams)}.` : `Your team has cancelled the scorekeeper reservation for ${getEntityName(bodyParams)}.`}
                </Text>
              </View>
            )}
            {checkSenderOrReceiver(bodyParams) === 'receiver'
            && bodyParams.status === ScorekeeperReservationStatus.cancelled && (
              <View>
                <Text
                  style={[
                    styles.challengeMessage,
                    { color: colors.userPostTimeColor },
                  ]}>
                  CANCELLED
                </Text>
                <Text style={styles.challengeText}>
                  {checkScorekeeperOrTeam(bodyParams) === 'scorekeeper' ? `${getEntityName(bodyParams)} has cancelled the scorekeeper reservation request booked by your team.` : `${getEntityName(bodyParams)} has cancelled the scorekeeper reservation request for you.`}
                </Text>
              </View>
            )}

            {bodyParams?.scorekeeper?.user_id !== entity.uid
            && bodyParams.status === ScorekeeperReservationStatus.pendingpayment && (
              <TCGradientButton
                title={'TRY TO PAY AGAIN'}
                onPress={() => {
                  navigation.navigate('PayAgainScorekeeperScreen', {
                    body: bodyParams,
                    comeFrom: 'ScorekeeperReservationScreen',
                  });
                }}
                marginBottom={15}
              />
            )}
            <TCThickDivider marginTop={15}/>
            {/* Name and country */}
            <View style={styles.contentContainer}>
              <Title text={'Scorekeeper'} />
              <View style={{ marginVertical: 10 }}>
                <TCProfileView
                type={'medium'}
                name={bodyParams?.scorekeeper?.full_name}
                location={`${bodyParams?.scorekeeper?.city} , ${bodyParams?.scorekeeper?.country}`}
                image={
                  bodyParams?.scorekeeper?.full_image
                    ? { uri: bodyParams?.scorekeeper?.full_image }
                    : images.profilePlaceHolder
                }
              />
              </View>
            </View>
            <TCThickDivider />
            {bodyParams && (
              <View>
                <TCLabel title="Match" />
                {bodyParams?.game && <TCGameCard data={bodyParams?.game} onPress={() => {
                  const routeName = getGameHomeScreen(bodyParams?.game?.sport);
                  navigation.push(routeName, { gameId: bodyParams?.game?.game_id })
                }}/>}
                {/* Date & Time */}
                {bodyParams?.game && (
                  <View>
                    <View style={styles.contentContainer}>
                      <Title text={'Date & Time'} />
                      <TCInfoField
                      title={'Date'}
                      value={
                        bodyParams?.start_datetime
                        && moment(bodyParams?.start_datetime * 1000).format('MMM DD, YYYY')
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
                      value={bodyParams?.game?.venue?.title}
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
                        latitude: bodyParams?.game?.venue.lat ?? 0.0,
                        longitude: bodyParams?.game?.venue.long ?? 0.0,
                      }}
                      region={{
                        latitude: bodyParams?.game?.venue.lat ?? 0.0,
                        longitude: bodyParams?.game?.venue.long ?? 0.0,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                      }}
                    />
                    </View>
                  </View>
                )}
              </View>
            )}

            <TCThickDivider />
            <TCLabel
            title={
              checkSenderForPayment(bodyParams) === 'sender'
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
              checkSenderForPayment(bodyParams)
            }
          />

            {checkSenderOrReceiver(bodyParams) === 'sender'
            && bodyParams.status === ScorekeeperReservationStatus.offered
            && bodyParams.expiry_datetime < new Date().getTime() && (
              <View>
                <TCBorderButton
                  title={strings.calcelRequest}
                  textColor={colors.grayColor}
                  borderColor={colors.grayColor}
                  marginBottom={15}
                  height={40}
                  shadow={true}
                  onPress={() => {
                    let callerId = '';
                    if (bodyParams?.scorekeeper?.user_id !== entity.uid) {
                      callerId = entity.uid
                    }
                    acceptDeclineScorekeeperReservation(
                      bodyParams.reservation_id,
                      callerId,
                      bodyParams.version,
                      'cancel',
                    );
                  }}
                />
              </View>
            )}

            {checkSenderOrReceiver(bodyParams) === 'receiver'
            && bodyParams.status === ScorekeeperReservationStatus.offered
            && bodyParams.expiry_datetime < new Date().getTime() && (
              <View style={{ marginTop: 15 }}>
                <TCGradientButton
                  title={strings.accept}
                  onPress={() => {
                    // navigation.navigate('AlterRefereeScreen', { reservationObj: allReservationData })

                    if (!(bodyParams?.game?.status === GameStatus.accepted || bodyParams?.game?.status === GameStatus.reset)) {
                      Alert.alert(strings.cannotAcceptText)
                    } else if ((bodyParams?.expiry_datetime < new Date().getTime() / 1000) || (bodyParams?.game?.start_datetime < new Date().getTime() / 1000)) {
                      Alert.alert(strings.refereeOfferExpiryText)
                    } else {
                      let callerId = '';
                      if (bodyParams?.scorekeeper?.user_id !== entity.uid) {
                        callerId = entity.uid
                      }
                      acceptDeclineScorekeeperReservation(
                        bodyParams.reservation_id,
                        callerId,
                        bodyParams.version,
                        'accept',
                      );
                    }
                  }}
                />
                <TCBorderButton
                  title={strings.decline}
                  textColor={colors.grayColor}
                  borderColor={colors.grayColor}
                  height={40}
                  marginBottom={15}
                  shadow={true}
                  onPress={() => {
                    let callerId = '';
                    if (bodyParams?.scorekeeper?.user_id !== entity.uid) {
                      callerId = entity.uid
                    }
                    acceptDeclineScorekeeperReservation(
                      bodyParams.reservation_id,
                      callerId,
                      bodyParams.version,
                      'decline',
                    );
                  }}
                />
              </View>
            )}

            {(bodyParams.status === ScorekeeperReservationStatus.accepted
            || bodyParams.status === ScorekeeperReservationStatus.restored || bodyParams.status === ScorekeeperReservationStatus.requestcancelled) && (
              <View>
                <TCBorderButton
                title={strings.alterReservation}
                textColor={colors.grayColor}
                borderColor={colors.grayColor}
                height={40}
                shadow={true}
                marginTop={15}
                onPress={() => {
                  if (
                    (bodyParams?.game?.status === GameStatus.accepted
                      || bodyParams?.game?.status === GameStatus.reset)
                    && bodyParams.start_datetime > parseFloat(new Date().getTime() / 1000).toFixed(0)
                  ) {
                    navigation.navigate('EditScorekeeperReservation', {
                      reservationObj: bodyParams,
                    });
                  } else {
                    Alert.alert(
                      'Reservation cannot be change after game time passed or offer expired.',
                    );
                  }
                }}
              />
                <TCBorderButton
                title={strings.cancelreservation}
                textColor={colors.whiteColor}
                borderColor={colors.grayColor}
                backgroundColor={colors.grayColor}
                height={40}
                shadow={true}
                marginBottom={15}
                marginTop={15}
                onPress={() => {
                  if (bodyParams?.game?.status === (GameStatus.accepted || GameStatus.reset)) {
                    let callerId = '';
                    if (bodyParams?.scorekeeper?.user_id !== entity.uid) {
                      callerId = entity.uid
                    }
                    acceptDeclineScorekeeperReservation(
                      bodyParams.reservation_id,
                      callerId,
                      bodyParams.version,
                      'cancel',
                    );
                  } else if (bodyParams.start_datetime * 1000 < new Date().getTime()) {
                    Alert.alert(
                      'Reservation cannot be cancel after game time passed or offer expired.',
                    );
                  } else {
                    Alert.alert(
                      'Reservation can not be change after game has been started.',
                    );
                  }
                }}
              />
              </View>
            )}
            {bodyParams.status === ScorekeeperReservationStatus.pendingpayment && (
              <TCBorderButton
                title={strings.cancelreservation}
                textColor={colors.whiteColor}
                borderColor={colors.grayColor}
                backgroundColor={colors.grayColor}
                height={40}
                shadow={true}
                marginBottom={15}
                marginTop={15}
                onPress={() => {
                  if (!(bodyParams?.game?.status === GameStatus.accepted || bodyParams?.game?.status === GameStatus.reset)) {
                    Alert.alert(strings.cannotAcceptText)
                  } else if ((bodyParams?.expiry_datetime < new Date().getTime() / 1000) || (bodyParams?.game?.start_datetime < new Date().getTime() / 1000)) {
                    Alert.alert(strings.refereeOfferExpiryText)
                  } else {
                    let callerId = '';
                    if (bodyParams?.scorekeeper?.user_id !== entity.uid) {
                      callerId = entity.uid
                    }
                    acceptDeclineScorekeeperReservation(
                      bodyParams.reservation_id,
                      callerId,
                      bodyParams.version,
                      'cancel',
                    );
                  }
                }}
              />
            )}
          </View>
        )}
      </ScrollView>
    </TCKeyboardView>
  );
}
const styles = StyleSheet.create({
  // rulesText: {
  //   fontSize: 16,
  //   fontFamily: fonts.RRegular,
  //   color: colors.lightBlackColor,
  //   marginLeft: 15,
  //   marginRight: 15,
  // },

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
    borderRadius: 10,
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
});
