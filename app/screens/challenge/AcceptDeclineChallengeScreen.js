/* eslint-disable react/no-unescaped-entities */
import React, { useEffect, useState, useContext } from 'react';
import {
  StyleSheet, View, Text, Image, FlatList, Alert,
} from 'react-native';
import moment from 'moment';
import { useIsFocused, useFocusEffect } from '@react-navigation/native';
import { acceptDeclineChallenge } from '../../api/Challenge';
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
import TCInfoImageField from '../../components/TCInfoImageField';
import TCInfoField from '../../components/TCInfoField';
import EventMapView from '../../components/Schedule/EventMapView';
import ReservationStatus from '../../Constants/ReservationStatus';
import GameStatus from '../../Constants/GameStatus';
import TCBorderButton from '../../components/TCBorderButton';
import MatchFeesCard from '../../components/challenge/MatchFeesCard';
import ReservationNumber from '../../components/reservations/ReservationNumber';
import { getGameHomeScreen } from '../../utils/gameUtils';
import TCGameDetailRules from '../../components/TCGameDetailRules';

let entity = {};
let timer;
export default function AcceptDeclineChallengeScreen({ navigation, route }) {
  const authContext = useContext(AuthContext);

  const isFocused = useIsFocused();
  const [loading, setloading] = useState(false);
  const [homeTeam, setHomeTeam] = useState();
  const [awayTeam, setAwayTeam] = useState();
  const [bodyParams, setbodyParams] = useState();
  const [countDown, setCountDown] = useState();

  useEffect(() => {
    entity = authContext.entity;
    const { challengeObj } = route.params ?? {};
    setbodyParams(challengeObj);
    // getChallengeDetail(challengeObj.challenge_id);
    if ((challengeObj.away_team.group_id || challengeObj.away_team.user_id) === entity.uid) {
      setHomeTeam(challengeObj.away_team);
      setAwayTeam(challengeObj.home_team);
    } else {
      setHomeTeam(challengeObj.home_team);
      setAwayTeam(challengeObj.away_team);
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
        if (bodyParams.status === ReservationStatus.pendingpayment) {
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

        if (status === 'accept') {
          navigation.push('ChallengeAcceptedDeclinedScreen', {
            teamObj: { ...awayTeam, game_id: response?.payload?.game_id ?? bodyParams?.game_id, sport: bodyParams.sport },
            status: 'accept',
          });
        } else if (status === 'decline') {
          navigation.push('ChallengeAcceptedDeclinedScreen', {
            teamObj: awayTeam,
            status: 'decline',
          });
        } else if (status === 'cancel') {
          navigation.push('ChallengeAcceptedDeclinedScreen', {
            teamObj: awayTeam,
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
  const singlePlayerText = () => {
    if (bodyParams?.sport?.toLowerCase() === 'tennis') {
      return 'You'
    }

    return 'Your team'
  }
  // const getChallengeDetail = (challengeID) => {
  //   getChallenge(challengeID, authContext)
  //     .then((response) => {
  //       setbodyParams(response.payload[0]);
  //       console.log(JSON.stringify(response.payload));
  //       setloading(false);
  //       if (response.payload[0].away_team.group_id === entity.uid) {
  //         setHomeTeam(response.payload[0].away_team);
  //         setAwayTeam(response.payload[0].home_team);
  //         console.log('HOME::', homeTeam);
  //       } else {
  //         setHomeTeam(response.payload[0].home_team);
  //         setAwayTeam(response.payload[0].away_team);
  //         console.log('HOME::', homeTeam);
  //         console.log('AWAY::', awayTeam);
  //       }
  //     })
  //     .catch((e) => {
  //       setloading(false);
  //       setTimeout(() => {
  //         Alert.alert(strings.alertmessagetitle, e.message);
  //       }, 0.7);
  //     });
  // };

  const getDateFormat = (dateValue) => {
    moment.locale('en');
    return moment(new Date(dateValue)).format('MMM DD, yy hh:mm a');
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
          || (item.responsible_team_id === (homeTeam.group_id ?? homeTeam.user_id)
            ? homeTeam.group_name || `${homeTeam.first_name} ${homeTeam.last_name}`
            : awayTeam.group_name || `${awayTeam.first_name} ${awayTeam.last_name}`))
      }
      marginLeft={30}
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
          || (item.responsible_team_id === (homeTeam.group_id ?? homeTeam.user_id)
            ? homeTeam.group_name || `${homeTeam.first_name} ${homeTeam.last_name}`
            : awayTeam.group_name || `${awayTeam.first_name} ${awayTeam.last_name}`))
      }
      marginLeft={30}
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
      if (challengeObj.status === ReservationStatus.offered) {
        if (entity.uid === bodyParams.created_by.group_id) {
          return 'sender';
        }
        return 'receiver';
      }

      if (challengeObj.updated_by.group_id === entity.uid) {
        return 'sender';
      }
      return 'receiver';
      // if (challengeObj.change_requested_by === entity.uid) {
      //   return 'sender';
      // }
      // return 'receiver';
    }
    console.log('challenge for user to user');
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
    // if (challengeObj.change_requested_by === entity.uid) {
    //   return 'sender';
    // }
    // return 'receiver';
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
  return (
    <TCKeyboardView>
      <ActivityLoader visible={loading} />
      {homeTeam && awayTeam && bodyParams && (
        <View>
          <ReservationNumber reservationNumber={bodyParams.challenge_id} />
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
                  {bodyParams.invited_by === (bodyParams.home_team.group_id ?? bodyParams.home_team.user_id)
                    ? bodyParams.home_team.group_name || `${bodyParams.home_team.first_name} ${bodyParams.home_team.last_name}`
                    : bodyParams.away_team.group_name || `${bodyParams.away_team.first_name} ${bodyParams.away_team.last_name}`}
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
                  {bodyParams.invited_by === (bodyParams.home_team.group_id ?? bodyParams.home_team.user_id)
                    ? bodyParams.away_team.group_name || `${bodyParams.away_team.first_name} ${bodyParams.away_team.last_name}`
                    : bodyParams.home_team.group_name || `${bodyParams.home_team.first_name} ${bodyParams.home_team.last_name}`}
                </Text>
              </View>
            </View>
          </View>
          <TCThinDivider />

          {/* status offered */}
          {checkSenderOrReceiver(bodyParams) === 'sender'
            && bodyParams.status === ReservationStatus.offered && (
              <View>
                {bodyParams.offer_expiry * 1000 < new Date().getTime() ? (
                  <Text style={styles.challengeMessage}>
                    RESERVATION REQUEST EXPIRED
                  </Text>
                ) : (
                  <Text style={styles.challengeMessage}>
                    RESERVATION REQUEST SENT
                  </Text>
                )}
                {bodyParams.offer_expiry * 1000 < new Date().getTime() ? (
                  <Text style={styles.challengeText}>
                    Your match reservation request has been expired.
                  </Text>
                ) : (
                  <Text style={styles.challengeText}>
                    {singlePlayerText()} sent a match reservation request to{' '}
                    {getTeamName(bodyParams)}. This request will be expired in{' '}
                    <Text style={styles.timeText}>
                      {getDayTimeDifferent(
                        bodyParams.offer_expiry * 1000,
                        new Date().getTime(),
                      )}
                      .
                    </Text>
                  </Text>
                )}
              </View>
          )}
          {checkSenderOrReceiver(bodyParams) === 'receiver'
            && bodyParams.status === ReservationStatus.offered && (
              <View>
                {bodyParams.offer_expiry * 1000 < new Date().getTime() ? (
                  <Text style={styles.challengeMessage}>
                    RESERVATION REQUEST EXPIRED
                  </Text>
                ) : (
                  <Text style={styles.challengeMessage}>
                    RESERVATION REQUEST PENDING
                  </Text>
                )}
                {bodyParams.offer_expiry * 1000 < new Date().getTime() ? (
                  <Text style={styles.challengeText}>
                    The match reservation request from {getTeamName(bodyParams)}{' '}
                    has been expired.
                  </Text>
                ) : (
                  <Text style={styles.challengeText}>
                    {singlePlayerText()} received a match reservation request from{' '}
                    {getTeamName(bodyParams)}. This request will be expired in{' '}
                    <Text style={styles.timeText}>
                      {getDayTimeDifferent(
                        bodyParams.offer_expiry * 1000,
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
            && bodyParams.status === ReservationStatus.pendingpayment && (
              <View>
                <Text style={styles.challengeMessage}>AWAITING PAYMENT</Text>
                <Text style={styles.challengeText}>
                  {getTeamName(bodyParams)} has accepted your match reservation,
                  but your payment hasnt gone through yet.
                </Text>
                <Text style={styles.pendingRequestText}>
                  {'This reservation will be canceled unless the payment goes through within '}
                  <Text style={{ color: colors.themeColor }}>{countDown}</Text>{'.'}
                </Text>
              </View>
          )}
          {checkSenderOrReceiver(bodyParams) === 'receiver'
            && bodyParams.status === ReservationStatus.pendingpayment && (
              <View>
                <Text style={styles.challengeMessage}>AWAITING PAYMENT</Text>
                <Text style={styles.challengeText}>
                  {singlePlayerText()} has accepted a game reservation from{' '}
                  {getTeamName(bodyParams)}, but the payment hasnt gone through
                  yet.
                </Text>
                <Text style={styles.awatingNotesText}>
                  {'This reservation will be canceled unless the payment goes through within '}<Text style={{ color: colors.themeColor }}>{countDown}</Text>{'.\nYou can cancel the game reservation without a penalty before the payment will go through.'}
                </Text>
              </View>
          )}
          {/* status pending payment */}
          {/* Status accepted */}
          {checkSenderOrReceiver(bodyParams) === 'sender'
            && (bodyParams.status === ReservationStatus.accepted || bodyParams.status === ReservationStatus.restored || bodyParams.status === ReservationStatus.requestcancelled) && (
              <View>
                <Text
                  style={[
                    styles.challengeMessage,
                    { color: colors.greenGradientStart },
                  ]}>
                  RESERVATION CONFIRMED
                </Text>
                <Text style={styles.challengeText}>
                  {singlePlayerText()} has the confirmed match reservation against{' '}
                  {getTeamName(bodyParams)}.
                </Text>
              </View>
          )}
          {checkSenderOrReceiver(bodyParams) === 'receiver'
            && (bodyParams.status === ReservationStatus.accepted || bodyParams.status === ReservationStatus.restored || bodyParams.status === ReservationStatus.requestcancelled) && (
              <View>
                <Text
                  style={[
                    styles.challengeMessage,
                    { color: colors.greenGradientStart },
                  ]}>
                  RESERVATION CONFIRMED
                </Text>
                <Text style={styles.challengeText}>
                  {getTeamName(bodyParams)} has the confirmed match reservation
                  against {singlePlayerText()}.
                </Text>
              </View>
          )}

          {/* Status declined */}
          {checkSenderOrReceiver(bodyParams) === 'sender'
            && bodyParams.status === ReservationStatus.declined && (
              <View>
                <Text
                  style={[
                    styles.challengeMessage,
                    { color: colors.googleColor },
                  ]}>
                  RESERVATION REQUEST DECLINED
                </Text>
                <Text style={styles.challengeText}>
                  {singlePlayerText()} declined the match reservation request from{' '}
                  {getTeamName(bodyParams)}.
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
                  RESERVATION REQUEST DECLINED
                </Text>
                <Text style={styles.challengeText}>
                  {getTeamName(bodyParams)} declined your match reservation
                  request.
                </Text>
              </View>
          )}

          {/* Status cancelled */}
          {checkSenderOrReceiver(bodyParams) === 'sender'
            && bodyParams.status === ReservationStatus.cancelled && (
              <View>
                <Text
                  style={[
                    styles.challengeMessage,
                    { color: colors.googleColor },
                  ]}>
                  RESERVATION CANCELLED
                </Text>
                <Text style={styles.challengeText}>
                  {singlePlayerText()} cancelled the match reservation from{' '}
                  {getTeamName(bodyParams)}.
                </Text>
              </View>
          )}
          {checkSenderOrReceiver(bodyParams) === 'receiver'
            && bodyParams.status === ReservationStatus.cancelled && (
              <View>
                <Text
                  style={[
                    styles.challengeMessage,
                    { color: colors.googleColor },
                  ]}>
                  RESERVATION CANCELLED
                </Text>
                <Text style={styles.challengeText}>
                  {getTeamName(bodyParams)} cancelled your match reservation.
                </Text>
              </View>
          )}

          {checkSenderOrReceiver(bodyParams) === 'sender'
            && bodyParams.status === ReservationStatus.pendingpayment && (
              <TCGradientButton
                title={'TRY TO PAY AGAIN'}
                onPress={() => {
                  navigation.navigate('PayAgainScreen', {
                    body: bodyParams,
                    comeFrom: ReservationStatus.pendingpayment,
                  })
                }}
                marginBottom={15}
              />
          )}

          {!(
            bodyParams.status === ReservationStatus.offered
            || bodyParams.status === ReservationStatus.cancelled
            || bodyParams.status === ReservationStatus.declined
            || bodyParams.status === ReservationStatus.pendingpayment
          ) && (
            <TCBorderButton
              title={'GAME HOME'}
              onPress={() => {
                const gameHome = getGameHomeScreen(bodyParams?.sport);
                if (gameHome && bodyParams?.game_id) {
                  navigation.navigate(gameHome, {
                    gameId: bodyParams?.game_id,
                  })
                }
              }}
              marginBottom={15}
            />
          )}

          <TCThickDivider />
          {bodyParams && (
            <View>
              <TCLabel title={`Match · ${bodyParams.sport.charAt(0).toUpperCase() + bodyParams.sport.slice(1)}`} />
              <TCInfoImageField
                title={'Home'}
                image = {bodyParams?.home_team?.thumbnail && bodyParams.home_team.thumbnail}
                name={bodyParams.home_team.group_name || `${bodyParams.home_team.first_name} ${bodyParams.home_team.last_name}`}
                marginLeft={30}
              />
              <TCThinDivider />
              <TCInfoImageField
                title={'Away'}
                image = {bodyParams?.away_team?.thumbnail && bodyParams.away_team.thumbnail}
                name={bodyParams.away_team.group_name || `${bodyParams.away_team.first_name} ${bodyParams.away_team.last_name}`}
                marginLeft={30}
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
                marginLeft={30}
                titleStyle={{ fontSize: 16 }}
              />
              <TCThinDivider />
              <TCInfoField
                title={'Venue'}
                value={bodyParams.venue.title}
                marginLeft={30}
                titleStyle={{ fontSize: 16 }}
              />
              <TCThinDivider />
              <TCInfoField
                title={'Address'}
                value={bodyParams.venue.address || bodyParams.venue.description}
                marginLeft={30}
                titleStyle={{ fontSize: 16 }}
              />
              <EventMapView
                coordinate={{
                  latitude: bodyParams?.venue?.lat ?? 0.00,
                  longitude: bodyParams?.venue?.long ?? 0.00,
                }}
                region={{
                  latitude: bodyParams?.venue?.lat ?? 0.00,
                  longitude: bodyParams?.venue?.long ?? 0.00,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                }}
                style={styles.map}
              />
              <TCThickDivider marginTop={20} />
            </View>
          )}

          {bodyParams && (
            <View>
              <TCLabel title={'Responsibility  to Secure Venue'} />
              <View style={styles.viewContainer}>
                <View style={styles.fieldValue}>
                  <Image
                    source={images.teamPlaceholder}
                    style={styles.imageView}
                  />
                  <Text style={styles.teamNameText} numberOfLines={1}>
                    {bodyParams.responsible_to_secure_venue}
                  </Text>
                </View>
              </View>
              <TCThickDivider marginTop={8} />
            </View>
          )}
          {bodyParams && (
            <View>
              <TCLabel title={'Rules'} />
              <Text style={styles.rulesText}>{bodyParams.special_rule}</Text>
            </View>
          )}
          <TCThickDivider marginTop={20} />
          {bodyParams?.sport.toLowerCase() === 'tennis' && <View>
            <TCGameDetailRules gameRules={bodyParams?.gameRules}/>
            <TCThickDivider marginTop={20} />
          </View>}

          <View>
            <TCLabel title={'Responsibility to Secure Referees'} />
            {bodyParams && (
              <FlatList
                data={bodyParams.referee}
                renderItem={renderSecureReferee}
                keyExtractor={(item, index) => index.toString()}
                ItemSeparatorComponent={() => <TCThinDivider />}
              />
            )}
          </View>
          <TCThickDivider marginTop={10} />
          <View>
            <TCLabel title={'Responsibility to Secure ScoreKeeper'} />
            {bodyParams && (
              <FlatList
                data={bodyParams.scorekeeper}
                renderItem={renderSecureScorekeeper}
                keyExtractor={(item, index) => index.toString()}
                ItemSeparatorComponent={() => <TCThinDivider />}
              />
            )}
          </View>
          <TCThickDivider marginTop={10} />
          <TCLabel
            title={
              bodyParams.invited_by === entity.uid
                ? 'Payment'
                : 'Earning'
            }
          />
          <MatchFeesCard
            challengeObj={{ ...bodyParams, start_datetime: bodyParams.start_datetime * 1000, end_datetime: bodyParams.end_datetime * 1000 }}
            senderOrReceiver={
              bodyParams.invited_by === entity.uid
                ? 'sender'
                : 'receiver'
            }
          />
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
            && bodyParams.status === ReservationStatus.offered
            && bodyParams.offer_expiry < new Date().getTime() && (
              <View>
                <TCBorderButton
                  title={strings.calcelRequest}
                  textColor={colors.grayColor}
                  borderColor={colors.grayColor}
                  marginBottom={15}
                  height={40}
                  shadow={true}
                  onPress={() => {
                    acceptDeclineChallengeOperation(
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
            && bodyParams.status === ReservationStatus.offered
            && bodyParams.offer_expiry * 1000 > new Date().getTime() && (

              <View style={{ marginTop: 15 }}>
                <TCGradientButton
                  title={strings.accept}

                  onPress={() => {
                    acceptDeclineChallengeOperation(
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
                  marginBottom={15}
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

          {(bodyParams.status === ReservationStatus.accepted || bodyParams.status === ReservationStatus.restored || bodyParams.status === ReservationStatus.requestcancelled) && (
            <View>
              <TCBorderButton
                title={strings.alterReservation}
                textColor={colors.grayColor}
                borderColor={colors.grayColor}
                height={40}
                shadow={true}
                marginTop={15}
                onPress={() => {
                  if (!bodyParams.game_status || bodyParams.game_status === GameStatus.accepted || bodyParams.game_status === GameStatus.reset) {
                    navigation.navigate('ChangeReservationInfoScreen', {
                      screen: 'change',
                      body: bodyParams,
                    });
                  } else if (bodyParams.start_datetime * 1000 < new Date().getTime()) {
                    Alert.alert(strings.cannotChangeReservationGameStartedText);
                  } else {
                    Alert.alert(strings.cannotChangeReservationText);
                  }
                }}
              />
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
                  if (!bodyParams.game_status || bodyParams.game_status === GameStatus.accepted || bodyParams.game_status === GameStatus.reset) {
                    acceptDeclineChallengeOperation(
                      entity.uid,
                      bodyParams.challenge_id,
                      bodyParams.version,
                      'cancel',
                    );
                  } else if (bodyParams.start_datetime * 1000 < new Date().getTime()) {
                    Alert.alert(strings.cannotCancelReservationText);
                  } else {
                    Alert.alert(strings.cannotCancelReservationAfterGameStartText);
                  }
                }}
              />
            </View>
          )}
          {bodyParams.status === ReservationStatus.pendingpayment && <TCBorderButton
                title={strings.cancelMatch}
                textColor={colors.whiteColor}
                borderColor={colors.grayColor}
                backgroundColor={colors.grayColor}
                height={40}
                shadow={true}
                marginBottom={15}
                marginTop={15}
                onPress={() => {
                  if (!bodyParams.game_status || bodyParams.game_status === GameStatus.accepted || bodyParams.game_status === GameStatus.reset) {
                    acceptDeclineChallengeOperation(
                      entity.uid,
                      bodyParams.challenge_id,
                      bodyParams.version,
                      'cancel',
                    );
                  } else if (bodyParams.start_datetime * 1000 < new Date().getTime()) {
                    Alert.alert(strings.cannotCancelReservationText);
                  } else {
                    Alert.alert(strings.cannotChangeReservationText);
                  }
                }}
              />}
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
});
