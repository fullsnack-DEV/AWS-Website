import {
  Alert,
} from 'react-native';
import { getReservation } from '../../api/Challenge';
import RefereeReservationStatus from '../../Constants/RefereeReservationStatus';
import strings from '../../Constants/String';

// eslint-disable-next-line import/prefer-default-export
export const getRefereeReservationDetail = (reservationID, callerID, authContext) => {
  const Obj = {}
  console.log('Authcontext::', JSON.stringify(authContext.entity.uid));
  // eslint-disable-next-line consistent-return
  return getReservation(reservationID, callerID && callerID, authContext).then((response) => {
    console.log('reservation Utils:', JSON.stringify(response.payload));
    if (RefereeReservationStatus.changeRequest === response.payload[0].status
          || RefereeReservationStatus.pendingrequestpayment === response.payload[0].status) {
      Obj.reservationObj = response.payload
      Obj.screenName = 'AlterRefereeScreen'
      return Obj
    }
    if (RefereeReservationStatus.pendingpayment === response.payload[0].status
          || RefereeReservationStatus.accepted === response.payload[0].status
          || RefereeReservationStatus.cancelled === response.payload[0].status
          || RefereeReservationStatus.offered === response.payload[0].status
    ) {
      Obj.reservationObj = response.payload[0]
      Obj.screenName = 'RefereeReservationScreen'
      return Obj
    }
    if (RefereeReservationStatus.restored === response.payload[0].status
        || RefereeReservationStatus.requestcancelled === response.payload[0].status) {
      let tempObj;
      console.log('request cancelled true');
      for (let i = 0; i < response.payload.length; i++) {
        if (response.payload[i].status === RefereeReservationStatus.accepted) {
          tempObj = response.payload[i]
          console.log('If condition true');
          break;
        }
      }
      Obj.reservationObj = tempObj
      Obj.screenName = 'RefereeReservationScreen'
      return Obj
    }
    if (RefereeReservationStatus.declined === response.payload[0].status) {
      if (response.payload.length <= 2) {
        Obj.reservationObj = response.payload[0]
        Obj.screenName = 'RefereeReservationScreen'
        return Obj
      }
      Obj.reservationObj = response.payload
      Obj.screenName = 'AlterRefereeScreen'
      return Obj
    }
  }).catch((e) => {
    setTimeout(() => {
      Alert.alert(strings.alertmessagetitle, e.message);
    }, 0.7);
  });
};
