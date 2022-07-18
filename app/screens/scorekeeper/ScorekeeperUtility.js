import {Alert} from 'react-native';
import {getReservation} from '../../api/Challenge';
import ScorekeeperReservationStatus from '../../Constants/ScorekeeperReservationStatus';
import strings from '../../Constants/String';

// eslint-disable-next-line import/prefer-default-export
export const getScorekeeperReservationDetail = (
  reservationID,
  callerID,
  authContext,
) => {
  const Obj = {};
  console.log('data of Scorekeeper reservation details::=>', reservationID);
  // eslint-disable-next-line consistent-return
  return getReservation(
    'scorekeepers',
    reservationID,
    callerID && callerID,
    authContext,
  )
    .then((response) => {
      console.log('Response of Scorekeeper reservation details::=>', response);
      if (
        ScorekeeperReservationStatus.changeRequest ===
          response.payload[0].status ||
        ScorekeeperReservationStatus.pendingrequestpayment ===
          response.payload[0].status
      ) {
        Obj.reservationObj = response.payload;
        Obj.screenName = 'AlterScorekeeperScreen';
        return Obj;
      }
      if (
        ScorekeeperReservationStatus.pendingpayment ===
          response.payload[0].status ||
        ScorekeeperReservationStatus.accepted === response.payload[0].status ||
        ScorekeeperReservationStatus.cancelled === response.payload[0].status ||
        ScorekeeperReservationStatus.approved === response.payload[0].status ||
        ScorekeeperReservationStatus.offered === response.payload[0].status
      ) {
        Obj.reservationObj = response.payload[0];
        Obj.screenName = 'ScorekeeperReservationScreen';
        return Obj;
      }
      if (
        ScorekeeperReservationStatus.restored === response.payload[0].status ||
        ScorekeeperReservationStatus.requestcancelled ===
          response.payload[0].status
      ) {
        let tempObj;
        console.log('request cancelled true');
        for (let i = 0; i < response.payload.length; i++) {
          if (
            response.payload[i].status === ScorekeeperReservationStatus.accepted
          ) {
            tempObj = response.payload[i];
            break;
          }
        }
        Obj.reservationObj = tempObj;
        Obj.screenName = 'ScorekeeperReservationScreen';
        return Obj;
      }
      if (
        ScorekeeperReservationStatus.declined === response.payload[0].status
      ) {
        if (response.payload.length <= 3) {
          Obj.reservationObj = response.payload[0];
          Obj.screenName = 'ScorekeeperReservationScreen';
          return Obj;
        }
        let tempObj;
        for (let i = 0; i < response.payload.length; i++) {
          if (
            response.payload[i].status === ScorekeeperReservationStatus.accepted
          ) {
            tempObj = response.payload[i];
            break;
          }
        }
        Obj.reservationObj = tempObj;
        Obj.screenName = 'ScorekeeperReservationScreen';
        return Obj;
      }
    })
    .catch((e) => {
      setTimeout(() => {
        Alert.alert(strings.alertmessagetitle, e.message);
      }, 10);
    });
};
