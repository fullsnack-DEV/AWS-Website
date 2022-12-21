/* eslint-disable no-unsafe-optional-chaining */
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
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import moment from 'moment';
import {useIsFocused} from '@react-navigation/native';
// eslint-disable-next-line no-unused-vars
import _ from 'lodash';

import * as Utility from '../../../utils';
import {
  acceptDeclineAlterReservation,
  acceptDeclineReservation,
  getEntityFeesEstimation,
  updateReservation,
  cancelAlterReservation,
} from '../../../api/Challenge';
import {paymentMethods} from '../../../api/Users';
import ActivityLoader from '../../../components/loader/ActivityLoader';
import {strings} from '../../../../Localization/translation';
import fonts from '../../../Constants/Fonts';
import colors from '../../../Constants/Colors';
import AuthContext from '../../../auth/context';
import TCGradientButton from '../../../components/TCGradientButton';
import TCKeyboardView from '../../../components/TCKeyboardView';
import TCThickDivider from '../../../components/TCThickDivider';
import images from '../../../Constants/ImagePath';
import TCLabel from '../../../components/TCLabel';
import TCInfoField from '../../../components/TCInfoField';
import EventMapView from '../../../components/Schedule/EventMapView';
import TCBorderButton from '../../../components/TCBorderButton';
import MatchFeesCard from '../../../components/challenge/MatchFeesCard';
import GameStatus from '../../../Constants/GameStatus';
import TCTouchableLabel from '../../../components/TCTouchableLabel';
import TCGameCard from '../../../components/TCGameCard';
import {getGameHomeScreen} from '../../../utils/gameUtils';
import ScorekeeperReservationStatus from '../../../Constants/ScorekeeperReservationStatus';
import TCTabView from '../../../components/TCTabView';
import TCThinDivider from '../../../components/TCThinDivider';
import CurruentScorekeeperReservationView from './CurruentScorekeeperReservationView';
import TCChallengeTitle from '../../../components/TCChallengeTitle';
import Verbs from '../../../Constants/Verbs';

