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
import LinearGradient from 'react-native-linear-gradient';
import _ from 'lodash';

import {useIsFocused} from '@react-navigation/native';
import {
  acceptDeclineAlterReservation,
  acceptDeclineReservation,
  getEntityFeesEstimation,
  updateReservation,
  cancelAlterReservation,
} from '../../../api/Challenge';
import * as Utility from '../../../utils';

import {paymentMethods} from '../../../api/Users';
import ActivityLoader from '../../../components/loader/ActivityLoader';
import strings from '../../../Constants/String';
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
import ReservationNumber from '../../../components/reservations/ReservationNumber';
import GameStatus from '../../../Constants/GameStatus';
import TCGameCard from '../../../components/TCGameCard';
import {
  getGameFromToDateDiff,
  getGameHomeScreen,
} from '../../../utils/gameUtils';
import RefereeReservationStatus from '../../../Constants/RefereeReservationStatus';
import {
  getHitSlop,
  heightPercentageToDP,
  widthPercentageToDP,
} from '../../../utils';
import TCTabView from '../../../components/TCTabView';
import CurruentRefereeReservationView from './CurrentRefereeReservationView';
import TCChallengeTitle from '../../../components/TCChallengeTitle';
import TCTouchableLabel from '../../../components/TCTouchableLabel';
import RefereeReservationTitle from '../../../components/reservations/RefereeReservationTitle';

