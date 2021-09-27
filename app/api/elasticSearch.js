/* eslint-disable import/no-cycle */
// import Config from 'react-native-config';
import envs from '../../src/config/env';

import makeAPIRequest from '../utils/Global';
import makeElasticAPIRequest from '../utils/ElasticGloble';

const {
 BASE_URL, GAME_INDEX, USER_INDEX, GROUP_INDEX, CALENDAR_INDEX,
} = envs;

// const elasticBaseURL = '';
// 'https://townscup.es.us-east-1.aws.found.io:9243';

export const postMultiElasticSearch = async (query) => makeElasticAPIRequest({
  method: 'post',
  url: `/${GAME_INDEX}/_msearch`,
  data: query,
})

export const getElasticSearch = async (reservationEntityType, refereeId, authContext) => makeAPIRequest({
  method: 'get',
  url: `${BASE_URL}${reservationEntityType}/reservation/${refereeId}/estimateGameFee`,
  authContext,
})

export const getGameIndex = async (query) => makeElasticAPIRequest({
  method: 'post',
  url: `/${GAME_INDEX}/_search`,
  data: query,
})

export const getUserIndex = async (query) => makeElasticAPIRequest({
  method: 'post',
  url: `/${USER_INDEX}/_search`,
  data: query,
})

export const getGroupIndex = async (query) => makeElasticAPIRequest({
  method: 'post',
  url: `/${GROUP_INDEX}/_search`,
  data: query,
})

export const getCalendarIndex = async (query) => makeElasticAPIRequest({
  method: 'post',
  url: `/${CALENDAR_INDEX}/_search`,
  data: query,
})
