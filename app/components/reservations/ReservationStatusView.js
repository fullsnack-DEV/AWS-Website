/* eslint-disable consistent-return */
import React, { memo, useContext, useEffect } from 'react';
import {
  StyleSheet, View, Text, TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import moment from 'moment'
import AuthContext from '../../auth/context';

import colors from '../../Constants/Colors'
import fonts from '../../Constants/Fonts'
import ReservationStatus from '../../Constants/ReservationStatus';
import strings from '../../Constants/String';
import ChallengeStatusTitle from '../challenge/ChallengeStatusTitle';

let entity = {};
 function ReservationStatusView({ data }) {
  const authContext = useContext(AuthContext);
  useEffect(() => {
    entity = authContext.entity;
  }, [authContext.entity, data])

  const getDate = () => {
    if (data.game) {
      return `${moment(data.game.start_datetime * 1000).format('MMM')}\n${moment(data.game.start_datetime * 1000).format('DD')}`
    }
    return `${moment(data.start_datetime * 1000).format('MMM')}\n${moment(data.start_datetime * 1000).format('DD')}`
  }
  const getChallengerOrChallengee = () => {
    if (data.responsible_to_secure_venue) {
      if (data.invited_by === entity.uid) {
        return strings.challengee
      }
      return strings.challenger
    }
    if (data.referee || data.scorekeeper) {
      if (data.initiated_by === entity.uid) {
        return strings.requestee
      }
      return strings.requester
    }
  }

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
    if (challengeObj?.updated_by?.group_id === entity.uid) {
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

  return (

    <View style={styles.reservationTitleView}>
      <TouchableOpacity>
        <LinearGradient
            colors={(getChallengerOrChallengee() === strings.challenger || getChallengerOrChallengee() === strings.requester) ? [colors.yellowColor, colors.themeColor] : [colors.greenGradientStart, colors.greenGradientEnd]}
            style={styles.borderView}>
          <View style={styles.dateView}>
            <Text style={styles.dateText}>{getDate()}</Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>
      <View style={styles.reservationTypeView}>
        {/* <Text style={[styles.reservationText, { color: getReservationStatus().color }]}>
          {getReservationStatus().status}
        </Text> */}
        <ChallengeStatusTitle
        challengeObj={data}
        isSender={checkSenderOrReceiver(data) === 'sender'}
        isTeam={!!data?.home_team?.group_name}
        teamName={getTeamName(data)}
        // receiverName={challengee?.full_name ?? challengee?.group_name}
        offerExpiry={
          ReservationStatus.offered === 'offered'
          || ReservationStatus.offered === 'changeRequest'
            ? new Date().getTime()
            : ''
        } // only if status offered
        status={data?.status}
      />

        {data.responsible_to_secure_venue && (
          <Text style={styles.matchText}>Match · {data.sport}</Text>
        )}
        {data.referee && data.game && (
          <Text style={styles.matchText}>Referee · {data.game.sport}</Text>
        )}
        {data.scorekeeper && data.game && (
          <Text style={styles.matchText}>
            Scorekeeper · {data.game.sport}
          </Text>
        )}
      </View>
      <View style={styles.amountView}>
        <Text style={styles.amountText}>${data.total_game_fee || 0} CAD</Text>
        {/* <Text style={styles.cancelAmountText}>$35 CAD</Text> */}
      </View>
    </View>

  );
}

const styles = StyleSheet.create({
  amountText: {
    color: colors.reservationAmountColor,
    fontFamily: fonts.RBold,
    fontSize: 16,
    textAlign: 'right',
  },
  amountView: {
    marginTop: 10,
    position: 'absolute',
    right: 15,
  },

  borderView: {
    alignItems: 'center',
    borderRadius: 27,
    height: 54,
    justifyContent: 'center',
    marginLeft: 15,
    width: 54,
  },

  // cancelAmountText: {
  //   color: colors.veryLightGray,
  //   fontFamily: fonts.RLight,
  //   fontSize: 14,
  //   textAlign: 'right',
  //   textDecorationLine: 'line-through',
  //   textDecorationStyle: 'solid',
  // },
  dateText: {
    alignSelf: 'center',
    color: colors.lightBlackColor,
    fontFamily: fonts.RMedium,
    fontSize: 14,
    textAlign: 'center',
  },
  dateView: {
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 24,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },

  matchText: {
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,
    fontSize: 20,
  },

  reservationTitleView: {
    flexDirection: 'row',

  },
  reservationTypeView: {
    alignContent: 'flex-start',
    alignSelf: 'center',
    marginLeft: 10,
  },
});
export default memo(ReservationStatusView)
