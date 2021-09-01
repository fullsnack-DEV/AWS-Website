/* eslint-disable no-unused-vars */
/* eslint-disable consistent-return */
/* eslint-disable no-nested-ternary */
import React, { useContext, useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Alert,
  SafeAreaView,
  Image,
  TouchableOpacity,
} from 'react-native';
import moment from 'moment';

import Modal from 'react-native-modal';
import strings from '../../../Constants/String';
import fonts from '../../../Constants/Fonts';
import colors from '../../../Constants/Colors';
import ActivityLoader from '../../../components/loader/ActivityLoader';
import TCKeyboardView from '../../../components/TCKeyboardView';
import TCThickDivider from '../../../components/TCThickDivider';
import TCLabel from '../../../components/TCLabel';
import AuthContext from '../../../auth/context';
import TCThinDivider from '../../../components/TCThinDivider';
import TCInfoImageField from '../../../components/TCInfoImageField';
import TCInfoField from '../../../components/TCInfoField';
import EventMapView from '../../../components/Schedule/EventMapView';
import TCChallengeTitle from '../../../components/TCChallengeTitle';
import SecureRefereeView from '../../../components/SecureRefereeView';
import GameFeeCard from '../../../components/challenge/GameFeeCard';
import ChallengeStatusView from '../../../components/challenge/ChallengeStatusView';
import ReservationStatus from '../../../Constants/ReservationStatus';
import { heightPercentageToDP, widthPercentageToDP } from '../../../utils';
import TCSmallButton from '../../../components/TCSmallButton';
import images from '../../../Constants/ImagePath';
import { getGameHomeScreen, getNumberSuffix } from '../../../utils/gameUtils';
import * as Utility from '../../../utils';

import {
  acceptDeclineChallenge,
  acceptDeclineAlterChallenge,
} from '../../../api/Challenge';

import GameStatus from '../../../Constants/GameStatus';
import TCArrowView from '../../../components/TCArrowView';
import TCGradientButton from '../../../components/TCGradientButton';

import TCBorderButton from '../../../components/TCBorderButton';
import * as Utils from '../manageChallenge/settingUtility';
import TCTouchableLabel from '../../../components/TCTouchableLabel';
import TCTabView from '../../../components/TCTabView';
import CurruentReservationView from '../alterChallenge/CurrentReservationView';

