import React, {
  useEffect, useState, useContext, useLayoutEffect,
} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  Alert,
  TouchableOpacity,
} from 'react-native';
import moment from 'moment';
import { useIsFocused } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import _ from 'lodash';

import * as Utility from '../../../utils';
import {
  acceptDeclineAlterReservation,
  acceptDeclineReservation,
  getRefereeFeesEstimation,
  updateReservation,
  cancelAlterReservation,
} from '../../../api/Challenge';
import { paymentMethods } from '../../../api/Users';
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
import TCTouchableLabel from '../../../components/TCTouchableLabel';
import TCProfileView from '../../../components/TCProfileView';
import TCGameCard from '../../../components/TCGameCard';
import { getGameFromToDateDiff, getGameHomeScreen } from '../../../utils/gameUtils';
import CurruentVersionView from '../../../components/challenge/CurruentVersionView';
import RefereeReservationStatus from '../../../Constants/RefereeReservationStatus';

let entity = {};
const scroll = React.createRef();
export default function EditRefereeReservation({ navigation, route }) {
  const authContext = useContext(AuthContext);
  const [chiefOrAssistant, setChiefOrAssistant] = useState('');
  const isFocused = useIsFocused();
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
  const [refereeUpdate, setRefereeUpdate] = useState(false);

  const [defaultCard, setDefaultCard] = useState()
  const [isDeclined, setIsDeclined] = useState(false)
  useEffect(() => {
    const is_chief = bodyParams?.chief_referee ? 'chief' : 'assistant'
    setChiefOrAssistant(is_chief);
  }, [bodyParams])

  const getNavigationTitle = () => {
    if (bodyParams?.status === RefereeReservationStatus.changeRequest) {
      return 'Referee Reservation'
    }

    return 'Change Referee Reservation'
  }
  useLayoutEffect(() => {
    navigation.setOptions({
      title: getNavigationTitle(),
    });
  }, [navigation, bodyParams, refereeUpdate]);
  useEffect(() => {
    entity = authContext.entity;

    const { reservationObj } = route.params ?? {};
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
            (reservationObj[0]?.game?.away_team?.group_id
                ?? reservationObj[0]?.game?.away_team?.user_id) === entity.uid
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
          total_game_charges: reservationObj[0]?.total_game_charges,
          service_fee1_charges: reservationObj[0]?.service_fee1_charges,
          service_fee2_charges: reservationObj[0]?.service_fee2_charges,
          total_charges: reservationObj[0]?.total_charges,
          total_stripe_fee: reservationObj[0]?.total_stripe_fee,
          total_payout: reservationObj[0]?.total_payout,
          hourly_game_fee: reservationObj[0]?.hourly_game_fee,
          manual_fee: reservationObj[0]?.manual_fee,
        })
      }
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
        (reservationObj?.game?.away_team?.group_id
            ?? reservationObj?.game?.away_team?.user_id) === entity.uid
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
          total_game_charges: reservationObj?.total_game_charges,
          service_fee1_charges: reservationObj?.service_fee1_charges,
          service_fee2_charges: reservationObj?.service_fee2_charges,
          total_charges: reservationObj?.total_charges,
          total_stripe_fee: reservationObj?.total_stripe_fee,
          total_payout: reservationObj?.total_payout,
          hourly_game_fee: reservationObj?.hourly_game_fee,
          manual_fee: reservationObj?.manual_fee,
        })
      }
    }
  }, [isFocused]);

  useEffect(() => {
    if (bodyParams?.referee?.user_id !== entity.uid) {
      getPaymentMethods()
    }
  }, [defaultCard])
  useLayoutEffect(() => {
    sectionEdited();
  }, [bodyParams, isOld, editVenue, editRules, editReferee, editScorekeeper, editInfo, defaultCard]);

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
        bodyParams.responsible_to_secure_venue
          !== oldVersion.responsible_to_secure_venue
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
        bodyParams?.home_team?.group_id !== oldVersion?.home_team?.group_id
          || bodyParams?.home_team?.user_id !== oldVersion?.home_team?.user_id
          || bodyParams?.away_team?.group_id !== oldVersion?.away_team?.group_id
          || bodyParams?.away_team?.user_id !== oldVersion?.away_team?.user_id
          || bodyParams?.start_datetime !== oldVersion?.start_datetime
          || bodyParams?.end_datetime !== oldVersion?.end_datetime
          || bodyParams?.venue?.address !== oldVersion?.venue?.address
      ) {
        setEditInfo(true);
      } else {
        setEditInfo(false);
      }
      if (bodyParams.total_game_charges !== oldVersion.total_game_charges || bodyParams.manual_fee !== oldVersion.manual_fee) {
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

    body.reservation_id = bodyParams.reservation_id;
    body.start_datetime = bodyParams?.start_datetime;
    body.end_datetime = bodyParams?.end_datetime;
    body.currency_type = bodyParams?.currency_type || 'CAD';
    body.payment_method_type = 'card';
    body.sport = bodyParams?.sport;
    body.manual_fee = bodyParams?.manual_fee;
    if (bodyParams?.manual_fee) {
      body.total_game_charges = bodyParams.total_game_charges;
    }

    setloading(true);
    getRefereeFeesEstimation(
      bodyParams?.referee?.user_id,
      body,
      authContext,
    )
      .then((response) => {
        setloading(false);
        console.log('fee data :', response.payload);
        setPaymentCard({
          ...paymentCard,
          total_game_charges: response.payload.total_game_fee,
          total_charges: response.payload.total_amount,
          total_payout: response.payload.total_payout,
          service_fee1_charges: response.payload.total_service_fee1,
          service_fee2_charges: response.payload.total_service_fee2,
          total_stripe_fee: response.payload.total_stripe_fee,
          hourly_game_fee: bodyParams?.hourly_game_fee,
          manual_fee: bodyParams?.manual_fee,
        })
      })
      .catch((e) => {
        setloading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 0.7);
      });
  };

  const cancelAlterReservationOperation = (
    reservationId,
    callerID,
    versionNo,
  ) => {
    setloading(true);
    cancelAlterReservation(
      reservationId,
      callerID,
      versionNo,
      authContext,
    )
      .then((response) => {
        setloading(false);
        console.log('ACCEPT RESPONSE::', JSON.stringify(response.payload));
        navigation.navigate('ReservationAcceptDeclineScreen', {
          teamObj: awayTeam,
          status: 'cancel',
        });
      })
      .catch((e) => {
        setloading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 0.7);
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
          navigation.navigate('RefereeRequestSent', {
            operationType: strings.reservationRequestAccepted,
            imageAnimation: true,
          });
        } else if (status === 'decline') {
          if (isRestored) {
            navigation.navigate('RefereeRequestSent', {
              operationType: strings.reservationRequestRestored,
              imageAnimation: false,
            });
          } else {
            navigation.navigate('RefereeRequestSent', {
              operationType: strings.reservationRequestDeclined,
              imageAnimation: false,
            });
          }
        } else if (status === 'cancel') {
          navigation.navigate('RefereeRequestSent', {
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

  const acceptDeclineAlterReservationOperation = (
    reservationId,
    callerID,
    versionNo,
    status,
    paymentID,
  ) => {
    setloading(true);

    acceptDeclineAlterReservation(
      reservationId,
      callerID,
      versionNo,
      status,
      paymentID && { source: paymentID },
      authContext,
    )
      .then((response) => {
        setloading(false);
        console.log('ACCEPT RESPONSE::', JSON.stringify(response.payload));
        if (status === 'accept') {
          navigation.navigate('RefereeRequestSent', {
            operationType: strings.reservationAlterRequestAccepted,
            imageAnimation: false,
          });
        } else if (status === 'decline') {
          navigation.navigate('RefereeRequestSent', {
            operationType: strings.reservationAlterRequestDeclined,
            imageAnimation: false,
          });
        } else if (status === 'cancel') {
          navigation.navigate('RefereeRequestSent', {
            operationType: strings.reservationAlterRequestCancelled,
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

  const getRequester = (param) => {
    if (entity.uid === param?.referee?.user_id) {
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

  const getPaymentMethods = () => {
    setloading(true)
    paymentMethods(authContext)
      .then((response) => {
        // setDefaultCard(response.payload[0].card)
        for (const tempCard of response.payload) {
          if (tempCard?.id === bodyParams?.source) {
            console.log('temp::', tempCard?.card)
            setDefaultCard(tempCard?.card)
            break
          }
        }
        setloading(false)
      })
      .catch((e) => {
        console.log('error in payment method', e)
        setloading(false)
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 0.3)
      })
  }
  const checkSenderForPayment = (reservationObj) => {
    if (reservationObj?.referee?.user_id === entity.uid) {
      return 'receiver'
    }

    return 'sender'
  }

  const checkSenderOrReceiver = (reservationObj) => {
    const teampObj = { ...reservationObj }
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
        if (teampObj?.automatic_request && teampObj?.status === RefereeReservationStatus.changeRequest && entity.obj.entity_type === 'team') {
          teampObj.requested_by = teampObj.initiated_by;
        } else {
          teampObj.requested_by = teampObj.updated_by.group_id;
        }
      } else if (teampObj?.automatic_request && teampObj?.status === RefereeReservationStatus.changeRequest && teampObj?.referee?.user_id !== entity.uid) {
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
      return 'sender'
    }
    return 'receiver'
  };

  const checkRefereeOrTeam = (reservationObj) => {
    const teampObj = { ...reservationObj }
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
        if (teampObj?.automatic_request && teampObj?.status === RefereeReservationStatus.changeRequest && entity.obj.entity_type === 'team') {
          teampObj.requested_by = teampObj.initiated_by;
        } else {
          teampObj.requested_by = teampObj.updated_by.group_id;
        }
      } else if (teampObj?.automatic_request && teampObj?.status === RefereeReservationStatus.changeRequest && teampObj?.referee?.user_id !== entity.uid) {
        teampObj.requested_by = teampObj.initiated_by;
      } else {
        teampObj.requested_by = teampObj.updated_by.uid;
      }
    } else if (teampObj?.created_by?.group_id) {
      teampObj.requested_by = teampObj.created_by.group_id;
    } else {
      teampObj.requested_by = teampObj.created_by.uid;
    }

    if (entity.uid === teampObj?.referee?.user_id) {
      if (teampObj?.requested_by === entity.uid) {
        return 'referee'
      }
      return 'team'
    }
    if (teampObj?.requested_by === entity.uid) {
      return 'team'
    }
    return 'referee'
  };
  const updateReservationDetail = () => {
    setloading(true);
    const body = {}
    body.referee_id = bodyParams?.referee?.user_id;
    body.game_id = bodyParams?.game?.game_id;
    console.log('Payment card data::', paymentCard);
    body.chief_referee = (chiefOrAssistant === 'chief');
    body.service_fee1_charges = paymentCard?.service_fee1_charges;
    body.total_game_charges = paymentCard?.total_game_charges;
    body.service_fee2_charges = paymentCard?.service_fee2_charges;
    body.total_charges = paymentCard?.total_charges;
    body.total_payout = paymentCard?.total_payout;
    body.manual_fee = bodyParams?.manual_fee;
    body.payment_method_type = 'card';
    body.currency_type = bodyParams?.currency_type

    if (checkSenderForPayment(bodyParams) === 'sender' && paymentCard.total_game_charges > 0) {
      let paymentSource;
      if (defaultCard) {
        paymentSource = defaultCard?.id
      } else if (route.params.paymentMethod) {
        paymentSource = route?.params?.paymentMethod?.id
      } else {
        Alert.alert(strings.selectCardText)
        return
      }
      body.source = paymentSource;
    }

    const reservationId = bodyParams?.reservation_id;
    console.log('FINAL BODY PARAMS::', body);
    let callerId = '';
    if (bodyParams?.referee?.user_id !== entity.uid) {
      callerId = entity.uid
    }
    updateReservation(reservationId, callerId, body, authContext)
      .then(() => {
        setloading(false);
        navigation.navigate('AlterRequestSent');
      })
      .catch((e) => {
        setloading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 0.7);
      });
  };

  const getPendingRequestPaymentMessage = () => {
    if (bodyParams?.change_requested_by === entity.uid) {
      return `${getEntityName(
        bodyParams,
      )} has accepted your match reservation alteration request, but `;
    }

    return `Your team has accepted a game reservation alteration request from ${getEntityName(
      bodyParams,
    )}, but `;
  };

  const Title = ({ text, required }) => (
    <Text style={styles.titleText}>
      {text}
      {required && <Text style={{ color: colors.redDelColor }}> * </Text>}
    </Text>
  )

  const Seperator = ({ height = 7 }) => <View style={{
    width: '100%', height, marginVertical: 2, backgroundColor: colors.grayBackgroundColor,
  }}/>
  const getDateDuration = (fromData, toDate) => {
    const startDate = moment(fromData * 1000).format('hh:mm a');
    const endDate = moment(toDate * 1000).format('hh:mm a');
    const duration = getGameFromToDateDiff(fromData, toDate);
    return `${startDate} - ${endDate} (${duration})`
  }
  const getEntityName = (reservationObj) => {
    if (reservationObj?.initiated_by === entity.uid) {
      return `${reservationObj?.referee?.first_name} ${reservationObj?.referee?.last_name}`
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
  const acceptDeclineRefereeReservation = (
    reservationID,
    versionNo,
    status,
  ) => {
    setloading(true);
    acceptDeclineReservation(
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
            teamObj: { ...awayTeam, game_id: bodyParams?.game_id },
            status: 'accept',
          });
        } else if (status === 'decline') {
          navigation.navigate('ChallengeAcceptedDeclinedScreen', {
            teamObj: awayTeam,
            status: 'decline',
          });
        } else if (status === 'cancel') {
          navigation.navigate('ChallengeAcceptedDeclinedScreen', {
            teamObj: awayTeam,
            status: 'cancel',
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
  console.log('Default card:', defaultCard);
  return (
    <TCKeyboardView scrollReference ={scroll}>
      <ActivityLoader visible={loading} />
      {homeTeam && awayTeam && bodyParams && (
        <View style={{ marginBottom: 15 }}>
          {(!isPendingRequestPayment || (bodyParams.status === RefereeReservationStatus.declined && isDeclined)) && (
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
              }}>
            <View style={styles.challengerView}>
              <View style={styles.teamView}>
                <Image source={images.requestOut} style={styles.reqOutImage} />
                <Text style={styles.challengerText}>Resv. Requester</Text>
              </View>

              <View style={styles.teamView}>
                <Image
                     source={getRequester(bodyParams).thumbnail ? { uri: getRequester(bodyParams).thumbnail } : images.teamPlaceholder}
                    style={styles.teamImage}
                  />
                <Text style={styles.teamNameText}>
                  {getRequester(bodyParams).group_id ? `${getRequester(bodyParams).group_name}` : `${getRequester(bodyParams).first_name} ${getRequester.last_name}`}
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
                    source={bodyParams?.referee?.thumbnail ? { uri: bodyParams?.referee?.thumbnail } : images.teamPlaceholder}
                    style={styles.teamImage}
                  />
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
                    {checkRefereeOrTeam(bodyParams) === 'referee' ? `You have declined a referee request from ${getEntityName(bodyParams)}.` : `Your team have declined referee reservation request from ${getEntityName(bodyParams)}.` }
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
                    {checkRefereeOrTeam(bodyParams) === 'referee' ? `${getEntityName(bodyParams)} has declined a referee request from your team.` : `${getEntityName(bodyParams)} have declined a referee reservation request sent by you.` }
                  </Text>
                </View>
          )}
          {/* Status declined */}
          {/* status change requested */}
          {checkSenderOrReceiver(bodyParams) === 'sender'
              && bodyParams.status === RefereeReservationStatus.changeRequest && (
                <View>
                  <Text style={[styles.challengeMessage, { color: colors.requestSentColor }]}>
                    ALTERATION REQUEST SENT
                  </Text>
                  <Text style={styles.challengeText}>
                    {checkRefereeOrTeam(bodyParams) === 'referee' ? `You sent a referee reservation alteration request to ${getEntityName(bodyParams)}.` : `Your team sent a referee reservation alteration request to ${getEntityName(bodyParams)}`}
                  </Text>
                </View>
          )}
          {checkSenderOrReceiver(bodyParams) === 'receiver'
              && bodyParams.status === RefereeReservationStatus.changeRequest && (
                <View>
                  <Text style={styles.challengeMessage}>
                    ALTERATION REQUEST PENDING
                  </Text>
                  <Text style={styles.challengeText}>
                    {bodyParams?.referee?.user_id === entity.uid ? `You received a referee reservation alteration request from ${getEntityName(bodyParams)}.` : `Your team received a referee reservation alteration request from ${getEntityName(bodyParams)}.`}
                    {' '}Please, respond within <Text style={{ color: colors.themeColor }}>
                      {getDayTimeDifferent(
                        bodyParams?.expiry_datetime * 1000,
                        new Date().getTime(),
                      )}
                    </Text>
                  </Text>
                </View>
          )}
          {/* status change requested */}

          {/* status pending request payment */}
          {checkSenderOrReceiver(bodyParams) === 'sender'
              && bodyParams.status === RefereeReservationStatus.pendingrequestpayment && (
                <View>
                  <Text style={styles.challengeMessage}>AWAITING PAYMENT</Text>
                  <Text style={styles.challengeText}>{`${getPendingRequestPaymentMessage()} your payment hasn't gone through yet.`}

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
          {checkSenderOrReceiver(bodyParams) === 'receiver'
              && bodyParams.status === RefereeReservationStatus.pendingrequestpayment && (
                <View>
                  <Text style={styles.challengeMessage}>AWAITING PAYMENT</Text>
                  <Text style={styles.challengeText}>{`${getPendingRequestPaymentMessage()} the payment hasn't gone through yet.`}
                  </Text>
                  <Text style={styles.awatingNotesText}>
                    {`The accepted alteration won't be applied to the current reservation unless the payment goes through within ${getDayTimeDifferent(
                      bodyParams.expiry_datetime * 1000,
                      new Date().getTime(),
                    )}
                    \nMeanwhile, you can cancel acceptance of the alteration request before the payment will go through.`}
                  </Text>
                </View>
          )}
          {/* status pending request payment */}

          {checkSenderOrReceiver(bodyParams) === 'sender'
              && bodyParams.status === RefereeReservationStatus.pendingrequestpayment && (
                <TCGradientButton
                  title={'TRY TO PAY AGAIN'}
                  onPress={() => {
                    navigation.navigate('PayAgainRefereeScreen', {
                      body: { ...bodyParams, ...paymentCard },
                      comeFrom: RefereeReservationStatus.pendingrequestpayment,
                    })
                  }}
                  marginBottom={15}
                />
          )}
          {checkSenderOrReceiver(bodyParams) === 'receiver'
              && bodyParams.status === RefereeReservationStatus.pendingrequestpayment && (
                <TCGradientButton
                  title={'RESTORE TO PREVIOUS VERSION'}
                  onPress={() => {
                    acceptDeclineReservationOperation(
                      entity.uid,
                      bodyParams.challenge_id,
                      bodyParams.version,
                      'decline',
                      true,
                    );
                  }}
                  marginBottom={15}
                />
          )}

          <TCThickDivider />
          {/* Name and country */}
          <View style={styles.contentContainer}>
            <Title text={'Referee'} />
            <View style={{ marginVertical: 10 }}>
              <TCProfileView
                    type={'medium'}
                    name={bodyParams?.referee?.full_name}
                    location={`${bodyParams?.referee?.city} , ${bodyParams?.referee?.country}`}
                    image={bodyParams?.referee?.full_image ? { uri: bodyParams?.referee?.full_image } : images.profilePlaceHolder}
                />
            </View>
          </View>
          <TCThickDivider />
          {bodyParams && (
            <View>
              {/* Choose Match */}
              <View style={styles.contentContainer}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Title text={'Match'} />

                  {bodyParams?.referee?.user_id !== entity.uid && (
                    <TouchableOpacity
                  style={styles.editTouchArea}
                  hitSlop={{
                    top: 15,
                    bottom: 15,
                    left: 15,
                    right: 15,
                  }}
                  onPress={() => {
                    navigation.navigate('RefereeSelectMatch', {
                      userData: bodyParams?.referee,
                      sport: bodyParams?.sport,
                      comeFrom: 'EditRefereeReservation',
                    });
                  }}>
                      <Image source={images.editSection} style={styles.editButton} />
                    </TouchableOpacity>
                  )}

                </View>
              </View>
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
                              value={bodyParams?.timestamp && moment(bodyParams?.game?.start_datetime * 1000).format('MMM DD, YYYY')}
                              titleStyle={{ alignSelf: 'flex-start', fontFamily: fonts.RRegular }}
                          />
                    <Seperator height={2}/>
                    <TCInfoField
                              title={'Time'}
                              value={(bodyParams?.game?.start_datetime && bodyParams?.game?.end_datetime)
                                ? getDateDuration(bodyParams?.game?.start_datetime, bodyParams?.game?.end_datetime)
                                : ''
                              }
                              titleStyle={{ alignSelf: 'flex-start', fontFamily: fonts.RRegular }}
                          />
                    <Seperator height={2}/>
                  </View>

                  {/* Venue */}
                  <View style={styles.contentContainer}>
                    <Title text={'Venue'} />
                    <TCInfoField
                              title={'Venue'}
                              value={bodyParams?.game?.venue?.title}
                              titleStyle={{ alignSelf: 'flex-start', fontFamily: fonts.RRegular }}
                          />
                    <TCInfoField
                              title={'Address'}
                              value={bodyParams?.game?.venue?.address}
                              titleStyle={{ alignSelf: 'flex-start', fontFamily: fonts.RRegular }}
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
          <CurruentVersionView
                      onPress={() => {
                        navigation.navigate('CurruentRefereeReservationScreen', {
                          reservationObj: oldVersion,
                        });
                      }}
                      />
          <TCThickDivider marginTop={15}/>
          {/* {bodyParams && (
              <View>
                <TCLabel title={'Rules of the match'} />
                <Text style={styles.rulesText}>{bodyParams?.game?.special_rule}</Text>
              </View>
            )}
            <CurruentVersionView
                      onPress={() => {
                        navigation.navigate('CurruentRefereeReservationScreen', {
                          reservationObj: oldVersion,
                        });
                      }}
                      />
            <TCThickDivider marginTop={15} /> */}
          {/* Chief or assistant */}
          <View style={styles.contentContainer}>
            <Title text={'Chief or assistant'} />
            {['chief', 'assistant'].map((item, index) => (
              <View
                      key={index}
                      style={{
                        margin: 7,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}>
                <Text style={{
                  fontFamily: fonts.RRegular,
                  fontSize: 16,
                  color: colors.lightBlackColor,
                }}>{_.startCase(item)} Referee</Text>
                <TouchableOpacity style={{
                  borderColor: colors.magnifyIconColor, height: 22, width: 22, borderWidth: 2, borderRadius: 50, alignItems: 'center', justifyContent: 'center',
                }}
                    onPress={() => {
                      setRefereeUpdate(true)
                      setChiefOrAssistant(item)
                    }}>
                  {item === chiefOrAssistant && (
                    <LinearGradient
                              colors={[colors.orangeColor, colors.yellowColor]}
                              end={{ x: 0.0, y: 0.25 }}
                              start={{ x: 1, y: 0.5 }}
                              style={{ height: 13, width: 13, borderRadius: 50 }}>
                    </LinearGradient>
                  )}
                </TouchableOpacity>
              </View>
            ))}
          </View>

          <CurruentVersionView
                      onPress={() => {
                        navigation.navigate('CurruentRefereeReservationScreen', {
                          reservationObj: oldVersion,
                        });
                      }}
                      />
          <TCThickDivider marginTop={15}/>
          <View style={styles.editableView}>
            <View style={{
              flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <TCLabel
                    title={
                      checkSenderForPayment(bodyParams) === 'sender'
                        ? 'Payment'
                        : 'Earning'
                    }
                    isNew={editPayment}
                />
              <TouchableOpacity onPress={() => {
                navigation.navigate('RefereeSelectMatch');
              }}>

              </TouchableOpacity>
            </View>
            {(!isPendingRequestPayment || (bodyParams.status === RefereeReservationStatus.declined && isDeclined)) && (
              <TouchableOpacity
                  style={styles.editTouchArea}
                  hitSlop={{
                    top: 15,
                    bottom: 15,
                    left: 15,
                    right: 15,
                  }}
                  onPress={() => navigation.navigate('EditRefereeFeeScreen', {
                    editableAlter: true,
                    body: bodyParams,
                  })
                  }>
                <Image source={images.editSection} style={styles.editButton} />
              </TouchableOpacity>
            )}
          </View>

          <MatchFeesCard
              challengeObj={paymentCard}
              senderOrReceiver={
                checkSenderForPayment(bodyParams)
              }
            />

          { checkSenderForPayment(bodyParams) === 'sender' && paymentCard.total_game_charges > 0 && (
            <View style={{ marginTop: 10 }}>
              <TCTouchableLabel
              title={ (defaultCard && defaultCard?.brand) ?? route?.params?.paymentMethod ? Utility.capitalize(route?.params?.paymentMethod?.card?.brand) : strings.addOptionMessage}
              subTitle={(defaultCard && defaultCard?.last4) ?? route?.params?.paymentMethod?.card.last4 }
              showNextArrow={true}
              onPress={() => {
                navigation.navigate('PaymentMethodsScreen', {
                  comeFrom: 'EditRefereeReservation',
                })
              }}
            />
            </View>
          )}
          {editPayment && (
            <View style={{ marginTop: 15 }}>
              <Text style={styles.differenceText}>
                Difference{' '}
                <Text style={styles.differenceSmallText}>
                  (New payment - Current payment)
                </Text>
              </Text>
              <View style={styles.differeceView}>
                <Text style={styles.differenceTextTitle}>Difference</Text>
                <Text style={styles.diffenceAmount}>{`$${
                  parseFloat(bodyParams?.total_game_charges
                    - oldVersion?.total_game_charges).toFixed(2)
                } ${bodyParams.currency_type || 'CAD'}`}</Text>
                {/* <Text style={styles.diffenceAmount}>{checkSenderOrReceiver(bodyParams) === 'sender' ? `$${bodyParams.total_charges - oldVersion.total_charges} CAD` : `$${bodyParams.total_payout - oldVersion.total_payout} CAD`}</Text> */}
              </View>
            </View>
          )}
          {checkSenderOrReceiver(bodyParams) === 'sender'
              && bodyParams.status === RefereeReservationStatus.changeRequest
               && (
                 <View style={{ marginTop: 15 }}>
                   <TCBorderButton
                    title={strings.cancelAlterRequest}
                    textColor={colors.grayColor}
                    borderColor={colors.grayColor}
                    height={40}
                    shadow={true}
                    onPress={() => {
                      let callerId = '';
                      if (bodyParams?.referee?.user_id !== entity.uid) {
                        callerId = entity.uid
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

          {checkSenderOrReceiver(bodyParams) === 'receiver'
              && bodyParams.status === RefereeReservationStatus.changeRequest
              && bodyParams.expiry_datetime < new Date().getTime() && (
                <View style={{ marginTop: 15 }}>
                  <TCGradientButton
                    title={strings.accept}
                    onPress={() => {
                      let callerId = '';
                      if (bodyParams?.referee?.user_id !== entity.uid) {
                        callerId = entity.uid
                      }
                      acceptDeclineAlterReservationOperation(
                        bodyParams.reservation_id,
                        callerId,
                        bodyParams.version,
                        'accept',
                        route?.params?.paymentMethod && route?.params?.paymentMethod?.id,
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

          {(((bodyParams.status === RefereeReservationStatus.accepted || bodyParams.status === RefereeReservationStatus.restored) && !isPendingRequestPayment) || (bodyParams.status === RefereeReservationStatus.declined && isDeclined)) && (
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
                      if (
                        editInfo
                        || refereeUpdate
                        || editPayment
                      ) {
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
                      navigation.goBack();
                    }}
                  />
            </View>
          )}
          {(bodyParams.status === RefereeReservationStatus.changeRequest
              || bodyParams.status === RefereeReservationStatus.pendingrequestpayment) && (
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
                      (bodyParams?.game?.status === GameStatus.accepted
                        || bodyParams?.game?.status === GameStatus.reset)
                      && bodyParams.start_datetime > parseFloat(new Date().getTime() / 1000).toFixed(0)
                    ) {
                      let callerId = '';
                      if (bodyParams?.referee?.user_id !== entity.uid) {
                        callerId = entity.uid
                      }
                      acceptDeclineAlterReservationOperation(
                        bodyParams.reservation_id,
                        callerId,
                        bodyParams.version,
                        'cancel',
                      );
                    } else {
                      Alert.alert(
                        'Reservation cannot be cancel after game time passed or offer expired.',
                      );
                    }
                  }}
                />
                </View>
          )}
          {(bodyParams.status === RefereeReservationStatus.declined && !isDeclined) && (
            <View>
              <TCBorderButton
                  title={strings.alterReservation}
                  textColor={colors.grayColor}
                  borderColor={colors.grayColor}
                  height={40}
                  shadow={true}
                  marginTop={15}
                  onPress={() => {
                    setIsDeclined(true)
                    setbodyParams(oldVersion)
                    scroll.current.scrollTo(0, 0)
                    // if (
                    //   (bodyParams?.game?.status === GameStatus.accepted
                    //     || bodyParams?.game?.status === GameStatus.reset)
                    //   && bodyParams.start_datetime > parseFloat(new Date().getTime() / 1000).toFixed(0)
                    // ) {
                    //   navigation.navigate('AlterRefereeScreen', {
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
                    if (bodyParams?.game?.status === (GameStatus.accepted || GameStatus.reset)) {
                      acceptDeclineRefereeReservation(
                        bodyParams.reservation_id,
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
        </View>
      )}
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
    shadowOffset: { width: 0, height: 1 },
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
  awatingNotesText: {
    color: colors.userPostTimeColor,
    marginRight: 15,
    marginLeft: 15,
    marginBottom: 15,
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
