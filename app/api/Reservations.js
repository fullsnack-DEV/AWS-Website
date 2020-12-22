import Config from 'react-native-config';
import makeAPIRequest from '../utils/Global';

// eslint-disable-next-line import/prefer-default-export
export const getReservationList = async (authContext) => makeAPIRequest({
  method: 'get',
  url: `${Config.BASE_URL}/reservations?referenceObject=true`,
  authContext,
})

export const createUserReservation = (userType, params, authContext) => makeAPIRequest({
  method: 'post',
  url: `${Config.BASE_URL}/${userType}/reservation`,
  data: params,
  authContext,
})

export const getRefereeReservationDetails = (gameID, params, authContext) => makeAPIRequest({
  method: 'get',
  url: `${Config.BASE_URL}referees/game/${gameID}/reservation`,
  params,
  authContext,
})
