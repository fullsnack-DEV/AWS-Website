import React, {
  useEffect, useState, useContext, useLayoutEffect,
} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  FlatList,
  Alert,
  TouchableOpacity,
} from 'react-native';
import moment from 'moment';
import { useIsFocused, useFocusEffect } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import * as Utility from '../../../utils';
import {
  acceptDeclineAlterChallenge,
  acceptDeclineChallenge,
  getFeesEstimation,
  updateChallenge,
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
import TCThinDivider from '../../../components/TCThinDivider';
import TCInfoImageField from '../../../components/TCInfoImageField';
import TCInfoField from '../../../components/TCInfoField';
import EventMapView from '../../../components/Schedule/EventMapView';
import ReservationStatus from '../../../Constants/ReservationStatus';
import TCBorderButton from '../../../components/TCBorderButton';
import MatchFeesCard from '../../../components/challenge/MatchFeesCard';
import CurruentVersionView from '../../../components/challenge/CurruentVersionView';
import ReservationNumber from '../../../components/reservations/ReservationNumber';
import GameStatus from '../../../Constants/GameStatus';
import TCTouchableLabel from '../../../components/TCTouchableLabel';
import { getGameHomeScreen } from '../../../utils/gameUtils';
import TCGameDetailRules from '../../../components/TCGameDetailRules';

let entity = {};
let timer;
export default function AlterAcceptDeclineScreen({ navigation, route }) {
  const authContext = useContext(AuthContext);

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
  const [defaultCard, setDefaultCard] = useState();
  const [countDown, setCountDown] = useState();
  useEffect(() => {
    entity = authContext.entity;
    const { challengeObj } = route.params ?? {};
    if (challengeObj.length > 0) {
      setIsPendingRequestPayment(true);
      for (let i = 0; i < challengeObj.length; i++) {
        if (challengeObj[i].status === ReservationStatus.accepted) {
          if (isOld === false) {
            setbodyParams(challengeObj[0]);
            setOldVersion(challengeObj[i]);
            setIsOld(true);
          } else {
            setbodyParams(challengeObj[0]);
          }

          if (
            (challengeObj[0]?.away_team?.group_id
                ?? challengeObj[0]?.away_team?.user_id) === entity.uid
          ) {
            setHomeTeam(challengeObj[0].away_team);
            setAwayTeam(challengeObj[0].home_team);
          } else {
            setHomeTeam(challengeObj[0].home_team);
            setAwayTeam(challengeObj[0].away_team);
          }

          break;
        }
      }
      if (!paymentCard) {
        setPaymentCard({
          start_datetime: challengeObj[0].start_datetime,
          end_datetime: challengeObj[0].end_datetime,
          currency_type: challengeObj[0].currency_type,
          payment_method_type: challengeObj[0].payment_method_type,
          total_game_charges: challengeObj[0].total_game_charges,
          service_fee1_charges: challengeObj[0].service_fee1_charges,
          service_fee2_charges: challengeObj[0].service_fee2_charges,
          total_charges: challengeObj[0].total_charges,
          total_stripe_fee: challengeObj[0].total_stripe_fee,
          total_payout: challengeObj[0].total_payout,
        });
      }
      if (!defaultCard && challengeObj[0].source) {
        getPaymentMethods(challengeObj[0].source);
      }

      console.log('challenge Object::', challengeObj[0]);

      console.log('Payment Object::', paymentCard);
    } else {
      if (isOld === false) {
        setbodyParams(challengeObj);
        // oldVersion = { ...body };
        setOldVersion(challengeObj);
        setIsOld(true);
      } else {
        setbodyParams(challengeObj);
      }

      if (
        (challengeObj?.away_team?.group_id
          ?? challengeObj?.away_team?.user_id) === entity.uid
      ) {
        setHomeTeam(challengeObj.away_team);
        setAwayTeam(challengeObj.home_team);
      } else {
        setHomeTeam(challengeObj.home_team);
        setAwayTeam(challengeObj.away_team);
      }
      if (!paymentCard) {
        setPaymentCard({
          start_datetime: challengeObj.start_datetime,
          end_datetime: challengeObj.end_datetime,
          currency_type: challengeObj.currency_type,
          payment_method_type: challengeObj.payment_method_type,
          total_game_charges: challengeObj.total_game_charges,
          service_fee1_charges: challengeObj.service_fee1_charges,
          service_fee2_charges: challengeObj.service_fee2_charges,
          total_charges: challengeObj.total_charges,
          total_stripe_fee: challengeObj.total_stripe_fee,
          total_payout: challengeObj.total_payout,
        });
      }
      if (!defaultCard && challengeObj.source) {
        getPaymentMethods(challengeObj.source);
      }
      console.log('challenge Object::', challengeObj);
      console.log('Payment Object::', paymentCard);
    }
    if (route?.params?.paymentMethod) {
      setDefaultCard(route?.params?.paymentMethod);
    }
  }, [isFocused]);
  useFocusEffect(() => {
    const timeStamp = moment(new Date(bodyParams?.timestamp * 1000)).add(24, 'h').toDate().getTime();
    const startDateTime = bodyParams?.start_datetime * 1000
    console.log(`${timeStamp}::::${startDateTime}::::${new Date().getTime()}`);
    let finalDate;
    if (timeStamp < startDateTime) {
      finalDate = timeStamp
    } else {
      finalDate = startDateTime
    }
    if (finalDate > new Date().getTime()) {
      timer = setInterval(() => {
        if (bodyParams.status === ReservationStatus.pendingrequestpayment) {
          getTwoDateDifference(finalDate, new Date().getTime())
        }
      }, 1000);
    } else {
      setCountDown()
    }

    return () => {
      clearInterval(timer)
    }
  }, [])

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
      if (JSON.stringify(bodyParams.referee) !== JSON.stringify(oldVersion.referee)) {
        setEditReferee(true);
      } else {
        setEditReferee(false);
      }

      if (JSON.stringify(bodyParams.scorekeeper) !== JSON.stringify(oldVersion.scorekeeper)) {
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
      if (
        bodyParams.total_game_charges !== oldVersion.total_game_charges
        || bodyParams.manual_fee !== oldVersion.manual_fee
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

    body.challenge_id = bodyParams.challenge_id;
    body.start_datetime = bodyParams.start_datetime;
    body.end_datetime = bodyParams.end_datetime;
    body.currency_type = bodyParams.currency_type || 'CAD';
    body.payment_method_type = 'card';
    body.userChallenge = bodyParams.userChallenge;
    body.sport = bodyParams.sport;
    body.manual_fee = bodyParams.manual_fee;
    if (bodyParams.manual_fee) {
      body.total_game_charges = bodyParams.total_game_charges;
    }

    setloading(true);
    getFeesEstimation(
      bodyParams.invited_by
        === (bodyParams?.home_team?.group_id || bodyParams?.home_team?.user_id)
        ? bodyParams?.away_team?.group_id || bodyParams?.away_team?.user_id
        : bodyParams?.home_team?.group_id || bodyParams?.home_team?.user_id,
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
        });
      })
      .catch((e) => {
        setloading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 0.7);
      });
  };
  const acceptDeclineChallengeOperation = (
    teamID,
    ChallengeId,
    versionNo,
    status,
    isRestored = false,
  ) => {
    setloading(true);
    acceptDeclineChallenge(
      teamID,
      ChallengeId,
      versionNo,
      status,
      {},
      authContext,
    )
      .then((response) => {
        setloading(false);
        console.log('ACCEPT RESPONSE::', JSON.stringify(response.payload));

        // if (status === 'accept') {
        //   navigation.navigate('ChallengeAcceptedDeclinedScreen', {
        //     teamObj: { ...awayTeam, game_id: bodyParams?.game_id },
        //     status: 'accept',
        //   });
        // } else if (status === 'decline') {
        //   if (isRestored) {
        //     navigation.navigate('ChallengeAcceptedDeclinedScreen', {
        //       teamObj: awayTeam,
        //       status: 'restored',
        //     });
        //   } else {
        //     navigation.navigate('ChallengeAcceptedDeclinedScreen', {
        //       teamObj: awayTeam,
        //       status: 'decline',
        //     });
        //   }
        // } else if (status === 'cancel') {
        //   navigation.navigate('ChallengeAcceptedDeclinedScreen', {
        //     teamObj: awayTeam,
        //     status: 'cancel',
        //   });
        // }
        if (status === 'accept') {
          navigation.navigate('AlterRequestAccept', {
            operationType: strings.reservationAlterRequestAccepted,
            imageAnimation: false,
          });
        } else if (status === 'decline') {
          if (isRestored) {
            navigation.navigate('AlterRequestAccept', {
              operationType: strings.reservationRequestRestored,
              imageAnimation: false,
            });
          } else {
            navigation.navigate('AlterRequestAccept', {
              operationType: strings.reservationAlterRequestDeclined,
              imageAnimation: false,
            });
          }
        } else if (status === 'cancel') {
          navigation.navigate('AlterRequestAccept', {
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

  const acceptDeclineAlterChallengeOperation = (
    teamID,
    ChallengeId,
    versionNo,
    status,
    paymentID,
  ) => {
    console.log(
      `teamID:${teamID}challengeID:${ChallengeId}versionNo:${versionNo}status:${status}paymentID:${paymentID}`,
    );
    setloading(true);

    acceptDeclineAlterChallenge(
      teamID,
      ChallengeId,
      versionNo,
      status,
      paymentID && { source: paymentID },
      authContext,
    )
      .then((response) => {
        setloading(false);
        console.log('ACCEPT RESPONSE::', JSON.stringify(response.payload));

        // if (status === 'accept') {
        //   navigation.navigate('ChallengeAcceptedDeclinedScreen', {
        //     teamObj: { ...awayTeam, game_id: bodyParams?.game_id },
        //     status: 'accept',
        //   });
        // } else if (status === 'decline') {
        //   navigation.navigate('ChallengeAcceptedDeclinedScreen', {
        //     teamObj: awayTeam,
        //     status: 'decline',
        //   });
        // } else if (status === 'cancel') {
        //   navigation.navigate('ChallengeAcceptedDeclinedScreen', {
        //     teamObj: awayTeam,
        //     status: 'cancel',
        //   });
        // }
        if (status === 'accept') {
          navigation.navigate('AlterRequestAccept', {
            operationType: strings.reservationAlterRequestAccepted,
            imageAnimation: false,
          });
        } else if (status === 'decline') {
          navigation.navigate('AlterRequestAccept', {
            operationType: strings.reservationAlterRequestDeclined,
            imageAnimation: false,
          });
        } else if (status === 'cancel') {
          navigation.navigate('AlterRequestAccept', {
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

  const getDateFormat = (dateValue) => {
    moment.locale('en');
    return moment(new Date(dateValue)).format('MMM DD, yy hh:mm a');
  };
  const getTwoDateDifference = (sDate, eDate) => {
    let delta = Math.abs(new Date(sDate).getTime() - new Date(eDate).getTime()) / 1000;

    const days = Math.floor(delta / 86400);
    delta -= days * 86400;

    const hours = Math.floor(delta / 3600) % 24;
    delta -= hours * 3600;

    const minutes = Math.floor(delta / 60) % 60;
    delta -= minutes * 60;

    const seconds = delta % 60;

    setCountDown(`${hours}h ${minutes}m ${seconds.toFixed(0)}s`);
  };
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

  const checkRefereeColor = (item) => {
    if (oldVersion.referee.filter((e) => e.is_chief === item.is_chief && e.responsible_team_id === item.responsible_team_id).length === 0) {
      return `${colors.themeColor}`;
    }
    return `${colors.lightBlackColor}`;
  };

  const checkScorekeeperColor = (item) => {
    if (oldVersion.scorekeeper.filter((e) => e.is_chief === item.is_chief && e.responsible_team_id === item.responsible_team_id).length === 0) {
      return `${colors.themeColor}`;
    }
    return `${colors.lightBlackColor}`;
  };

  const renderSecureReferee = ({ item, index }) => (
    <TCInfoImageField
      title={
        index === 0 ? `Referee ${index + 1} (Chief)` : `Referee ${index + 1}`
      }
      image={item.responsible_team_id !== 'none' && item.responsible_team_id
        === (homeTeam?.group_id || homeTeam?.user_id) ? homeTeam?.thumbnail && homeTeam.thumbnail : awayTeam?.thumbnail && awayTeam.thumbnail}
      name={
        homeTeam
        && awayTeam
        && ((item.responsible_team_id === 'none' && 'None')
          || (item.responsible_team_id
          === (homeTeam?.group_id || homeTeam?.user_id)
            ? homeTeam?.group_name
              || `${homeTeam?.first_name} ${homeTeam?.last_name}`
            : awayTeam?.group_name
              || `${awayTeam?.first_name} ${awayTeam?.last_name}`))
      }
      marginLeft={30}
      color={checkRefereeColor(item)}
    />
  );

  const renderSecureScorekeeper = ({ item, index }) => (
    <TCInfoImageField
      title={`Scorekeeper ${index + 1}`}
      image={item.responsible_team_id !== 'none' && item.responsible_team_id
        === (homeTeam?.group_id || homeTeam?.user_id) ? homeTeam?.thumbnail && homeTeam.thumbnail : awayTeam?.thumbnail && awayTeam.thumbnail}
      name={
        homeTeam
        && awayTeam
        && ((item.responsible_team_id === 'none' && 'None')
          || (item.responsible_team_id
          === (homeTeam?.group_id || homeTeam?.user_id)
            ? homeTeam?.group_name
              || `${homeTeam?.first_name} ${homeTeam?.last_name}`
            : awayTeam?.group_name
              || `${awayTeam?.first_name} ${awayTeam?.last_name}`))
      }
      marginLeft={30}
      color={checkScorekeeperColor(item)}
    />
  );
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
        }, 0.3);
      });
  };
  // eslint-disable-next-line consistent-return
  const checkSenderOrReceiver = (challengeObj) => {
    if (!challengeObj.userChallenge) {
      if (
        challengeObj.status === ReservationStatus.pendingpayment
        || challengeObj.status === ReservationStatus.pendingrequestpayment
      ) {
        if (challengeObj.invited_by === entity.uid) {
          return 'sender';
        }
        return 'receiver';
      }
      if (challengeObj?.status === ReservationStatus.offered) {
        if (entity.uid === bodyParams?.created_by?.group_id) {
          return 'sender';
        }
        return 'receiver';
      }
      if (challengeObj?.updated_by?.group_id === entity.uid) {
        return 'sender';
      }
      return 'receiver';
    }
    if (
      challengeObj.status === ReservationStatus.pendingpayment
      || challengeObj.status === ReservationStatus.pendingrequestpayment
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
    if (challengeObj?.updated_by?.uid === entity.uid) {
      return 'sender';
    }
    return 'receiver';
  };
  const singlePlayerText = () => {
    if (bodyParams?.sport?.toLowerCase() === 'tennis') {
      return 'You'
    }

    return 'Your team'
  }
  const updateChallengeDetail = () => {
    setloading(true);
    const body = { ...bodyParams };
    const challengeID = body.challenge_id;
    if (route?.params?.paymentMethod) {
      setDefaultCard(route?.params?.paymentMethod);
    }
    delete body.created_at;
    delete body.created_by;
    delete body.entity_id;
    delete body.entity_type;
    delete body.offer_expiry;
    delete body.status;
    delete body.challenge_id;
    delete body.userChallenge;
    delete body.game_id;
    delete body.change_requested_by;
    delete body.updated_by;
    delete body.updated_at;
    delete body.version;
    delete body.reservations;
    const home_id = body?.home_team?.group_id ?? body.home_team.user_id;
    const away_id = body?.away_team?.group_id ?? body.away_team.user_id;
    delete body.home_team;
    delete body.away_team;
    body.home_team = home_id;
    body.away_team = away_id;
    body.total_game_charges = paymentCard.total_game_charges;
    body.total_charges = paymentCard.total_charges;
    body.total_payout = paymentCard.total_payout;
    body.service_fee1_charges = paymentCard.service_fee1_charges;
    body.service_fee2_charges = paymentCard.service_fee2_charges;
    body.stripe_fee = paymentCard.stripe_fee;
    if (defaultCard) {
      body.source = defaultCard.id;
    }

    console.log('FINAL BODY PARAMS::', body);
    updateChallenge(challengeID, body, authContext)
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
  // eslint-disable-next-line consistent-return
  const getTeamName = (challengeObject) => {
    if (!challengeObject.userChallenge) {
      if (challengeObject.home_team.group_id === entity.uid) {
        return challengeObject.away_team.group_name;
      }
      return challengeObject.home_team.group_name;
    }
    if (challengeObject.home_team.user_id === entity.uid) {
      return `${challengeObject.away_team.first_name} ${challengeObject.away_team.last_name}`;
    }
    return `${challengeObject.home_team.first_name} ${challengeObject.home_team.last_name}`;
  };

  const getPendingRequestPaymentMessage = () => {
    if (bodyParams.change_requested_by === entity.uid) {
      return `${getTeamName(
        bodyParams,
      )} has accepted your match reservation alteration request, but `;
    }

    return `${singlePlayerText()} has accepted a match reservation alteration request from ${getTeamName(
      bodyParams,
    )}, but `;
  };
  console.log('DEFAULT CARD:', defaultCard);
  return (
    <TCKeyboardView>
      <ActivityLoader visible={loading} />
      {homeTeam && awayTeam && bodyParams && (
        <View>
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
              // flexDirection: 'row',
              justifyContent: 'flex-end',
              // alignItems: 'center',
              marginLeft: 15,
              marginRight: 15,
            }}>
            <ReservationNumber reservationNumber={bodyParams.challenge_id} />
            {/* <CurruentVersionView
              onPress={() => {
                navigation.navigate('CurruentReservationScreen', {
                  body: oldVersion,
                });
              }}
            /> */}
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
                <Text style={styles.challengerText}>Challenger</Text>
              </View>

              <View style={styles.teamView}>
                <Image
                  source={images.teamPlaceholder}
                  style={styles.teamImage}
                />
                <Text style={styles.teamNameText}>
                  {bodyParams.invited_by
                  === (bodyParams?.home_team?.group_id
                    ?? bodyParams?.home_team?.user_id)
                    ? bodyParams?.home_team?.group_name
                      || `${bodyParams?.home_team?.first_name} ${bodyParams?.home_team?.last_name}`
                    : bodyParams?.away_team?.group_name
                      || `${bodyParams?.away_team?.first_name} ${bodyParams?.away_team?.last_name}`}
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
                  {bodyParams.invited_by
                  === (bodyParams?.home_team?.group_id
                    ?? bodyParams?.home_team?.user_id)
                    ? bodyParams?.away_team?.group_name
                      || `${bodyParams?.away_team?.first_name} ${bodyParams?.away_team?.last_name}`
                    : bodyParams?.home_team?.group_name
                      || `${bodyParams?.home_team?.first_name} ${bodyParams?.home_team?.last_name}`}
                </Text>
              </View>
            </View>
          </View>
          {/* status change requested */}
          {checkSenderOrReceiver(bodyParams) === 'sender'
            && bodyParams.status === ReservationStatus.changeRequest && (
              <View>
                {bodyParams.offer_expiry * 1000 < new Date().getTime() ? (
                  <Text style={styles.challengeMessage}>
                    RESERVATION REQUEST EXPIRED
                  </Text>
                ) : (
                  <Text style={styles.challengeMessage}>
                    ALTEARION REQUEST SENT
                  </Text>
                )}
                {bodyParams.offer_expiry * 1000 < new Date().getTime() ? (
                  <Text style={styles.challengeText}>
                    Your match reservation request has been expired.
                  </Text>
                ) : (
                  <Text style={styles.challengeText}>
                    {singlePlayerText()} sent a match reservation alteration request to{' '}
                    {getTeamName(bodyParams)}.
                  </Text>
                )}
              </View>
          )}
          {checkSenderOrReceiver(bodyParams) === 'receiver'
            && bodyParams.status === ReservationStatus.changeRequest && (
              <View>
                {bodyParams.offer_expiry * 1000 < new Date().getTime() ? (
                  <Text style={styles.challengeMessage}>
                    RESERVATION REQUEST EXPIRED
                  </Text>
                ) : (
                  <Text style={styles.challengeMessage}>
                    ALTERATION REQUEST PENDING
                  </Text>
                )}
                {bodyParams.offer_expiry * 1000 < new Date().getTime() ? (
                  <Text style={styles.challengeText}>
                    The match reservation request from {getTeamName(bodyParams)}{' '}
                    has been expired.
                  </Text>
                ) : (
                  <Text style={styles.challengeText}>
                    {singlePlayerText()} received a match reservation alteration request from{' '}
                    {getTeamName(bodyParams)}.
                  </Text>
                )}
              </View>
          )}

          {/* status change requested */}

          {/* status pending request payment */}
          {checkSenderOrReceiver(bodyParams) === 'sender'
            && bodyParams.status === ReservationStatus.pendingrequestpayment && (
              <View>
                <Text style={styles.challengeMessage}>AWAITING PAYMENT</Text>
                <Text style={styles.challengeText}>
                  {`${getPendingRequestPaymentMessage()} your payment hasn't gone through yet.`}
                </Text>
                <Text style={styles.awatingNotesText}>
                  {'The accepted alteration won\'t be applied to the current reservation unless the payment goes through within'} <Text style={{ color: colors.themeColor }}>{countDown}</Text>
                  {'\n\nMeanwhile,'} {getTeamName(
                    bodyParams,
                  )} {'can cancel acceptance of the alteration request before the payment is completed.'}

                </Text>
              </View>
          )}
          {checkSenderOrReceiver(bodyParams) === 'receiver'
            && bodyParams.status === ReservationStatus.pendingrequestpayment && (
              <View>
                <Text style={styles.challengeMessage}>AWAITING PAYMENT</Text>
                <Text style={styles.challengeText}>
                  {`${getPendingRequestPaymentMessage()} the payment hasn't gone through yet.`}
                </Text>
                <Text style={styles.awatingNotesText}>
                  {'The accepted alteration won\'t be applied to the current reservation unless the payment goes through within'} <Text style={{ color: colors.themeColor }}>{countDown}</Text>
                  {'\n\nMeanwhile, you can cancel acceptance of the alteration request before the payment will go through.'}
                </Text>
              </View>
          )}
          {/* status pending request payment */}
          {/* Status declined */}
          {checkSenderOrReceiver(bodyParams) === 'sender'
            && bodyParams.status === ReservationStatus.declined && (
              <View>
                <Text
                  style={[
                    styles.challengeMessage,
                    { color: colors.googleColor },
                  ]}>
                  DECLINED
                </Text>
                <Text style={styles.challengeText}>
                  {`${singlePlayerText()} declined match reservation request from ${getTeamName(
                    bodyParams,
                  )}.`}
                </Text>
              </View>
          )}
          {checkSenderOrReceiver(bodyParams) === 'receiver'
            && bodyParams.status === ReservationStatus.declined && (
              <View>
                <Text
                  style={[
                    styles.challengeMessage,
                    { color: colors.googleColor },
                  ]}>
                  DECLINED
                </Text>
                <Text style={styles.challengeText}>
                  {`${getTeamName(
                    bodyParams,
                  )} declined a match reservation request sent by you.`}
                </Text>
              </View>
          )}
          {/* Status declined */}
          {checkSenderOrReceiver(bodyParams) === 'sender'
            && bodyParams.status === ReservationStatus.pendingrequestpayment && countDown && (
              <TCGradientButton
                title={'TRY TO PAY AGAIN'}
                onPress={() => {
                  navigation.navigate('PayAgainScreen', {
                    body: { ...bodyParams, ...paymentCard },
                    comeFrom: ReservationStatus.pendingrequestpayment,
                  });
                }}
                marginBottom={15}
              />
          )}
          {checkSenderOrReceiver(bodyParams) === 'receiver'
            && bodyParams.status === ReservationStatus.pendingrequestpayment && countDown && (
              <TCGradientButton
                title={'RESTORE TO PREVIOUS VERSION'}
                onPress={() => {
                  acceptDeclineChallengeOperation(
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

          <TCBorderButton
            title={strings.gameHomeText}
            onPress={() => {
              const gameHome = getGameHomeScreen(bodyParams.sport);
              navigation.navigate(gameHome, {
                gameId: bodyParams.game_id,
              });
            }}
            marginBottom={15}
          />

          <TCThickDivider />
          {bodyParams && (
            <View>
              <View style={styles.editableView}>
                <TCLabel
                  title={`Match · ${
                    bodyParams.sport.charAt(0).toUpperCase()
                    + bodyParams.sport.slice(1)
                  }`}
                  isNew={editInfo}
                />
                {!isPendingRequestPayment && (
                  <TouchableOpacity
                    style={styles.editTouchArea}
                    hitSlop={{
                      top: 15,
                      bottom: 15,
                      left: 15,
                      right: 15,
                    }}
                    onPress={() => navigation.navigate('CreateChallengeForm1', {
                      editableAlter: true,
                      body: bodyParams,
                    })
                    }>
                    <Image
                      source={images.editSection}
                      style={styles.editButton}
                    />
                  </TouchableOpacity>
                )}
              </View>
              <TCInfoImageField
                title={'Home'}
                image={
                  bodyParams?.home_team?.thumbnail
                  && bodyParams.home_team.thumbnail
                }
                name={
                  bodyParams?.home_team?.group_name
                  || `${bodyParams?.home_team?.first_name} ${bodyParams?.home_team?.last_name}`
                }
                marginLeft={30}
                color={
                  bodyParams?.home_team?.group_name
                    === oldVersion?.home_team?.group_name
                  || `${bodyParams?.home_team?.first_name} ${bodyParams?.home_team?.last_name}`
                    === `${oldVersion?.home_team?.first_name} ${oldVersion?.home_team?.last_name}`
                    ? colors.lightBlackColor
                    : colors.themeColor
                }
              />
              <TCThinDivider />
              <TCInfoImageField
                title={'Away'}
                image={
                  bodyParams?.away_team?.thumbnail
                  && bodyParams.away_team.thumbnail
                }
                name={
                  bodyParams?.away_team?.group_name
                  || `${bodyParams?.away_team?.first_name} ${bodyParams?.away_team?.last_name}`
                }
                marginLeft={30}
                color={
                  bodyParams?.away_team?.group_name
                    === oldVersion?.away_team?.group_name
                  || `${bodyParams?.away_team?.first_name} ${bodyParams?.away_team?.last_name}`
                    === `${oldVersion?.away_team?.first_name} ${oldVersion?.away_team?.last_name}`
                    ? colors.lightBlackColor
                    : colors.themeColor
                }
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
                color={
                  `${getDateFormat(
                    bodyParams.start_datetime,
                  )} -\n${getDateFormat(
                    bodyParams.end_datetime,
                  )}\n${getTimeDifferent(
                    new Date(bodyParams.start_datetime),
                    new Date(bodyParams.end_datetime),
                  )}`
                  === `${getDateFormat(
                    oldVersion.start_datetime,
                  )} -\n${getDateFormat(
                    oldVersion.end_datetime,
                  )}\n${getTimeDifferent(
                    new Date(oldVersion.start_datetime),
                    new Date(oldVersion.end_datetime),
                  )}`
                    ? colors.lightBlackColor
                    : colors.themeColor
                }
                marginLeft={30}
                titleStyle={{ fontSize: 16 }}
              />
              <TCThinDivider />
              <TCInfoField
                title={'Venue'}
                value={bodyParams?.venue?.title}
                marginLeft={30}
                titleStyle={{ fontSize: 16 }}
                color={
                  bodyParams?.venue?.title === oldVersion?.venue?.title
                    ? colors.lightBlackColor
                    : colors.themeColor
                }
              />
              <TCThinDivider />
              <TCInfoField
                title={'Address'}
                value={bodyParams?.venue?.address}
                marginLeft={30}
                titleStyle={{ fontSize: 16 }}
                color={
                  bodyParams?.venue?.address === oldVersion?.venue?.address
                    ? colors.lightBlackColor
                    : colors.themeColor
                }
              />
              <EventMapView
                coordinate={{
                  latitude: bodyParams?.venue?.lat,
                  longitude: bodyParams?.venue?.long,
                }}
                region={{
                  latitude: bodyParams?.venue?.lat,
                  longitude: bodyParams?.venue?.long,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                }}
                style={styles.map}
              />
              {editInfo && (
                <CurruentVersionView
                  onPress={() => {
                    navigation.navigate('CurruentReservationScreen', {
                      body: oldVersion,
                    });
                  }}
                />
              )}
              <TCThickDivider marginTop={20} />
            </View>
          )}

          {bodyParams && (
            <View>
              <View style={styles.editableView}>
                <TCLabel
                  title={'Responsibility  to Secure Venue'}
                  isNew={editVenue}
                />
                {!isPendingRequestPayment && (
                  <TouchableOpacity
                    style={styles.editTouchArea}
                    hitSlop={{
                      top: 15,
                      bottom: 15,
                      left: 15,
                      right: 15,
                    }}
                    onPress={() => navigation.navigate('CreateChallengeForm1', {
                      editableAlter: true,
                      body: bodyParams,
                    })
                    }>
                    <Image
                      source={images.editSection}
                      style={styles.editButton}
                    />
                  </TouchableOpacity>
                )}
              </View>

              <View style={styles.viewContainer}>
                <View style={styles.fieldValue}>
                  <Image
                    source={
                      // eslint-disable-next-line no-nested-ternary
                      (bodyParams?.home_team?.group_name
                        || `${bodyParams?.home_team?.first_name} ${bodyParams?.home_team?.last_name}`)
                      === bodyParams?.responsible_to_secure_venue
                        ? bodyParams?.home_team?.thumbnail
                          ? { uri: bodyParams?.home_team?.thumbnail }
                          : images.teamPlaceholder
                        : bodyParams?.away_team?.thumbnail
                          ? { uri: bodyParams?.away_team?.thumbnail }
                          : images.teamPlaceholder
                    }
                    style={styles.imageView}
                  />
                  <Text
                    style={
                      editVenue
                        ? [styles.teamNameText, { color: colors.themeColor }]
                        : styles.teamNameText
                    }
                    numberOfLines={1}>
                    {bodyParams.responsible_to_secure_venue}
                  </Text>
                </View>
              </View>
              {editVenue && (
                <CurruentVersionView
                  onPress={() => {
                    navigation.navigate('CurruentReservationScreen', {
                      body: oldVersion,
                    });
                  }}
                />
              )}
              <TCThickDivider marginTop={20} />
            </View>
          )}
          {bodyParams?.sport.toLowerCase() === 'tennis' && <View>
            <TCGameDetailRules gameRules={bodyParams?.gameRules}/>
            <TCThickDivider marginTop={20} />
          </View>}
          {bodyParams && (
            <View>
              <View style={styles.editableView}>
                <TCLabel title={'Rules'} isNew={editRules} />
                {!isPendingRequestPayment && (
                  <TouchableOpacity
                    style={styles.editTouchArea}
                    hitSlop={{
                      top: 15,
                      bottom: 15,
                      left: 15,
                      right: 15,
                    }}
                    onPress={() => navigation.navigate('CreateChallengeForm2', {
                      editableAlter: true,
                      body: bodyParams,
                      teamData: [{ ...homeTeam }, { ...awayTeam }],
                    })
                    }>
                    <Image
                      source={images.editSection}
                      style={styles.editButton}
                    />
                  </TouchableOpacity>
                )}
              </View>
              <Text
                style={
                  editRules
                    ? [styles.rulesText, { color: colors.themeColor }]
                    : styles.rulesText
                }>
                {bodyParams.special_rule}
              </Text>
              {editRules && (
                <CurruentVersionView
                  onPress={() => {
                    navigation.navigate('CurruentReservationScreen', {
                      body: oldVersion,
                    });
                  }}
                />
              )}
            </View>
          )}
          <TCThickDivider marginTop={20} />
          <View>
            <View style={styles.editableView}>
              <TCLabel
                title={'Responsibility to Secure Referees'}
                isNew={editReferee}
              />
              {!isPendingRequestPayment && (
                <TouchableOpacity
                  style={styles.editTouchArea}
                  hitSlop={{
                    top: 15,
                    bottom: 15,
                    left: 15,
                    right: 15,
                  }}
                  onPress={() => navigation.navigate('CreateChallengeForm3', {
                    editableAlter: true,
                    body: bodyParams,
                    teamData: [{ ...homeTeam }, { ...awayTeam }],
                  })
                  }>
                  <Image
                    source={images.editSection}
                    style={styles.editButton}
                  />
                </TouchableOpacity>
              )}
            </View>
            {bodyParams && (
              <FlatList
                data={bodyParams.referee}
                renderItem={renderSecureReferee}
                keyExtractor={(item, index) => index.toString()}
                ItemSeparatorComponent={() => <TCThinDivider />}
              />
            )}
            {editReferee && (
              <CurruentVersionView
                onPress={() => {
                  navigation.navigate('CurruentReservationScreen', {
                    body: oldVersion,
                  });
                }}
              />
            )}
          </View>
          <TCThickDivider marginTop={10} />
          <View>
            <View style={styles.editableView}>
              <TCLabel
                title={'Responsibility to Secure ScoreKeeper'}
                isNew={editScorekeeper}
              />
              {!isPendingRequestPayment && (
                <TouchableOpacity
                  style={styles.editTouchArea}
                  hitSlop={{
                    top: 15,
                    bottom: 15,
                    left: 15,
                    right: 15,
                  }}
                  onPress={() => navigation.navigate('CreateChallengeForm3', {
                    editableAlter: true,
                    body: bodyParams,
                    teamData: [{ ...homeTeam }, { ...awayTeam }],
                  })
                  }>
                  <Image
                    source={images.editSection}
                    style={styles.editButton}
                  />
                </TouchableOpacity>
              )}
            </View>
            {bodyParams && (
              <FlatList
                data={bodyParams.scorekeeper}
                renderItem={renderSecureScorekeeper}
                keyExtractor={(item, index) => index.toString()}
                ItemSeparatorComponent={() => <TCThinDivider />}
              />
            )}
            {editScorekeeper && (
              <CurruentVersionView
                onPress={() => {
                  navigation.navigate('CurruentReservationScreen', {
                    body: oldVersion,
                  });
                }}
              />
            )}
          </View>
          <TCThickDivider marginTop={10} />
          <View style={styles.editableView}>
            <TCLabel
              title={
                bodyParams.invited_by === entity.uid ? 'Payment' : 'Earning'
              }
              isNew={editPayment}
            />
            {!isPendingRequestPayment && (
              <TouchableOpacity
                style={styles.editTouchArea}
                hitSlop={{
                  top: 15,
                  bottom: 15,
                  left: 15,
                  right: 15,
                }}
                onPress={() => navigation.navigate('EditFeeScreen', {
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
              bodyParams.invited_by === entity.uid ? 'sender' : 'receiver'
            }
          />
          {editPayment && (<View style={{ marginBottom: 10, marginTop: 10 }}>
            <CurruentVersionView
                  onPress={() => {
                    navigation.navigate('CurruentReservationScreen', {
                      body: oldVersion,
                    });
                  }}
                />
          </View>
          )}
          {/* {checkSenderOrReceiver(bodyParams) === 'receiver'
            && bodyParams.status === ReservationStatus.changeRequest && (
              <View style={{ marginTop: 10 }}>
                <TCTouchableLabel
            title={ (defaultCard && defaultCard.brand) ?? route.params.paymentMethod ? Utility.capitalize(route.params.paymentMethod.card.brand) : strings.addOptionMessage}
            subTitle={(defaultCard && defaultCard.last4) ?? route.params.paymentMethod?.card.last4 }
            showNextArrow={true}
            onPress={() => {
              navigation.navigate('PaymentMethodsScreen', {
                comeFrom: 'AlterAcceptDeclineScreen',
              })
            }}
          />
              </View>
          )} */}
          {bodyParams.invited_by === entity.uid && bodyParams.status !== ReservationStatus.declined && (
            <View style={{ marginTop: 10 }}>
              <TCTouchableLabel
                title={
                  defaultCard && defaultCard?.card?.brand
                    ? Utility.capitalize(defaultCard?.card?.brand)
                    : strings.addOptionMessage
                }
                subTitle={
                  (defaultCard && defaultCard?.card?.last4)
                  ?? defaultCard?.card?.last4
                }
                showNextArrow={true}
                onPress={() => {
                  navigation.navigate('PaymentMethodsScreen', {
                    comeFrom: 'AlterAcceptDeclineScreen',
                  });
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
                <Text style={styles.diffenceAmount}>{`${parseFloat(
                  bodyParams?.total_charges - oldVersion?.total_charges,
                ).toFixed(2)} ${bodyParams.currency_type || 'CAD'}`}</Text>
                {/* <Text style={styles.diffenceAmount}>{checkSenderOrReceiver(bodyParams) === 'sender' ? `$${bodyParams.total_charges - oldVersion.total_charges} CAD` : `$${bodyParams.total_payout - oldVersion.total_payout} CAD`}</Text> */}
              </View>
            </View>
          )}
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
          {checkSenderOrReceiver(bodyParams) === 'sender'
            && bodyParams.status === ReservationStatus.changeRequest
            && bodyParams.offer_expiry < new Date().getTime() && (
              <View>
                <TCBorderButton
                  title={strings.calcelRequest}
                  textColor={colors.grayColor}
                  borderColor={colors.grayColor}
                  height={40}
                  shadow={true}
                  onPress={() => {
                    // acceptDeclineChallengeOperation(
                    //   entity.uid,
                    //   bodyParams.challenge_id,
                    //   bodyParams.version,
                    //   'cancel',
                    // );
                    acceptDeclineAlterChallengeOperation(
                      entity.uid,
                      bodyParams.challenge_id,
                      bodyParams.version,
                      'cancel',
                    );
                  }}
                />
              </View>
          )}

          {checkSenderOrReceiver(bodyParams) === 'receiver'
            && bodyParams.status === ReservationStatus.changeRequest
            && bodyParams.offer_expiry < new Date().getTime() && (
              <View style={{ marginTop: 15 }}>
                <TCGradientButton
                  title={strings.accept}
                  onPress={() => {
                    acceptDeclineAlterChallengeOperation(
                      entity.uid,
                      bodyParams.challenge_id,
                      bodyParams.version,
                      'accept',
                      route?.params?.paymentMethod?.id
                        && route?.params?.paymentMethod?.id,
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
                    acceptDeclineChallengeOperation(
                      entity.uid,
                      bodyParams.challenge_id,
                      bodyParams.version,
                      'decline',
                    );
                  }}
                />
              </View>
          )}
          {bodyParams.status === ReservationStatus.declined && (
            <View>
              <TCBorderButton
                title={strings.alterReservation}
                textColor={colors.grayColor}
                borderColor={colors.grayColor}
                height={40}
                shadow={true}
                marginTop={15}
                onPress={() => {
                  if ((bodyParams?.game?.status || bodyParams?.game_status) === (GameStatus.accepted || GameStatus.reset)) {
                    navigation.navigate('EditChallenge', {
                      challengeObj: oldVersion,
                    });
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
                    bodyParams?.game?.status
                    === (GameStatus.accepted || GameStatus.reset)
                  ) {
                    acceptDeclineChallengeOperation(
                      bodyParams.reservation_id,
                      bodyParams.version,
                      'cancel',
                    );
                  } else if (
                    bodyParams.start_datetime * 1000 < new Date().getTime()
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
          {(bodyParams.status === ReservationStatus.accepted
            || bodyParams.status === ReservationStatus.restored)
            && !isPendingRequestPayment && (
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
                      || editVenue
                      || editRules
                      || editReferee
                      || editScorekeeper
                      || editPayment
                    ) {
                      updateChallengeDetail();
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
          {(bodyParams.status === ReservationStatus.changeRequest
            || bodyParams.status === ReservationStatus.pendingrequestpayment) && (
              <View>
                <TCBorderButton
                title={strings.cancelMatch}
                textColor={colors.whiteColor}
                borderColor={colors.grayColor}
                backgroundColor={colors.grayColor}
                height={40}
                shadow={true}
                marginBottom={15}
                marginTop={15}
                onPress={() => {
                  if (bodyParams.game_status === (GameStatus.accepted || GameStatus.reset)) {
                    acceptDeclineChallengeOperation(
                      entity.uid,
                      bodyParams.challenge_id,
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
  awatingNotesText: {
    color: colors.userPostTimeColor,
    marginRight: 15,
    marginLeft: 15,
    marginBottom: 15,
  },
});
