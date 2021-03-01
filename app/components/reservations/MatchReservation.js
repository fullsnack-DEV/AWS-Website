import React, { memo, useContext } from 'react';
import {
  View, Text, StyleSheet,
} from 'react-native';

import TCGameCard from '../TCGameCard';
import ReservationPendingButton from './ReservationPendingButton';
import ReservationDetailButton from './ReservationDetailButton';
import ReservationNumber from './ReservationNumber';
import ReservationStatusView from './ReservationStatusView';
import ChallengerInOutView from './ChallengerInOutView';
import TCThickDivider from '../TCThickDivider';
import RefereeReservationStatus from '../../Constants/RefereeReservationStatus';
import AuthContext from '../../auth/context'
import ReservationStatus from '../../Constants/ReservationStatus';
import fonts from '../../Constants/Fonts';
import colors from '../../Constants/Colors';

function MatchReservation({ data, onPressButon = () => {}, onPressGameCard = () => {} }) {
  const authContext = useContext(AuthContext)

  const isPendingButtonOrDetailButton = () => {
    if (data.game) {
      console.log('Game Data::::=>', JSON.stringify(data.game));
      if (data.status === RefereeReservationStatus.offered) {
        if (data.expiry_datetime < new Date().getTime() / 1000) {
          return false
        }
        if (data.initiated_by === authContext.entity.uid) {
          return false
        }
        return true
      }
      if (data.status === RefereeReservationStatus.changeRequest) {
        if (data.expiry_datetime < new Date().getTime() / 1000) {
          return false
        }
        if (data.requested_by === authContext.entity.uid) {
          return false
        }
        return true
      }
      return false
    }
    if (data.status === ReservationStatus.offered) {
      if (data.offer_expiry < new Date().getTime() / 1000) {
        return false
      }
      if (data.invited_by === authContext.entity.uid) {
        return false
      }
      return true
    }
    if (data.status === ReservationStatus.changeRequest) {
      if (data.offer_expiry < new Date().getTime() / 1000) {
        return false
      }
      if (data.change_requested_by === authContext.entity.uid) {
        return false
      }
      return true
    }
    return false
  }
  const isOfferExpired = () => {
    if (data.game) {
      if (data.status === RefereeReservationStatus.offered) {
        if (data.expiry_datetime < new Date().getTime() / 1000) {
          return false
        }
        return true
      }
      if (data.status === RefereeReservationStatus.changeRequest) {
        if (data.expiry_datetime < new Date().getTime() / 1000) {
          return false
        }
        return true
      }
      return false
    }
    if (data.status === ReservationStatus.offered) {
      if (data.offer_expiry < new Date().getTime() / 1000) {
        return false
      }
      return true
    }
    if (data.status === ReservationStatus.changeRequest) {
      if (data.offer_expiry < new Date().getTime() / 1000) {
        return false
      }
      return true
    }
    return false
  }
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

  return (
    <View>
      <ReservationNumber reservationNumber={data.reservation_id || data.challenge_id}/>
      <ReservationStatusView data={data}/>
      <ChallengerInOutView data={data}/>
      <TCGameCard data={data.game || data} onPress={onPressGameCard}/>
      {isPendingButtonOrDetailButton() ? <ReservationPendingButton onPressButon={onPressButon}/> : <ReservationDetailButton onPressButon={onPressButon}/>}
      {isOfferExpired() && <Text style={styles.expiryText}>The reponse time will be expired within <Text style={styles.timeText}>{`${getDayTimeDifferent(
        (data.offer_expiry || data.expiry_datetime) * 1000,
        new Date().getTime(),
      )}.`}</Text></Text>}
      <TCThickDivider height={7} marginTop={isOfferExpired() ? 0 : 25}/>
    </View>
  );
}

const styles = StyleSheet.create({
  expiryText: {
    marginLeft: 30,
    fontFamily: fonts.RRegular,
    fontSize: 12,
    color: colors.darkOrangColor,
    marginBottom: 25,
  },
  timeText: {
    fontFamily: fonts.RMedium,
  },
})

export default memo(MatchReservation)
