// import Config from 'react-native-config';
import envs from '../../src/config/env';

import makeAPIRequest from '../utils/Global';

const { BASE_URL } = envs;
// eslint-disable-next-line import/prefer-default-export
export const getReservationList = async (callerId, authContext) => makeAPIRequest({
  method: 'get',
  url: `${BASE_URL}/reservations?referenceObject=true`,
  authContext,
  headers: callerId && { caller_id: callerId },
})

export const createUserReservation = (userType, params, authContext) => makeAPIRequest({
  method: 'post',
  url: `${BASE_URL}/${userType}/reservation`,
  data: params,
  authContext,
})

export const getRefereeReservationDetails = (gameID, params, authContext) => makeAPIRequest({
  method: 'get',
  url: `${BASE_URL}referees/game/${gameID}/reservation`,
  params,
  authContext,
})

export const getScorekeeperReservationDetails = (gameID, params, authContext) => makeAPIRequest({
  method: 'get',
  url: `${BASE_URL}scorekeepers/game/${gameID}/reservation`,
  params,
  authContext,
})
