import Config from 'react-native-config';
import makeAPIRequest from '../utils/Global';

export const getFeesEstimation = async (entityID, params, authContext) => makeAPIRequest({
  method: 'post',
  url: `${Config.BASE_URL}challenge/${entityID}/estimateGameFee`,
  data: params,
  authContext,
})

export const getRefereeFeesEstimation = async (refereeId, params, authContext) => makeAPIRequest({
  method: 'post',
  url: `${Config.BASE_URL}referees/reservation/${refereeId}/estimateGameFee`,
  data: params,
  authContext,
})
export const payAgainAlter = async (challengeID, params, authContext) => makeAPIRequest({
  method: 'post',
  url: `${Config.BASE_URL}challenges/${challengeID}/alterrequest/payment`,
  data: params,
  authContext,
})

export const payAgain = async (challengeID, params, authContext) => makeAPIRequest({
  method: 'post',
  url: `${Config.BASE_URL}referees/${challengeID}/payment`,
  data: params,
  authContext,
})

export const payAgainAlterReferee = async (reservationID, params, authContext) => makeAPIRequest({
  method: 'post',
  url: `${Config.BASE_URL}referees/${reservationID}/alterrequest/payment`,
  data: params,
  authContext,
})

export const payAgainReferee = async (reservationID, params, authContext) => makeAPIRequest({
  method: 'post',
  url: `${Config.BASE_URL}referees/${reservationID}/payment`,
  data: params,
  authContext,
})

export const createChallenge = async (entityID, type, params, authContext) => makeAPIRequest({
  method: 'post',
  url: `${Config.BASE_URL}${type}/${entityID}/challenge`,
  data: params,
  authContext,
  // type = 'teams' or 'users'
})

export const getChallenge = async (challengeId, authContext) => makeAPIRequest({
  method: 'get',
  url: `${Config.BASE_URL}teams/challenge/${challengeId}`,
  authContext,
})
export const getReservation = async (reservationId, authContext) => makeAPIRequest({
  method: 'get',
  url: `${Config.BASE_URL}referees/reservation/${reservationId}`,
  authContext,
})
export const acceptDeclineChallenge = async (teamId, challengeId, versionNo, status, params = {}, authContext) => makeAPIRequest({
  method: 'post',
  url: `${Config.BASE_URL}teams/${teamId}/challenge/${challengeId}/${status}?version=${versionNo}`,
  data: params,
  authContext,
})
export const acceptDeclineReservation = async (reservationID, versionNo, status, params = {}, authContext) => makeAPIRequest({
  method: 'patch',
  url: `${Config.BASE_URL}referees/reservation/${reservationID}/${status}?version=${versionNo}`,
  data: params,
  authContext,
})

export const acceptDeclineAlterReservation = async (reservationID, versionNo, status, params = {}, authContext) => makeAPIRequest({
  method: 'patch',
  url: `${Config.BASE_URL}referees/reservation/${reservationID}/${status}/alterrequest?version=${versionNo}`,
  data: params,
  authContext,
})
export const cancelAlterReservation = async (reservationID, versionNo, authContext) => makeAPIRequest({
  method: 'patch',
  url: `${Config.BASE_URL}referees/reservation/${reservationID}/cancelRequest?version=${versionNo}`,
  authContext,
})

export const acceptDeclineAlterChallenge = async (teamId, challengeId, versionNo, status, params = {}, authContext) => makeAPIRequest({
  method: 'post',
  url: `${Config.BASE_URL}teams/${teamId}/challenge/${challengeId}/${status}/alterrequest?version=${versionNo}`,
  data: params,
  authContext,
})

export const updateChallenge = async (challengeId, params, authContext) => makeAPIRequest({
  method: 'patch',
  url: `${Config.BASE_URL}challenges/${challengeId}`,
  data: params,
  authContext,
})
export const updateReservation = async (reservationId, params, authContext) => makeAPIRequest({
  method: 'patch',
  url: `${Config.BASE_URL}referees/reservation/${reservationId}`,
  data: params,
  authContext,
})
export const getRefereeGameFeeEstimation = async (entityID, params, authContext) => makeAPIRequest({
  method: 'post',
  url: `${Config.BASE_URL}referees/reservation/${entityID}/estimateGameFee`,
  data: params,
  authContext,
})