let entity = {};
const scroll = React.createRef();
export default function AlterRefereeScreen({navigation, route}) {
  const authContext = useContext(AuthContext);
  const isFocused = useIsFocused();

  const [chiefOrAssistant, setChiefOrAssistant] = useState('');
  const [loading, setloading] = useState(false);
  const [homeTeam, setHomeTeam] = useState();
  const [awayTeam, setAwayTeam] = useState();
  const [bodyParams, setbodyParams] = useState();
  const [paymentCard, setPaymentCard] = useState();
  const [editRules, setEditRules] = useState(false);
  const [editVenue, setEditVenue] = useState(false);
  const [editReferee, setEditReferee] = useState(false);
  const [editScorekeeper, setEditScoreKeeper] = useState(false);
  const [oldVersion, setOldVersion] = useState();
  const [editInfo, setEditInfo] = useState(false);
  const [editPayment, setEditPayment] = useState(false);
  const [isPendingRequestPayment, setIsPendingRequestPayment] = useState();
  const [isOld, setIsOld] = useState(false);
  const [defaultCard, setDefaultCard] = useState();
  const [maintabNumber, setMaintabNumber] = useState(0);
  const [reservationObj] = useState(route?.params?.reservationObj);

  useEffect(() => {
    const is_chief = bodyParams?.chief_referee ? 'chief' : 'assistant';
    setChiefOrAssistant(is_chief);
  }, [bodyParams]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Referee Reservation',
    });
  }, [navigation, bodyParams]);
  useEffect(() => {
    entity = authContext.entity;

    console.log('reservationObjreservationObj:=>', reservationObj);
    if (isFocused) {
      if (reservationObj.length > 0) {
        setIsPendingRequestPayment(true);
        for (let i = 0; i < reservationObj.length; i++) {
          if (reservationObj[i].status === RefereeReservationStatus.accepted) {
            if (isOld === false) {
              setbodyParams(reservationObj[0]);
              setOldVersion(reservationObj[i]);
              setIsOld(true);
            } else {
              setbodyParams(reservationObj[0]);
            }

            if (
              (reservationObj[0]?.game?.away_team?.group_id ??
                reservationObj[0]?.game?.away_team?.user_id) === entity.uid
            ) {
              setHomeTeam(reservationObj[0]?.game?.away_team);
              setAwayTeam(reservationObj[0]?.game?.home_team);
            } else {
              setHomeTeam(reservationObj[0]?.game?.home_team);
              setAwayTeam(reservationObj[0]?.game?.away_team);
            }
            break;
          }
        }
        if (!paymentCard) {
          setPaymentCard({
            start_datetime: reservationObj[0]?.start_datetime,
            end_datetime: reservationObj[0]?.end_datetime,
            currency_type: reservationObj[0]?.currency_type,
            payment_method_type: reservationObj[0]?.payment_method_type,
            total_game_fee: reservationObj[0]?.total_game_fee,
            total_service_fee1: reservationObj[0]?.total_service_fee1,
            total_service_fee2: reservationObj[0]?.total_service_fee2,
            international_card_fee: reservationObj[0]?.international_card_fee,
            total_amount: reservationObj[0]?.total_amount,
            total_stripe_fee: reservationObj[0]?.total_stripe_fee,
            total_payout: reservationObj[0]?.total_payout,
            hourly_game_fee: reservationObj[0]?.hourly_game_fee,
            manual_fee: reservationObj[0]?.manual_fee,
          });
        }
        console.log('challenge Object::', reservationObj[0]);

        console.log('Payment Object::', paymentCard);
      } else {
        if (isOld === false) {
          setbodyParams(reservationObj);
          // oldVersion = { ...body };
          setOldVersion(reservationObj);
          setIsOld(true);
        } else {
          setbodyParams(reservationObj);
        }

        if (
          (reservationObj?.game?.away_team?.group_id ??
            reservationObj?.game?.away_team?.user_id) === entity.uid
        ) {
          setHomeTeam(reservationObj?.game?.away_team);
          setAwayTeam(reservationObj?.game?.home_team);
        } else {
          setHomeTeam(reservationObj?.game?.home_team);
          setAwayTeam(reservationObj?.game.away_team);
        }
        if (!paymentCard) {
          setPaymentCard({
            start_datetime: reservationObj?.start_datetime,
            end_datetime: reservationObj?.end_datetime,
            currency_type: reservationObj?.currency_type,
            payment_method_type: reservationObj?.payment_method_type,
            total_game_fee: reservationObj?.total_game_fee,
            total_service_fee1: reservationObj?.total_service_fee1,
            total_service_fee2: reservationObj?.total_service_fee1,
            international_card_fee: reservationObj?.international_card_fee,
            total_amount: reservationObj?.total_amount,
            total_stripe_fee: reservationObj?.total_stripe_fee,
            total_payout: reservationObj?.total_payout,
            hourly_game_fee: reservationObj?.hourly_game_fee,
            manual_fee: reservationObj?.manual_fee,
          });
        }
        console.log('challenge Object::', reservationObj);

        console.log('Payment Object::', paymentCard);
      }
      getPaymentMethods(reservationObj[0] ?? reservationObj);
    }
  }, []);

  useLayoutEffect(() => {
    sectionEdited();
  }, [
    bodyParams,
    isOld,
    editVenue,
    editRules,
    editReferee,
    editScorekeeper,
    editInfo,
  ]);

  useEffect(() => {
    if (route?.params?.paymentMethod) {
      setDefaultCard(route?.params?.paymentMethod);
      setbodyParams({
        ...bodyParams,
        source: route?.params?.paymentMethod?.id,
      });
      getFeesEstimationDetail();
    }
  }, [route?.params?.paymentMethod]);

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
      if (bodyParams.referee !== oldVersion.referee) {
        setEditReferee(true);
      } else {
        setEditReferee(false);
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
        bodyParams.total_game_charges !== oldVersion.total_game_charges ||
        bodyParams.manual_fee !== oldVersion.manual_fee
      ) {
        setEditPayment(true);
        getFeesEstimationDetail();
      } else {
        setEditPayment(false);
      }
    }
  };

  const getFeesEstimationDetail = () => {
    const body = {};
    // parseFloat((bodyParams.start_datetime / 1000).toFixed(0)
    body.source = bodyParams?.source;
    body.reservation_id = bodyParams.reservation_id;
    body.start_datetime = bodyParams?.start_datetime;
    body.end_datetime = bodyParams?.end_datetime;
    body.currency_type = bodyParams?.currency_type || strings.defaultCurrency;
    body.payment_method_type = 'card';
    body.sport = bodyParams?.sport;
    body.manual_fee = bodyParams?.manual_fee;
    if (bodyParams?.manual_fee) {
      body.total_game_fee = bodyParams.total_game_fee;
    }

    setloading(true);
    getEntityFeesEstimation(
      'referees',
      bodyParams?.referee?.user_id,
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
          hourly_game_fee: bodyParams.hourly_game_fee,
          manual_fee: bodyParams.manual_fee,
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
      'referees',
      reservationId,
      callerID,
      versionNo,
      authContext,
    )
      .then((response) => {
        setloading(false);
        console.log('ACCEPT RESPONSE::', JSON.stringify(response.payload));
        navigation.push('RefereeRequestSent', {
          operationType: strings.reservationRequestCancelled,
          imageAnimation: false,
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
    callerID,
    versionNo,
    status,
    isRestored = false,
  ) => {
    setloading(true);
    acceptDeclineReservation(
      'referees',
      reservationId,
      callerID,
      versionNo,
      status,
      {},
      authContext,
    )
      .then((response) => {
        setloading(false);
        console.log('ACCEPT RESPONSE::', response.payload);

        if (status === 'accept') {
          navigation.navigate('ReservationAcceptDeclineScreen', {
            teamObj: {
              ...getOpponentEntity(bodyParams),
              game_id: bodyParams?.game_id,
              sport: bodyParams?.sport,
            },
            status: 'accept',
          });
        } else if (status === 'decline') {
          if (isRestored) {
            navigation.navigate('ReservationAcceptDeclineScreen', {
              teamObj: getOpponentEntity(bodyParams),
              status: 'restored',
            });
          } else {
            navigation.navigate('ReservationAcceptDeclineScreen', {
              teamObj: getOpponentEntity(bodyParams),
              status: 'decline',
            });
          }
        } else if (status === 'cancel') {
          navigation.navigate('ReservationAcceptDeclineScreen', {
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

  const acceptDeclineAlterReservationOperation = (
    reservationId,
    callerID,
    versionNo,
    status,
    paymentobj,
  ) => {
    setloading(true);

    acceptDeclineAlterReservation(
      'referees',
      reservationId,
      callerID,
      versionNo,
      status,
      paymentobj,
      authContext,
    )
      .then((response) => {
        setloading(false);
        console.log('ACCEPT RESPONSE::', JSON.stringify(response.payload));

        if (status === 'accept') {
          navigation.navigate('ReservationAcceptDeclineScreen', {
            teamObj: {
              ...getOpponentEntity(bodyParams),
              game_id: bodyParams?.game_id,
              sport: bodyParams?.sport,
            },
            status: 'accept',
          });
        } else if (status === 'decline') {
          navigation.navigate('ReservationAcceptDeclineScreen', {
            teamObj: getOpponentEntity(bodyParams),
            status: 'decline',
          });
        } else if (status === 'cancel') {
          navigation.navigate('ReservationAcceptDeclineScreen', {
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

    return (param?.game?.home_team?.group_id ||
      param?.game?.home_team?.user_id) === param?.initiated_by
      ? param?.game?.home_team
      : param?.game?.away_team;
  };

  const getPaymentMethods = useCallback(
    (obj) => {
      setloading(true);
      paymentMethods(authContext)
        .then((response) => {
          console.log('source ID:', obj?.source);
          console.log('payment method', response.payload);
          for (const tempCard of response?.payload) {
            if (tempCard?.id === obj?.source) {
              setDefaultCard(tempCard);
              break;
            }
          }

          // setCards([...response.payload])
          setloading(false);
          // if (response.payload.length === 0) {
          //   openNewCardScreen();
          // }
        })
        .catch((e) => {
          console.log('error in payment method', e);
          setloading(false);
          setTimeout(() => {
            Alert.alert(strings.alertmessagetitle, e.message);
          }, 10);
        });
    },
    [authContext],
  );
  const checkSenderForPayment = (reservationObject) => {
    if (reservationObject?.referee?.user_id === entity.uid) {
      return 'receiver';
    }

    return 'sender';
  };

  const checkSenderOrReceiver = (reservationObject) => {
    const teampObj = {...reservationObject};
    if (
      teampObj?.status === RefereeReservationStatus.pendingpayment ||
      teampObj?.status === RefereeReservationStatus.pendingrequestpayment
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
          teampObj?.status === RefereeReservationStatus.changeRequest &&
          entity?.obj?.entity_type === 'team'
        ) {
          teampObj.requested_by = teampObj.initiated_by;
        } else {
          teampObj.requested_by = teampObj.updated_by.group_id;
        }
      } else if (
        teampObj?.automatic_request &&
        teampObj?.status === RefereeReservationStatus.changeRequest &&
        teampObj?.referee?.user_id !== entity.uid
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

  const updateReservationDetail = () => {
    setloading(true);
    const body = {};
    body.referee_id = bodyParams?.referee?.user_id;
    body.game_id = bodyParams?.game?.game_id;
    console.log('Payment card data::', paymentCard);
    body.chief_referee = chiefOrAssistant === 'chief';
    body.total_service_fee1 = paymentCard?.total_service_fee1;
    body.total_game_fee = paymentCard?.total_game_fee;
    body.total_service_fee2 = paymentCard?.total_service_fee2;
    body.international_card_fee = paymentCard?.international_card_fee;
    body.total_amount = paymentCard?.total_amount;
    body.total_payout = paymentCard?.total_payout;
    body.manual_fee = bodyParams?.manual_fee;
    body.payment_method_type = 'card';
    body.currency_type = bodyParams?.currency_type;

    if (
      checkSenderForPayment(bodyParams) === 'sender' &&
      paymentCard.total_game_charges > 0
    ) {
      let paymentSource;
      if (defaultCard) {
        paymentSource = defaultCard?.id;
      } else if (route.params.paymentMethod) {
        paymentSource = route?.params?.paymentMethod?.id;
      } else {
        Alert.alert(strings.selectCardText);
        return;
      }
      body.source = paymentSource;
    }

    const reservationId = bodyParams?.reservation_id;
    console.log('FINAL BODY PARAMS::', body);
    let callerId = '';
    if (bodyParams?.referee?.user_id !== entity.uid) {
      callerId = entity.uid;
    }
    updateReservation('referees', reservationId, callerId, body, authContext)
      .then(() => {
        setloading(false);
        navigation.navigate('AlterRequestSent');
      })
      .catch((e) => {
        setloading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 10);
      });
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
  const getDateDuration = (fromData, toDate) => {
    const startDate = moment(fromData * 1000).format('hh:mm a');
    const endDate = moment(toDate * 1000).format('hh:mm a');
    const duration = getGameFromToDateDiff(fromData, toDate);
    return `${startDate} - ${endDate} (${duration})`;
  };

  const getOpponentEntity = (reservationObject) => {
    if (reservationObject?.referee?.user_id === entity.uid) {
      if (
        reservationObject?.initiated_by ===
        reservationObject?.game?.home_team?.user_id
      ) {
        return reservationObject?.game?.away_team;
      }
      return reservationObject?.game?.home_team;
    }
    return reservationObject?.referee;
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
      {},
      authContext,
    )
      .then((response) => {
        setloading(false);
        console.log('ACCEPT RESPONSE::', JSON.stringify(response.payload));
        const Obj = {
          ...getOpponentEntity(bodyParams),
          game_id: bodyParams?.game_id,
          sport: bodyParams?.sport,
        };
        console.log('OBJ RESPONSE::', Obj);
        if (status === 'accept') {
          navigation.push('ReservationAcceptDeclineScreen', {
            teamObj: Obj,
            status: 'accept',
          });
        } else if (status === 'decline') {
          navigation.push('ReservationAcceptDeclineScreen', {
            teamObj: getOpponentEntity(bodyParams),
            status: 'decline',
          });
        } else if (status === 'cancel') {
          navigation.push('ReservationAcceptDeclineScreen', {
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

  const isThirdParty = (data) => {
    if (authContext.entity.uid === data?.referee?.user_id) {
      return false;
    }
    if (authContext.entity.uid === getRequester(data)?.user_id) {
      return false;
    }
    if (authContext.entity.uid === getRequester(data)?.group_id) {
      return false;
    }
    return true;
  };
  return (
    <TCKeyboardView scrollReference={scroll}>
      <ActivityLoader visible={loading} />
      <TCTabView
        totalTabs={2}
        firstTabTitle={'ALTERATION REQUEST'}
        secondTabTitle={'CURRENT RESERVATION'}
        indexCounter={maintabNumber}
        eventPrivacyContianer={{width: 100}}
        onFirstTabPress={() => setMaintabNumber(0)}
        onSecondTabPress={() => setMaintabNumber(1)}
        activeHeight={36}
        inactiveHeight={40}
      />
      {homeTeam && awayTeam && bodyParams && maintabNumber === 0 && (
        <View style={{marginBottom: 15}}>
          {!isPendingRequestPayment && (
            <TouchableOpacity onPress={() => console.log('OK')}>
              <LinearGradient
                colors={[colors.yellowColor, colors.themeColor]}
                style={styles.containerStyle}>
                <Text style={styles.buttonText}>
                  Please edit the reservation details below before you send the
                  alteration request.
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
              alignItems: 'flex-end',
              marginLeft: 15,
              marginRight: 15,
            }}>
            <ReservationNumber reservationNumber={bodyParams?.reservation_id} />
          </View>

          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
              margin: 15,
              marginBottom: 0,
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

          <RefereeReservationTitle
            reservationObject={bodyParams}
            showDesc={true}
            containerStyle={{margin: 15}}
          />

          {/* status pending request payment */}
          {/* {bodyParams?.referee?.user_id !== entity.uid
            && bodyParams.status
              === RefereeReservationStatus.pendingrequestpayment && (
                <View>
                  <Text style={styles.challengeMessage}>AWAITING PAYMENT</Text>
                  <Text style={styles.challengeText}>
                    {`${getPendingRequestPaymentMessage()} your payment hasn't gone through yet.`}
                  </Text>
                  <Text style={styles.awatingNotesText}>
                    {`The accepted alteration won't be applied to the current reservation unless the payment goes through within ${getDayTimeDifferent(
                    bodyParams.expiry_datetime * 1000,
                    new Date().getTime(),
                  )}
                  \nMeanwhile, ${getEntityName(
                    bodyParams,
                  )} can cancel acceptance of the alteration request before the payment is completed.`}
                  </Text>
                </View>
            )}
          {bodyParams?.referee?.user_id === entity.uid
            && bodyParams.status
              === RefereeReservationStatus.pendingrequestpayment && (
                <View>
                  <Text style={styles.challengeMessage}>AWAITING PAYMENT</Text>
                  <Text style={styles.challengeText}>
                    {`${getPendingRequestPaymentMessage()} the payment hasn't gone through yet.`}
                  </Text>
                  <Text style={styles.awatingNotesText}>
                    {`The accepted alteration won't be applied to the current reservation unless the payment goes through within ${getDayTimeDifferent(
                    bodyParams.expiry_datetime * 1000,
                    new Date().getTime(),
                  )}
                  \nMeanwhile, you can cancel acceptance of the alteration request before the payment will go through.`}
                  </Text>
                </View>
            )} */}
          {/* status pending request payment */}

          {bodyParams?.referee?.user_id !== entity.uid &&
            bodyParams.status ===
              RefereeReservationStatus.pendingrequestpayment && (
              <TCGradientButton
                title={strings.tryToPayText}
                onPress={() => {
                  navigation.navigate('PayAgainRefereeScreen', {
                    body: {...bodyParams, ...paymentCard},
                    comeFrom: RefereeReservationStatus.pendingrequestpayment,
                  });
                }}
                marginBottom={15}
              />
            )}
          {bodyParams?.referee?.user_id === entity.uid &&
            bodyParams.status ===
              RefereeReservationStatus.pendingrequestpayment && (
              <TCGradientButton
                title={strings.restorePreviousText}
                onPress={() => {
                  let callerId = '';
                  if (bodyParams?.referee?.user_id !== entity.uid) {
                    callerId = entity.uid;
                  }
                  acceptDeclineReservationOperation(
                    bodyParams.reservation_id,
                    callerId,
                    bodyParams.version,
                    'decline',
                    true,
                  );
                }}
                marginBottom={15}
              />
            )}

          <TCThickDivider />

          {bodyParams && (
            <View>
              {/* Choose Match */}
              <View style={styles.contentContainer}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                  <Title text={strings.match.toUpperCase()} />

                  {!isPendingRequestPayment && (
                    <TouchableOpacity
                      style={styles.editTouchArea}
                      hitSlop={getHitSlop(15)}
                      onPress={() => navigation.navigate('RefereeSelectMatch')}>
                      <Image
                        source={images.editSection}
                        style={styles.editButton}
                      />
                    </TouchableOpacity>
                  )}
                </View>
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
                            Vancouver
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
            </View>
          )}
          <TCLabel
            title={strings.matchrules.toUpperCase()}
            style={{
              ...styles.titleText,
              marginTop: 25,
            }}
          />
          <Text style={styles.rulesTitle}>General Rules</Text>
          <Text style={styles.rulesDetail}>
            {bodyParams?.game?.general_rules}
          </Text>
          <View style={{marginBottom: 10}} />
          <Text style={styles.rulesTitle}>Special Rules</Text>
          <Text style={[styles.rulesDetail, {marginBottom: 10}]}>
            {bodyParams?.game?.special_rules}
          </Text>
          <TCThickDivider marginTop={15} />

          {/* Chief or assistant */}
          <View style={styles.contentContainer}>
            <View style={styles.editableView}>
              <TCLabel
                title={strings.chieforassistant.toUpperCase()}
                isNew={oldVersion?.chief_referee !== bodyParams?.chief_referee}
                style={{
                  marginTop: 10,
                  marginLeft: 0,
                  padding: 0,
                }}
              />
            </View>
            <View
              style={{
                margin: 0,
                marginTop: 15,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 10,
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

          {/* <CurruentVersionView
            onPress={() => {
              navigation.navigate('CurruentRefereeReservationScreen', {
                reservationObj: oldVersion,
              });
            }}
          /> */}
          <TCThickDivider />
          <View>
            <TCChallengeTitle
              title={strings.refundpolicy.toUpperCase()}
              value={bodyParams?.refund_policy}
              tooltipText={
                '-Cancellation 24 hours in advance- Free cancellation until 24 hours before the game starting time.  -Cancellation less than 24 hours in advance-If the challenge sender cancels  less than 24 hours before the game starting time the match fee and service fee are not refunded.'
              }
              tooltipHeight={heightPercentageToDP('18%')}
              tooltipWidth={widthPercentageToDP('50%')}
              isEdit={false}
              titleStyle={{
                ...styles.titleText,
                marginTop: 10,
                marginBottom: 10,
              }}
              valueStyle={{
                ...styles.titleText,
                marginTop: 10,
                marginBottom: 10,
              }}
            />
            <TCThickDivider />
          </View>
          <View style={styles.editableView}>
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: 25,
              }}>
              <TCLabel
                title={
                  checkSenderForPayment(bodyParams) === 'sender'
                    ? strings.payment.toUpperCase()
                    : strings.earning.toUpperCase()
                }
                isNew={editPayment}
                marginTop={0}
                style={{marginTop: 0}}
              />
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('RefereeSelectMatch');
                }}></TouchableOpacity>
            </View>
            {!isPendingRequestPayment && (
              <TouchableOpacity
                style={styles.editTouchArea}
                hitSlop={getHitSlop(15)}
                onPress={() =>
                  navigation.navigate('EditRefereeFeeScreen', {
                    comeFrom: 'AlterRefereeScreen',
                    editableAlter: true,
                    body: bodyParams,
                  })
                }>
                <Image source={images.editSection} style={styles.editButton} />
              </TouchableOpacity>
            )}
          </View>
          <View
            style={{
              marginTop: 20,
            }}>
            <MatchFeesCard
              challengeObj={paymentCard}
              senderOrReceiver={checkSenderForPayment(bodyParams)}
            />
          </View>
          <TCThickDivider marginTop={25} />
          {/* Payment Method */}
          {((oldVersion?.total_game_fee === 0 &&
            bodyParams?.total_game_fee > 0) ||
            (bodyParams?.total_game_fee > 0 &&
              checkSenderForPayment(bodyParams) === 'sender')) && (
            <View style={styles.contentContainer}>
              <View>
                <Title text={strings.paymentMethod.toUpperCase()} />
                <View
                  style={{
                    marginTop: 10,
                    marginBottom: 15,
                  }}>
                  <TCTouchableLabel
                    title={
                      defaultCard
                        ? Utility.capitalize(defaultCard.card.brand)
                        : strings.addOptionMessage
                    }
                    subTitle={defaultCard?.card.last4}
                    showNextArrow={true}
                    onPress={() => {
                      navigation.navigate('PaymentMethodsScreen', {
                        comeFrom: 'AlterRefereeScreen',
                      });
                    }}
                    style={{marginHorizontal: 0}}
                  />
                </View>
              </View>
            </View>
          )}

          {editPayment && (
            <View style={{marginTop: 15}}>
              <Text style={styles.differenceText}>
                Difference{' '}
                <Text style={styles.differenceSmallText}>
                  (New payment - Current payment)
                </Text>
              </Text>
              <View style={styles.differeceView}>
                <Text style={styles.differenceTextTitle}>Difference</Text>
                <Text style={styles.diffenceAmount}>{`$${parseFloat(
                  bodyParams?.total_game_fee - oldVersion?.total_game_fee,
                ).toFixed(2)} ${
                  bodyParams.currency_type.toUpperCase() ||
                  strings.defaultCurrency
                }`}</Text>
                {/* <Text style={styles.diffenceAmount}>{checkSenderOrReceiver(bodyParams) === 'sender' ? `$${bodyParams.total_charges - oldVersion.total_charges} CAD` : `$${bodyParams.total_payout - oldVersion.total_payout} CAD`}</Text> */}
              </View>
            </View>
          )}
          {checkSenderOrReceiver(bodyParams) === 'sender' &&
            bodyParams.status === RefereeReservationStatus.changeRequest && (
              <View style={{marginTop: 15}}>
                <TCBorderButton
                  title={strings.cancelAlterRequest}
                  textColor={colors.grayColor}
                  borderColor={colors.grayColor}
                  height={40}
                  shadow={true}
                  onPress={() => {
                    let callerId = '';
                    if (bodyParams?.referee?.user_id !== entity.uid) {
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
            !isThirdParty(bodyParams) &&
            bodyParams.status === RefereeReservationStatus.changeRequest &&
            bodyParams.expiry_datetime < new Date().getTime() && (
              <View style={{marginTop: 15}}>
                <TCGradientButton
                  title={strings.accept}
                  onPress={() => {
                    let callerId = '';
                    if (bodyParams?.referee?.user_id !== entity.uid) {
                      callerId = entity.uid;
                    }
                    let paymentObj = {};
                    paymentObj = {
                      source: defaultCard?.id,
                      payment_method_type: 'card',
                      total_game_fee: paymentCard?.total_game_fee,
                      total_service_fee1: paymentCard?.total_service_fee1,
                      total_service_fee2: paymentCard?.total_service_fee2,
                      international_card_fee:
                        paymentCard?.international_card_fee,
                      total_stripe_fee: paymentCard?.total_stripe_fee,
                      total_payout: paymentCard?.total_payout,
                      total_amount: paymentCard?.total_amount,
                    };

                    acceptDeclineAlterReservationOperation(
                      bodyParams.reservation_id,
                      callerId,
                      bodyParams.version,
                      'accept',
                      paymentObj,
                    );
                  }}
                  marginBottom={15}
                />
                <TCBorderButton
                  title={strings.decline}
                  textColor={colors.grayColor}
                  borderColor={colors.grayColor}
                  height={40}
                  shadow={true}
                  onPress={() => {
                    let callerId = '';
                    if (bodyParams?.referee?.user_id !== entity.uid) {
                      callerId = entity.uid;
                    }
                    acceptDeclineReservationOperation(
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
            bodyParams.status === RefereeReservationStatus.restored) &&
            !isPendingRequestPayment && (
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
                    if (editInfo || editPayment) {
                      updateReservationDetail();
                    } else {
                      Alert.alert(
                        'Please modify atleast one field for alter request.',
                      );
                    }
                  }}
                />
                <TCBorderButton
                  title={strings.cancel}
                  textColor={colors.themeColor}
                  borderColor={colors.themeColor}
                  height={40}
                  shadow={true}
                  marginBottom={15}
                  fontSize={16}
                  onPress={() => {
                    navigation.popToTop();
                  }}
                />
              </View>
            )}
          {(bodyParams.status === RefereeReservationStatus.changeRequest ||
            bodyParams.status ===
              RefereeReservationStatus.pendingrequestpayment) &&
            !isThirdParty(bodyParams) && (
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
                      bodyParams?.game?.status === GameStatus.accepted ||
                      bodyParams?.game?.status === GameStatus.reset
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
          {bodyParams.status === RefereeReservationStatus.declined && (
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
                      reservationObj: oldVersion,
                    });
                  } else {
                    Alert.alert(
                      'Reservation cannot be change after game time passed or offer expired.',
                    );
                  }
                }}
              />
              {!isThirdParty(bodyParams) && (
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
                      bodyParams?.game?.status === GameStatus.accepted ||
                      bodyParams?.game?.status === GameStatus.reset
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
                        'Reservation cannot be cancel after game time passed or offer expired.',
                      );
                    } else {
                      Alert.alert(
                        'Reservation can not be change after game has been started.',
                      );
                    }
                  }}
                />
              )}
            </View>
          )}
        </View>
      )}
      <SafeAreaView>
        {maintabNumber === 1 && (
          <CurruentRefereeReservationView
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
  containerStyle: {
    height: 61,
    justifyContent: 'center',
  },
  buttonText: {
    justifyContent: 'center',
    alignSelf: 'center',
    color: colors.whiteColor,
    fontSize: 16,
    fontFamily: fonts.RRegular,
    marginLeft: 15,
    marginRight: 15,
  },
  editButton: {
    height: 16,
    width: 16,
    resizeMode: 'center',
    alignSelf: 'center',
  },
  editTouchArea: {
    alignSelf: 'center',
  },
  editableView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginRight: 15,
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
    paddingTop: 25,
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
