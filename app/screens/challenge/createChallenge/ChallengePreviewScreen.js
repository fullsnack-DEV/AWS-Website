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
} from 'react-native';
import moment from 'moment';

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
import ChallengeHeaderView from '../../../components/challenge/ChallengeHeaderView';
import ChallengeStatusView from '../../../components/challenge/ChallengeStatusView';
import ReservationStatus from '../../../Constants/ReservationStatus';
import { heightPercentageToDP, widthPercentageToDP } from '../../../utils';
import TCSmallButton from '../../../components/TCSmallButton';
import images from '../../../Constants/ImagePath';
import { getNumberSuffix } from '../../../utils/gameUtils';
import { acceptDeclineChallenge } from '../../../api/Challenge';
import GameStatus from '../../../Constants/GameStatus';

let entity = {};
export default function ChallengePreviewScreen({ navigation, route }) {
  const authContext = useContext(AuthContext);
  const [loading, setloading] = useState(false);

  entity = authContext.entity;

  const [challengeData, setChallengeData] = useState(route?.params?.challengeObj[0]);
  const [oldVersion, setOldVersion] = useState();

  const [challenger] = useState(
    challengeData?.challenger === challengeData?.home_team?.user_id
      || challengeData?.challenger === challengeData?.home_team?.group_id
      ? challengeData?.home_team
      : challengeData?.away_team,
  );
  const [challengee] = useState(
    challengeData?.challengee === challengeData?.home_team?.user_id
      || challengeData?.challengee === challengeData?.home_team?.group_id
      ? challengeData?.home_team
      : challengeData?.away_team,
  );
  const [feeObj] = useState({
    total_game_fee: challengeData?.total_game_fee,
    total_service_fee1: challengeData?.total_service_fee1,
    total_service_fee2: challengeData?.total_service_fee2,
    total_stripe_fee: challengeData?.total_stripe_fee,
    total_payout: challengeData?.total_payout,
    total_amount: challengeData?.total_amount,
  });

  console.log('challenge Object:=>', route?.params?.challengeObj);
  console.log('challenger Object:=>', challenger);
  console.log('challengee Object:=>', challengee);

  useEffect(() => {
    if (route?.params?.challengeObj?.length > 1) {
      // setIsPendingRequestPayment(true);
      for (let i = 0; i < route?.params?.challengeObj.length; i++) {
        if (route?.params?.challengeObj?.[i]?.status === ReservationStatus.accepted) {
            setOldVersion(route?.params?.challengeObj?.[i]);
          break;
        }
      }
      console.log('challenge Object::', route?.params?.challengeObj?.[0]);

      console.log('Old Version:=>', oldVersion);
    }
    setChallengeData(route?.params?.challengeObj[0]);
  }, [oldVersion, route?.params?.challengeObj])

  const checkSenderOrReceiver = (challengeObj) => {
    if (!challengeObj?.user_challenge) {
      if (
        challengeObj?.status === ReservationStatus.pendingpayment
        || challengeObj?.status === ReservationStatus.pendingrequestpayment
      ) {
        if (challengeObj?.invited_by === entity.uid) {
          return 'sender';
        }
        return 'receiver';
      }
      if (challengeObj?.status === ReservationStatus.offered) {
        if (entity.uid === challengeData?.created_by?.group_id) {
          return 'sender';
        }
        return 'receiver';
      }

      if (challengeObj?.updated_by?.group_id === entity.uid) {
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
      challengeObj?.status === ReservationStatus.pendingpayment
      || challengeObj?.status === ReservationStatus.pendingrequestpayment
    ) {
      if (challengeObj?.invited_by === entity.uid) {
        return 'sender';
      }
      return 'receiver';
    }
    if (challengeObj?.status === ReservationStatus.offered) {
      if (entity.uid === challengeData?.created_by?.uid) {
        return 'sender';
      }
      return 'receiver';
    }

    if (challengeObj?.updated_by?.uid === entity.uid) {
      return 'sender';
    }
    return 'receiver';
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

        if (status === 'accept') {
          navigation.navigate('ChallengeAcceptedDeclinedScreen', {
            teamObj: {
              ...groupObj,
              game_id: response?.payload?.game_id,
              sport: challengeData?.sport,
            },
            status: 'accept',
          });
        } else if (status === 'decline') {
          navigation.navigate('ChallengeAcceptedDeclinedScreen', {
            teamObj: {
              ...groupObj,
              game_id: response?.payload?.game_id,
              sport: challengeData?.sport,
            },
            status: 'decline',
          });
        } else if (status === 'cancel') {
          navigation.navigate('ChallengeAcceptedDeclinedScreen', {
            teamObj: {
              ...groupObj,
              game_id: response?.payload?.game_id,
              sport: challengeData?.sport,
            },
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

  const renderReferees = ({ item, index }) => (
    <SecureRefereeView
      entityName={
        item.responsible_to_secure_referee === 'challenger'
          ? challenger?.full_name ?? challenger?.group_name
          : challengee?.full_name ?? challengee?.group_name
      }
      image={
        item.responsible_to_secure_referee === 'challenger'
          ? challenger?.thumbnail
            ? { uri: challenger?.thumbnail }
            : challenger?.full_name
            ? images.profilePlaceHolder
            : images.teamPlaceholder
          : challengee?.thumbnail
          ? { uri: challengee?.thumbnail }
          : challengee?.full_name
          ? images.profilePlaceHolder
          : images.teamPlaceholder
      }
      entity={'Referee'}
      entityNumber={index + 1}
    />
  );
  const renderScorekeepers = ({ item, index }) => (
    <SecureRefereeView
      entityName={
        item.responsible_to_secure_scorekeeper === 'challenger'
          ? challenger?.full_name ?? challenger?.group_name
          : challengee?.full_name ?? challengee?.group_name
      }
      image={
        item.responsible_to_secure_scorekeeper === 'challenger'
          ? challenger?.thumbnail
            ? { uri: challenger?.thumbnail }
            : challenger?.full_name
            ? images.profilePlaceHolder
            : images.teamPlaceholder
          : challengee?.thumbnail
          ? { uri: challengee?.thumbnail }
          : challengee?.full_name
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
          title={strings.cancelRequestTitle}
          onPress={() => {
            // navigation.navigate('ChallengeAcceptedDeclinedScreen', {
            //   status: 'accept',
            //   teamObj: authContext.entity.obj,
            // });
            Alert.alert('Offered Request');
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
              challengeOperation(
                entity.uid,
                challengeData?.challenge_id,
                challengeData?.version,
                'accept',
              );
            }}
            style={{ width: widthPercentageToDP('45%') }}
          />
        </View>
      );
    }
    if (
      (checkSenderOrReceiver(challengeData) === 'sender'
        || checkSenderOrReceiver(challengeData) === 'receiver')
      && challengeData?.status === ReservationStatus.accepted
    ) {
      return (
        <View
          style={styles.bottomButtonView}>
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
              if (!challengeData?.game_status || challengeData?.game_status === GameStatus.accepted || challengeData?.game_status === GameStatus.reset) {
                navigation.navigate('ChangeReservationInfoScreen', {
                  screen: 'change',
                  challengeObj: challengeData,
                });
              } else if (challengeData?.start_datetime * 1000 < new Date().getTime()) {
                Alert.alert(strings.cannotChangeReservationGameStartedText);
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
            startGradientColor = {colors.endGrayGradient}
            endGradientColor = {colors.startGrayGrdient}
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

  return (
    <TCKeyboardView>
      <ActivityLoader visible={loading} />
      <View >
        <Text style={styles.challengeNumberStyle}>
          Request No.{`${challengeData?.challenge_id}`}
        </Text>
        <Text style={styles.curruentVersion}>
          Current reservation
        </Text>
      </View>
      <ChallengeHeaderView
        challenger={
          challengeData?.challenger === challengeData?.home_team?.user_id
          || challengeData?.challenger === challengeData?.home_team?.group_id
            ? challengeData?.home_team
            : challengeData?.away_team
        }
        challengee={
          challengeData?.challengee === challengeData?.home_team?.user_id
          || challengeData?.challengee === challengeData?.home_team?.group_id
            ? challengeData?.home_team
            : challengeData?.away_team
        }
        role={challengeData?.home_team?.user_id ? 'user' : 'team'}
      />
      <TCThinDivider />
      {/* offered: 'offered',*
  changeRequest: 'changeRequest',*
  accepted: 'accepted',*
  restored: 'restored',*
  declined: 'declined',*
  cancelled: 'cancelled',*
  pendingpayment: 'pendingpayment',*
  pendingrequestpayment: 'pendingrequestpayment',*
  requestcancelled: 'requestcancelled',*  */}
      <ChallengeStatusView
        challengeObj={challengeData}
        isSender={checkSenderOrReceiver(challengeData) === 'sender'}
        isTeam={!!challengeData?.home_team?.group_name}
        senderName={challenger?.full_name ?? challenger?.group_name}
        receiverName={challengee?.full_name ?? challengee?.group_name}
        offerExpiry={
          ReservationStatus.offered === 'offered'
          || ReservationStatus.offered === 'changeRequest'
            ? new Date().getTime()
            : ''
        } // only if status offered
        status={challengeData?.status}
      />
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
           title={'Type of Game'}
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
        <Text style={styles.normalTextStyle}>{strings.gameDurationTitle2}</Text>
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
        <Text style={styles.rulesDetail}>{challengeData?.general_rules}</Text>
        <View style={{ marginBottom: 10 }} />
        <Text style={styles.rulesTitle}>Special Rules</Text>
        <Text style={styles.rulesDetail}>{challengeData?.special_rules}</Text>
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
        value={challengeData?.responsible_for_scorekeeper?.who_secure?.length}
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

      <TCLabel
        title={
          checkSenderOrReceiver(challengeData) === 'sender'
            ? 'Payment'
            : 'Earning'
        }
        style={{ marginBottom: 15 }}
      />
      <GameFeeCard
        feeObject={feeObj}
        currency={challengeData?.game_fee?.currency_type}
        isChallenger={checkSenderOrReceiver(challengeData) === 'sender'}
      />
      <TCThickDivider marginTop={20} />

      <SafeAreaView>{bottomButtonView()}</SafeAreaView>
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
  curruentVersion: {
    fontSize: 14,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
    marginBottom: 0,
    alignSelf: 'flex-end',
    margin: 15,
    textDecorationLine: 'underline',

  },
  bottomButtonContainer: {
    flexDirection: 'row',
    marginBottom: 45,
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
});
