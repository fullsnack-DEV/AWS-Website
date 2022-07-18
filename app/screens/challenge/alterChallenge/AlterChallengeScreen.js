/* eslint-disable no-unused-vars */
/* eslint-disable no-nested-ternary */
import React, {useEffect, useState, useContext} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  FlatList,
  SafeAreaView,
} from 'react-native';
import moment from 'moment';

import {useIsFocused} from '@react-navigation/native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Modal from 'react-native-modal';
import * as Utility from '../../../utils';
import GameFeeCard from '../../../components/challenge/GameFeeCard';
import {
  acceptDeclineAlterChallenge,
  acceptDeclineChallenge,
  getFeesEstimation,
} from '../../../api/Challenge';
import {paymentMethods} from '../../../api/Users';

import ActivityLoader from '../../../components/loader/ActivityLoader';

import strings from '../../../Constants/String';
import fonts from '../../../Constants/Fonts';
import colors from '../../../Constants/Colors';
import TCKeyboardView from '../../../components/TCKeyboardView';
import TCThickDivider from '../../../components/TCThickDivider';
import images from '../../../Constants/ImagePath';
import TCLabel from '../../../components/TCLabel';
import AuthContext from '../../../auth/context';
import TCChallengeTitle from '../../../components/TCChallengeTitle';
import SecureRefereeView from '../../../components/SecureRefereeView';
import {getGameHomeScreen, getNumberSuffix} from '../../../utils/gameUtils';
import EventMapView from '../../../components/Schedule/EventMapView';
import TCSmallButton from '../../../components/TCSmallButton';
import {widthPercentageToDP} from '../../../utils';
import TCTouchableLabel from '../../../components/TCTouchableLabel';
import {getSetting} from '../manageChallenge/settingUtility';
import TCTabView from '../../../components/TCTabView';
import CurruentReservationView from './CurrentReservationView';
import ReservationStatus from '../../../Constants/ReservationStatus';
import TCThinDivider from '../../../components/TCThinDivider';
import TCArrowView from '../../../components/TCArrowView';
import ChallengeStatusView from '../../../components/challenge/ChallengeStatusView';
import GameStatus from '../../../Constants/GameStatus';
import RefereeAgreementView from '../../../components/challenge/RefereeAgreementView';
import ScorekeeperAgreementView from '../../../components/challenge/ScorekeeperAgreementView';

