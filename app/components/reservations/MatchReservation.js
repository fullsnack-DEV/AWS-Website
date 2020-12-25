import React, { useEffect, useContext } from 'react';
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

export default function MatchReservation({ data, onPressButon }) {
  const authContext = useContext(AuthContext)
  useEffect(() => {
  }, []);
  // const checkStatus = (invited_by, invited_to, myid) => {
  //   if (data.responsible_to_secure_venue) {
  //     if (data.invited_by == myID) {
  //       if (data.userChallenge) {
  //         if (data.home_team.user_id == myID) {
  //           console.log('not usefull');
  //           return true;
  //         }

  //         console.log('pick data from away team');
  //         return false;
  //       }

  //       console.log('Team to team challenge');

  //       console.log('i am requester');
  //     } else {
  //       if (data.userChallenge) {
  //         if (data.home_team.user_id == myID) {
  //           console.log('not usefull');
  //           return true;
  //         }

  //         console.log('pick data from away team');
  //         return false;
  //       }

  //       console.log('Team to team challenge');

  //       console.log('i am requstee');
  //     }
  //   } else {
  //     console.log('Referee or Scorekeeper');
  //   }
  // };
  const isPendingButtonOrDetailButton = () => {
    if (data.game) {
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
  return (
    <View>
      <ReservationNumber reservationNumber={data.reservation_id || data.challenge_id}/>
      <ReservationStatusView data={data}/>
      <ChallengerInOutView data={data}/>
      <TCGameCard data={data.game || data} />
      {isPendingButtonOrDetailButton() ? <ReservationPendingButton onPressButon={onPressButon}/> : <ReservationDetailButton onPressButon={onPressButon}/>}
      {isOfferExpired() && <Text style={styles.expiryText}>The reponse time will be expired within <Text style={styles.timeText}>4d 23h 59m.</Text></Text>}
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
