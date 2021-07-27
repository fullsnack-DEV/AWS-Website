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
      if (ReservationStatus.changeRequest === response.payload[0].status
        || ReservationStatus.pendingrequestpayment === response.payload[0].status) {
        Obj.challengeObj = response.payload
        Obj.screenName = 'ChallengePreviewScreen'// AlterAcceptDeclineScreen
        return Obj
      }
      if (ReservationStatus.pendingpayment === response.payload[0].status
        || ReservationStatus.accepted === response.payload[0].status
        || ReservationStatus.restored === response.payload[0].status
        || ReservationStatus.cancelled === response.payload[0].status
        || ReservationStatus.completed === response.payload[0].status
        || ReservationStatus.offered === response.payload[0].status) {
        Obj.challengeObj = response.payload
        Obj.screenName = 'ChallengePreviewScreen'
        return Obj
      }
      if (ReservationStatus.restored === response.payload[0].status || ReservationStatus.requestcancelled === response.payload[0].status) {
        // let tempObj;
        // for (let i = 0; i < response.payload.length; i++) {
        //   if (response.payload[i].status === ReservationStatus.accepted) {
        //     tempObj = response.payload[i]
        //     break;
        //   }
        // }
        Obj.challengeObj = response.payload
        Obj.screenName = 'ChallengePreviewScreen'// AcceptDeclineChallengeScreen
        return Obj
      }
      if (ReservationStatus.declined === response.payload[0].status) {
        console.log('ReservationStatus.declined === response.payload[0].status', response);
        // if (response.payload[0].requested_by) {
          if (response.payload[1].status !== ReservationStatus.offered) {
          Obj.challengeObj = response.payload
          Obj.screenName = 'ChallengePreviewScreen'// AlterAcceptDeclineScreen
          return Obj
        }
        Obj.challengeObj = response.payload[0]
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
