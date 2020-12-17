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
import { useIsFocused } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import {
  acceptDeclineAlterChallenge,
  acceptDeclineChallenge,
  getFeesEstimation,
  updateChallenge,
} from '../../../api/Challenge';
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

let entity = {};

export default function AlterAcceptDeclineScreen({ navigation, route }) {
  const authContext = useContext(AuthContext);

  const isFocused = useIsFocused();
  const [loading, setloading] = useState(false);
  const [homeTeam, setHomeTeam] = useState();
  const [awayTeam, setAwayTeam] = useState();
  const [bodyParams, setbodyParams] = useState();

  const [editRules, setEditRules] = useState(false);
  const [editVenue, setEditVenue] = useState(false);
  const [editReferee, setEditReferee] = useState(false);
  const [editScorekeeper, setEditScoreKeeper] = useState(false);
  const [oldVersion, setOldVersion] = useState();
  const [editInfo, setEditInfo] = useState(false);
  const [editPayment, setEditPayment] = useState(false);
  const [isPendingRequestPayment, setIsPendingRequestPayment] = useState()
  const [isOld, setIsOld] = useState(false);

  useEffect(() => {
    entity = authContext.entity;
    console.log('useEffect called Alter  .....:');
    const { challengeObj } = route.params ?? {};
    if (challengeObj.length > 0) {
      setIsPendingRequestPayment(true)
      for (let i = 0; i < challengeObj.length; i++) {
        if (challengeObj[i].status === ReservationStatus.accepted) {
          if (isOld === false) {
            setbodyParams(challengeObj[0]);
            setOldVersion(challengeObj[i]);
            setIsOld(true);
          } else {
            setbodyParams(challengeObj[0]);
          }
          sectionEdited();

          if ((challengeObj[0]?.away_team?.group_id ?? challengeObj[0]?.away_team?.user_id) === entity.uid) {
            setHomeTeam(challengeObj[0].away_team);
            setAwayTeam(challengeObj[0].home_team);
          } else {
            setHomeTeam(challengeObj[0].home_team);
            setAwayTeam(challengeObj[0].away_team);
          }
          break
        }
      }
    } else {
      if (isOld === false) {
        setbodyParams(challengeObj);
        // oldVersion = { ...body };
        setOldVersion(challengeObj);
        setIsOld(true);
      } else {
        setbodyParams(challengeObj);
      }
      sectionEdited();

      if ((challengeObj?.away_team?.group_id ?? challengeObj?.away_team?.user_id) === entity.uid) {
        setHomeTeam(challengeObj.away_team);
        setAwayTeam(challengeObj.home_team);
      } else {
        setHomeTeam(challengeObj.home_team);
        setAwayTeam(challengeObj.away_team);
      }
    }
  }, [isFocused]);

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
        console.log('secure venue changed');
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
        ((bodyParams?.home_team?.group_id !== oldVersion?.home_team?.group_id) || (bodyParams?.home_team?.user_id !== oldVersion?.home_team?.user_id))
        || ((bodyParams?.away_team?.group_id !== oldVersion?.away_team?.group_id) || (bodyParams?.away_team?.user_id !== oldVersion?.away_team?.user_id))
        || bodyParams?.start_datetime !== oldVersion?.start_datetime
        || bodyParams?.end_datetime !== oldVersion?.end_datetime
        || bodyParams?.venue?.address !== oldVersion?.venue?.address
      ) {
        setEditInfo(true);
      } else {
        setEditInfo(false);
      }
      if (bodyParams.total_game_charges !== oldVersion.total_game_charges) {
        setEditPayment(true);
        getFeesEstimationDetail()
      } else {
        setEditPayment(false);
      }
    }
  };
  const getFeesEstimationDetail = () => {
    const body = {};
    body.start_datetime = bodyParams.start_datetime / 1000;
    body.end_datetime = bodyParams.end_datetime / 1000;
    body.currency_type = 'CAD';
    body.payment_method_type = 'card';
    body.manual_fee = bodyParams.manual_fee;
    if (bodyParams.manual_fee) {
      body.total_game_charges = bodyParams.total_game_charges;
    }

    console.log('Body data of fee:', body);

    setloading(true);
    getFeesEstimation(
      bodyParams.invited_by === (bodyParams?.home_team?.group_id || bodyParams?.home_team?.user_id)
        ? bodyParams?.away_team?.group_id || bodyParams?.away_team?.user_id
        : bodyParams?.home_team?.group_id || bodyParams?.home_team?.user_id,
      body,
      authContext,
    )
      .then((response) => {
        setloading(false);
        console.log('fee data :', response.payload);

        setbodyParams({
          ...bodyParams,
          total_game_charges: response.payload.total_game_fee,
          total_charges: response.payload.total_amount,
          total_payout: response.payload.total_payout,
          service_fee1_charges: response.payload.total_service_fee1,
          service_fee2_charges: response.payload.total_service_fee2,
        })

        // total_stripe_fee

        // if (route && route.params && route.params.body) {
        //   body = route.params.body;
        //   body.total_payout = response.payload.total_payout;
        //   body.service_fee1_charges = response.payload.total_service_fee1;
        //   body.service_fee2_charges = response.payload.total_service_fee2;
        //   body.total_charges = response.payload.total_amount;
        //   body.total_game_charges = response.payload.total_game_fee;
        //   body.hourly_game_fee = 0;
        //   body.currency_type = 'CAD';
        //   body.payment_method_type = 'card';
        // }
        // console.log('fee BODY :', body);
        // setPaymentInfo(response.payload)
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

        if (status === 'accept') {
          navigation.navigate('ChallengeAcceptedDeclinedScreen', {
            teamObj: awayTeam,
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

  const acceptDeclineAlterChallengeOperation = (
    teamID,
    ChallengeId,
    versionNo,
    status,
  ) => {
    setloading(true);
    acceptDeclineAlterChallenge(
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

        if (status === 'accept') {
          navigation.navigate('ChallengeAcceptedDeclinedScreen', {
            teamObj: awayTeam,
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

  const getDateFormat = (dateValue) => {
    moment.locale('en');
    return moment(new Date(dateValue)).format('MMM DD, yy hh:mm a');
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
    if (!oldVersion.referee.includes(item)) {
      console.log('Orange');
      return `${colors.themeColor}`;
    }
    console.log('Black');
    return `${colors.lightBlackColor}`;
  };

  const checkScorekeeperColor = (item) => {
    if (!oldVersion.scorekeeper.includes(item)) {
      console.log('Orange');
      return `${colors.themeColor}`;
    }
    console.log('Black');
    return `${colors.lightBlackColor}`;
  };
  const renderSecureReferee = ({ item, index }) => (
    <TCInfoImageField
      title={
        index === 0 ? `Referee ${index + 1} (Chief)` : `Referee ${index + 1}`
      }
      name={
        homeTeam
        && awayTeam
        && ((item.responsible_team_id === 'none' && 'None')
          || (item.responsible_team_id === (homeTeam?.group_id || homeTeam?.user_id)
            ? homeTeam?.group_name || `${homeTeam?.first_name} ${homeTeam?.last_name}`
            : awayTeam?.group_name || `${awayTeam?.first_name} ${awayTeam?.last_name}`))
      }
      marginLeft={30}
      color={checkRefereeColor(item)}
    />
  );

  const renderSecureScorekeeper = ({ item, index }) => (
    <TCInfoImageField
      title={`Scorekeeper ${index + 1}`}
      name={
        homeTeam
        && awayTeam
        && ((item.responsible_team_id === 'none' && 'None')
          || (item.responsible_team_id === (homeTeam?.group_id || homeTeam?.user_id)
            ? homeTeam?.group_name || `${homeTeam?.first_name} ${homeTeam?.last_name}`
            : awayTeam?.group_name || `${awayTeam?.first_name} ${awayTeam?.last_name}`))
      }
      marginLeft={30}
      color={checkScorekeeperColor(item)}
    />
  );

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
    if (challengeObj.updated_by.uid === entity.uid) {
      return 'sender';
    }
    return 'receiver';
  };
  const updateChallengeDetail = () => {
    setloading(true)
    const challengeID = bodyParams.challenge_id;
    delete bodyParams.created_at;
    delete bodyParams.created_by;
    delete bodyParams.entity_id;
    delete bodyParams.entity_type;
    delete bodyParams.offer_expiry;
    delete bodyParams.status;
    delete bodyParams.challenge_id;
    delete bodyParams.userChallenge;
    delete bodyParams.game_id;
    delete bodyParams.change_requested_by;
    delete bodyParams.updated_by;
    delete bodyParams.updated_at;
    delete bodyParams.version;
    delete bodyParams.reservations;
    const home_id = bodyParams?.home_team?.group_id ?? bodyParams.home_team.user_id;
    const away_id = bodyParams?.away_team?.group_id ?? bodyParams.away_team.user_id;
    delete bodyParams.home_team;
    delete bodyParams.away_team;
    bodyParams.home_team = home_id;
    bodyParams.away_team = away_id;

    // setbodyParams({ ...bodyParams });

    console.log('FINAL BODY PARAMS::', bodyParams);
    updateChallenge(challengeID, bodyParams, authContext).then((response) => {
      setloading(false)
      console.log('response of alter challenge::', response.payload);
      navigation.navigate('AlterRequestSent')
    }).catch((e) => {
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
  // const getDayTimeDifferent = (sDate, eDate) => {
  //   let delta = Math.abs(new Date(sDate).getTime() - new Date(eDate).getTime()) / 1000;

  //   const days = Math.floor(delta / 86400);
  //   delta -= days * 86400;

  //   const hours = Math.floor(delta / 3600) % 24;
  //   delta -= hours * 3600;

  //   const minutes = Math.floor(delta / 60) % 60;
  //   delta -= minutes * 60;

  //   return `${days}d ${hours}h ${minutes}m`;
  // };
  const getPendingRequestPaymentMessage = () => {
    if (bodyParams.change_requested_by === entity.uid) {
      return `${getTeamName(bodyParams)} has accepted your game reservation alteration request, but `
    }

    return `Your team has accepted a game reservation alteration request from ${getTeamName(bodyParams)}, but `
  }
  return (
    <TCKeyboardView>
      <ActivityLoader visible={loading} />
      {homeTeam && awayTeam && bodyParams && (
        <View>
          {!isPendingRequestPayment && <TouchableOpacity onPress={() => console.log('OK')}>
            <LinearGradient
              colors={[colors.yellowColor, colors.themeColor]}
              style={styles.containerStyle}>
              <Text style={styles.buttonText}>
                Please edit the reservation details below before you send the
                alteration request.
              </Text>
            </LinearGradient>
          </TouchableOpacity>}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginLeft: 15,
              marginRight: 15,
            }}>
            <ReservationNumber reservationNumber={bodyParams.challenge_id}/>
            <CurruentVersionView
              onPress={() => {
                navigation.navigate('CurruentReservationScreen', {
                  body: oldVersion,
                });
              }}
            />
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
                  {bodyParams.invited_by === (bodyParams?.home_team?.group_id ?? bodyParams?.home_team?.user_id)
                    ? bodyParams?.home_team?.group_name || `${bodyParams?.home_team?.first_name} ${bodyParams?.home_team?.last_name}`
                    : bodyParams?.away_team?.group_name || `${bodyParams?.away_team?.first_name} ${bodyParams?.away_team?.last_name}`}
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
                  {bodyParams.invited_by === (bodyParams?.home_team?.group_id ?? bodyParams?.home_team?.user_id)
                    ? bodyParams?.away_team?.group_name || `${bodyParams?.away_team?.first_name} ${bodyParams?.away_team?.last_name}`
                    : bodyParams?.home_team?.group_name || `${bodyParams?.home_team?.first_name} ${bodyParams?.home_team?.last_name}`}
                </Text>
              </View>
            </View>
          </View>
          {/* status change requested */}
          {checkSenderOrReceiver(bodyParams) === 'sender'
            && bodyParams.status === ReservationStatus.changeRequest && (
              <View>
                <Text style={styles.challengeMessage}>ALTEARION REQUEST SENT</Text>
                <Text style={styles.challengeText}>
                  You sent a match reservation alteration request to {getTeamName(bodyParams)}.
                </Text>

              </View>
          )}
          {checkSenderOrReceiver(bodyParams) === 'receiver'
            && bodyParams.status === ReservationStatus.changeRequest && (
              <View>
                <Text style={styles.challengeMessage}>ALTERATION REQUEST PENDING</Text>
                <Text style={styles.challengeText}>
                  You received a match reservation alteration request from {getTeamName(bodyParams)}.
                </Text>
              </View>
          )}
          {/* status change requested */}

          {/* status pending request payment */}
          {checkSenderOrReceiver(bodyParams) === 'sender'
            && bodyParams.status === ReservationStatus.pendingrequestpayment && (
              <View>
                <Text style={styles.challengeMessage}>AWAITING PAYMENT</Text>
                <Text style={styles.challengeText}>
                  {getPendingRequestPaymentMessage()}your payment hasnt gone through yet.
                </Text>
                <Text style={styles.awatingNotesText}>
                  {`The accepted alteration won't be applied to the current reservation unless the payment goes through within ${getDayTimeDifferent(
                    bodyParams.offer_expiry * 1000,
                    new Date().getTime(),
                  )}
                  \n Meanwhile, ${getTeamName(bodyParams)} can cancel acceptance of the alteration request before the payment is completed.`}
                </Text>

              </View>
          )}
          {checkSenderOrReceiver(bodyParams) === 'receiver'
            && bodyParams.status === ReservationStatus.pendingrequestpayment && (
              <View>
                <Text style={styles.challengeMessage}>AWAITING PAYMENT</Text>
                <Text style={styles.challengeText}>
                  {getPendingRequestPaymentMessage()}the payment hasnt gone through yet.
                </Text>
                <Text style={styles.awatingNotesText}>
                  {`The accepted alteration won't be applied to the current reservation unless the payment goes through within ${getDayTimeDifferent(
                    bodyParams.offer_expiry * 1000,
                    new Date().getTime(),
                  )}
                  \n Meanwhile, you can cancel acceptance of the alteration request before the payment will go through.`}
                </Text>
              </View>
          )}
          {/* status pending request payment */}

          {checkSenderOrReceiver(bodyParams) === 'sender'
            && bodyParams.status === ReservationStatus.pendingrequestpayment && (
              <TCGradientButton
                title={'TRY TO PAY AGAIN'}
                onPress={() => {
                  console.log('OK PAYMENT');
                }}
                marginBottom={15}
              />
          )}
          {checkSenderOrReceiver(bodyParams) === 'receiver'
            && bodyParams.status === ReservationStatus.pendingrequestpayment && (
              <TCGradientButton
                title={'RESTORE TO PREVIOUS VERSION'}
                onPress={() => {
                  console.log('OK PAYMENT');
                }}
                marginBottom={15}
              />
          )}
          {(bodyParams.status === ReservationStatus.changeRequest) && (
            <TCBorderButton
              title={'GAME HOME'}
              onPress={() => navigation.navigate('SoccerHome', {
                gameId: bodyParams.game_id,
              })
              }
              marginBottom={15}
            />
          )}
          <TCThickDivider />
          {bodyParams && (
            <View>
              <View style={styles.editableView}>
                <TCLabel
                  title={`Match · ${bodyParams.sport}`}
                  isNew={editInfo}
                />
                {!isPendingRequestPayment && <TouchableOpacity
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
                </TouchableOpacity>}
              </View>
              <TCInfoImageField
                title={'Home'}
                name={bodyParams?.home_team?.group_name || `${bodyParams?.home_team?.first_name} ${bodyParams?.home_team?.last_name}`}
                marginLeft={30}
                color={
                  ((bodyParams?.home_team?.group_name
                  === oldVersion?.home_team?.group_name) || (`${bodyParams?.home_team?.first_name} ${bodyParams?.home_team?.last_name}`
                    === `${oldVersion?.home_team?.first_name} ${oldVersion?.home_team?.last_name}`))
                    ? colors.lightBlackColor
                    : colors.themeColor
                }
              />
              <TCThinDivider />
              <TCInfoImageField
                title={'Away'}
                name={bodyParams?.away_team?.group_name || `${bodyParams?.away_team?.first_name} ${bodyParams?.away_team?.last_name}`}
                marginLeft={30}
                color={
                  ((bodyParams?.away_team?.group_name
                  === oldVersion?.away_team?.group_name) || (`${bodyParams?.away_team?.first_name} ${bodyParams?.away_team?.last_name}`
                  === `${oldVersion?.away_team?.first_name} ${oldVersion?.away_team?.last_name}`))
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
              {editInfo && <CurruentVersionView onPress={() => {
                navigation.navigate('CurruentReservationScreen', {
                  body: oldVersion,
                });
              }}/>}
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
                {!isPendingRequestPayment && <TouchableOpacity
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
                </TouchableOpacity>}
              </View>

              <View style={styles.viewContainer}>
                <View style={styles.fieldValue}>
                  <Image
                    source={
                      // eslint-disable-next-line no-nested-ternary
                      ((bodyParams?.home_team?.group_name || `${bodyParams?.home_team?.first_name} ${bodyParams?.home_team?.last_name}`)
                      === bodyParams?.responsible_to_secure_venue)
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
              {editVenue && <CurruentVersionView onPress={() => {
                navigation.navigate('CurruentReservationScreen', {
                  body: oldVersion,
                });
              }}/>}

              <TCThickDivider marginTop={20} />
            </View>
          )}
          {bodyParams && (
            <View>
              <View style={styles.editableView}>
                <TCLabel title={'Rules'} isNew={editRules} />
                {!isPendingRequestPayment && <TouchableOpacity
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
                </TouchableOpacity>}
              </View>
              <Text
                style={
                  editRules
                    ? [styles.rulesText, { color: colors.themeColor }]
                    : styles.rulesText
                }>
                {bodyParams.special_rule}
              </Text>
              {editRules && <CurruentVersionView onPress={() => {
                navigation.navigate('CurruentReservationScreen', {
                  body: oldVersion,
                });
              }}/>}
            </View>
          )}
          <TCThickDivider marginTop={20} />
          <View>
            <View style={styles.editableView}>
              <TCLabel
                title={'Responsibility to Secure Referees'}
                isNew={editReferee}
              />
              {!isPendingRequestPayment && <TouchableOpacity
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
                <Image source={images.editSection} style={styles.editButton} />
              </TouchableOpacity>}
            </View>
            {bodyParams && (
              <FlatList
                data={bodyParams.referee}
                renderItem={renderSecureReferee}
                keyExtractor={(item, index) => index.toString()}
                ItemSeparatorComponent={() => <TCThinDivider />}
              />
            )}
            {editReferee && <CurruentVersionView onPress={() => {
              navigation.navigate('CurruentReservationScreen', {
                body: oldVersion,
              });
            }}/>}
          </View>
          <TCThickDivider marginTop={10} />
          <View>
            <View style={styles.editableView}>
              <TCLabel
                title={'Responsibility to Secure ScoreKeeper'}
                isNew={editScorekeeper}
              />
              {!isPendingRequestPayment && <TouchableOpacity
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
                <Image source={images.editSection} style={styles.editButton} />
              </TouchableOpacity>}
            </View>
            {bodyParams && (
              <FlatList
                data={bodyParams.scorekeeper}
                renderItem={renderSecureScorekeeper}
                keyExtractor={(item, index) => index.toString()}
                ItemSeparatorComponent={() => <TCThinDivider />}
              />
            )}
            {editScorekeeper && <CurruentVersionView onPress={() => {
              navigation.navigate('CurruentReservationScreen', {
                body: oldVersion,
              });
            }}/>}
          </View>
          <TCThickDivider marginTop={10} />
          <View style={styles.editableView}>
            <TCLabel
              title={
                checkSenderOrReceiver(bodyParams) === 'sender'
                  ? 'Payment'
                  : 'Earning'
              }
              isNew={editPayment}
            />
            {!isPendingRequestPayment && <TouchableOpacity
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
            </TouchableOpacity>}
          </View>

          <MatchFeesCard
            challengeObj={bodyParams}
            senderOrReceiver={
              checkSenderOrReceiver(bodyParams) === 'sender'
                ? 'sender'
                : 'receiver'
            }
          />

          {editPayment && (
            <View style={{ marginTop: 15 }}>
              <Text
                style={styles.differenceText}>
                Difference{' '}
                <Text
                  style={styles.differenceSmallText}>
                  (New payment - Current payment)
                </Text>
              </Text>
              <View
                style={styles.differeceView}>
                <Text style={styles.differenceTextTitle}>Difference</Text>
                <Text style={styles.diffenceAmount}>{'$10 CAD'}</Text>
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
                    acceptDeclineAlterChallengeOperation(
                      entity.uid,
                      bodyParams.challenge_id,
                      bodyParams.version,
                      'decline',
                    );
                  }}
                />
              </View>
          )}

          {checkSenderOrReceiver(bodyParams) === 'sender' && !isPendingRequestPayment && (
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
                  if (editInfo || editVenue || editRules || editReferee || editScorekeeper || editPayment) {
                    updateChallengeDetail();
                  } else {
                    Alert.alert('Please modify atleast one field for alter request.')
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
          {(bodyParams.status === ReservationStatus.changeRequest || bodyParams.status === ReservationStatus.pendingrequestpayment) && (
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
                  if (
                    (bodyParams.game_status === GameStatus.accepted
                      || bodyParams.game_status === GameStatus.reset)
                    && bodyParams.start_datetime * 1000 > new Date().getTime()
                  ) {
                    acceptDeclineChallengeOperation(
                      entity.uid,
                      bodyParams.challenge_id,
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
    marginLeft: 15, alignSelf: 'center', fontFamily: fonts.RRegular, fontSize: 15, color: colors.lightBlackColor,
  },
  diffenceAmount: {
    marginRight: 15, alignSelf: 'center', fontFamily: fonts.RMedium, fontSize: 15, color: colors.themeColor,
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
});
