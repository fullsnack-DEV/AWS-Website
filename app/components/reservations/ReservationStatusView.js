/* eslint-disable consistent-return */
import React, { memo, useContext, useEffect } from 'react';
import {
 StyleSheet, View, Text, Image,
  TouchableOpacity,
} from 'react-native';
import moment from 'moment';
import AuthContext from '../../auth/context';

import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import ReservationStatus from '../../Constants/ReservationStatus';
import ChallengeStatusTitle from '../challenge/ChallengeStatusTitle';
import images from '../../Constants/ImagePath';

let entity = {};
function ReservationStatusView({ data, onClick }) {
  const authContext = useContext(AuthContext);
  useEffect(() => {
    entity = authContext.entity;
  }, [authContext.entity, data]);

  const getDate = () => {
    if (data?.game) {
      return data?.game?.start_datetime * 1000;
    }
    return data?.start_datetime * 1000;
  };

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
      <View >
        <Text
          style={{
            fontFamily: fonts.RMedium,
            fontSize: 12,
            color: colors.lightBlackColor,
            textAlign: 'center',
          }}>
          {moment(getDate()).format('MMM')}
        </Text>
        <Text
          style={{
            fontFamily: fonts.RMedium,
            fontSize: 25,
            color: colors.lightBlackColor,
            textAlign: 'center',

          }}>
          {moment(getDate()).format('DD')}
        </Text>
      </View>

      <TouchableOpacity style={{ marginLeft: 15 }} onPress={onClick}>
        {/* <Text style={[styles.reservationText, { color: getReservationStatus().color }]}>
          {getReservationStatus().status}
        </Text> */}
        <ChallengeStatusTitle
          challengeObj={data?.referee_id || data?.scorekeeper_id ? data : data?.game}
          isSender={checkSenderOrReceiver(data?.referee_id || data?.scorekeeper_id ? data : data?.game) === 'sender'}
          isTeam={!!data?.home_team?.group_name}
          teamName={getTeamName(data?.referee_id || data?.scorekeeper_id ? data : data?.game)}
          // receiverName={challengee?.full_name ?? challengee?.group_name}
          offerExpiry={
            ReservationStatus.offered === 'offered'
            || ReservationStatus.offered === 'changeRequest'
              ? new Date().getTime()
              : ''
          } // only if status offered
          status={data?.status}
        />

        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {!data?.referee_id && !data?.scorekeeper_id && (
            <Text style={styles.matchText}>Match · {data.sport}</Text>
        )}
          {data?.referee_id && (
            <Text style={styles.matchText}>Referee · {data.game.sport}</Text>
        )}
          {data?.scorekeeper_id && (
            <Text style={styles.matchText}>Scorekeeper · {data.game.sport}</Text>
        )}
          <Image source={images.nextArrow} style={{ height: 12, width: 8, marginLeft: 10 }}/>
        </View>
      </TouchableOpacity>
      <View style={styles.amountView}>
        <Text style={styles.amountText}>${data.total_game_fee ?? 0} CAD</Text>
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
   // marginTop: 10,
    position: 'absolute',
    right: 10,
  },

  matchText: {
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,
    fontSize: 20,
  },

  reservationTitleView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 15,
  },

});
export default memo(ReservationStatusView);
