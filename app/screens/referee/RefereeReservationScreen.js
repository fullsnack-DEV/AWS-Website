/* eslint-disable no-unsafe-optional-chaining */
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
import {strings} from '../../../Localization/translation';
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
import {getGameHomeScreen} from '../../utils/gameUtils';
import RefereeReservationStatus from '../../Constants/RefereeReservationStatus';
import TCChallengeTitle from '../../components/TCChallengeTitle';
import {heightPercentageToDP, widthPercentageToDP} from '../../utils';
import TCTouchableLabel from '../../components/TCTouchableLabel';
import RefereeReservationTitle from '../../components/reservations/RefereeReservationTitle';
import {paymentMethods} from '../../api/Users';

let entity = {};

export default function RefereeReservationScreen({navigation, route}) {
  const authContext = useContext(AuthContext);

  const [loading, setloading] = useState(false);
  const [homeTeam, setHomeTeam] = useState();
  const [awayTeam, setAwayTeam] = useState();
  const [bodyParams, setbodyParams] = useState();
  const [defaultCard, setDefaultCard] = useState();

  useEffect(() => {
    entity = authContext.entity;
    const {reservationObj} = route.params ?? {};
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
        const matchCard = response.payload.find((card) => card.id === source);
        if (matchCard) {
          setDefaultCard(matchCard);
        }
        setloading(false);
      })
      .catch((e) => {
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
      bodyParams?.status === RefereeReservationStatus.approved ||
      bodyParams?.status === RefereeReservationStatus.declined
    ) {
      return strings.refereeRequestScreenTitle;
    }
    return strings.refereeScreenTitle;
  };
  const acceptDeclineRefereeReservation = (
    reservationID,
    callerID,
    versionNo,
    status,
  ) => {
    setloading(true);
    acceptDeclineReservation(
      'referees',
      reservationID,
      callerID,
      versionNo,
      status,
      {source: defaultCard?.id},
      authContext,
    )
      .then(() => {
        setloading(false);
        if (status === 'accept') {
          navigation.navigate('RefereeRequestSent', {
            operationType: strings.reservationRequestAccepted,
            imageAnimation: true,
          });
        } else if (status === 'decline') {
          navigation.navigate('RefereeRequestSent', {
            operationType: strings.reservationRequestDeclined,
            imageAnimation: false,
          });
        } else if (status === 'cancel') {
          navigation.navigate('RefereeRequestSent', {
            operationType: strings.reservationRequestCancelled,
            imageAnimation: false,
          });
        } else if (status === 'approve') {
          navigation.navigate('RefereeRequestSent', {
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
    if (reservationObj?.referee?.user_id === entity.uid) {
      return 'receiver';
    }

    return 'sender';
  }, []);
  const checkSenderOrReceiver = (reservationObj) => {
    const teampObj = {...reservationObj};
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
    if (entity.uid === param?.referee?.user_id) {
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
        (bodyParams.status === RefereeReservationStatus.approved ||
          bodyParams.status === RefereeReservationStatus.offered) &&
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
                if (bodyParams?.referee?.user_id !== entity.uid) {
                  callerId = entity.uid;
                }
                acceptDeclineRefereeReservation(
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
        (bodyParams.status === RefereeReservationStatus.offered ||
          (bodyParams.status === RefereeReservationStatus.approved &&
            !bodyParams.is_offer)) &&
        bodyParams.expiry_datetime > new Date().getTime() / 1000 && (
          <View style={{marginTop: 15}}>
            <TCGradientButton
              title={strings.accept}
              marginBottom={15}
              onPress={() => {
                if (
                  !(
                    bodyParams?.game?.status === GameStatus.accepted ||
                    bodyParams?.game?.status === GameStatus.reset
                  )
                ) {
                  Alert.alert(strings.cannotAcceptText);
                } else if (
                  bodyParams?.game?.start_datetime <
                  new Date().getTime() / 1000
                ) {
                  Alert.alert(strings.refereeOfferExpiryText);
                } else if (
                  bodyParams.initiated_by === authContext.entity.uid &&
                  (bodyParams.status === RefereeReservationStatus.approved ||
                    bodyParams.status === RefereeReservationStatus.offered) &&
                  bodyParams.total_game_fee > 0 &&
                  !defaultCard
                ) {
                  Alert.alert(strings.paymentMethodFirst);
                } else {
                  let callerId = '';
                  if (bodyParams?.referee?.user_id !== entity.uid) {
                    callerId = entity.uid;
                  }
                  acceptDeclineRefereeReservation(
                    bodyParams.reservation_id,
                    callerId,
                    bodyParams.version,
                    bodyParams?.status === RefereeReservationStatus.offered &&
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
                if (bodyParams?.referee?.user_id !== entity.uid) {
                  callerId = entity.uid;
                }
                acceptDeclineRefereeReservation(
                  bodyParams.reservation_id,
                  callerId,
                  bodyParams.version,
                  'decline',
                );
              }}
            />
          </View>
        )}

      {(bodyParams.status === RefereeReservationStatus.accepted ||
        bodyParams.status === RefereeReservationStatus.restored ||
        bodyParams.status === RefereeReservationStatus.requestcancelled ||
        (bodyParams.status === RefereeReservationStatus.declined &&
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
                navigation.navigate('EditRefereeReservation', {
                  reservationObj: bodyParams,
                  lastConfirmVersion: bodyParams,
                });
              } else if (bodyParams?.game?.status === GameStatus.ended) {
                Alert.alert(strings.gameEndedNotChangeReservation);
              } else {
                Alert.alert(
                  strings.reservationCannotChange,
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
                if (bodyParams?.referee?.user_id !== entity.uid) {
                  callerId = entity.uid;
                }
                acceptDeclineRefereeReservation(
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
                  strings.cannotCancelReservationText,
                );
              } else {
                Alert.alert(
                  strings.reservationNotCancelAfterGame,
                );
              }
            }}
          />
        </View>
      )}
      {(bodyParams.status === RefereeReservationStatus.pendingpayment ||
        bodyParams.status === RefereeReservationStatus.approved) && (
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
              Alert.alert(strings.refereeOfferExpiryText);
            } else {
              let callerId = '';
              if (bodyParams?.referee?.user_id !== entity.uid) {
                callerId = entity.uid;
              }
              acceptDeclineRefereeReservation(
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
  return (
    <TCKeyboardView>
      <ScrollView style={{flex: 1}}>
        <ActivityLoader visible={loading} />
        {bodyParams && (
          <View>
            <ReservationNumber reservationNumber={bodyParams.reservation_id} />
            <RefereeReservationTitle
              reservationObject={bodyParams}
              showDesc={true}
              containerStyle={{
                margin: 15,
                marginBottom: 15,
              }}
              fontSize={18}
              fontFamily={fonts.RBold}
            />
            <TCThinDivider />
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-between',
                margin: 15,
                marginTop: 25,
              }}>
              <View style={styles.challengerView}>
                <View style={styles.teamView}>
                  <Image source={images.reqIcon} style={styles.reqOutImage} />
                  <Text style={styles.challengerText}>{strings.requester}</Text>
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
                  <Text style={styles.challengeeText}>{strings.Referee}</Text>
                </View>

                <View style={styles.teamView}>
                  <View style={styles.profileView}>
                    <Image
                      source={
                        bodyParams?.referee?.full_image
                          ? {uri: bodyParams?.referee?.full_image}
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
                    {`${bodyParams?.referee?.first_name} ${bodyParams?.referee?.last_name}`}
                  </Text>
                </View>
              </View>
            </View>
            {bodyParams?.referee?.user_id !== entity.uid &&
              bodyParams.status === RefereeReservationStatus.pendingpayment && (
                <TCGradientButton
                  title={strings.tryToPayText}
                  onPress={() => {
                    navigation.navigate('PayAgainRefereeScreen', {
                      body: bodyParams,
                      comeFrom: 'RefereeReservationScreen',
                    });
                  }}
                  style={{marginTop: 15}}
                />
              )}

            <TCThickDivider marginTop={15} />

            {bodyParams && (
              <View>
                <View style={{marginBottom: 10}}>
                  <TCLabel
                    title={strings.match.toUpperCase()}
                    style={{marginLeft: 15, marginBottom: 15, marginTop: 25}}
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
                      cardWidth={'92%'}
                    />
                  )}
                </View>
                <Seperator />
                {/* Date & Time */}
                {bodyParams?.game && (
                  <View>
                    <View style={styles.contentContainer}>
                      <Title text={strings.dateAndTime.toUpperCase()} />
                      <View
                        style={{
                          marginTop: 20,
                          marginLeft: 0,
                          marginRight: 15,
                        }}>
                        <View style={styles.dateTimeValue}>
                          <Text style={styles.dateTimeText}>
                            {strings.start.toUpperCase()}{' '}
                          </Text>
                          <Text style={styles.dateTimeText}>
                            {bodyParams?.start_datetime &&
                              moment(bodyParams?.start_datetime * 1000).format(
                                'MMM DD, YYYY\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0hh:mm a',
                              )}
                          </Text>
                        </View>
                        <View style={styles.dateTimeValue}>
                          <Text style={styles.dateTimeText}>
                            {strings.end.toUpperCase()}{' '}
                          </Text>
                          <Text style={styles.dateTimeText}>
                            {bodyParams?.end_datetime &&
                              moment(bodyParams?.end_datetime * 1000).format(
                                'MMM DD, YYYY\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0hh:mm a',
                              )}
                          </Text>
                        </View>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'flex-end',
                          }}>
                          <Text style={styles.timeZoneText}>
                            {strings.timezone}{' '}
                            <Text style={{fontFamily: fonts.RRegular}}>
                              {strings.vancouver}
                            </Text>
                          </Text>
                        </View>
                      </View>
                    </View>
                    <Seperator />
                    <View style={styles.contentContainer}>
                      <Title text={strings.venue.toUpperCase()} />
                      <TCInfoField
                        title={strings.venue.toUpperCase()}
                        value={bodyParams?.game?.venue?.name}
                        marginTop={20}
                        marginLeft={0}
                        marginRight={0}
                        marginBottom={15}
                        titleStyle={{
                          alignSelf: 'flex-start',
                          fontFamily: fonts.RRegular,
                        }}
                        valueStyle={{
                          flex: 0.72,
                        }}
                      />
                      <Seperator height={1} />
                      <TCInfoField
                        title={strings.address.toUpperCase()}
                        value={bodyParams?.game?.venue?.address}
                        marginTop={0}
                        marginBottom={15}
                        marginLeft={0}
                        marginRight={0}
                        titleStyle={{
                          fontFamily: fonts.RRegular,
                          color: colors.lightBlackColor,
                          fontSize: 16,
                        }}
                        valueStyle={{
                          flex: 0.72,
                          marginTop: 15,
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
                        style={{marginBottom: 10}}
                      />
                    </View>
                    <Seperator />
                  </View>
                )}
              </View>
            )}
            <TCChallengeTitle
              title={strings.matchrules.toUpperCase()}
              titleStyle={{
                ...styles.titleText,
                marginTop: 10,
              }}
            />
            <Text style={styles.rulesTitle}>{strings.gameRulesSubTitle1}</Text>
            <Text style={styles.rulesDetail}>
              {bodyParams?.game?.general_rules}
            </Text>
            <View style={{marginBottom: 10}} />
            <Text style={styles.rulesTitle}>{strings.gameRulesSubTitle2}</Text>
            <Text style={[styles.rulesDetail, {marginBottom: 25}]}>
              {bodyParams?.game?.special_rules}
            </Text>
            <TCThickDivider />
            <View style={styles.contentContainer}>
              <Title text={strings.chieforassistant.toUpperCase()} />
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
                  {_.startCase(
                    bodyParams?.chief_referee ? strings.chief : strings.assistant,
                  )}{' '}
                  {strings.Referee}
                </Text>
              </View>
            </View>
            <TCThickDivider />
            <View>
              <TCChallengeTitle
                title={strings.refundpolicy.toUpperCase()}
                value={bodyParams?.refund_policy}
                tooltipText={
                  strings.cancellationPolicyDesc
                }
                tooltipHeight={heightPercentageToDP('18%')}
                tooltipWidth={widthPercentageToDP('50%')}
                isEdit={false}
                titleStyle={{
                  ...styles.titleText,
                  marginTop: 10,
                  marginBottom: 10,
                }}
              />
              <TCThickDivider />
            </View>
            <TCLabel
              title={
                checkSenderForPayment(bodyParams) === 'sender'
                  ? strings.payment.toUpperCase()
                  : strings.earning.toUpperCase()
              }
              style={{marginTop: 25}}
            />
            <View
              style={{
                marginTop: 20,
                marginBottom: 25,
              }}>
              <MatchFeesCard
                challengeObj={{
                  ...bodyParams,
                  start_datetime: bodyParams.start_datetime * 1000,
                  end_datetime: bodyParams.end_datetime * 1000,
                }}
                senderOrReceiver={checkSenderForPayment(bodyParams)}
              />
            </View>

            {bodyParams.initiated_by === authContext.entity.uid &&
              bodyParams.status === RefereeReservationStatus.offered &&
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
                        comeFrom: 'RefereeReservationScreen',
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
    paddingTop: 25,
    padding: 15,
  },
  titleText: {
    color: colors.lightBlackColor,
    fontSize: 16,
    fontFamily: fonts.RBold,
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
  dateTimeValue: {
    flexDirection: 'row',
    justifyContent: 'space-between',

    marginLeft: 0,
    marginTop: 0,
  },
  dateTimeText: {
    fontFamily: fonts.RRegular,
    fontSize: 16,
    color: colors.lightBlackColor,
    marginBottom: 15,
  },
  timeZoneText: {
    fontFamily: fonts.RLight,
    fontSize: 14,
    color: colors.lightBlackColor,
    marginBottom: 25,
  },
});
