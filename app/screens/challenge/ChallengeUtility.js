/* eslint-disable no-param-reassign */
import {
  Alert,
} from 'react-native';
import { getChallenge } from '../../api/Challenge';
import ReservationStatus from '../../Constants/ReservationStatus';
import strings from '../../Constants/String';

// eslint-disable-next-line import/prefer-default-export
export const getChallengeDetail = (challengeID, authContext) => {
  const Obj = {}
  // eslint-disable-next-line consistent-return
  return getChallenge(challengeID, authContext).then((response) => {
    console.log('Challenge Utils:', JSON.stringify(response.payload));
    if (response.payload.length > 0) {
      const reservations = response.payload[0].reservations;
      const gameStatus = response.payload[0].game_status;

     const challenges = response.payload.map((challenge) => {
        challenge.reservations = reservations
        challenge.game_status = gameStatus
        return challenge
        })
      if (ReservationStatus.changeRequest === challenges[0].status
        || ReservationStatus.pendingrequestpayment === challenges[0].status) {
        Obj.challengeObj = challenges
        Obj.screenName = 'ChallengePreviewScreen' // 'AlterChallengeScreen'
        return Obj
      }
      if (ReservationStatus.pendingpayment === challenges[0].status
        || ReservationStatus.accepted === challenges[0].status
        || ReservationStatus.restored === challenges[0].status
        || ReservationStatus.cancelled === challenges[0].status
        || ReservationStatus.completed === challenges[0].status
        || ReservationStatus.offered === challenges[0].status) {
        Obj.challengeObj = challenges
        Obj.screenName = 'ChallengePreviewScreen'
        return Obj
      }
      if (ReservationStatus.restored === challenges[0].status || ReservationStatus.requestcancelled === challenges[0].status) {
        // let tempObj;
        // for (let i = 0; i < response.payload.length; i++) {
        //   if (response.payload[i].status === ReservationStatus.accepted) {
        //     tempObj = response.payload[i]
        //     break;
        //   }
        // }
        Obj.challengeObj = challenges
        Obj.screenName = 'ChallengePreviewScreen'// AcceptDeclineChallengeScreen
        return Obj
      }
      if (ReservationStatus.declined === challenges[0].status) {
          if (challenges[1].status !== ReservationStatus.offered) {
          Obj.challengeObj = challenges
          Obj.screenName = 'ChallengePreviewScreen'
          return Obj
        }
          Obj.challengeObj = challenges[0]
          Obj.screenName = 'ChallengePreviewScreen'// AcceptDeclineChallengeScreen
          return Obj
      }
    }
  }).catch((e) => {
    setTimeout(() => {
      Alert.alert(strings.alertmessagetitle, e.message);
    }, 10);
  });
};
