/* eslint-disable import/no-cycle */
import Config from 'react-native-config';

import makeAPIRequest from '../utils/Global';
import makeElasticAPIRequest from '../utils/ElasticGloble';

// const elasticBaseURL = '';
// 'https://townscup.es.us-east-1.aws.found.io:9243';

export const postMultiElasticSearch = async (query) => makeElasticAPIRequest({
  method: 'post',
  url: `/${Config.GAME_INDEX}/_msearch`,
  data: query,
})

export const getElasticSearch = async (reservationEntityType, refereeId, authContext) => makeAPIRequest({
  method: 'get',
  url: `${Config.BASE_URL}${reservationEntityType}/reservation/${refereeId}/estimateGameFee`,
  authContext,
})

export const getGameIndex = async (query) => makeElasticAPIRequest({
  method: 'post',
  url: `/${Config.GAME_INDEX}/_search`,
  data: query,
})

export const getUserIndex = async (query) => makeElasticAPIRequest({
  method: 'post',
  url: `/${Config.USER_INDEX}/_search`,
  data: query,
})

export const getGroupIndex = async (query) => makeElasticAPIRequest({
  method: 'post',
  url: `/${Config.GROUP_INDEX}/_search`,
  data: query,
})

export const getCalendarIndex = async (query) => makeElasticAPIRequest({
  method: 'post',
  url: `/${Config.CALENDAR_INDEX}/_search`,
  data: query,
})

export const getGamesListIndex = async () => makeElasticAPIRequest({
  method: 'get',
  url: `/${Config.GAME_INDEX}/_search`,
})