let entity = {};
export default function AlterChallengeScreen({navigation, route}) {
  const [groupObj] = useState(route?.params?.groupObj);
  const [sportName] = useState(route?.params?.sportName);

  console.log('settingObjsettingObj:=>', route?.params?.settingObj);

  const authContext = useContext(AuthContext);
  const isFocused = useIsFocused();
  const [loading, setloading] = useState(false);
  const [feeObj, setFeeObj] = useState();
  const [venueList, setVenueList] = useState();
  const [venue, setVenue] = useState();
  const [alterModalVisible, setAlterModalVisible] = useState(false);
  const [defaultCard, setDefaultCard] = useState();

  const [maintabNumber, setMaintabNumber] = useState(0);

  const [isOld, setIsOld] = useState(false);
  const [bodyParams, setbodyParams] = useState(
    route?.params?.challengeObj?.[0],
  );
  const [oldVersion, setOldVersion] = useState();
  const [paymentCard, setPaymentCard] = useState();
  const [homeTeam, setHomeTeam] = useState();
  const [awayTeam, setAwayTeam] = useState();

  const [settingObject, setSettingObject] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [challengeStatus, setChallengeStatus] = useState();
  const [teamObject, setTeamObject] = useState();
  const [groupObject, setGroupObject] = useState();

  const [moreButtonReferee, setMoreButtonReferee] = useState();
  const [moreButtonScorekeeper, setMoreButtonScorekeeper] = useState();
  // const [challengeObj, setChallengeObj] = useState(route?.params?.challengeObj);
  const [teams, setteams] = useState([]);

  useEffect(() => {
    setloading(true);
    console.log('challenge data11:=>', bodyParams?.challengee);
    getSetting(
      bodyParams?.challengee,
      authContext.entity.role === 'user' ? 'player' : 'team',
      bodyParams?.sport,
      authContext,
      bodyParams?.sport_type,
    ).then((response) => {
      setloading(false);
      console.log('manage challenge response:=>', response);
      setSettingObject(response);
    });
  }, [authContext, bodyParams?.challengee, bodyParams?.sport]);

  useEffect(() => {
    entity = authContext.entity;
    const {challengeObj} = route.params ?? {};
    console.log('challengeObj1:=> ', challengeObj);
    if (challengeObj.length > 0) {
      for (let i = 0; i < challengeObj.length; i++) {
        if (challengeObj[i].status === ReservationStatus.accepted) {
          if (isOld === false) {
            setOldVersion(challengeObj[i]);
            setIsOld(true);
          }

          if (
            (challengeObj[0]?.away_team?.group_id ??
              challengeObj[0]?.away_team?.user_id) === entity.uid
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
          total_game_fee: challengeObj[0].total_game_fee,
          total_service_fee1: challengeObj[0].total_service_fee1,
          total_service_fee2: challengeObj[0].total_service_fee2,
          international_card_fee: challengeObj[0].international_card_fee,

          total_amount: challengeObj[0].total_amount,
          total_stripe_fee: challengeObj[0].total_stripe_fee,
          total_payout: challengeObj[0].total_payout,
        });
      }
      if (!defaultCard && challengeObj[0].source) {
        getPaymentMethods(challengeObj[0].source);
      }

      console.log('challenge Object::', challengeObj[0]);
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
        (challengeObj?.away_team?.group_id ??
          challengeObj?.away_team?.user_id) === entity.uid
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
          total_game_fee: challengeObj.total_game_fee,
          total_service_fee1: challengeObj.total_service_fee1,
          total_service_fee2: challengeObj.total_service_fee2,
          international_card_fee: challengeObj?.international_card_fee,
          total_amount: challengeObj.total_amount,
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

  const getPaymentMethods = () => {
    setloading(true);
    paymentMethods(authContext)
      .then((response) => {
        console.log('source ID:', bodyParams?.source);
        console.log('payment method', response.payload);
        for (const tempCard of response?.payload) {
          if (tempCard?.id === bodyParams?.source) {
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
  };

  useEffect(() => {
    if (isFocused) {
      if (route?.params?.paymentMethod) {
        setDefaultCard(route?.params?.paymentMethod);
      }
    }
  }, [isFocused, route?.params?.paymentMethod]);

  useEffect(() => {
    if (route?.params?.selectedVenueObj) {
      setVenue(route?.params?.selectedVenueObj);
    }
    if (bodyParams?.venue?.length === 1) {
      setVenue(bodyParams?.venue?.[0]);
    }
    setbodyParams({
      ...bodyParams,
      venue: route?.params?.selectedVenueObj ?? bodyParams?.venue?.[0],
    });
  }, [route?.params?.selectedVenueObj, bodyParams?.venue, venue]);

  useEffect(() => {
    entity = authContext.entity;
    if (groupObj) {
      if (bodyParams?.challenger === entity.uid) {
        setteams([{...entity.obj}, {...groupObj}]);
      } else {
        setteams([{...groupObj}, {...entity.obj}]);
      }
    }
    if (bodyParams?.game_fee?.fee || bodyParams?.game_fee?.fee === 0) {
      console.log('bodyParams check 1:=>', bodyParams);

      getFeeDetail();
    }
  }, [authContext.entity, bodyParams, groupObj]);

  useEffect(() => {
    console.log('authContext.entitity', authContext.entity);
    setloading(true);
    getSetting(
      bodyParams?.challengee,
      authContext.entity.role === 'user' ? 'player' : 'team',
      sportName,
      authContext,
    )
      .then((response) => {
        setloading(false);
        console.log('manage challenge response:=>', response);
        if (bodyParams?.venue?.isCustom) {
          response.venue.push(bodyParams?.venue);
          setVenueList(response.venue);
        } else {
          setVenueList(response.venue);
        }
      })
      .catch((e) => {
        setloading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 10);
      });
  }, [authContext, bodyParams?.challengee, bodyParams?.venue, sportName]);

  useEffect(() => {
    console.log('useEffect Called');
    if (isFocused) {
      const settings = {...bodyParams};
      if (route?.params?.gameType) {
        console.log('route?.params?.gameType', route?.params?.gameType);
        settings.game_type = route?.params?.gameType;
      }
      if (route?.params?.gameFee) {
        console.log('route?.params?.gameFee', route?.params?.gameFee);
        settings.game_fee = route?.params?.gameFee;
      }
      if (route?.params?.refundPolicy) {
        console.log('route?.params?.refundPolicy', route?.params?.refundPolicy);
        settings.refund_policy = route?.params?.refundPolicy;
      }
      if (route?.params?.homeAway) {
        settings.home_away = route?.params?.homeAway;

        if (route?.params?.home_team?.name) {
          settings.home_team = groupObj;
          settings.away_team = route?.params?.away_team;
        } else {
          settings.away_team = groupObj;
          settings.home_team = route?.params?.home_team;
        }

        //  settings.home_team = route?.params?.home_team;
        //  settings.away_team = route?.params?.away_team;

        console.log('setting:=> ', settings);
      }
      if (route?.params?.gameDuration) {
        settings.game_duration = route?.params?.gameDuration;
      }
      if (route?.params?.gameGeneralRules) {
        console.log(
          'route?.params?.gameGeneralRules',
          route?.params?.gameGeneralRules,
        );
        settings.general_rules = route?.params?.gameGeneralRules;
        settings.special_rules = route?.params?.gameSpecialRules;
      }
      if (route?.params?.refereeSetting) {
        settings.responsible_for_referee = route?.params?.refereeSetting;
      }
      if (route?.params?.scorekeeperSetting) {
        settings.responsible_for_scorekeeper =
          route?.params?.scorekeeperSetting;
      }

      setbodyParams(settings);
    }
  }, [
    authContext.entity,
    groupObj,
    isFocused,
    route?.params?.gameDuration,
    route?.params?.gameFee,
    route?.params?.gameGeneralRules,
    route?.params?.gameSpecialRules,
    route?.params?.gameType,
    route?.params?.homeAway,
    route?.params?.refereeSetting,
    route?.params?.refundPolicy,
    route?.params?.scorekeeperSetting,
  ]);

  const getChallenger = () => {
    if (
      bodyParams?.challenger === bodyParams?.home_team?.user_id ||
      bodyParams?.challenger === bodyParams?.home_team?.group_id
    ) {
      return bodyParams?.home_team;
    }
    return bodyParams?.away_team;
  };

  const getChallengee = () => {
    if (
      bodyParams?.challengee === bodyParams?.home_team?.user_id ||
      bodyParams?.challengee === bodyParams?.home_team?.group_id
    ) {
      return bodyParams?.home_team;
    }
    return bodyParams?.away_team;
  };

  const renderPeriod = ({item, index}) => (
    <>
      <TCChallengeTitle
        containerStyle={{marginLeft: 25, marginTop: 5, marginBottom: 5}}
        title={'Interval'}
        titleStyle={{fontSize: 16, fontFamily: fonts.RRegular}}
        value={item.interval}
        valueStyle={{
          fontFamily: fonts.RBold,
          fontSize: 16,
          color: colors.greenColorCard,
          marginRight: 2,
        }}
        staticValueText={'min.'}
      />
      <TCChallengeTitle
        containerStyle={{marginLeft: 25, marginTop: 5, marginBottom: 5}}
        title={`${getNumberSuffix(index + 2)} Period`}
        titleStyle={{fontSize: 16, fontFamily: fonts.RRegular}}
        value={item.period}
        valueStyle={{
          fontFamily: fonts.RBold,
          fontSize: 16,
          color: colors.greenColorCard,
          marginRight: 2,
        }}
        staticValueText={'min.'}
      />
    </>
  );

  const renderOverTime = ({item, index}) => (
    <>
      <TCChallengeTitle
        containerStyle={{marginLeft: 25, marginTop: 5, marginBottom: 5}}
        title={'Interval'}
        titleStyle={{fontSize: 16, fontFamily: fonts.RRegular}}
        value={item.interval}
        valueStyle={{
          fontFamily: fonts.RBold,
          fontSize: 16,
          color: colors.greenColorCard,
          marginRight: 2,
        }}
        staticValueText={'min.'}
      />
      <TCChallengeTitle
        containerStyle={{marginLeft: 25, marginTop: 5, marginBottom: 5}}
        title={`${getNumberSuffix(index + 1)} Over time`}
        titleStyle={{fontSize: 16, fontFamily: fonts.RRegular}}
        value={item.overTime}
        valueStyle={{
          fontFamily: fonts.RBold,
          fontSize: 16,
          color: colors.greenColorCard,
          marginRight: 2,
        }}
        staticValueText={'min.'}
      />
    </>
  );

  const renderReferees = ({item, index}) => {
    console.log('Referee Item:=>', item);
    return (
      <SecureRefereeView
        entityName={
          item.responsible_to_secure_referee === 'challenger'
            ? getChallenger()?.full_name ?? getChallenger()?.group_name
            : getChallengee()?.full_name ?? getChallengee()?.group_name
        }
        image={
          item.responsible_to_secure_referee === 'challenger'
            ? getChallenger()?.thumbnail
              ? {uri: getChallenger()?.thumbnail}
              : getChallenger()?.full_name
              ? images.profilePlaceHolder
              : images.teamPlaceholder
            : getChallenger()?.thumbnail
            ? {uri: getChallengee()?.thumbnail}
            : getChallengee()?.full_name
            ? images.profilePlaceHolder
            : images.teamPlaceholder
        }
        entity={'Referee'}
        entityNumber={index + 1}
      />
    );
  };

  const renderScorekeepers = ({item, index}) => (
    <SecureRefereeView
      entityName={
        item.responsible_to_secure_scorekeeper === 'challenger'
          ? getChallenger()?.full_name ?? getChallenger()?.group_name
          : getChallengee()?.full_name ?? getChallengee()?.group_name
      }
      image={
        item.responsible_to_secure_scorekeeper === 'challenger'
          ? getChallenger()?.thumbnail
            ? {uri: getChallenger()?.thumbnail}
            : getChallenger()?.full_name
            ? images.profilePlaceHolder
            : images.teamPlaceholder
          : getChallengee()?.thumbnail
          ? {uri: getChallengee()?.thumbnail}
          : getChallengee()?.full_name
          ? images.profilePlaceHolder
          : images.teamPlaceholder
      }
      entity={'Scorekeeper'}
      entityNumber={index + 1}
    />
  );

  const getFeeDetail = () => {
    const feeBody = {};
    console.log('bodyParams check:=>', bodyParams);
    feeBody.challenge_id = bodyParams?.challenge_id;
    feeBody.payment_method_type = 'card';
    feeBody.currency_type = bodyParams?.game_fee?.currency_type?.toLowerCase();
    feeBody.total_game_fee = Number(
      parseFloat(bodyParams?.game_fee?.fee).toFixed(2),
    );
    setloading(true);
    getFeesEstimation(feeBody, authContext)
      .then((response) => {
        setFeeObj(response.payload);
        // setbodyParams({
        //   ...bodyParams,
        //   total_game_fee: response.payload?.total_game_fee,
        //   total_service_fee1: response.payload?.total_service_fee1,
        //   total_service_fee2: response.payload?.total_service_fee2,
        //   total_stripe_fee: response.payload?.total_stripe_fee,
        //   total_payout: response.payload?.total_payout,
        //   total_amount: response.payload?.total_amount,
        // });

        // if (response.payload.total_game_fee === 0) {
        //   setTotalZero(true);
        // }
        console.log('Body estimate fee:=>', response.payload);

        setloading(false);
      })
      .catch((e) => {
        setloading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 10);
      });
  };

  const challengeOperation = (teamID, ChallengeId, versionNo, status) => {
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
        let groupOb;
        if (bodyParams?.home_team?.full_name) {
          if (bodyParams?.home_team?.user_id === authContext?.entity?.uid) {
            groupOb = bodyParams?.away_team;
          } else {
            groupOb = bodyParams?.home_team;
          }
        } else if (
          bodyParams?.home_team?.group_id === authContext?.entity?.uid
        ) {
          groupOb = bodyParams?.away_team;
        } else {
          groupOb = bodyParams?.home_team;
        }
        setChallengeStatus(status);
        setModalVisible(true);
        setGroupObject(groupOb);
        setTeamObject({
          ...groupObj,
          game_id: response?.payload?.game_id,
          sport: bodyParams?.sport,
        });
      })
      .catch((e) => {
        setloading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 10);
      });
  };

  const alterChallengeOperation = (
    teamID,
    ChallengeId,
    versionNo,
    status,
    paymentObj,
  ) => {
    setloading(true);

    acceptDeclineAlterChallenge(
      teamID,
      ChallengeId,
      versionNo,
      status,
      paymentObj,
      authContext,
    )
      .then((response) => {
        console.log('ACCEPT RESPONSE::', JSON.stringify(response.payload));

        setloading(false);
        let groupOb;
        if (bodyParams?.home_team?.full_name) {
          if (bodyParams?.home_team?.user_id === authContext?.entity?.uid) {
            groupOb = bodyParams?.away_team;
          } else {
            groupOb = bodyParams?.home_team;
          }
        } else if (
          bodyParams?.home_team?.group_id === authContext?.entity?.uid
        ) {
          groupOb = bodyParams?.away_team;
        } else {
          groupOb = bodyParams?.home_team;
        }
        setChallengeStatus(status);
        setAlterModalVisible(true);
        setGroupObject(groupOb);
        setTeamObject({
          ...groupObj,
          game_id: response?.payload?.game_id,
          sport: bodyParams?.sport,
        });
      })
      .catch((e) => {
        setloading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 10);
      });
  };

  const checkSenderOrReceiver = (challengeObj) => {
    console.log('sender & receiver Obj', challengeObj);

    if (
      challengeObj?.status === ReservationStatus.pendingpayment ||
      challengeObj?.status === ReservationStatus.pendingrequestpayment
    ) {
      if (challengeObj?.requested_by === entity.uid) {
        return 'sender';
      }
      return 'receiver';
    }
    if (
      challengeObj?.status === ReservationStatus.requestcancelled ||
      challengeObj?.status === ReservationStatus.cancelled
    ) {
      if (challengeObj?.requested_by === entity.uid) {
        return 'sender';
      }
      return 'receiver';
    }
    if (challengeObj?.status === ReservationStatus.offered) {
      if (challengeObj?.requested_by === entity.uid) {
        return 'sender';
      }
      return 'receiver';
    }
    if (challengeObj?.status === ReservationStatus.accepted) {
      if (challengeObj?.requested_by === entity.uid) {
        return 'sender';
      }
      return 'receiver';
    }
    if (challengeObj?.status === ReservationStatus.declined) {
      if (challengeObj?.requested_to === entity.uid) {
        return 'sender';
      }
      return 'receiver';
    }
    if (challengeObj?.status === ReservationStatus.restored) {
      if (challengeObj?.requested_to === entity.uid) {
        return 'sender';
      }
      return 'receiver';
    }
    if (
      (challengeObj?.updated_by?.group_id ?? challengeObj?.updated_by?.uid) ===
      entity.uid
    ) {
      return 'sender';
    }
    return 'receiver';
  };

  // eslint-disable-next-line consistent-return
  const getTeamName = (challengeObject) => {
    if (!challengeObject?.user_challenge) {
      if (challengeObject?.home_team?.group_id === entity.uid) {
        return challengeObject?.away_team?.group_name;
      }
      return challengeObject?.home_team?.group_name;
    }
    if (challengeObject?.home_team?.user_id === entity.uid) {
      return `${challengeObject?.away_team?.first_name} ${challengeObject?.away_team?.last_name}`;
    }
    return `${challengeObject?.home_team?.first_name} ${challengeObject?.home_team?.last_name}`;
  };

  const bottomButtonView = () => {
    if (
      checkSenderOrReceiver(bodyParams) === 'sender' &&
      bodyParams?.status === ReservationStatus.offered
    ) {
      return (
        <TCSmallButton
          isBorderButton={true}
          borderstyle={{
            borderColor: colors.userPostTimeColor,
            borderWidth: 1,
            borderRadious: 80,
          }}
          textStyle={{color: colors.userPostTimeColor}}
          title={strings.calcelRequest}
          onPress={() => {
            challengeOperation(
              entity.uid,
              bodyParams?.challenge_id,
              bodyParams?.version,
              'cancel',
            );
          }}
          style={{
            width: widthPercentageToDP('92%'),
            alignSelf: 'center',
            marginBottom: 45,
            marginTop: 15,
          }}
        />
      );
    }
    if (
      checkSenderOrReceiver(bodyParams) === 'receiver' &&
      bodyParams?.status === ReservationStatus.offered
    ) {
      return (
        <View style={styles.bottomButtonContainer}>
          <TCSmallButton
            isBorderButton={true}
            borderstyle={{
              borderColor: colors.userPostTimeColor,
              borderWidth: 1,
              borderRadious: 80,
            }}
            textStyle={{color: colors.userPostTimeColor}}
            title={strings.declineTitle}
            onPress={() => {
              // navigation.navigate('ChallengeAcceptedDeclinedScreen', {
              //   status: 'accept',
              //   teamObj: authContext.entity.obj,
              // });
              challengeOperation(
                entity.uid,
                bodyParams?.challenge_id,
                bodyParams?.version,
                'decline',
              );
            }}
            style={{width: widthPercentageToDP('45%')}}
          />
          <TCSmallButton
            title={strings.acceptTitle}
            onPress={() => {
              // navigation.navigate('ChallengeAcceptedDeclinedScreen', {
              //   status: 'accept',
              //   teamObj: authContext.entity.obj,
              // });
              if (bodyParams?.challenger === bodyParams?.invited_by) {
                challengeOperation(
                  entity.uid,
                  bodyParams?.challenge_id,
                  bodyParams?.version,
                  'accept',
                );
              } else {
                let groupOb;
                if (bodyParams?.home_team?.full_name) {
                  if (
                    bodyParams?.home_team?.user_id === authContext?.entity?.uid
                  ) {
                    groupOb = bodyParams?.away_team;
                  } else {
                    groupOb = bodyParams?.home_team;
                  }
                } else if (
                  bodyParams?.home_team?.group_id === authContext?.entity?.uid
                ) {
                  groupOb = bodyParams?.away_team;
                } else {
                  groupOb = bodyParams?.home_team;
                }
                navigation.push('ChallengePaymentScreen', {
                  challengeObj: bodyParams,
                  groupObj: groupOb,
                  type: 'invite',
                });
              }
            }}
            style={{width: widthPercentageToDP('45%')}}
          />
        </View>
      );
    }
    console.log('Challenge Object:=>', bodyParams);
    if (
      (checkSenderOrReceiver(bodyParams) === 'sender' ||
        checkSenderOrReceiver(bodyParams) === 'receiver') &&
      maintabNumber === 0 &&
      (bodyParams?.status === ReservationStatus.accepted ||
        (bodyParams?.status === ReservationStatus.declined &&
          bodyParams?.version !== 2))
    ) {
      return (
        <View style={styles.bottomButtonView}>
          {(bodyParams?.game_status === GameStatus.accepted ||
            bodyParams?.game_status === GameStatus.reset ||
            !bodyParams?.game_status) && (
            <TCSmallButton
              isBorderButton={true}
              borderstyle={{
                borderColor: colors.userPostTimeColor,
                borderWidth: 1,
                borderRadious: 80,
              }}
              textStyle={{color: colors.userPostTimeColor}}
              title={strings.alterReservation}
              onPress={() => {
                if (
                  bodyParams?.game_status === GameStatus.accepted ||
                  bodyParams?.game_status === GameStatus.reset ||
                  !bodyParams?.game_status
                ) {
                  if (
                    bodyParams?.start_datetime * 1000 <
                    new Date().getTime()
                  ) {
                    Alert.alert(strings.cannotChangeReservationGameStartedText);
                  } else {
                    navigation.navigate('ChangeReservationInfoScreen', {
                      screen: 'change',
                      challengeObj: bodyParams,
                      settingObj: settingObject,
                    });
                  }
                } else {
                  Alert.alert(strings.cannotChangeReservationText);
                }
              }}
              style={{
                width: widthPercentageToDP('92%'),
                alignSelf: 'center',
              }}
            />
          )}
          <TCSmallButton
            isBorderButton={false}
            startGradientColor={colors.endGrayGradient}
            endGradientColor={colors.startGrayGrdient}
            title={strings.cancelMatch}
            onPress={() => {
              // navigation.navigate('ChallengeAcceptedDeclinedScreen', {
              //   status: 'accept',
              //   teamObj: authContext.entity.obj,
              // });

              if (
                bodyParams?.game_status === GameStatus.accepted ||
                bodyParams?.game_status === GameStatus.reset
              ) {
                if (bodyParams?.start_datetime * 1000 < new Date().getTime()) {
                  Alert.alert(strings.cannotChangeReservationGameStartedText);
                } else {
                  navigation.navigate('ChangeReservationInfoScreen', {
                    screen: 'cancel',
                    challengeObj: bodyParams,
                  });
                }
              } else {
                Alert.alert(strings.cannotChangeReservationText);
              }
            }}
            style={{
              width: widthPercentageToDP('92%'),
              alignSelf: 'center',
            }}
          />
        </View>
      );
    }
    if (
      checkSenderOrReceiver(bodyParams) === 'receiver' &&
      bodyParams?.status === ReservationStatus.changeRequest
    ) {
      return (
        <View>
          <View style={styles.bottomButtonContainer}>
            <TCSmallButton
              isBorderButton={true}
              borderstyle={{
                borderColor: colors.userPostTimeColor,
                borderWidth: 1,
                borderRadious: 80,
              }}
              textStyle={{color: colors.userPostTimeColor}}
              title={strings.declineTitle}
              onPress={() => {
                // navigation.navigate('ChallengeAcceptedDeclinedScreen', {
                //   status: 'accept',
                //   teamObj: authContext.entity.obj,
                // });
                challengeOperation(
                  entity.uid,
                  bodyParams?.challenge_id,
                  bodyParams?.version,
                  'decline',
                );
              }}
              style={{width: widthPercentageToDP('45%')}}
            />
            <TCSmallButton
              title={strings.acceptTitle}
              onPress={() => {
                let paymentObj = {};
                if (route?.params?.paymentMethod) {
                  paymentObj = {
                    source: route?.params?.paymentMethod?.id,
                    payment_method_type: 'card',
                  };
                }

                alterChallengeOperation(
                  entity.uid,
                  bodyParams?.challenge_id,
                  bodyParams?.version,
                  'accept',
                  paymentObj,
                );
              }}
              style={{width: widthPercentageToDP('45%')}}
            />
          </View>
          <TCSmallButton
            isBorderButton={false}
            startGradientColor={colors.endGrayGradient}
            endGradientColor={colors.startGrayGrdient}
            title={strings.cancelMatch}
            onPress={() => {
              // navigation.navigate('ChallengeAcceptedDeclinedScreen', {
              //   status: 'accept',
              //   teamObj: authContext.entity.obj,
              // });
              navigation.navigate('ChangeReservationInfoScreen', {
                screen: 'cancel',
                challengeObj: bodyParams,
              });
            }}
            style={{
              width: widthPercentageToDP('92%'),
              alignSelf: 'center',
            }}
          />
        </View>
      );
    }
    if (
      checkSenderOrReceiver(bodyParams) === 'sender' &&
      bodyParams?.status === ReservationStatus.changeRequest
    ) {
      return (
        <View style={styles.bottomButtonView}>
          <TCSmallButton
            isBorderButton={true}
            borderstyle={{
              borderColor: colors.userPostTimeColor,
              borderWidth: 1,
              borderRadious: 80,
            }}
            textStyle={{color: colors.userPostTimeColor}}
            title={strings.calcelRequest}
            onPress={() => {
              if (
                bodyParams?.game_status === GameStatus.accepted ||
                bodyParams?.game_status === GameStatus.reset
              ) {
                if (bodyParams?.start_datetime * 1000 < new Date().getTime()) {
                  Alert.alert(strings.cannotChangeReservationGameStartedText);
                } else {
                  alterChallengeOperation(
                    entity.uid,
                    bodyParams?.challenge_id,
                    bodyParams?.version,
                    'cancel',
                    {},
                  );
                }
              } else {
                Alert.alert(strings.cannotChangeReservationText);
              }
            }}
            style={{
              width: widthPercentageToDP('92%'),
              alignSelf: 'center',
            }}
          />
          <TCSmallButton
            isBorderButton={false}
            startGradientColor={colors.endGrayGradient}
            endGradientColor={colors.startGrayGrdient}
            title={strings.cancelMatch}
            onPress={() => {
              // navigation.navigate('ChallengeAcceptedDeclinedScreen', {
              //   status: 'accept',
              //   teamObj: authContext.entity.obj,
              // });
              navigation.navigate('ChangeReservationInfoScreen', {
                screen: 'cancel',
                challengeObj: bodyParams,
              });
            }}
            style={{
              width: widthPercentageToDP('92%'),
              alignSelf: 'center',
            }}
          />
        </View>
      );
    }

    return <View style={{marginBottom: 45}} />;
  };

  return (
    <TCKeyboardView>
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
      {teams && bodyParams && maintabNumber === 0 && (
        <View style={{marginBottom: 15}}>
          <View>
            <Text style={styles.challengeNumberStyle}>
              Request No.{`${bodyParams?.challenge_id}`}
            </Text>

            <ChallengeStatusView
              challengeObj={bodyParams}
              isSender={checkSenderOrReceiver(bodyParams) === 'sender'}
              isTeam={!!bodyParams?.home_team?.group_name}
              teamName={getTeamName(bodyParams)}
              // receiverName={challengee?.full_name ?? challengee?.group_name}
              offerExpiry={
                ReservationStatus.offered === 'offered' ||
                ReservationStatus.offered === 'changeRequest'
                  ? new Date().getTime()
                  : ''
              } // only if status offered
              status={bodyParams?.status}
            />

            {/* {topButtons()} */}

            {bodyParams?.game_id && (
              <TCArrowView
                title={'Game Home '}
                onPress={() => {
                  console.log('teamObject?.sport', bodyParams);
                  const gameHome = getGameHomeScreen(bodyParams?.sport);
                  console.log('gameHome', gameHome);

                  navigation.navigate(gameHome, {
                    gameId: bodyParams?.game_id,
                  });
                }}
                containerStyle={{
                  marginBottom: 15,
                  justifyContent: 'flex-start',
                  marginLeft: 15,
                }}
              />
            )}

            <TCThinDivider />

            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-between',
                margin: 15,
              }}
            >
              <View style={styles.challengerView}>
                <View style={styles.teamView}>
                  <Image source={images.reqIcon} style={styles.reqOutImage} />
                  <Text style={styles.challengerText}>Challenger</Text>
                </View>

                <View style={styles.teamView}>
                  <View style={styles.profileView}>
                    <Image
                      source={
                        getChallenger()?.thumbnail
                          ? {uri: getChallenger()?.thumbnail}
                          : images.teamPlaceholder
                      }
                      style={styles.profileImage}
                    />
                  </View>
                  <Text style={styles.teamNameText}>
                    {getChallenger()?.group_id
                      ? `${getChallenger()?.group_name}`
                      : `${getChallenger()?.first_name} ${
                          getChallenger()?.last_name
                        }`}
                  </Text>
                </View>
              </View>
              <View style={styles.challengeeView}>
                <View style={styles.teamView}>
                  <Image source={images.reqeIcon} style={styles.reqOutImage} />
                  <Text style={styles.challengeeText}>Challengee</Text>
                </View>

                <View style={styles.teamView}>
                  <View style={styles.profileView}>
                    <Image
                      source={
                        getChallengee()?.thumbnail
                          ? {uri: getChallengee()?.thumbnail}
                          : images.teamPlaceholder
                      }
                      style={styles.profileImage}
                    />
                  </View>
                  <Text style={styles.teamNameText}>
                    {getChallengee()?.group_id
                      ? `${getChallengee()?.group_name}`
                      : `${getChallengee()?.first_name} ${
                          getChallengee()?.last_name
                        }`}
                  </Text>
                </View>
              </View>
            </View>

            <TCThickDivider marginTop={15} />
            <View>
              <TCChallengeTitle
                title={'Home & Away'}
                isEdit={true}
                onEditPress={() => {
                  navigation.navigate('HomeAway', {
                    settingObj: bodyParams,
                    comeFrom: 'AlterChallengeScreen',
                    sportName,
                  });
                }}
              />
              <View style={styles.teamContainer}>
                <Text style={styles.homeLableStyle}>Home</Text>
                <View style={styles.teamViewStyle}>
                  <Image
                    source={
                      bodyParams?.home_team?.thumbnail
                        ? {uri: bodyParams?.home_team?.thumbnail}
                        : bodyParams?.home_team?.user_challenge === true
                        ? images.profilePlaceHolder
                        : images.teamPlaceholder
                    }
                    style={styles.imageView}
                  />

                  <View style={styles.teamTextContainer}>
                    <Text style={styles.teamNameLable}>
                      {bodyParams?.home_team?.full_name ||
                        bodyParams?.home_team?.group_name}
                    </Text>
                    <Text style={styles.locationLable}>
                      {`${bodyParams?.home_team?.city}, ${bodyParams?.home_team?.state_abbr}`}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.teamContainer}>
                <Text style={styles.homeLableStyle}>Away</Text>
                <View style={styles.teamViewStyle}>
                  <Image
                    source={
                      bodyParams?.away_team?.thumbnail
                        ? {uri: bodyParams?.away_team?.thumbnail}
                        : bodyParams?.away_team?.user_challenge === true
                        ? images.profilePlaceHolder
                        : images.teamPlaceholder
                    }
                    style={styles.imageView}
                  />

                  <View style={styles.teamTextContainer}>
                    <Text style={styles.teamNameLable}>
                      {bodyParams?.away_team?.full_name ??
                        bodyParams?.away_team?.group_name}
                    </Text>
                    <Text style={styles.locationLable}>
                      {`${bodyParams?.away_team?.city}, ${bodyParams?.away_team?.state_abbr}`}
                    </Text>
                  </View>
                </View>
              </View>
              <TCThickDivider marginTop={20} />
            </View>

            <TCChallengeTitle
              title={'Game Duration'}
              isEdit={true}
              onEditPress={() => {
                navigation.navigate('GameDuration', {
                  settingObj: bodyParams,
                  comeFrom: 'AlterChallengeScreen',
                  sportName,
                });
              }}
            />
            <TCChallengeTitle
              containerStyle={{marginLeft: 25, marginTop: 15, marginBottom: 5}}
              title={'1st period'}
              titleStyle={{fontSize: 16, fontFamily: fonts.RRegular}}
              value={bodyParams?.game_duration?.first_period}
              valueStyle={{
                fontFamily: fonts.RBold,
                fontSize: 16,
                color: colors.greenColorCard,
                marginRight: 2,
              }}
              staticValueText={'min.'}
            />

            <FlatList
              data={bodyParams?.game_duration?.period}
              renderItem={renderPeriod}
              keyExtractor={(item, index) => index.toString()}
              style={{marginBottom: 15}}
            />
            {bodyParams?.game_duration?.period?.length > 0 && (
              <Text style={styles.normalTextStyle}>
                {strings.gameDurationTitle2}
              </Text>
            )}

            <FlatList
              data={bodyParams?.game_duration?.overtime}
              renderItem={renderOverTime}
              keyExtractor={(item, index) => index.toString()}
              style={{marginBottom: 15}}
            />
            <TCThickDivider marginTop={20} />

            <View>
              <TCChallengeTitle
                title={'Date & Time'}
                isEdit={true}
                onEditPress={() => {
                  navigation.navigate('ChooseTimeSlotScreen', {
                    settingObject: route?.params?.settingObj,
                    comeFrom: 'AlterChallengeScreen',
                  });
                }}
              />

              <View>
                <View style={styles.dateTimeValue}>
                  <Text style={styles.dateTimeText}>Start </Text>
                  <Text style={styles.dateTimeText}>
                    {moment(
                      new Date(
                        route?.params?.startTime ??
                          bodyParams?.start_datetime * 1000,
                      ),
                    ).format('MMM DD, YYYY hh:mm a')}
                  </Text>
                </View>
                <View style={styles.dateTimeValue}>
                  <Text style={styles.dateTimeText}>End </Text>
                  <Text style={styles.dateTimeText}>
                    {moment(
                      new Date(
                        route?.params?.endTime ??
                          bodyParams?.end_datetime * 1000,
                      ),
                    ).format('MMM DD, YYYY hh:mm a')}
                  </Text>
                </View>
                <View style={styles.dateTimeValue}>
                  <Text style={styles.dateTimeText}> </Text>
                  <Text style={styles.timeZoneText}>
                    Time zone{' '}
                    <Text style={{fontFamily: fonts.RRegular}}>Vancouver</Text>
                  </Text>
                </View>
              </View>

              {/* <TouchableOpacity
             onPress={() => {
               navigation.navigate('ChooseTimeSlotScreen');
             }}>
             <View style={[styles.borderButtonView, styles.shadowView]}>
               <View />
               <Text style={styles.detailButtonText}>{'CHOOSE DATE & TIME'}</Text>
               <Image
                 source={images.arrowGraterthan}
                 style={styles.arrowImage}
               />
             </View>
           </TouchableOpacity> */}
              <TCThickDivider marginTop={10} />
            </View>

            <View>
              <TCChallengeTitle
                title={'Venue'}
                isEdit={true}
                onEditPress={() => {
                  navigation.navigate('ChooseVenueScreen', {
                    venues: venueList || [],
                    comeFrom: 'AlterChallengeScreen',
                  });
                }}
              />

              <View style={styles.venueContainer}>
                <Text style={styles.venueTitle}>{bodyParams?.venue?.name}</Text>
                <Text style={styles.venueAddress}>
                  {bodyParams?.venue?.address}
                </Text>

                <EventMapView
                  coordinate={bodyParams?.venue?.coordinate}
                  region={bodyParams?.venue?.region}
                  style={styles.map}
                />
              </View>

              <TCThickDivider marginTop={10} />
            </View>

            <TCChallengeTitle
              title={'Type of Game'}
              value={bodyParams?.game_type}
              tooltipText={
                'The game result has an effect on TC points of the challengee and you.'
              }
              tooltipHeight={hp('6%')}
              tooltipWidth={wp('50%')}
              isEdit={true}
              onEditPress={() => {
                navigation.navigate('GameType', {
                  settingObj: bodyParams,
                  comeFrom: 'AlterChallengeScreen',
                  sportName,
                });
              }}
            />
            <TCThickDivider />

            <TCChallengeTitle
              title={'Match Fee'}
              value={bodyParams?.game_fee?.fee}
              staticValueText={`${bodyParams?.game_fee?.currency_type} /Game`}
              valueStyle={{
                fontFamily: fonts.RBold,
                fontSize: 16,
                color: colors.greenColorCard,
                marginRight: 2,
              }}
              isEdit={true}
              onEditPress={() => {
                navigation.navigate('GameFee', {
                  settingObj: bodyParams,
                  comeFrom: 'AlterChallengeScreen',
                  sportName,
                });
              }}
            />
            <TCThickDivider />

            {Number(bodyParams?.game_fee?.fee) !== 0 &&
              bodyParams?.challenger === authContext.entity.uid && (
                <View>
                  <View>
                    <TCLabel
                      title={'Payment Method'}
                      style={{marginBottom: 10}}
                    />
                    <View style={styles.viewMarginStyle}>
                      <TCTouchableLabel
                        title={
                          defaultCard &&
                          defaultCard?.card?.brand &&
                          defaultCard?.card?.last4
                            ? `${Utility.capitalize(
                                defaultCard?.card?.brand,
                              )} ****${defaultCard?.card?.last4}`
                            : strings.addOptionMessage
                        }
                        showNextArrow={true}
                        onPress={() => {
                          navigation.navigate('PaymentMethodsScreen', {
                            comeFrom: 'AlterChallengeScreen',
                          });
                        }}
                      />
                    </View>
                  </View>
                  <TCThickDivider marginTop={20} />
                </View>
              )}

            <TCChallengeTitle
              title={'Game Rules'}
              isEdit={true}
              onEditPress={() => {
                navigation.navigate('GameRules', {
                  settingObj: bodyParams,
                  comeFrom: 'AlterChallengeScreen',
                  sportName,
                });
              }}
            />
            <Text style={styles.rulesTitle}>General Rules</Text>
            <Text style={styles.rulesDetail}>{bodyParams?.general_rules}</Text>
            <View style={{marginBottom: 10}} />
            <Text style={styles.rulesTitle}>Special Rules</Text>
            <Text style={styles.rulesDetail}>{bodyParams?.special_rules}</Text>
            <TCThickDivider marginTop={20} />
          </View>

          <View>
            {/* <TCChallengeTitle
          title={'Referees'}
          value={bodyParams?.responsible_for_referee?.who_secure?.length}
          staticValueText={'Referees'}
          valueStyle={{
            fontFamily: fonts.RBold,
            fontSize: 16,
            color: colors.greenColorCard,
            marginRight: 2,
          }}
          isEdit={true}
          onEditPress={() => {
            navigation.navigate('RefereesSetting', {
              settingObj: bodyParams,
              comeFrom: 'AlterChallengeScreen',
              sportName,
            });
          }}
        />

            <FlatList
          data={bodyParams?.responsible_for_referee?.who_secure}
          renderItem={renderReferees}
          keyExtractor={(item, index) => index.toString()}
          ItemSeparatorComponent={() => <View style={{ margin: 5 }} />}
          style={{ marginBottom: 15 }}
        /> */}

            <RefereeAgreementView
              teamA={getChallenger()?.group_name ?? getChallenger()?.full_name}
              teamB={getChallengee()?.group_name ?? getChallengee()?.full_name}
              numberOfReferee={
                bodyParams?.responsible_for_referee?.who_secure?.length ?? 0
              }
              agreementOpetion={bodyParams?.min_referee === 0 ? 1 : 2}
              moreButtonVisible={true}
              morePressed={(value) => {
                setMoreButtonReferee(value);
              }}
              isMore={moreButtonReferee}
              isEdit={true}
              onEditPress={() => {
                navigation.navigate('RefereesSetting', {
                  settingObj: bodyParams,
                  comeFrom: 'AlterChallengeScreen',
                  sportName,
                });
              }}
            />

            <TCThickDivider />

            {/* <TCChallengeTitle
          title={'Scorekeepers'}
          value={bodyParams?.responsible_for_scorekeeper?.who_secure?.length}
          staticValueText={'Scorekeepers'}
          valueStyle={{
            fontFamily: fonts.RBold,
            fontSize: 16,
            color: colors.greenColorCard,
            marginRight: 2,
          }}
          isEdit={true}
          onEditPress={() => {
            navigation.navigate('ScorekeepersSetting', {
              settingObj: bodyParams,
              comeFrom: 'AlterChallengeScreen',
              sportName,
            });
          }}
        />
            <FlatList
          data={bodyParams?.responsible_for_scorekeeper?.who_secure}
          renderItem={renderScorekeepers}
          keyExtractor={(item, index) => index.toString()}
          ItemSeparatorComponent={() => <View style={{ margin: 5 }} />}
          style={{ marginBottom: 15 }}
        /> */}

            <ScorekeeperAgreementView
              teamA={getChallenger()?.group_name ?? getChallenger()?.full_name}
              teamB={getChallengee()?.group_name ?? getChallengee()?.full_name}
              numberOfScorekeeper={
                bodyParams?.responsible_for_scorekeeper?.who_secure?.length ?? 0
              }
              agreementOpetion={bodyParams?.min_scorekeeper === 0 ? 1 : 2}
              moreButtonVisible={true}
              morePressed={(value) => {
                setMoreButtonScorekeeper(value);
              }}
              isMore={moreButtonScorekeeper}
              isEdit={true}
              onEditPress={() => {
                navigation.navigate('ScorekeepersSetting', {
                  settingObj: bodyParams,
                  comeFrom: 'AlterChallengeScreen',
                  sportName,
                });
              }}
            />

            <TCThickDivider />

            <TCChallengeTitle
              title={
                bodyParams?.challenger === entity.uid ? 'Payment' : 'Earning'
              }
              isEdit={false}
              onEditPress={() => {
                navigation.navigate('EditFeeScreen', {
                  editableAlter: true,
                  body: bodyParams,
                });
              }}
            />
            <GameFeeCard
              feeObject={
                feeObj ?? {
                  total_game_fee: bodyParams?.total_game_fee,
                  total_service_fee1: bodyParams?.total_service_fee1,
                  total_service_fee2: bodyParams?.total_service_fee2,
                  international_card_fee: bodyParams?.international_card_fee,
                  total_stripe_fee: bodyParams?.total_stripe_fee,
                  total_payout: bodyParams?.total_payout,
                  total_amount: bodyParams?.total_amount,
                }
              }
              currency={bodyParams?.game_fee?.currency_type}
              isChallenger={bodyParams?.challenger === entity.uid}
            />
            <TCThickDivider marginTop={20} />
          </View>

          {/* <TCGradientButton
         title={strings.sendAlterRequest}
         onPress={() => {
           // navigation.push('ChallengePaymentScreen');
           // navigation.push('InviteToChallengeSentScreen');
           sendChallengeInvitation();
         }}
         outerContainerStyle={{
           marginBottom: 45,
           width: '92%',
           alignSelf: 'center',
           marginTop: 15,
         }}
       /> */}
          <TCChallengeTitle
            title={'Refund Policy'}
            value={bodyParams?.refund_policy}
            tooltipText={
              '-Cancellation 24 hours in advance- Free cancellation until 24 hours before the game starting time.  -Cancellation less than 24 hours in advance-If the challenge sender cancels  less than 24 hours before the game starting time the match fee and service fee are not refunded.'
            }
            tooltipHeight={hp('18%')}
            tooltipWidth={wp('50%')}
            isEdit={false}
            onEditPress={() => {
              navigation.navigate('RefundPolicy', {
                settingObj: bodyParams,
                comeFrom: 'AlterChallengeScreen',
                sportName,
              });
            }}
          />

          <TCThickDivider />
          <SafeAreaView>{bottomButtonView()}</SafeAreaView>
        </View>
      )}

      <SafeAreaView>
        {maintabNumber === 1 && (
          <CurruentReservationView reservationObj={oldVersion} />
        )}
      </SafeAreaView>

      <Modal
        isVisible={alterModalVisible}
        backdropColor="black"
        //   onBackdropPress={backdropPress}
        //   onRequestClose={onClose}
        backdropOpacity={0.5}
        style={{
          margin: 0,
          marginTop: 50,
          backgroundColor: 'rgba(0,0,0,0.5)',
          borderTopLeftRadius: 15,
          borderTopRightRadius: 15,
        }}
      >
        <View style={styles.mainContainer}>
          <Image style={styles.background} source={images.orangeLayer} />
          <Image style={styles.background} source={images.entityCreatedBG} />

          <View style={styles.mailContainer}>
            <Text style={styles.invitationText}>
              {'Alteration request\nsent'}
            </Text>
            <View style={styles.imageContainer}>
              <Image
                source={images.challengeSentPlane}
                style={styles.rotateImage}
              />
            </View>
          </View>

          <SafeAreaView>
            <TouchableOpacity
              style={styles.goToProfileButton}
              onPress={() => {
                setAlterModalVisible(false);
                navigation.popToTop();
              }}
            >
              <Text style={styles.goToProfileTitle}>OK</Text>
            </TouchableOpacity>
          </SafeAreaView>
        </View>
      </Modal>
    </TCKeyboardView>
  );
}

