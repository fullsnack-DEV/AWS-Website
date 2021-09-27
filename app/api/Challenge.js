// import Config from 'react-native-config';
import envs from '../../src/config/env';

import makeAPIRequest from '../utils/Global';

const { BASE_URL } = envs;

export const getFeesEstimation = async (params, authContext) => makeAPIRequest({
  method: 'post',
  url: `${BASE_URL}challenge/estimateGameFee`,
  data: params,
  authContext,
})

export const getEntityFeesEstimation = async (reservationEntityType, refereeId, params, authContext) => makeAPIRequest({
  method: 'post',
  url: `${BASE_URL}${reservationEntityType}/reservation/${refereeId}/estimateGameFee`,
  data: params,
  authContext,
})
export const payAgainAlter = async (challengeID, params, authContext) => makeAPIRequest({
  method: 'post',
  url: `${BASE_URL}challenges/${challengeID}/alterrequest/payment`,
  data: params,
  authContext,
})

export const payAgain = async (challengeID, params, authContext) => makeAPIRequest({
  method: 'post',
  url: `${BASE_URL}challenges/${challengeID}/payment`,
  data: params,
  authContext,
})

export const payAgainAlterReferee = async (reservationID, params, authContext) => makeAPIRequest({
  method: 'post',
  url: `${BASE_URL}referees/${reservationID}/alterrequest/payment`,
  data: params,
  authContext,
})

export const payAgainReferee = async (reservationID, params, authContext) => makeAPIRequest({
  method: 'post',
  url: `${BASE_URL}referees/${reservationID}/payment`,
  data: params,
  authContext,
})

export const payAgainAlterScorekeeper = async (reservationID, params, authContext) => makeAPIRequest({
  method: 'post',
  url: `${BASE_URL}scorekeepers/${reservationID}/alterrequest/payment`,
  data: params,
  authContext,
})
export const payAgainScorekeeper = async (reservationID, params, authContext) => makeAPIRequest({
  method: 'post',
  url: `${BASE_URL}scorekeepers/${reservationID}/payment`,
  data: params,
  authContext,
})

export const createChallenge = async (params, authContext) => makeAPIRequest({
  method: 'post',
  url: `${BASE_URL}/challenge`,
  data: params,
  authContext,
  // type = 'teams' or 'users'
})

export const getChallenge = async (challengeId, authContext) => makeAPIRequest({
  method: 'get',
  url: `${BASE_URL}teams/challenge/${challengeId}`,
  authContext,
})
export const getReservation = async (bookingType = 'referees', reservationId, callerID, authContext) => makeAPIRequest({
  method: 'get',
  url: `${BASE_URL}${bookingType}/reservation/${reservationId}`,
  headers: { caller_id: callerID },
  authContext,
})
export const acceptDeclineChallenge = async (teamId, challengeId, versionNo, status, params, authContext) => makeAPIRequest({
  method: 'post',
  url: `${BASE_URL}teams/${teamId}/challenge/${challengeId}/${status}?version=${versionNo}`,
  data: params,
  authContext,
})
export const acceptDeclineReservation = async (reservationEntityType, reservationID, callerID, versionNo, status, params = {}, authContext) => makeAPIRequest({
  method: 'patch',
  url: `${BASE_URL}${reservationEntityType}/reservation/${reservationID}/${status}?version=${versionNo}`,
  data: params,
  headers: { caller_id: callerID },
  authContext,
})

export const acceptDeclineAlterReservation = async (reservationEntityType, reservationID, callerID, versionNo, status, params = {}, authContext) => makeAPIRequest({
  method: 'patch',
  url: `${BASE_URL}${reservationEntityType}/reservation/${reservationID}/${status}/alterrequest?version=${versionNo}`,
  data: params,
  headers: { caller_id: callerID },
  authContext,
})
export const cancelAlterReservation = async (reservationEntityType, reservationID, callerID, versionNo, authContext) => makeAPIRequest({
  method: 'patch',
  url: `${BASE_URL}${reservationEntityType}/reservation/${reservationID}/cancelRequest?version=${versionNo}`,
  headers: { caller_id: callerID },
  authContext,
})

export const acceptDeclineAlterChallenge = async (teamId, challengeId, versionNo, status, params = {}, authContext) => makeAPIRequest({
  method: 'post',
  url: `${BASE_URL}teams/${teamId}/challenge/${challengeId}/${status}/alterrequest?version=${versionNo}`,
  data: params,
  authContext,
})

export const updateChallenge = async (challengeId, params, authContext) => makeAPIRequest({
  method: 'patch',
  url: `${BASE_URL}challenges/${challengeId}`,
  data: params,
  authContext,
})
export const updateReservation = async (reservationEntityType, reservationId, callerID, params, authContext) => makeAPIRequest({
  method: 'patch',
  url: `${BASE_URL}${reservationEntityType}/reservation/${reservationId}`,
  data: params,
  headers: { caller_id: callerID },
  authContext,
})
export const getRefereeGameFeeEstimation = async (entityID, params, authContext) => makeAPIRequest({
  method: 'post',
  url: `${BASE_URL}referees/reservation/${entityID}/estimateGameFee`,
  data: params,
  authContext,
})

export const getScorekeeperGameFeeEstimation = async (entityID, params, authContext) => makeAPIRequest({
  method: 'post',
  url: `${BASE_URL}scorekeepers/reservation/${entityID}/estimateGameFee`,
  data: params,
  authContext,
})

export const getChallengeSetting = async (entityId, sport, entityType, authContext) => makeAPIRequest({
  method: 'get',
  url: `${BASE_URL}managesetting/${entityId}?sport=${sport}&entity_type=${entityType}`,
  authContext,
})

// export const patchChallengeSetting = async (entityId, params, authContext) => makeAPIRequest({
//   method: 'patch',
//   url: `${BASE_URL}managesetting/${entityId}`,
//   data: params,
//   authContext,
// })
