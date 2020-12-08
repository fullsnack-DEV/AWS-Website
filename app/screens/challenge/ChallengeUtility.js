import {
  Alert,
} from 'react-native';
import { getChallenge } from '../../api/Challenge';
import ReservationStatus from '../../Constants/ReservationStatus';

// eslint-disable-next-line import/prefer-default-export
export const getChallengeDetail = async (challengeID, authContext) => {
  const Obj = {}
  return getChallenge(challengeID, authContext).then((response) => {
    console.log('Challenge Utils:', response.payload);
    if (response.payload.length > 0) {
      if (ReservationStatus.changeRequest === response.payload[0].status
        || ReservationStatus.pendingrequestpayment === response.payload[0].status) {
        Obj.challengeObj = response.payload
        Obj.screenName = 'AlterAcceptDeclineScreen'
        return Obj
      }
      if (ReservationStatus.pendingpayment === response.payload[0].status
        || ReservationStatus.accepted === response.payload[0].status
        || ReservationStatus.cancelled === response.payload[0].status
        || ReservationStatus.offered === response.payload[0].status) {
        Obj.challengeObj = response.payload[0]
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
    Obj.screenName = 'screen3'
    return Obj
  }).catch((error) => {
    Alert.alert(error.messages)
  })
};