let entity = {};
const scroll = React.createRef();
export default function EditScorekeeperReservation({navigation, route}) {
  const authContext = useContext(AuthContext);
  const isFocused = useIsFocused();
  const [loading, setloading] = useState(false);
  const [bodyParams, setbodyParams] = useState();
  const [paymentCard, setPaymentCard] = useState();
  const [editRules, setEditRules] = useState(false);
  const [editVenue, setEditVenue] = useState(false);
  const [editScorekeeper, setEditScoreKeeper] = useState(false);
  const [oldVersion, setOldVersion] = useState();
  const [editInfo, setEditInfo] = useState(false);
  const [editPayment, setEditPayment] = useState(false);
  const [editMatch, setEditMatch] = useState(false);
  const [isPendingRequestPayment, setIsPendingRequestPayment] = useState();
  const [maintabNumber, setMaintabNumber] = useState(0);

  const [defaultCard, setDefaultCard] = useState();
  const [isDeclined, setIsDeclined] = useState(false);

  const {reservationObj} = route.params ?? {};
  const getNavigationTitle = useCallback(() => {
    if (bodyParams?.status === ScorekeeperReservationStatus.changeRequest) {
      return strings.scorekeeperScreenTitle;
    }

    return strings.changeScorekeeperReservation;
  }, [bodyParams?.status]);
  useLayoutEffect(() => {
    navigation.setOptions({
      title: getNavigationTitle(),
    });
  }, [getNavigationTitle, navigation]);

  useEffect(() => {
    entity = authContext.entity;
    let reservationObject;
    if (reservationObj?.length > 0) {
      setIsPendingRequestPayment(true);
      reservationObject = reservationObj[0];
    } else {
      reservationObject = reservationObj;
    }
    setOldVersion(route?.params?.lastConfirmVersion);
    setbodyParams(reservationObject);

    if (!paymentCard) {
      setPaymentCard({
        start_datetime: reservationObject?.start_datetime,
        end_datetime: reservationObject?.end_datetime,
        currency_type: reservationObject?.currency_type,
        payment_method_type: reservationObject?.payment_method_type,
        total_game_fee: reservationObject?.total_game_fee,
        total_service_fee1: reservationObject?.total_service_fee1,
        total_service_fee2: reservationObject?.total_service_fee2,
        international_card_fee: reservationObject?.international_card_fee,
        total_amount: reservationObject?.total_amount,
        total_stripe_fee: reservationObject?.total_stripe_fee,
        total_payout: reservationObject?.total_payout,
        hourly_game_fee: reservationObject?.hourly_game_fee,
        manual_fee: reservationObject?.manual_fee,
      });
    }
    if (!defaultCard && reservationObject?.source) {
      getPaymentMethods(reservationObject?.source);
    }

    if (route?.params?.paymentMethod) {
      setDefaultCard(route?.params?.paymentMethod);
    }
  }, [isFocused]);

  useEffect(() => {
    if (route?.params?.comeFrom === 'ScorekeeperSelectMatch') {
      setbodyParams({...bodyParams, game: route?.params?.gameData});
      getFeesEstimationDetail();
    }
  }, [route?.params?.gameData]);
  useLayoutEffect(() => {
    sectionEdited();
  }, [
    bodyParams,
    editVenue,
    editRules,
    editScorekeeper,
    editScorekeeper,
    editInfo,
    defaultCard,
    editMatch,
  ]);

  const sectionEdited = () => {
    if (bodyParams && oldVersion) {
      if (bodyParams.special_rule !== oldVersion.special_rule) {
        setEditRules(true);
      } else {
        setEditRules(false);
      }
      // console.log('OLD:', oldVersion.responsible_to_secure_venue);
      // console.log('NEW:', bodyParams.responsible_to_secure_venue);
      if (
        bodyParams.responsible_to_secure_venue !==
        oldVersion.responsible_to_secure_venue
      ) {
        setEditVenue(true);
      } else {
        setEditVenue(false);
      }

      if (bodyParams.scorekeeper !== oldVersion.scorekeeper) {
        setEditScoreKeeper(true);
      } else {
        setEditScoreKeeper(false);
      }
      if (
        bodyParams?.home_team?.group_id !== oldVersion?.home_team?.group_id ||
        bodyParams?.home_team?.user_id !== oldVersion?.home_team?.user_id ||
        bodyParams?.away_team?.group_id !== oldVersion?.away_team?.group_id ||
        bodyParams?.away_team?.user_id !== oldVersion?.away_team?.user_id ||
        bodyParams?.start_datetime !== oldVersion?.start_datetime ||
        bodyParams?.end_datetime !== oldVersion?.end_datetime ||
        bodyParams?.venue?.address !== oldVersion?.venue?.address
      ) {
        setEditInfo(true);
      } else {
        setEditInfo(false);
      }
      if (
        bodyParams.total_game_fee !== oldVersion.total_game_fee ||
        bodyParams.manual_fee !== oldVersion.manual_fee
      ) {
        setEditPayment(true);
        getFeesEstimationDetail();
      } else {
        setEditPayment(false);
      }
      if (bodyParams.game.game_id !== oldVersion.game.game_id) {
        setEditMatch(true);
      } else {
        setEditMatch(false);
      }
    }
  };

  const getFeesEstimationDetail = () => {
    const body = {};
    // parseFloat((bodyParams.start_datetime / 1000).toFixed(0)

    body.reservation_id = bodyParams.reservation_id;
    body.start_datetime = bodyParams?.start_datetime;
    body.end_datetime = bodyParams?.end_datetime;
    body.currency_type = bodyParams?.currency_type ?? Verbs.usd;
    body.payment_method_type = Verbs.card;
    body.sport = bodyParams?.sport;
    body.manual_fee = bodyParams?.manual_fee;
    if (bodyParams?.manual_fee) {
      body.total_game_fee = bodyParams.total_game_fee;
    }

    setloading(true);
    getEntityFeesEstimation(
      'scorekeepers',
      bodyParams?.scorekeeper?.user_id,
      body,
      authContext,
    )
      .then((response) => {
        setloading(false);
        console.log('fee data :', response.payload);
        setPaymentCard({
          ...paymentCard,
          total_game_fee: response.payload.total_game_fee,
          total_amount: response.payload.total_amount,
          total_payout: response.payload.total_payout,
          total_service_fee1: response.payload.total_service_fee1,
          total_service_fee2: response.payload.total_service_fee2,
          international_card_fee: response.payload.international_card_fee,

          total_stripe_fee: response.payload.total_stripe_fee,
          hourly_game_fee: bodyParams?.hourly_game_fee,
          manual_fee: bodyParams?.manual_fee,
        });
      })
      .catch((e) => {
        setloading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 10);
      });
  };

  const cancelAlterReservationOperation = (
    reservationId,
    callerID,
    versionNo,
  ) => {
    setloading(true);
    cancelAlterReservation(
      'scorekeepers',
      reservationId,
      callerID,
      versionNo,
      authContext,
    )
      .then((response) => {
        setloading(false);
        console.log('ACCEPT RESPONSE::', JSON.stringify(response.payload));
        navigation.navigate('ReservationAcceptDeclineScreen', {
          teamObj:
            (reservationObj[0]?.game?.away_team?.group_id ??
              reservationObj[0]?.game?.away_team?.user_id) === entity.uid
              ? reservationObj[0]?.game?.home_team
              : reservationObj[0]?.game?.away_team,
          status: 'cancel',
        });
      })
      .catch((e) => {
        setloading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 10);
      });
  };

  const acceptDeclineReservationOperation = (
    reservationId,
    versionNo,
    status,
    isRestored = false,
  ) => {
    setloading(true);
    acceptDeclineReservation(
      'scorekeepers',
      reservationId,
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
          if (isRestored) {
            navigation.navigate('ScorekeeperRequestSent', {
              operationType: strings.reservationRequestRestored,
              imageAnimation: false,
            });
          } else {
            navigation.navigate('ScorekeeperRequestSent', {
              operationType: strings.reservationRequestDeclined,
              imageAnimation: false,
            });
          }
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
        }, 10);
      });
  };

  const acceptDeclineAlterReservationOperation = (
    reservationId,
    callerID,
    versionNo,
    status,
    paymentID,
  ) => {
    setloading(true);
    acceptDeclineAlterReservation(
      'scorekeepers',
      reservationId,
      callerID,
      versionNo,
      status,
      paymentID && {source: paymentID},
      authContext,
    )
      .then((response) => {
        setloading(false);
        console.log('ACCEPT RESPONSE::', JSON.stringify(response.payload));
        if (status === 'accept') {
          navigation.navigate('ScorekeeperRequestSent', {
            operationType: strings.reservationAlterRequestAccepted,
            imageAnimation: false,
          });
        } else if (status === 'decline') {
          navigation.navigate('ScorekeeperRequestSent', {
            operationType: strings.reservationAlterRequestDeclined,
            imageAnimation: false,
          });
        } else if (status === 'cancel') {
          navigation.navigate('ScorekeeperRequestSent', {
            operationType: strings.reservationAlterRequestCancelled,
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
      (param?.game?.home_team?.group_id || param?.game?.home_team?.user_id)
    ) {
      return param?.game?.home_team;
    }
    return param?.game?.away_team;
  };

  // const getPaymentMethods = () => {
  //   setloading(true)
  //   paymentMethods(authContext)
  //     .then((response) => {
  //       // setDefaultCard(response.payload[0].card)
  //       for (const tempCard of response.payload) {
  //         if (tempCard?.id === bodyParams?.source) {
  //           console.log('temp::', tempCard?.card)
  //           setDefaultCard(tempCard?.card)
  //           break
  //         }
  //       }
  //       setloading(false)
  //     })
  //     .catch((e) => {
  //       console.log('error in payment method', e)
  //       setloading(false)
  //       setTimeout(() => {
  //         Alert.alert(strings.alertmessagetitle, e.message);
  //       }, 10)
  //     })
  // }
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
  const checkSenderForPayment = (Obj) => {
    if (Obj?.scorekeeper?.user_id === entity.uid) {
      return 'receiver';
    }

    return 'sender';
  };

  const checkSenderOrReceiver = (Obj) => {
    const teampObj = {...Obj};
    if (
      teampObj?.status === ScorekeeperReservationStatus.pendingpayment ||
      teampObj?.status === ScorekeeperReservationStatus.pendingrequestpayment
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
          teampObj?.automatic_request &&
          teampObj?.status === ScorekeeperReservationStatus.changeRequest &&
          entity.obj.entity_type === 'team'
        ) {
          teampObj.requested_by = teampObj.initiated_by;
        } else {
          teampObj.requested_by = teampObj.updated_by.group_id;
        }
      } else if (
        teampObj?.automatic_request &&
        teampObj?.status === ScorekeeperReservationStatus.changeRequest &&
        teampObj?.scorekeeper?.user_id !== entity.uid
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
    if (teampObj?.requested_by === entity.uid) {
      return 'sender';
    }
    return 'receiver';
  };

  const updateReservationDetail = () => {
    setloading(true);
    const body = {};
    body.scorekeeper_id = bodyParams?.scorekeeper?.user_id;
    body.game_id = bodyParams?.game?.game_id;
    console.log('Payment card data::', paymentCard);
    body.total_service_fee1 = paymentCard?.total_service_fee1;
    body.total_game_fee = paymentCard?.total_game_fee;
    body.total_service_fee2 = paymentCard?.total_service_fee2;
    body.total_amount = paymentCard?.total_amount;
    body.total_payout = paymentCard?.total_payout;
    body.manual_fee = bodyParams?.manual_fee;
    body.international_card_fee = bodyParams?.international_card_fee;

    body.payment_method_type = Verbs.card;
    body.currency_type = bodyParams?.currency_type;

    if (
      checkSenderForPayment(bodyParams) === 'sender' &&
      paymentCard?.total_game_fee > 0
    ) {
      if (defaultCard) {
        body.source = defaultCard.id;
      }
    }

    const reservationId = bodyParams?.reservation_id;
    console.log('FINAL BODY PARAMS::', body);
    let callerId = '';
    if (bodyParams?.scorekeeper?.user_id !== entity.uid) {
      callerId = entity.uid;
    }
    updateReservation(
      'scorekeepers',
      reservationId,
      callerId,
      body,
      authContext,
    )
      .then(() => {
        setloading(false);
        navigation.push('AlterRequestSent');
      })
      .catch((e) => {
        setloading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 20);
      });
  };
  const getOpponentEntity = (Obj) => {
    if (Obj?.scorekeeper?.user_id === entity.uid) {
      if (Obj?.initiated_by === Obj?.game?.home_team?.user_id) {
        return Obj?.game?.away_team;
      }
      return Obj?.game?.home_team;
    }
    return Obj?.scorekeeper;
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

  const acceptDeclineScorekeeperReservation = (
    reservationID,
    versionNo,
    status,
  ) => {
    setloading(true);
    acceptDeclineReservation(
      'scorekeepers',
      reservationID,
      versionNo,
      status,
      {},
      authContext,
    )
      .then((response) => {
        setloading(false);
        console.log('ACCEPT RESPONSE::', JSON.stringify(response.payload));

        if (status === 'accept') {
          navigation.navigate('ChallengeAcceptedDeclinedScreen', {
            teamObj: {
              ...getOpponentEntity(bodyParams),
              game_id: bodyParams?.game_id,
              sport: bodyParams?.sport,
            },
            status: 'accept',
          });
        } else if (status === 'decline') {
          navigation.navigate('ChallengeAcceptedDeclinedScreen', {
            teamObj: getOpponentEntity(bodyParams),
            status: 'decline',
          });
        } else if (status === 'cancel') {
          navigation.navigate('ChallengeAcceptedDeclinedScreen', {
            teamObj: getOpponentEntity(bodyParams),
            status: 'cancel',
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
  console.log('Default card:', defaultCard);
  return (
    <TCKeyboardView scrollReference={scroll}>
      <ActivityLoader visible={loading} />
      <TCTabView
        totalTabs={2}
        firstTabTitle={strings.alterRequest}
        secondTabTitle={strings.currentReservation}
        indexCounter={maintabNumber}
        eventPrivacyContianer={{width: 100}}
        onFirstTabPress={() => setMaintabNumber(0)}
        onSecondTabPress={() => setMaintabNumber(1)}
        activeHeight={36}
        inactiveHeight={40}
      />

      {bodyParams && maintabNumber === 0 && (
        <View style={{marginBottom: 15}}>
          {(!isPendingRequestPayment ||
            (bodyParams.status === ScorekeeperReservationStatus.declined &&
              isDeclined)) && (
              <Text style={styles.buttonText}>
                {strings.editReservationDetails}
              </Text>
          )}
          {/* <View
             style={{
               flexDirection: 'row',
               justifyContent: 'flex-end',
               alignItems: 'flex-end',
               marginLeft: 15,
               marginRight: 15,
             }}>
             <ReservationNumber reservationNumber={bodyParams?.reservation_id} />
           </View> */}

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
                <Text style={styles.challengerText}>{strings.requester}</Text>
              </View>

              <View style={styles.teamView}>
                <View style={styles.profileView}>
                  <Image
                    source={
                      getRequester(bodyParams).thumbnail
                        ? {uri: getRequester(bodyParams).thumbnail}
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
                <Text style={styles.challengeeText}>{strings.scorekeeper}</Text>
              </View>

              <View style={styles.teamView}>
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

          {bodyParams && (
            <View>
              {/* Choose Match */}

              <View style={styles.editableView}>
                <TCLabel
                  title={strings.match.toUpperCase()}
                  isNew={editMatch}
                  style={{
                    marginLeft: 0,
                    marginTop: 10,
                  }}
                />

                {/* {bodyParams?.scorekeeper?.user_id !== entity.uid && (
                   <TouchableOpacity
                     style={styles.editTouchArea}
                     hitSlop={Utility.getHitSlop(15)}
                     onPress={() => {
                       navigation.navigate('ScorekeeperSelectMatch', {
                         userData: bodyParams?.scorekeeper,
                         sport: bodyParams?.sport,
                         comeFrom: 'EditScorekeeperReservation',
                         editableAlter: true,
                        body: bodyParams,
                       });
                     }}>
                     <Text
                       style={{
                         color: colors.themeColor,
                         fontFamily: fonts.RMedium,
                         fontSize: 16,
                       }}>
                       Edit
                     </Text>
                   </TouchableOpacity>
                 )} */}
              </View>

              {bodyParams?.game && (
                <View
                  style={{
                    marginBottom: 10,
                  }}>
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
                </View>
              )}
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
                        {/* <Text style={styles.dateTimeText}> </Text> */}
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

                  {/* Venue */}
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
                      style={{marginBottom: 10}}
                    />
                  </View>
                  <Seperator />
                </View>
              )}
              <TCLabel
                title={strings.matchrules.toUpperCase()}
                style={{
                  ...styles.titleText,
                  marginTop: 25,
                }}
              />
              <Text style={styles.rulesTitle}>
                {strings.gameRulesSubTitle1}
              </Text>
              <Text style={styles.rulesDetail}>
                {bodyParams?.game?.general_rules}
              </Text>
              <View style={{marginBottom: 10}} />
              <Text style={styles.rulesTitle}>
                {strings.gameRulesSubTitle2}
              </Text>
              <Text style={[styles.rulesDetail, {marginBottom: 10}]}>
                {bodyParams?.game?.special_rules}
              </Text>
            </View>
          )}
          {/* <CurruentVersionView
             onPress={() => {
               navigation.navigate('CurruentScorekeeperReservationScreen', {
                 reservationObj: oldVersion,
               });
             }}
           /> */}
          <TCThickDivider marginTop={15} />

          {/* Chief or assistant */}

          {/* <TCLabel title={'Chief or assistant'} style={{ marginLeft: 0 }}/> */}

          <View>
            <TCChallengeTitle
              title={strings.refundpolicy.toUpperCase()}
              value={bodyParams?.refund_policy}
              tooltipText={strings.cancellationPolicyDesc}
              tooltipHeight={Utility.heightPercentageToDP('18%')}
              tooltipWidth={Utility.widthPercentageToDP('50%')}
              isEdit={false}
              titleStyle={{
                ...styles.titleText,
                marginTop: 10,
                marginBottom: 10,
              }}
            />
            <TCThickDivider />
          </View>
          <View style={styles.editableView}>
            <TCLabel
              title={
                checkSenderForPayment(bodyParams) === 'sender'
                  ? strings.payment.toUpperCase()
                  : strings.earning.toUpperCase()
              }
              isNew={editPayment}
              style={{
                marginTop: 10,
                marginLeft: 0,
              }}
            />

            {(!isPendingRequestPayment ||
              (bodyParams.status === ScorekeeperReservationStatus.declined &&
                isDeclined)) && (
                <TouchableOpacity
                style={styles.editTouchArea}
                hitSlop={Utility.getHitSlop(15)}
                onPress={() =>
                  navigation.navigate('EditScorekeeperFeeScreen', {
                    editableAlter: true,
                    body: bodyParams,
                  })
                }>
                  <Text
                  style={{
                    color: colors.themeColor,
                    fontFamily: fonts.RMedium,
                    fontSize: 16,
                    marginTop: 10,
                  }}>
                    {strings.editTitleText}
                  </Text>
                </TouchableOpacity>
            )}
          </View>
          <View
            style={{
              marginBottom: 25,
            }}>
            <MatchFeesCard
              challengeObj={paymentCard}
              senderOrReceiver={checkSenderForPayment(bodyParams)}
            />
          </View>
          <Seperator />

          {checkSenderForPayment(bodyParams) === 'sender' &&
            paymentCard.total_game_fee > 0 && (
              <View style={{marginTop: 25}}>
                <View
                  style={{
                    marginLeft: 15,
                    marginRight: 15,
                    marginBottom: 10,
                  }}>
                  <Title text={strings.paymentMethod.toUpperCase()} />
                </View>
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
                      comeFrom: 'EditScorekeeperReservation',
                    });
                  }}
                />
              </View>
            )}
          {editPayment && (
            <View style={{marginTop: 15}}>
              <Text style={styles.differenceText}>
                {`${strings.Difference} `}
                <Text style={styles.differenceSmallText}>
                  {strings.newCurrentPayment}
                </Text>
              </Text>
              <View style={styles.differeceView}>
                <Text style={styles.differenceTextTitle}>
                  {strings.Difference}
                </Text>
                <Text style={styles.diffenceAmount}>{`$${parseFloat(
                  bodyParams?.total_game_fee - oldVersion?.total_game_fee,
                ).toFixed(2)} ${bodyParams.currency_type ?? Verbs.usd}`}</Text>
                {/* <Text style={styles.diffenceAmount}>{checkSenderOrReceiver(bodyParams) === 'sender' ? `$${bodyParams.total_charges - oldVersion.total_charges} CAD` : `$${bodyParams.total_payout - oldVersion.total_payout} CAD`}</Text> */}
              </View>
            </View>
          )}
          {checkSenderOrReceiver(bodyParams) === 'sender' &&
            bodyParams.status ===
              ScorekeeperReservationStatus.changeRequest && (
              <View style={{marginTop: 15}}>
                <TCBorderButton
                  title={strings.cancelAlterRequest}
                  textColor={colors.grayColor}
                  borderColor={colors.grayColor}
                  height={40}
                  shadow={true}
                  onPress={() => {
                    let callerId = '';
                    if (bodyParams?.scorekeeper?.user_id !== entity.uid) {
                      callerId = entity.uid;
                    }
                    cancelAlterReservationOperation(
                      bodyParams.reservation_id,
                      callerId,
                      bodyParams.version,
                    );
                  }}
                />
              </View>
            )}

          {checkSenderOrReceiver(bodyParams) === 'receiver' &&
            bodyParams.status === ScorekeeperReservationStatus.changeRequest &&
            bodyParams.expiry_datetime < new Date().getTime() && (
              <View style={{marginTop: 15}}>
                <TCGradientButton
                  title={strings.accept}
                  onPress={() => {
                    let callerId = '';
                    if (bodyParams?.scorekeeper?.user_id !== entity.uid) {
                      callerId = entity.uid;
                    }
                    acceptDeclineAlterReservationOperation(
                      bodyParams.reservation_id,
                      callerId,
                      bodyParams.version,
                      'accept',
                      route?.params?.paymentMethod &&
                        route?.params?.paymentMethod?.id,
                    );
                  }}
                />
                <TCBorderButton
                  title={strings.decline}
                  textColor={colors.grayColor}
                  borderColor={colors.grayColor}
                  height={40}
                  shadow={true}
                  onPress={() => {
                    acceptDeclineReservationOperation(
                      bodyParams.reservation_id,
                      bodyParams.version,
                      'decline',
                    );
                  }}
                />
              </View>
            )}

          {(((bodyParams.status === ScorekeeperReservationStatus.accepted ||
            bodyParams.status === ScorekeeperReservationStatus.restored) &&
            !isPendingRequestPayment) ||
            (bodyParams.status === ScorekeeperReservationStatus.declined &&
              isDeclined)) && (
              <View>
                <TCGradientButton
                title={strings.sendAlterRequest}
                textColor={colors.grayColor}
                startGradientColor={colors.yellowColor}
                endGradientColor={colors.themeColor}
                height={40}
                shadow={true}
                marginTop={15}
                onPress={() => {
                  if (editInfo || editPayment || editMatch) {
                    updateReservationDetail();
                  } else {
                    Alert.alert(strings.alterModificationMsg);
                  }
                }}
              />
                {/* <TCBorderButton
                 title={strings.cancel}
                 textColor={colors.themeColor}
                 borderColor={colors.themeColor}
                 height={40}
                 shadow={true}
                 marginBottom={15}
                 fontSize={16}
                 onPress={() => {
                   navigation.goBack();
                 }}
               /> */}
              </View>
          )}
          {(bodyParams.status === ScorekeeperReservationStatus.changeRequest ||
            bodyParams.status ===
              ScorekeeperReservationStatus.pendingrequestpayment) && (
              <View>
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
                    (bodyParams?.game?.status === GameStatus.accepted ||
                      bodyParams?.game?.status === GameStatus.reset) &&
                    bodyParams.start_datetime >
                      parseFloat(new Date().getTime() / 1000).toFixed(0)
                  ) {
                    let callerId = '';
                    if (bodyParams?.scorekeeper?.user_id !== entity.uid) {
                      callerId = entity.uid;
                    }
                    acceptDeclineAlterReservationOperation(
                      bodyParams.reservation_id,
                      callerId,
                      bodyParams.version,
                      'cancel',
                    );
                  } else {
                    Alert.alert(strings.cannotCancelReservationText);
                  }
                }}
              />
              </View>
          )}
          {bodyParams.status === ScorekeeperReservationStatus.declined &&
            !isDeclined && (
              <View>
                <TCBorderButton
                  title={strings.alterReservation}
                  textColor={colors.grayColor}
                  borderColor={colors.grayColor}
                  height={40}
                  shadow={true}
                  marginTop={15}
                  onPress={() => {
                    setIsDeclined(true);
                    setbodyParams(oldVersion);
                    scroll.current.scrollTo(0, 0);
                    // if (
                    //   (bodyParams?.game?.status === GameStatus.accepted
                    //     || bodyParams?.game?.status === GameStatus.reset)
                    //   && bodyParams.start_datetime > parseFloat(new Date().getTime() / 1000).toFixed(0)
                    // ) {
                    //   navigation.navigate('AlterScorekeeperScreen', {
                    //     reservationObj: bodyParams,
                    //   });
                    // } else {
                    //   Alert.alert(
                    //     'Reservation cannot be change after game time passed or offer expired.',
                    //   );
                    // }
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
                    if (
                      bodyParams?.game?.status ===
                      (GameStatus.accepted || GameStatus.reset)
                    ) {
                      acceptDeclineScorekeeperReservation(
                        bodyParams.reservation_id,
                        bodyParams.version,
                        'cancel',
                      );
                    } else if (
                      bodyParams.start_datetime * 1000 <
                      new Date().getTime()
                    ) {
                      Alert.alert(strings.cannotCancelReservationText);
                    } else {
                      Alert.alert(strings.cannotAcceptText);
                    }
                  }}
                />
              </View>
            )}
        </View>
      )}
      <SafeAreaView>
        {maintabNumber === 1 && (
          <CurruentScorekeeperReservationView
            reservationObj={oldVersion}
            navigation={navigation}
          />
        )}
      </SafeAreaView>
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
    marginBottom: 5,
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

  buttonText: {
    justifyContent: 'center',
    alignSelf: 'center',
    color: colors.darkThemeColor,
    fontSize: 16,
    fontFamily: fonts.RRegular,
    marginLeft: 15,
    marginRight: 15,
    marginBottom: 5,
  },
  // editButton: {
  //   height: 16,
  //   width: 16,
  //   resizeMode: 'center',
  //   alignSelf: 'center',
  // },
  editTouchArea: {
    alignSelf: 'center',
  },
  editableView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 15,
  },
  differeceView: {
    shadowColor: colors.blackColor,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.16,
    shadowRadius: 1,
    elevation: 3,
    borderRadius: 8,
    marginTop: 5,
    marginLeft: 15,
    marginRight: 15,
    height: 40,
    backgroundColor: colors.whiteColor,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  differenceText: {
    marginLeft: 15,
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.themeColor,
  },
  differenceSmallText: {
    marginLeft: 15,
    fontSize: 14,
    fontFamily: fonts.RRegular,
    color: colors.themeColor,
  },
  differenceTextTitle: {
    marginLeft: 15,
    alignSelf: 'center',
    fontFamily: fonts.RRegular,
    fontSize: 15,
    color: colors.lightBlackColor,
  },
  diffenceAmount: {
    marginRight: 15,
    alignSelf: 'center',
    fontFamily: fonts.RMedium,
    fontSize: 15,
    color: colors.themeColor,
  },

  contentContainer: {
    padding: 15,
    // paddingTop: 0,
    paddingTop: 25,
  },
  titleText: {
    color: colors.lightBlackColor,
    fontSize: 16,
    fontFamily: fonts.RBold,
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
    marginBottom: 10,
  },
});
