import React from 'react';
import {
  View,
} from 'react-native';

import TCGameCard from '../TCGameCard';

import ReservationPendingButton from './ReservationPendingButton';
import ReservationDetailButton from './ReservationDetailButton';
import ReservationNumber from './ReservationNumber';
import ReservationStatusView from './ReservationStatusView';
import ChallengerInOutView from './ChallengerInOutView';
import TCThickDivider from '../TCThickDivider';

export default function MatchReservation({ data, onPressButon }) {
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

  return (
      <View>

          <ReservationNumber reservationNumber={data.reservation_id || data.challenge_id}/>
          <ReservationStatusView data={data}/>
          <ChallengerInOutView data={data}/>
          <TCGameCard data={data.game || data} />
          {data.status === 'pending' ? <ReservationPendingButton onPressButon={onPressButon}/> : <ReservationDetailButton onPressButon={onPressButon}/>}
          <TCThickDivider height={7}/>
      </View>
  );
}