let entity = {};
export default function ChallengePreviewScreen({ navigation, route }) {
  console.log('route?.params?.challengeObj[0]', route?.params?.challengeObj[0]);
  console.log('route?.params?.challengeObj', route?.params?.challengeObj);
  const authContext = useContext(AuthContext);
  const [loading, setloading] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);

  entity = authContext.entity;

  const [settingObject, setSettingObject] = useState();
  const [modalVisible, setModalVisible] = useState(false);

  const [alterModalVisible, setAlterModalVisible] = useState(false);

  const [challengeStatus, setChallengeStatus] = useState();
  const [teamObject, setTeamObject] = useState();
  const [groupObject, setGroupObject] = useState();

  const [challengeData, setChallengeData] = useState(
    route?.params?.challengeObj?.length > 1
      ? route?.params?.challengeObj[0]
      : route?.params?.challengeObj,
  );
  const [oldVersion, setOldVersion] = useState();

  const getChallenger = () => {
    if (
      challengeData?.challenger === challengeData?.home_team?.user_id
      || challengeData?.challenger === challengeData?.home_team?.group_id
    ) {
      return challengeData?.home_team;
    }
    return challengeData?.away_team;
  };

  const getChallengee = () => {
    if (
      challengeData?.challengee === challengeData?.home_team?.user_id
      || challengeData?.challengee === challengeData?.home_team?.group_id
    ) {
      return challengeData?.home_team;
    }
    return challengeData?.away_team;
  };
  useEffect(() => {
    if (route?.params?.challengeObj?.length > 1) {
      // setIsPendingRequestPayment(true);
      for (let i = 0; i < route?.params?.challengeObj.length; i++) {
        if (
          route?.params?.challengeObj?.[i]?.status
          === ReservationStatus.accepted
        ) {
          console.log('Old version111::=>', route?.params?.challengeObj?.[i]);
          setOldVersion(route?.params?.challengeObj?.[i]);
          break;
        }
      }
    }
    if (
      [ReservationStatus.declined, ReservationStatus.requestcancelled].includes(
        route?.params?.challengeObj?.[0]?.status
          ?? route?.params?.challengeObj?.status,
      )
    ) {
      if (route?.params?.challengeObj?.length > 1) {
        setChallengeData(oldVersion);
      } else {
        setChallengeData(
          route?.params?.challengeObj?.[0] ?? route?.params?.challengeObj,
        );
      }
    } else {
      console.log(
        'new Version:=>',
        route?.params?.challengeObj?.[0] ?? route?.params?.challengeObj,
      );
      setChallengeData(
        route?.params?.challengeObj?.[0] ?? route?.params?.challengeObj,
      );
    }
  }, [oldVersion, route?.params?.challengeObj]);

  useEffect(() => {
    setloading(true);
    console.log('challenge data11:=>', challengeData?.challengee);
    Utils.getSetting(
      challengeData?.challengee,
      authContext.entity.role === 'user' ? 'player' : 'team',
      challengeData?.sport,
      authContext,
    ).then((response) => {
      setloading(false);
      console.log('manage challenge response:=>', response);
      setSettingObject(response);
    });
  }, [authContext, challengeData?.challengee, challengeData?.sport]);

  const checkSenderOrReceiver = (challengeObj) => {
    console.log('sender & receiver Obj', challengeObj);

    if (
      challengeObj?.status === ReservationStatus.pendingpayment
      || challengeObj?.status === ReservationStatus.pendingrequestpayment
    ) {
      if (challengeObj?.requested_by === entity.uid) {
        return 'sender';
      }
      return 'receiver';
    }
    if (
      challengeObj?.status === ReservationStatus.requestcancelled
      || challengeObj?.status === ReservationStatus.cancelled
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
      (challengeObj?.updated_by?.group_id ?? challengeObj?.updated_by?.uid)
      === entity.uid
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

  const getTimeDifferent = (sDate, eDate) => {
    let delta = Math.abs(new Date(sDate).getTime() - new Date(eDate).getTime()) / 1000;

    const days = Math.floor(delta / 86400);
    delta -= days * 86400;

    const hours = Math.floor(delta / 3600) % 24;
    delta -= hours * 3600;

    const minutes = Math.floor(delta / 60) % 60;
    delta -= minutes * 60;

    return `${hours}h ${minutes}m`;
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
        let groupObj;
        if (challengeData?.home_team?.full_name) {
          if (challengeData?.home_team?.user_id === authContext?.entity?.uid) {
            groupObj = challengeData?.away_team;
          } else {
            groupObj = challengeData?.home_team;
          }
        } else if (
          challengeData?.home_team?.group_id === authContext?.entity?.uid
        ) {
          groupObj = challengeData?.away_team;
        } else {
          groupObj = challengeData?.home_team;
        }
        setChallengeStatus(status);
        setModalVisible(true);
        setGroupObject(groupObj);
        setTeamObject({
          ...groupObj,
          game_id: response?.payload?.game_id,
          sport: challengeData?.sport,
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
        let groupObj;
        if (challengeData?.home_team?.full_name) {
          if (challengeData?.home_team?.user_id === authContext?.entity?.uid) {
            groupObj = challengeData?.away_team;
          } else {
            groupObj = challengeData?.home_team;
          }
        } else if (
          challengeData?.home_team?.group_id === authContext?.entity?.uid
        ) {
          groupObj = challengeData?.away_team;
        } else {
          groupObj = challengeData?.home_team;
        }
        setChallengeStatus(status);
        setAlterModalVisible(true);
        setGroupObject(groupObj);
        setTeamObject({
          ...groupObj,
          game_id: response?.payload?.game_id,
          sport: challengeData?.sport,
        });
      })
      .catch((e) => {
        setloading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 10);
      });
  };

  const renderPeriod = ({ item, index }) => (
    <>
      <TCChallengeTitle
        containerStyle={{ marginLeft: 25, marginTop: 5, marginBottom: 5 }}
        title={'Interval'}
        titleStyle={{ fontSize: 16, fontFamily: fonts.RRegular }}
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
        containerStyle={{ marginLeft: 25, marginTop: 5, marginBottom: 5 }}
        title={`${getNumberSuffix(index + 2)} Period`}
        titleStyle={{ fontSize: 16, fontFamily: fonts.RRegular }}
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

  const renderOverTime = ({ item, index }) => (
    <>
      <TCChallengeTitle
        containerStyle={{ marginLeft: 25, marginTop: 5, marginBottom: 5 }}
        title={'Interval'}
        titleStyle={{ fontSize: 16, fontFamily: fonts.RRegular }}
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
        containerStyle={{ marginLeft: 25, marginTop: 5, marginBottom: 5 }}
        title={`${getNumberSuffix(index + 1)} Over time`}
        titleStyle={{ fontSize: 16, fontFamily: fonts.RRegular }}
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

  const renderReferees = ({ item, index }) => {
    console.log('ITEm:', item);
    console.log(
      'challengee?.full_name ?? challengee?.group_name',
      getChallenger()?.full_name ?? getChallenger()?.group_name,
    );
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
              ? { uri: getChallenger()?.thumbnail }
              : getChallenger()?.full_name
              ? images.profilePlaceHolder
              : images.teamPlaceholder
            : getChallenger()?.thumbnail
            ? { uri: getChallengee()?.thumbnail }
            : getChallengee()?.full_name
            ? images.profilePlaceHolder
            : images.teamPlaceholder
        }
        entity={'Referee'}
        entityNumber={index + 1}
      />
    );
  };
  const renderScorekeepers = ({ item, index }) => (
    <SecureRefereeView
      entityName={
        item.responsible_to_secure_scorekeeper === 'challenger'
          ? getChallenger()?.full_name ?? getChallenger()?.group_name
          : getChallengee()?.full_name ?? getChallengee()?.group_name
      }
      image={
        item.responsible_to_secure_scorekeeper === 'challenger'
          ? getChallenger()?.thumbnail
            ? { uri: getChallenger()?.thumbnail }
            : getChallenger()?.full_name
            ? images.profilePlaceHolder
            : images.teamPlaceholder
          : getChallengee()?.thumbnail
          ? { uri: getChallengee()?.thumbnail }
          : getChallengee()?.full_name
          ? images.profilePlaceHolder
          : images.teamPlaceholder
      }
      entity={'Scorekeeper'}
      entityNumber={index + 1}
    />
  );

  const bottomButtonView = () => {
    if (
      checkSenderOrReceiver(challengeData) === 'sender'
      && challengeData?.status === ReservationStatus.offered
    ) {
      return (
        <TCSmallButton
          isBorderButton={true}
          borderstyle={{
            borderColor: colors.userPostTimeColor,
            borderWidth: 1,
            borderRadious: 80,
          }}
          textStyle={{ color: colors.userPostTimeColor }}
          title={strings.calcelRequest}
          onPress={() => {
            challengeOperation(
              entity.uid,
              challengeData?.challenge_id,
              challengeData?.version,
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
      checkSenderOrReceiver(challengeData) === 'receiver'
      && challengeData?.status === ReservationStatus.offered
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
            textStyle={{ color: colors.userPostTimeColor }}
            title={strings.declineTitle}
            onPress={() => {
              // navigation.navigate('ChallengeAcceptedDeclinedScreen', {
              //   status: 'accept',
              //   teamObj: authContext.entity.obj,
              // });
              challengeOperation(
                entity.uid,
                challengeData?.challenge_id,
                challengeData?.version,
                'decline',
              );
            }}
            style={{ width: widthPercentageToDP('45%') }}
          />
          <TCSmallButton
            title={strings.acceptTitle}
            onPress={() => {
              // navigation.navigate('ChallengeAcceptedDeclinedScreen', {
              //   status: 'accept',
              //   teamObj: authContext.entity.obj,
              // });
              if (challengeData?.challenger === challengeData?.invited_by) {
                challengeOperation(
                  entity.uid,
                  challengeData?.challenge_id,
                  challengeData?.version,
                  'accept',
                );
              } else {
                let groupObj;
                if (challengeData?.home_team?.full_name) {
                  if (
                    challengeData?.home_team?.user_id
                    === authContext?.entity?.uid
                  ) {
                    groupObj = challengeData?.away_team;
                  } else {
                    groupObj = challengeData?.home_team;
                  }
                } else if (
                  challengeData?.home_team?.group_id
                  === authContext?.entity?.uid
                ) {
                  groupObj = challengeData?.away_team;
                } else {
                  groupObj = challengeData?.home_team;
                }
                navigation.push('ChallengePaymentScreen', {
                  challengeObj: challengeData,
                  groupObj,
                  type: 'invite',
                });
              }
            }}
            style={{ width: widthPercentageToDP('45%') }}
          />
        </View>
      );
    }
    console.log('Challenge Object:=>', challengeData);
    if (
      (checkSenderOrReceiver(challengeData) === 'sender'
        || checkSenderOrReceiver(challengeData) === 'receiver')
      && selectedTab === 0
      && (challengeData?.status === ReservationStatus.accepted
        || (challengeData?.status === ReservationStatus.declined
          && challengeData?.version !== 2))
    ) {
      return (
        <View style={styles.bottomButtonView}>
          {(challengeData?.game_status === GameStatus.accepted
            || challengeData?.game_status === GameStatus.reset
            || !challengeData?.game_status) && (
              <TCSmallButton
              isBorderButton={true}
              borderstyle={{
                borderColor: colors.userPostTimeColor,
                borderWidth: 1,
                borderRadious: 80,
              }}
              textStyle={{ color: colors.userPostTimeColor }}
              title={strings.alterReservation}
              onPress={() => {
                if (
                  challengeData?.game_status === GameStatus.accepted
                  || challengeData?.game_status === GameStatus.reset
                  || !challengeData?.game_status
                ) {
                  if (
                    challengeData?.start_datetime * 1000
                    < new Date().getTime()
                  ) {
                    Alert.alert(strings.cannotChangeReservationGameStartedText);
                  } else {
                    console.log('settingObject1', settingObject);
                    navigation.navigate('ChangeReservationInfoScreen', {
                      screen: 'change',
                      challengeObj: challengeData,
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
                challengeData?.game_status === GameStatus.accepted
                || challengeData?.game_status === GameStatus.reset
              ) {
                if (
                  challengeData?.start_datetime * 1000
                  < new Date().getTime()
                ) {
                  Alert.alert(strings.cannotChangeReservationGameStartedText);
                } else {
                  navigation.navigate('ChangeReservationInfoScreen', {
                    screen: 'cancel',
                    challengeObj: challengeData,
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
      checkSenderOrReceiver(challengeData) === 'receiver'
      && challengeData?.status === ReservationStatus.changeRequest
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
              textStyle={{ color: colors.userPostTimeColor }}
              title={strings.declineTitle}
              onPress={() => {
                // navigation.navigate('ChallengeAcceptedDeclinedScreen', {
                //   status: 'accept',
                //   teamObj: authContext.entity.obj,
                // });
                challengeOperation(
                  entity.uid,
                  challengeData?.challenge_id,
                  challengeData?.version,
                  'decline',
                );
              }}
              style={{ width: widthPercentageToDP('45%') }}
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
                  challengeData?.challenge_id,
                  challengeData?.version,
                  'accept',
                  paymentObj,
                );
              }}
              style={{ width: widthPercentageToDP('45%') }}
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
                challengeObj: challengeData,
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
      checkSenderOrReceiver(challengeData) === 'sender'
      && challengeData?.status === ReservationStatus.changeRequest
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
            textStyle={{ color: colors.userPostTimeColor }}
            title={strings.calcelRequest}
            onPress={() => {
              if (
                challengeData?.game_status === GameStatus.accepted
                || challengeData?.game_status === GameStatus.reset
              ) {
                if (
                  challengeData?.start_datetime * 1000
                  < new Date().getTime()
                ) {
                  Alert.alert(strings.cannotChangeReservationGameStartedText);
                } else {
                  alterChallengeOperation(
                    entity.uid,
                    challengeData?.challenge_id,
                    challengeData?.version,
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
                challengeObj: challengeData,
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

    return <View style={{ marginBottom: 45 }} />;
  };

  const topButtons = () => {
    if (challengeData?.challenger === challengeData?.invited_by) {
      if (
        checkSenderOrReceiver(challengeData) === 'sender'
        && [
          ReservationStatus.pendingrequestpayment,
          ReservationStatus.pendingpayment,
        ].includes(challengeData?.status)
      ) {
        return (
          <TCGradientButton
            title={'TRY TO PAY AGAIN'}
            onPress={() => {
              navigation.navigate('PayAgainScreen', {
                body: { ...challengeData },
                status: challengeData?.status,
              });
            }}
            marginBottom={15}
          />
        );
      }
      if (
        checkSenderOrReceiver(challengeData) === 'receiver'
        && [ReservationStatus.pendingrequestpayment].includes(
          challengeData?.status,
        )
      ) {
        return (
          <TCGradientButton
            title={'RESTORE TO PREVIOUS VERSION'}
            onPress={() => {
              challengeOperation(
                entity.uid,
                challengeData.challenge_id,
                challengeData.version,
                'decline',
                true,
              );
            }}
            marginBottom={15}
          />
        );
      }
    } else {
      if (
        checkSenderOrReceiver(challengeData) === 'sender'
        && [ReservationStatus.pendingrequestpayment].includes(
          challengeData?.status,
        )
      ) {
        return (
          <TCGradientButton
            title={'RESTORE TO PREVIOUS VERSION'}
            onPress={() => {
              challengeOperation(
                entity.uid,
                challengeData.challenge_id,
                challengeData.version,
                'decline',
                true,
              );
            }}
            marginBottom={15}
          />
        );
      }
      if (
        checkSenderOrReceiver(challengeData) === 'receiver'
        && [
          ReservationStatus.pendingrequestpayment,
          ReservationStatus.pendingpayment,
        ].includes(challengeData?.status)
      ) {
        return (
          <TCGradientButton
            title={'TRY TO PAY AGAIN'}
            onPress={() => {
              navigation.navigate('PayAgainScreen', {
                body: { ...challengeData },
                status: challengeData?.status,
              });
            }}
            marginBottom={15}
          />
        );
      }
    }
  };

  return (
    <TCKeyboardView>
      <ActivityLoader visible={loading} />

      {(challengeData?.status === ReservationStatus.changeRequest
        || selectedTab === 1) && (
          <TCTabView
          totalTabs={2}
          firstTabTitle={'ALTERATION REQUEST'}
          secondTabTitle={'CURRENT RESERVATION'}
          indexCounter={selectedTab}
          eventPrivacyContianer={{ width: 100 }}
          onFirstTabPress={() => setSelectedTab(0)}
          onSecondTabPress={() => setSelectedTab(1)}
          activeHeight={36}
          inactiveHeight={40}
        />
      )}
      {challengeData && selectedTab === 0 && (
        <View style={{ marginBottom: 15 }}>
          <Text
            style={[
              styles.challengeNumberStyle,
              {
                marginTop:
                  challengeData?.status === ReservationStatus.changeRequest
                    ? 0
                    : 15,
              },
            ]}>
            Request No.{`${challengeData?.challenge_id}`}
          </Text>

          <ChallengeStatusView
            challengeObj={challengeData}
            isSender={checkSenderOrReceiver(challengeData) === 'sender'}
            isTeam={!!challengeData?.home_team?.group_name}
            teamName={getTeamName(challengeData)}
            // receiverName={challengee?.full_name ?? challengee?.group_name}
            offerExpiry={
              ReservationStatus.offered === 'offered'
              || ReservationStatus.offered === 'changeRequest'
                ? new Date().getTime()
                : ''
            } // only if status offered
            status={challengeData?.status}
          />

          {topButtons()}

          {challengeData?.game_id && (
            <TCArrowView
              title={'Game Home '}
              onPress={() => {
                console.log('teamObject?.sport', challengeData);
                const gameHome = getGameHomeScreen(challengeData?.sport);
                console.log('gameHome', gameHome);

                navigation.navigate(gameHome, {
                  gameId: challengeData?.game_id,
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
            }}>
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
                        ? { uri: getChallenger()?.thumbnail }
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
                        ? { uri: getChallengee()?.thumbnail }
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

          <TCThickDivider />

          <View>
            <TCLabel title={`Game · ${challengeData?.sport}`} />

            <TCInfoImageField
              title={'Home'}
              image={
                challengeData?.home_team?.thumbnail
                  ? { uri: challengeData?.home_team?.thumbnail }
                  : challengeData?.home_team?.full_name
                  ? images.profilePlaceHolder
                  : images.teamPlaceholder
              }
              name={
                challengeData?.home_team?.group_name
                ?? challengeData?.home_team?.full_name
              }
              marginLeft={30}
            />
            <TCThinDivider />
            <TCInfoImageField
              title={'Away'}
              image={
                challengeData?.away_team?.thumbnail
                  ? { uri: challengeData?.away_team?.thumbnail }
                  : challengeData?.away_team?.full_name
                  ? images.profilePlaceHolder
                  : images.teamPlaceholder
              }
              name={
                challengeData?.away_team?.group_name
                ?? challengeData?.away_team?.full_name
              }
              marginLeft={30}
            />
            <TCThinDivider />

            <TCInfoField
              title={'Time'}
              value={`${moment(
                new Date(challengeData?.start_datetime * 1000),
              ).format('MMM DD, YYYY  hh:mm a')} -\n${moment(
                new Date(challengeData?.end_datetime * 1000),
              ).format('MMM DD, YYYY  hh:mm a')}\n( ${getTimeDifferent(
                new Date(challengeData?.start_datetime * 1000),
                new Date(challengeData?.end_datetime * 1000),
              )} )   `}
              marginLeft={30}
              titleStyle={{ fontSize: 16 }}
            />
            <TCThinDivider />

            <TCInfoField
              title={'Venue'}
              value={challengeData?.venue?.name}
              marginLeft={30}
              titleStyle={{ fontSize: 16 }}
            />
            <TCThinDivider />
            <TCInfoField
              title={'Address'}
              value={challengeData?.venue?.address}
              marginLeft={30}
              titleStyle={{ fontSize: 16 }}
            />
            <EventMapView
              coordinate={challengeData?.venue?.coordinate}
              region={challengeData?.venue?.region}
              style={styles.map}
            />
            <TCThickDivider marginTop={20} />
          </View>

          <TCChallengeTitle
            title={'Game Type'}
            value={challengeData?.game_type}
            tooltipText={
            'The game result has an effect on TC points of the challengee and you.'
            }
            tooltipHeight={heightPercentageToDP('6%')}
            tooltipWidth={widthPercentageToDP('50%')}
          />
          <TCThickDivider />

          <TCLabel title={'Game Duration'} />
          <TCChallengeTitle
            containerStyle={{ marginLeft: 25, marginTop: 15, marginBottom: 5 }}
            title={'1st period'}
            titleStyle={{ fontSize: 16, fontFamily: fonts.RRegular }}
            value={challengeData?.game_duration?.first_period}
            valueStyle={{
              fontFamily: fonts.RBold,
              fontSize: 16,
              color: colors.greenColorCard,
              marginRight: 2,
            }}
            staticValueText={'min.'}
          />

          <FlatList
            data={challengeData?.game_duration?.period}
            renderItem={renderPeriod}
            keyExtractor={(item, index) => index.toString()}
            style={{ marginBottom: 15 }}
          />
          {challengeData?.game_duration?.period?.length > 0 && (
            <Text style={styles.normalTextStyle}>
              {strings.gameDurationTitle2}
            </Text>
          )}

          <FlatList
            data={challengeData?.game_duration?.overtime}
            renderItem={renderOverTime}
            keyExtractor={(item, index) => index.toString()}
            style={{ marginBottom: 15 }}
          />
          <TCThickDivider marginTop={20} />

          <View>
            <TCChallengeTitle title={'Game Rules'} />
            <Text style={styles.rulesTitle}>General Rules</Text>
            <Text style={styles.rulesDetail}>
              {challengeData?.general_rules}
            </Text>
            <View style={{ marginBottom: 10 }} />
            <Text style={styles.rulesTitle}>Special Rules</Text>
            <Text style={styles.rulesDetail}>
              {challengeData?.special_rules}
            </Text>
            <TCThickDivider marginTop={20} />
          </View>

          <TCChallengeTitle
            title={'Referees'}
            value={challengeData?.responsible_for_referee?.who_secure?.length}
            staticValueText={'Referees'}
            valueStyle={{
              fontFamily: fonts.RBold,
              fontSize: 16,
              color: colors.greenColorCard,
              marginRight: 2,
            }}
          />
          <FlatList
            data={challengeData?.responsible_for_referee?.who_secure}
            renderItem={renderReferees}
            keyExtractor={(item, index) => index.toString()}
            ItemSeparatorComponent={() => <View style={{ margin: 5 }} />}
            style={{ marginBottom: 15 }}
          />

          <TCThickDivider marginTop={20} />

          <TCChallengeTitle
            title={'Scorekeepers'}
            value={
              challengeData?.responsible_for_scorekeeper?.who_secure?.length
            }
            staticValueText={'Scorekeepers'}
            valueStyle={{
              fontFamily: fonts.RBold,
              fontSize: 16,
              color: colors.greenColorCard,
              marginRight: 2,
            }}
          />
          <FlatList
            data={challengeData?.responsible_for_scorekeeper?.who_secure}
            renderItem={renderScorekeepers}
            keyExtractor={(item, index) => index.toString()}
            ItemSeparatorComponent={() => <View style={{ margin: 5 }} />}
            style={{ marginBottom: 15 }}
          />
          <TCThickDivider marginTop={20} />
          <View>
            <TCChallengeTitle
              title={'Refund Policy'}
              value={challengeData?.refund_policy}
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
              challengeData?.challenger === entity.uid ? 'Payment' : 'Earning'
            }
            style={{ marginBottom: 15 }}
          />
          <GameFeeCard
            feeObject={{
              total_game_fee: challengeData?.total_game_fee,
              total_service_fee1: challengeData?.total_service_fee1,
              total_service_fee2: challengeData?.total_service_fee2,
              total_stripe_fee: challengeData?.total_stripe_fee,
              total_payout: challengeData?.total_payout,
              total_amount: challengeData?.total_amount,
            }}
            currency={challengeData?.game_fee?.currency_type}
            isChallenger={challengeData?.challenger === entity.uid}
          />
          <TCThickDivider marginTop={20} />

          {oldVersion?.total_game_fee === 0
            && challengeData?.total_game_fee > 0
            && challengeData?.challenger === entity.uid && (
              <View>
                <View>
                  <TCLabel title={'Payment Method'} />
                  <View style={styles.viewMarginStyle}>
                    <TCTouchableLabel
                      title={
                        route?.params?.paymentMethod
                          ? `${Utility.capitalize(
                              route?.params?.paymentMethod?.card?.brand,
                            )} ****${route?.params?.paymentMethod?.card?.last4}`
                          : strings.addOptionMessage
                      }
                      showNextArrow={true}
                      onPress={() => {
                        navigation.navigate('PaymentMethodsScreen', {
                          comeFrom: 'ChallengePreviewScreen',
                        });
                      }}
                    />
                  </View>
                </View>
                <TCThickDivider marginTop={20} />
              </View>
            )}

          <SafeAreaView>{bottomButtonView()}</SafeAreaView>
        </View>
      )}
      <SafeAreaView>
        {selectedTab === 1 && (
          <CurruentReservationView reservationObj={oldVersion} />
        )}
      </SafeAreaView>

      {/* <ChallengeModalView
        navigation={navigation}
        modalVisible={modalVisible}
        // backdropPress={() => setModalVisible(false)}
        // onClose={() => setModalVisible(false)}
        groupObj={groupObject}
        teamObj={teamObject}
        entity={entity}
        status={challengeStatus}
      /> */}
      <Modal
        isVisible={modalVisible}
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
        }}>
        <View style={styles.mainContainer}>
          <Image style={styles.background} source={images.orangeLayer} />
          <Image style={styles.background} source={images.entityCreatedBG} />

          {challengeStatus === 'sent' && (
            <View style={styles.mailContainer}>
              <Text style={styles.invitationText}>Challenge sent</Text>
              <Text style={styles.infoText}>
                When{' '}
                {groupObject?.group_name
                  ?? `${groupObject?.first_name} ${groupObject?.last_name}`}{' '}
                accepts your match reservation request, you will be notified.
              </Text>
            </View>
          )}

          {challengeStatus !== 'sent' && (
            <View style={styles.mailContainer}>
              <Text style={styles.invitationText}>
                {(challengeStatus === 'accept' && 'Challenge accepted')
                  || (challengeStatus === 'decline' && 'Challenge declined')
                  || (challengeStatus === 'cancel' && 'Challenge cancelled')
                  || (challengeStatus === 'restored' && 'Challenge Restored')}
              </Text>

              {challengeStatus === 'accept' && (
                <Text style={styles.infoText}>
                  A match between{' '}
                  <Text style={styles.entityNameBoldText}>
                    {teamObject?.group_name
                      ? teamObject?.group_name
                      : teamObject?.first_name + teamObject?.last_name}
                  </Text>{' '}
                  and {teamObject?.group_name ? 'your team' : 'you'} has been
                  scheduled.
                </Text>
              )}

              {challengeStatus === 'decline' && (
                <Text style={styles.infoText}>
                  A match reservation request from{' '}
                  <Text style={styles.entityNameBoldText}>
                    {teamObject?.group_name
                      ? teamObject?.group_name
                      : teamObject?.first_name + teamObject?.last_name}
                  </Text>{' '}
                  has been declined.
                </Text>
              )}

              {challengeStatus === 'cancel' && (
                <Text style={styles.infoText}>
                  A match reservation from{' '}
                  <Text style={styles.entityNameBoldText}>
                    {teamObject?.group_name
                      ? teamObject?.group_name
                      : teamObject?.first_name + teamObject?.last_name}
                  </Text>{' '}
                  has been cancelled.
                </Text>
              )}

              {challengeStatus === 'restored' && (
                <Text style={styles.infoText}>
                  Reservation alteration request restored.
                </Text>
              )}

              {challengeStatus !== 'sent' && (
                <View style={styles.entityViewContainer}>
                  <Image
                    source={
                      entity?.thumbnail
                        ? { uri: entity?.thumbnail }
                        : entity?.full_name
                        ? images.profilePlaceHolder
                        : images.teamPlaceholder
                    }
                    style={[
                      styles.entityImage,
                      { opacity: challengeStatus === 'decline' ? 0.5 : 1.0 },
                      teamObject?.thumbnail
                        ? {
                            height: 82,
                            width: 82,
                          }
                        : {
                            height: 75,
                            width: 75,
                          },
                    ]}
                  />
                  <Text style={styles.vsText}>VS</Text>
                  <Image
                    source={
                      teamObject?.thumbnail
                        ? { uri: teamObject?.thumbnail }
                        : images.teamPlaceholder
                    }
                    style={[
                      styles.entityImage,
                      { opacity: challengeStatus === 'decline' ? 0.5 : 1.0 },
                      teamObject?.thumbnail
                        ? {
                            height: 82,
                            width: 82,
                          }
                        : {
                            height: 75,
                            width: 75,
                          },
                    ]}
                  />
                </View>
              )}
            </View>
          )}
          {challengeStatus === 'sent' ? (
            <SafeAreaView>
              <TouchableOpacity
                style={styles.goToProfileButton}
                onPress={() => {
                  navigation.popToTop();
                }}>
                <Text style={styles.goToProfileTitle}>OK</Text>
              </TouchableOpacity>
            </SafeAreaView>
          ) : (
            <SafeAreaView>
              <View style={{ height: 95, justifyContent: 'space-between' }}>
                <TCBorderButton
                  title={`GO TO ${
                    teamObject?.group_name?.toUpperCase()
                    || `${teamObject?.first_name?.toUpperCase()} ${teamObject?.last_name?.toUpperCase()}`
                  }`}
                  textColor={colors.whiteColor}
                  borderColor={colors.whiteColor}
                  backgroundColor={'transparent'}
                  height={40}
                  shadow={true}
                  // marginBottom={15}// route?.params?.status === 'accept' ? 34 : 55
                  onPress={() => {
                    setModalVisible(false);

                    navigation.push('HomeScreen', {
                      sourceScreen: 'orangeScreen',
                      uid: teamObject?.group_id || teamObject?.user_id,
                      backButtonVisible: true,
                      menuBtnVisible: false,
                      role:
                        teamObject?.entity_type === 'player'
                          ? 'user'
                          : teamObject?.entity_type,
                    });
                  }}
                />

                {challengeStatus !== 'decline' && (
                  <TCBorderButton
                    title={strings.goToGameHome}
                    textColor={colors.themeColor}
                    borderColor={'transparent'}
                    height={40}
                    shadow={true}
                    // marginBottom={55}
                    onPress={() => {
                      setModalVisible(false);
                      const gameHome = getGameHomeScreen(challengeData?.sport);
                      if (teamObject?.game_id || challengeData?.game_id) {
                        navigation.push(gameHome, {
                          gameId: teamObject?.game_id ?? challengeData?.game_id,
                        });
                      } else {
                        Alert.alert('Game ID does not exist.');
                      }
                    }}
                  />
                )}
              </View>
            </SafeAreaView>
          )}
        </View>
      </Modal>

      {/* <AlterChallengeModalView
        navigation={navigation}
        modalVisible={alterModalVisible}
        status={challengeStatus}
      /> */}

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
        }}>
        <View style={styles.mainContainer}>
          <Image style={styles.background} source={images.orangeLayer} />
          <Image style={styles.background} source={images.entityCreatedBG} />

          {challengeStatus === 'sent' && (
            <View style={styles.mailContainer}>
              <Text style={styles.invitationText}>Alteration request sent</Text>
              <View style={styles.imageContainer}>
                <Image
                  source={images.challengeSentPlane}
                  style={styles.rotateImage}
                />
              </View>
            </View>
          )}

          {challengeStatus !== 'sent' && (
            <View style={styles.mailContainer}>
              <Text style={styles.invitationText}>
                {(challengeStatus === 'accept'
                  && 'Alteration request\naccepted')
                  || (challengeStatus === 'decline'
                    && 'Alteration request\ndeclined')
                  || (challengeStatus === 'cancel'
                    && 'Alteration request\ncancelled')
                  || (challengeStatus === 'restored'
                    && 'Alteration request\nRestored')}
              </Text>
            </View>
          )}
          <SafeAreaView>
            <TouchableOpacity
              style={styles.goToProfileButton}
              onPress={() => {
                setAlterModalVisible(false);
                navigation.popToTop();
              }}>
              <Text style={styles.goToProfileTitle}>OK</Text>
            </TouchableOpacity>
          </SafeAreaView>
        </View>
      </Modal>
    </TCKeyboardView>
  );
}
const styles = StyleSheet.create({
  map: {
    height: 150,
    marginTop: 15,
    marginBottom: 15,
    marginLeft: 15,
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
    color: colors.RRegular,
  },
  challengeNumberStyle: {
    fontSize: 12,
    fontFamily: fonts.RLight,
    color: colors.lightBlackColor,
    alignSelf: 'flex-end',
    margin: 15,
    marginBottom: 0,
  },
  // curruentVersion: {
  //   fontSize: 14,
  //   fontFamily: fonts.RRegular,
  //   color: colors.lightBlackColor,
  //   marginBottom: 0,
  //   alignSelf: 'flex-end',
  //   margin: 15,
  //   textDecorationLine: 'underline',
  // },
  bottomButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: 15,
  },

  rulesTitle: {
    fontFamily: fonts.RMedium,
    fontSize: 16,
    color: colors.lightBlackColor,
    marginLeft: 15,
    marginBottom: 5,
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
  },
  infoText: {
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.whiteColor,
    marginLeft: 30,
    marginRight: 30,
    marginTop: 15,
    marginBottom: 25,
    textAlign: 'center',
    lineHeight: 25,
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
  entityImage: {
    resizeMode: 'contain',
    borderRadius: 150,
  },
  entityViewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: 20,
    marginTop: 40,
    width: 250,
  },
  vsText: {
    fontSize: 20,
    fontFamily: fonts.RBlack,
    color: colors.whiteColor,
  },
  entityNameBoldText: {
    fontSize: 16,
    fontFamily: fonts.RBold,
    color: colors.whiteColor,
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
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 3,
  },
});
