/* eslint-disable no-unused-vars */
/* eslint-disable consistent-return */
/* eslint-disable react/no-unescaped-entities */
import React, {
  useEffect,
  useState,
  useContext,
  useLayoutEffect,
  useCallback,
} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  Alert,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import moment from 'moment';

import _ from 'lodash';
import * as Utility from '../../utils';
import {acceptDeclineReservation, getReservation} from '../../api/Challenge';
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
import {getGameFromToDateDiff, getGameHomeScreen} from '../../utils/gameUtils';
import ScorekeeperReservationStatus from '../../Constants/ScorekeeperReservationStatus';
import TCChallengeTitle from '../../components/TCChallengeTitle';
import {heightPercentageToDP, widthPercentageToDP} from '../../utils';
import TCTouchableLabel from '../../components/TCTouchableLabel';
import ScorekeeperReservationTitle from '../../components/reservations/ScorekeeperReservationTitle';
import {paymentMethods} from '../../api/Users';

let entity = {};

export default function ScorekeeperReservationScreen({navigation, route}) {
  const authContext = useContext(AuthContext);

  const [loading, setloading] = useState(false);
  const [homeTeam, setHomeTeam] = useState();
  const [awayTeam, setAwayTeam] = useState();
  const [bodyParams, setbodyParams] = useState();
  const [defaultCard, setDefaultCard] = useState();

  useEffect(() => {
    entity = authContext.entity;
    const {reservationObj} = route.params ?? {};
    console.log('ALTER Scorekeeper RESERVATION OBJECT:', reservationObj);
    console.log('ALTER Scorekeeper RESERVATION Home team OBJECT:', awayTeam);
    if (route?.params?.isRefresh) {
      getReservationDetails(reservationObj?.reservation_id);
    }
    setbodyParams(reservationObj);
    if (
      (reservationObj?.game?.away_team?.group_id ||
        reservationObj?.game?.away_team?.user_id) === entity.uid
    ) {
      setHomeTeam(reservationObj?.game?.away_team);
      setAwayTeam(reservationObj?.game?.home_team);
    } else {
      setHomeTeam(reservationObj?.game?.home_team);
      setAwayTeam(reservationObj?.game?.away_team);
    }
    if (route?.params?.paymentMethod) {
      setDefaultCard(route?.params?.paymentMethod);
    } else {
      getPaymentMethods(reservationObj?.source);
    }
  }, [authContext.entity, awayTeam, route.params]);

  const getPaymentMethods = (source) => {
    setloading(true);
    paymentMethods(authContext)
      .then((response) => {
        console.log('Payment api called', response.payload);
        const matchCard = response.payload.find((card) => card.id === source);
        if (matchCard) {
          console.log('default payment method', matchCard);
          setDefaultCard(matchCard);
        }
        setloading(false);
      })
      .catch((e) => {
        console.log('error in payment method', e);
        setloading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 10);
      });
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      title: getNavigationTitle(),
    });
  }, [navigation, bodyParams]);

  const getNavigationTitle = () => {
    if (
      bodyParams?.status === ScorekeeperReservationStatus.approved ||
      bodyParams?.status === ScorekeeperReservationStatus.declined
    ) {
      return strings.scorekeeperRequestScreenTitle;
    }
    return strings.scorekeeperScreenTitle;
  };
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
      {source: defaultCard?.id},
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
        } else if (status === 'approve') {
          navigation.navigate('ScorekeeperRequestSent', {
            operationType: strings.reservationRequestApproved,
            imageAnimation: false,
          });
        }
      })
      .catch((e) => {
        setloading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 10);
      });
  };
  const getReservationDetails = (reservationId) => {
    getReservation(reservationId, authContext.entity.uid, authContext)
      .then((response) => {
        setloading(false);
        setbodyParams(response.payload[0]);
        if (
          (response.payload[0]?.game?.away_team?.group_id ||
            response.payload[0]?.game?.away_team?.user_id) === entity.uid
        ) {
          setHomeTeam(response.payload[0]?.game?.away_team);
          setAwayTeam(response.payload[0]?.game?.home_team);
        } else {
          setHomeTeam(response.payload[0]?.game?.home_team);
          setAwayTeam(response.payload[0]?.game?.away_team);
        }
        console.log(homeTeam);
      })
      .catch((e) => {
        setloading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 10);
      });
  };

  const checkSenderForPayment = useCallback((reservationObj) => {
    console.log('reservationObj::=>', reservationObj);
    if (reservationObj?.scorekeeper?.user_id === entity.uid) {
      return 'receiver';
    }

    return 'sender';
  }, []);
  const checkSenderOrReceiver = (reservationObj) => {
    const teampObj = {...reservationObj};
    // if (
    //   teampObj?.status === ScorekeeperReservationStatus.pendingpayment
    //   || teampObj?.status === ScorekeeperReservationStatus.pendingrequestpayment
    // ) {
    //   if (teampObj?.updated_by) {
    //     if (teampObj?.updated_by?.group_id) {
    //       teampObj.requested_by = teampObj.updated_by.group_id;
    //     } else {
    //       teampObj.requested_by = teampObj.updated_by.uid;
    //     }
    //   } else if (teampObj?.created_by?.group_id) {
    //     teampObj.requested_by = teampObj.created_by.group_id;
    //   } else {
    //     teampObj.requested_by = teampObj.created_by.uid;
    //   }
    // } else if (teampObj?.updated_by) {
    //   if (teampObj?.updated_by?.group_id) {
    //     if (
    //       teampObj?.automatic_request
    //       && teampObj?.status === ScorekeeperReservationStatus.changeRequest
    //       && entity.obj.entity_type === 'team'
    //     ) {
    //       teampObj.requested_by = teampObj.initiated_by;
    //     } else {
    //       teampObj.requested_by = teampObj.updated_by.group_id;
    //     }
    //   } else if (
    //     teampObj?.automatic_request
    //     && teampObj?.status === ScorekeeperReservationStatus.changeRequest
    //     && teampObj?.scorekeeper?.user_id !== entity.uid
    //   ) {
    //     teampObj.requested_by = teampObj.initiated_by;
    //   } else {
    //     teampObj.requested_by = teampObj.updated_by.uid;
    //   }
    // } else if (teampObj?.created_by?.group_id) {
    //   teampObj.requested_by = teampObj.created_by.group_id;
    // } else {
    //   teampObj.requested_by = teampObj.created_by.uid;
    // }

    console.log('Temp Object::', teampObj);
    console.log(`${teampObj?.requested_by}:::${entity.uid}`);
    if (teampObj?.requested_by === entity.uid) {
      return 'sender';
    }
    return 'receiver';
  };

  const Title = ({text, required}) => (
    <Text style={styles.titleText}>
      {text}
      {required && <Text style={{color: colors.redDelColor}}> * </Text>}
    </Text>
  );

  const getDateDuration = (fromData, toDate) => {
    const startDate = moment(fromData * 1000).format('hh:mm a');
    const endDate = moment(toDate * 1000).format('hh:mm a');
    const duration = getGameFromToDateDiff(fromData, toDate);
    return `${startDate} - ${endDate} (${duration})`;
  };

  const Seperator = ({height = 7}) => (
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
      if (
        param?.initiated_by ===
        (param?.game?.home_team?.group_id || param?.game?.home_team?.user_id)
      ) {
        return param?.game?.home_team;
      }
      return param?.game?.away_team;
    }

    if (
      entity.uid ===
        (param?.game?.home_team?.group_id || param?.game?.home_team?.user_id) ||
      param?.initiated_by ===
        (param?.game?.home_team?.group_id || param?.game?.home_team?.user_id)
    ) {
      return param?.game?.home_team;
    }
    return param?.game?.away_team;
  };

  const renderBottomBurron = () => (
    <SafeAreaView>
      {checkSenderOrReceiver(bodyParams) === 'sender' &&
        (bodyParams.status === ScorekeeperReservationStatus.approved ||
          bodyParams.status === ScorekeeperReservationStatus.offered) &&
        bodyParams.expiry_datetime < new Date().getTime() && (
          <View>
            <TCBorderButton
              title={strings.calcelRequest}
              textColor={colors.grayColor}
              borderColor={colors.grayColor}
              marginBottom={15}
              marginTop={15}
              height={40}
              shadow={true}
              onPress={() => {
                let callerId = '';
                if (bodyParams?.scorekeeper?.user_id !== entity.uid) {
                  callerId = entity.uid;
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

      {checkSenderOrReceiver(bodyParams) === 'receiver' &&
        (bodyParams.status === ScorekeeperReservationStatus.offered ||
          (bodyParams.status === ScorekeeperReservationStatus.approved &&
            !bodyParams.is_offer)) &&
        bodyParams.expiry_datetime > new Date().getTime() / 1000 && (
          <View style={{marginTop: 15}}>
            <TCGradientButton
              title={strings.accept}
              marginBottom={15}
              onPress={() => {
                // navigation.navigate('AlterScorekeeperScreen', { reservationObj: allReservationData })

                if (
                  !(
                    bodyParams?.game?.status === GameStatus.accepted ||
                    bodyParams?.game?.status === GameStatus.reset
                  )
                ) {
                  Alert.alert('aa');
                } else if (
                  bodyParams?.game?.start_datetime <
                  new Date().getTime() / 1000
                ) {
                  Alert.alert(strings.scorekeeperOfferExpiryText);
                } else if (
                  bodyParams.initiated_by === authContext.entity.uid &&
                  (bodyParams.status ===
                    ScorekeeperReservationStatus.approved ||
                    bodyParams.status ===
                      ScorekeeperReservationStatus.offered) &&
                  bodyParams.total_game_fee > 0 &&
                  !defaultCard
                ) {
                  Alert.alert('Please choose payment method first.');
                } else {
                  let callerId = '';
                  if (bodyParams?.scorekeeper?.user_id !== entity.uid) {
                    callerId = entity.uid;
                  }
                  acceptDeclineScorekeeperReservation(
                    bodyParams.reservation_id,
                    callerId,
                    bodyParams.version,
                    bodyParams?.status ===
                      ScorekeeperReservationStatus.offered &&
                      bodyParams?.is_offer === true
                      ? 'approve'
                      : 'accept',
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
                  callerId = entity.uid;
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

      {(bodyParams.status === ScorekeeperReservationStatus.accepted ||
        bodyParams.status === ScorekeeperReservationStatus.restored ||
        bodyParams.status === ScorekeeperReservationStatus.requestcancelled ||
        (bodyParams.status === ScorekeeperReservationStatus.declined &&
          bodyParams.version > 3)) && (
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
                (bodyParams?.game?.status === GameStatus.accepted ||
                  bodyParams?.game?.status === GameStatus.reset) &&
                bodyParams.start_datetime >
                  parseFloat(new Date().getTime() / 1000).toFixed(0)
              ) {
                navigation.navigate('EditScorekeeperReservation', {
                  reservationObj: bodyParams,
                  lastConfirmVersion: bodyParams,
                });
              } else if (bodyParams?.game?.status === GameStatus.ended) {
                Alert.alert('Game is ended so you can not change reservation.');
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
            marginTop={10}
            onPress={() => {
              if (
                bodyParams?.game?.status ===
                (GameStatus.accepted || GameStatus.reset)
              ) {
                let callerId = '';
                if (bodyParams?.scorekeeper?.user_id !== entity.uid) {
                  callerId = entity.uid;
                }
                acceptDeclineScorekeeperReservation(
                  bodyParams.reservation_id,
                  callerId,
                  bodyParams.version,
                  'cancel',
                );
              } else if (
                bodyParams.start_datetime * 1000 <
                new Date().getTime()
              ) {
                Alert.alert(
                  'Reservation cannot be cancel after game time passed or offer expired.',
                );
              } else {
                Alert.alert(
                  'Reservation can not be cancel after game has been started.',
                );
              }
            }}
          />
            </View>
      )}
      {(bodyParams.status === ScorekeeperReservationStatus.pendingpayment ||
        bodyParams.status === ScorekeeperReservationStatus.approved) && (
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
            if (
              !(
                bodyParams?.game?.status === GameStatus.accepted ||
                bodyParams?.game?.status === GameStatus.reset
              )
            ) {
              Alert.alert(strings.cannotAcceptText);
            } else if (
              bodyParams?.expiry_datetime < new Date().getTime() / 1000 ||
              bodyParams?.game?.start_datetime < new Date().getTime() / 1000
            ) {
              Alert.alert(strings.scorekeeperOfferExpiryText);
            } else {
              let callerId = '';
              if (bodyParams?.scorekeeper?.user_id !== entity.uid) {
                callerId = entity.uid;
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
    </SafeAreaView>
  );

  console.log('Scorekeeper bodyparams:', bodyParams);
  return (
    <TCKeyboardView>
      <ScrollView style={{flex: 1}}>
        <ActivityLoader visible={loading} />
        {bodyParams && (
          <View>
            <ReservationNumber reservationNumber={bodyParams.reservation_id} />

            {/* <Text onPress={() => {
              navigation.navigate('ScorekeeperApprovalScreen', { reservationObj: bodyParams })
            }}>On Press</Text> */}

            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-between',
                margin: 15,
              }}>
              <View style={styles.challengerView}>
                <View style={styles.teamView}>
                  <Image source={images.reqIcon} style={styles.reqOutImage} />
                  <Text style={styles.challengerText}>Requester</Text>
                </View>

                <View style={styles.teamView}>
                  <View style={styles.profileView}>
                    <Image
                      source={
                        getRequester(bodyParams)?.thumbnail
                          ? {uri: getRequester(bodyParams)?.thumbnail}
                          : images.teamPlaceholder
                      }
                      style={styles.profileImage}
                    />
                  </View>
                  <Text style={styles.teamNameText}>
                    {getRequester(bodyParams)?.group_id
                      ? `${getRequester(bodyParams)?.group_name}`
                      : `${getRequester(bodyParams)?.first_name} ${
                          getRequester(bodyParams)?.last_name
                        }`}
                  </Text>
                </View>
              </View>
              <View style={styles.challengeeView}>
                <View style={styles.teamView}>
                  <Image source={images.refIcon} style={styles.reqOutImage} />
                  <Text style={styles.challengeeText}>Scorekeeper</Text>
                </View>

                <View style={styles.teamView}>
                  {/* <Image
                    source={
                      bodyParams?.scorekeeper?.thumbnail
                        ? { uri: bodyParams?.scorekeeper?.thumbnail }
                        : images.teamPlaceholder
                    }
                    style={styles.teamImage}
                  /> */}
                  <View style={styles.profileView}>
                    <Image
                      source={
                        bodyParams?.scorekeeper?.full_image
                          ? {uri: bodyParams?.scorekeeper?.full_image}
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
                      width: '80%',
                    }}>
                    {`${bodyParams?.scorekeeper?.first_name} ${bodyParams?.scorekeeper?.last_name}`}
                  </Text>
                </View>
              </View>
            </View>
            <TCThinDivider />

            <ScorekeeperReservationTitle
              reservationObject={bodyParams}
              showDesc={true}
              containerStyle={{margin: 15}}
            />

            {/* Status declined */}
            {/* {bodyParams?.approved_by === entity.uid && !bodyParams?.is_offer
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
                    {checkScorekeeperOrTeam(bodyParams) === 'scorekeeper'
                      ? `You have declined a scorekeeper request from ${getEntityName(
                          bodyParams,
                        )}.`
                      : `Your team have declined scorekeeper reservation request from ${getEntityName(
                          bodyParams,
                        )}.`}
                  </Text>
                </View>
              )}
            {bodyParams?.initiated_by === entity.uid && !bodyParams?.is_offer
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
                    {checkScorekeeperOrTeam(bodyParams) === 'scorekeeper'
                      ? `${getEntityName(
                        bodyParams,
                      )} has declined a scorekeeper request sent by you.`
                      : `${getEntityName(
                        bodyParams,
                      )} has declined scorekeeper reservation request sent by your team.`}
                  </Text>
                </View>
              )} */}

            {bodyParams?.scorekeeper?.user_id !== entity.uid &&
              bodyParams.status ===
                ScorekeeperReservationStatus.pendingpayment && (
                  <TCGradientButton
                  title={'TRY TO PAY AGAIN'}
                  onPress={() => {
                    navigation.navigate('PayAgainScorekeeperScreen', {
                      body: bodyParams,
                      comeFrom: 'ScorekeeperReservationScreen',
                    });
                  }}
                  style={{marginTop: 15}}
                />
              )}

            <TCThickDivider marginTop={15} />

            {bodyParams && (
              <View>
                <TCLabel
                  title="Game"
                  style={{marginLeft: 15, marginBottom: 15, marginTop: 15}}
                />
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
                    cardWidth={'90%'}
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
                          bodyParams?.start_datetime &&
                          moment(bodyParams?.start_datetime * 1000).format(
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
                            bodyParams?.game?.venue?.coordinate?.latitude ??
                            0.0,
                          longitude:
                            bodyParams?.game?.venue?.coordinate?.longitude ??
                            0.0,
                        }}
                        region={{
                          latitude:
                            bodyParams?.game?.venue?.coordinate?.latitude ??
                            0.0,
                          longitude:
                            bodyParams?.game?.venue?.coordinate?.longitude ??
                            0.0,
                          latitudeDelta: 0.0922,
                          longitudeDelta: 0.0421,
                        }}
                      />
                    </View>
                  </View>
                )}
              </View>
            )}
            <TCChallengeTitle title={'Game Rules'} />
            <Text style={styles.rulesTitle}>General Rules</Text>
            <Text style={styles.rulesDetail}>
              {bodyParams?.game?.general_rules}
            </Text>
            <View style={{marginBottom: 10}} />
            <Text style={styles.rulesTitle}>Special Rules</Text>
            <Text style={[styles.rulesDetail, {marginBottom: 10}]}>
              {bodyParams?.game?.special_rules}
            </Text>
            <TCThickDivider />
            {/* {bodyParams && (
            <View>
              <TCLabel title={'Rules of the match'} />
              <Text style={styles.rulesText}>
                {bodyParams?.game?.special_rule}
              </Text>
            </View>
          )}
          <TCThickDivider marginTop={20} /> */}

            <View>
              <TCChallengeTitle
                title={'Refund Policy'}
                value={bodyParams?.refund_policy}
                tooltipText={
                '-Cancellation 24 hours in advance- Free cancellation until 24 hours before the game starting time.  -Cancellation less than 24 hours in advance-If the challenge sender cancels  less than 24 hours before the game starting time the game fee and service fee are not refunded.'
                }
                tooltipHeight={heightPercentageToDP('18%')}
                tooltipWidth={widthPercentageToDP('50%')}
                isEdit={false}
              />
              <TCThickDivider />
            </View>
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
              senderOrReceiver={checkSenderForPayment(bodyParams)}
            />

            {bodyParams.initiated_by === authContext.entity.uid &&
              bodyParams.status === ScorekeeperReservationStatus.offered &&
              bodyParams.total_game_fee > 0 && (
                <View style={{marginTop: 15}}>
                  <TCTouchableLabel
                    title={
                      defaultCard && defaultCard?.card?.brand
                        ? Utility.capitalize(defaultCard?.card?.brand)
                        : strings.addOptionMessage
                    }
                    subTitle={
                      (defaultCard && defaultCard?.card?.last4) ??
                      defaultCard?.card?.last4
                    }
                    showNextArrow={true}
                    onPress={() => {
                      navigation.navigate('PaymentMethodsScreen', {
                        comeFrom: 'ScorekeeperReservationScreen',
                      });
                    }}
                  />
                </View>
              )}

            {renderBottomBurron()}
          </View>
        )}
      </ScrollView>
    </TCKeyboardView>
  );
}
const styles = StyleSheet.create({
  teamView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  reqOutImage: {
    width: 20,
    height: 20,
    resizeMode: 'cover',
  },
  challengeeText: {
    marginLeft: 5,
    fontFamily: fonts.RRegular,
    fontSize: 14,
    color: colors.lightBlackColor,
  },
  challengerText: {
    marginLeft: 5,
    fontFamily: fonts.RRegular,
    fontSize: 14,
    color: colors.lightBlackColor,
  },

  teamNameText: {
    marginLeft: 5,
    fontFamily: fonts.RMedium,
    fontSize: 16,
    color: colors.lightBlackColor,
    width: '80%',
  },
  challengerView: {
    marginRight: 15,
    flex: 0.5,
  },
  challengeeView: {
    flex: 0.5,
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
    height: 38,
    width: 38,
    borderRadius: 76,
  },

  profileView: {
    backgroundColor: colors.whiteColor,
    height: 40,
    width: 40,
    borderRadius: 80,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.grayColor,
    shadowOffset: {width: 0, height: 3},
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