const styles = StyleSheet.create({
  teamContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 15,
    marginRight: 15,
  },
  homeLableStyle: {
    flex: 0.14,
    margin: 15,
    marginRight: 20,
    fontFamily: fonts.RRegular,
    fontSize: 16,
    color: colors.lightBlackColor,
  },
  teamViewStyle: {
    flex: 0.86,
    flexDirection: 'row',
    alignItems: 'center',
  },

  imageView: {
    height: 40,
    width: 40,
    resizeMode: 'cover',
    borderRadius: 20,
    shadowColor: colors.googleColor,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.4,
    shadowRadius: 1,
  },

  teamNameLable: {
    fontFamily: fonts.RMedium,
    fontSize: 16,
    color: colors.lightBlackColor,
  },
  locationLable: {
    fontFamily: fonts.RLight,
    fontSize: 14,
    color: colors.lightBlackColor,
  },
  teamTextContainer: {
    marginLeft: 20,
  },

  venueTitle: {
    fontFamily: fonts.RMedium,
    fontSize: 16,
    color: colors.lightBlackColor,

    marginBottom: 5,
  },
  rulesTitle: {
    fontFamily: fonts.RMedium,
    fontSize: 16,
    color: colors.lightBlackColor,
    marginLeft: 15,
    marginBottom: 5,
  },
  dateTimeText: {
    fontFamily: fonts.RRegular,
    fontSize: 16,
    color: colors.lightBlackColor,
    marginLeft: 15,
    marginBottom: 5,
  },
  timeZoneText: {
    fontFamily: fonts.RLight,
    fontSize: 14,
    color: colors.lightBlackColor,
  },
  rulesDetail: {
    fontFamily: fonts.RRegular,
    fontSize: 16,
    color: colors.lightBlackColor,
    marginLeft: 15,
    marginRight: 15,
  },

  normalTextStyle: {
    marginLeft: 25,
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
  },
  dateTimeValue: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 25,
    marginBottom: 10,
    marginLeft: 15,
    marginTop: 0,
  },

  venueAddress: {
    fontFamily: fonts.RRegular,
    fontSize: 16,
    color: colors.lightBlackColor,
  },
  venueContainer: {
    marginLeft: 15,
    marginRight: 15,
  },

  challengeNumberStyle: {
    fontSize: 12,
    fontFamily: fonts.RLight,
    color: colors.lightBlackColor,
    alignSelf: 'flex-end',
    margin: 15,
    marginTop: 0,
    marginBottom: 0,
  },
  bottomButtonView: {
    marginTop: 15,
    marginBottom: 15,
    height: 95,
    justifyContent: 'space-between',
  },

  mainContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  background: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    resizeMode: 'stretch',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  goToProfileButton: {
    alignSelf: 'center',
    borderColor: colors.whiteColor,
    borderRadius: 40,
    borderWidth: 1,
    height: 45,

    width: '92%',
  },
  goToProfileTitle: {
    color: colors.whiteColor,
    fontFamily: fonts.RBold,
    fontSize: 15,
    height: 50,
    padding: 12,
    textAlign: 'center',
  },
  mailContainer: {
    alignSelf: 'center',
    justifyContent: 'center',
    flex: 1,
    alignItems: 'center',
  },
  invitationText: {
    fontSize: 25,
    fontFamily: fonts.RBold,
    color: colors.whiteColor,
    textAlign: 'center',
    marginBottom: 20,
  },

  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  rotateImage: {
    width: 230,
    height: 150,
    resizeMode: 'contain',
  },

  challengerView: {
    marginRight: 15,
    flex: 0.5,
  },
  challengeeView: {
    flex: 0.5,
  },
  profileImage: {
    alignSelf: 'center',
    height: 38,
    width: 38,
    borderRadius: 76,
  },
  teamNameText: {
    marginLeft: 5,
    fontFamily: fonts.RMedium,
    fontSize: 16,
    color: colors.lightBlackColor,
    width: '80%',
  },
  reqOutImage: {
    width: 20,
    height: 20,
    resizeMode: 'cover',
    marginRight: 5,
  },
  teamView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
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
});
