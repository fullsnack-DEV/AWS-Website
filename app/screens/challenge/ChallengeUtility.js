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
        Obj.screenName = 'AlterAcceptDeclineScreen'
        return Obj
      }
      if (ReservationStatus.pendingpayment === response.payload[0].status
        || ReservationStatus.accepted === response.payload[0].status
        || ReservationStatus.restored === response.payload[0].status
        || ReservationStatus.cancelled === response.payload[0].status
        || ReservationStatus.offered === response.payload[0].status) {
        Obj.challengeObj = response.payload[0]
        Obj.screenName = 'AcceptDeclineChallengeScreen'
        return Obj
      }
      if (ReservationStatus.restored === response.payload[0].status) {
        let tempObj;
        for (let i = 0; i < response.payload.length; i++) {
          if (response.payload[i].status === ReservationStatus.accepted) {
            tempObj = response.payload[i]
            break;
          }
        }
        Obj.challengeObj = tempObj
        Obj.screenName = 'AcceptDeclineChallengeScreen'
        return Obj
      }
      if (ReservationStatus.declined === response.payload[0].status) {
        if (response.payload[0].change_requested_by) {
          Obj.challengeObj = response.payload
          Obj.screenName = 'AcceptDeclineChallengeScreen'
          return Obj
        }
        Obj.challengeObj = response.payload[0]
        Obj.screenName = 'AcceptDeclineChallengeScreen'
        return Obj
      }
    }
  }).catch((e) => {
    setTimeout(() => {
      Alert.alert(strings.alertmessagetitle, e.message);
    }, 0.7);
  });
};
