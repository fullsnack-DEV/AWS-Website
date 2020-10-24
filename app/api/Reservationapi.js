import Config from 'react-native-config';
import api from '../utils/endPoints';
import makeAPIRequest from '../utils/Global';

// eslint-disable-next-line import/prefer-default-export
export const getReservationList = async () => makeAPIRequest({
  method: 'get',
  url: Config.BASE_URL + api.reservation.reservationList,
})
