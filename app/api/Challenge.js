import Config from 'react-native-config';
import makeAPIRequest from '../utils/Global';

export const getFeesEstimation = async (entityID, params, authContext) => makeAPIRequest({
  method: 'post',
  url: `${Config.BASE_URL}challenge/${entityID}/estimateGameFee`,
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

export const acceptDeclineChallenge = async (teamId, challengeId, versionNo, status, params = {}, authContext) => makeAPIRequest({
  method: 'post',
  url: `${Config.BASE_URL}teams/${teamId}/challenge/${challengeId}/${status}?version=${versionNo}`,
  data: params,
  authContext,
})

export const updateChallenge = async (challengeId, params, authContext) => makeAPIRequest({
  method: 'patch',
  url: `${Config.BASE_URL}challenges/${challengeId}`,
  data: params,
  authContext,
})
